import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    messages: { type: [messageSchema], default: [] },
    escalated: { type: Boolean, default: false, index: true },
    escalatedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model('Conversation', conversationSchema);
