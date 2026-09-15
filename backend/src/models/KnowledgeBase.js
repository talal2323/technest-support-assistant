import mongoose from 'mongoose';

const knowledgeBaseSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true, lowercase: true }]
  },
  { timestamps: true }
);

knowledgeBaseSchema.index({ question: 'text', answer: 'text', tags: 'text' });

export default mongoose.model('KnowledgeBase', knowledgeBaseSchema);
