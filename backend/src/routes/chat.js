import { Router } from 'express';
import OpenAI from 'openai';
import Conversation from '../models/Conversation.js';
import { formatContext, retrieveKnowledge } from '../services/retrieval.js';

const router = Router();
const aiClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});
const FALLBACK = "I don't have that information yet. I can connect you with a TechNest team member to help.";
const ESCALATION_RESPONSE = "Got it — I've flagged this conversation for our support team. Someone will follow up with you shortly.";
const AFFIRMATIVE_REPLY = /^(yes|yeah|yep|yup|sure|please|please do|that would be great|okay|ok|go ahead|connect me|do it)[.!\s]*$/i;

function isEscalationOffer(content = '') {
  return /(connect|escalat|human|team member|support team).{0,80}(human|team member|agent|support|help)|human.{0,80}(connect|support|team)/i.test(content);
}

router.post('/', async (req, res) => {
  const { message, sessionId } = req.body;
  if (!message?.trim() || !sessionId?.trim()) return res.status(400).json({ error: 'message and sessionId are required' });

  try {
    const session = await Conversation.findOne({ sessionId: sessionId.trim() });
    const previousMessages = (session?.messages || []).slice(-10).map(({ role, content }) => ({ role, content }));
    const previousAssistantMessage = [...previousMessages].reverse().find(({ role }) => role === 'assistant');

    if (previousAssistantMessage && AFFIRMATIVE_REPLY.test(message.trim()) && isEscalationOffer(previousAssistantMessage.content)) {
      const updatedSession = await Conversation.findOneAndUpdate(
        { sessionId: sessionId.trim() },
        {
          $push: { messages: [{ role: 'user', content: message.trim() }, { role: 'assistant', content: ESCALATION_RESPONSE }] },
          $set: { escalated: true, escalatedAt: new Date() }
        },
        { upsert: true, new: true }
      );

      return res.json({ response: ESCALATION_RESPONSE, sources: [], sessionId: updatedSession.sessionId, escalated: true });
    }

    const entries = await retrieveKnowledge(message);
    let response = FALLBACK;

    if (entries.length && process.env.GROQ_API_KEY) {
      const completion = await aiClient.chat.completions.create({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: `You are the helpful customer support assistant for TechNest, an electronics store. Only answer using the context below. Never invent policies, specifications, prices, order details, or availability. If the answer is not directly supported by the context, say exactly that you are not sure and offer to connect the customer with a human team member. Keep answers concise, warm, and practical.\n\nContext:\n${formatContext(entries)}`
          },
          ...previousMessages,
          { role: 'user', content: message.trim() }
        ]
      });
      response = completion.choices[0]?.message?.content?.trim() || FALLBACK;
    } else if (entries.length && !process.env.GROQ_API_KEY) {
      response = `${entries[0].answer} (Demo mode: add GROQ_API_KEY for generated responses.)`;
    }

    const updatedSession = await Conversation.findOneAndUpdate(
      { sessionId: sessionId.trim() },
      { $push: { messages: [{ role: 'user', content: message.trim() }, { role: 'assistant', content: response }] } },
      { upsert: true, new: true }
    );

    res.json({ response, sources: entries.map(({ _id, category, question }) => ({ _id, category, question })), sessionId: updatedSession.sessionId, escalated: updatedSession.escalated });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Unable to process your message right now' });
  }
});

export default router;
