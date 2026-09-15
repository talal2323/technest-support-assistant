import KnowledgeBase from '../models/KnowledgeBase.js';

const STOP_WORDS = new Set(['a', 'an', 'and', 'are', 'can', 'do', 'for', 'how', 'i', 'is', 'my', 'of', 'the', 'to', 'what', 'when', 'where', 'you']);

function tokenize(value = '') {
  return value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

export async function retrieveKnowledge(message, limit = 5) {
  const tokens = [...new Set(tokenize(message))];
  if (!tokens.length) return [];

  const candidates = await KnowledgeBase.find({
    $or: [
      { question: { $regex: tokens.join('|'), $options: 'i' } },
      { answer: { $regex: tokens.join('|'), $options: 'i' } },
      { tags: { $in: tokens } }
    ]
  }).lean();

  return candidates
    .map((entry) => {
      const searchable = tokenize(`${entry.category} ${entry.question} ${entry.answer} ${(entry.tags || []).join(' ')}`);
      const score = tokens.reduce((total, token) => total + (searchable.includes(token) ? (entry.tags?.includes(token) ? 3 : 1) : 0), 0);
      return { ...entry, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}

export function formatContext(entries) {
  return entries.map((entry, index) => `${index + 1}. Category: ${entry.category}\nQuestion: ${entry.question}\nAnswer: ${entry.answer}`).join('\n\n');
}
