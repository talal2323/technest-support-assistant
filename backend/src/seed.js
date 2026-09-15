import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from './db.js';
import KnowledgeBase from './models/KnowledgeBase.js';

const entries = [
  ['Shipping', 'How long does standard shipping take?', 'Standard shipping takes 3-5 business days. Orders over $75 qualify for free standard shipping.', ['shipping', 'delivery', 'standard']],
  ['Shipping', 'Do you offer express shipping?', 'Yes. Express shipping takes 1-2 business days and is available at checkout for $14.99.', ['shipping', 'express', 'delivery']],
  ['Shipping', 'Where can I track my order?', 'Use the tracking link in your shipping confirmation email. If you checked out as a guest, enter your order number on the Track Order page.', ['tracking', 'order', 'delivery']],
  ['Returns', 'What is your return policy?', 'Unused products can be returned within 30 days of delivery in their original packaging for a full refund.', ['returns', 'refund', 'policy']],
  ['Returns', 'How do I start a return?', 'Open the Returns Portal from your order confirmation or contact support with your order number. We will email a prepaid label for eligible returns.', ['returns', 'label', 'refund']],
  ['Returns', 'Are opened electronics returnable?', 'Opened electronics are eligible within 30 days if all accessories are included and the product is free from damage.', ['returns', 'electronics', 'opened']],
  ['Warranty', 'What warranty do products include?', 'TechNest products include a 1-year limited warranty covering manufacturing defects. Accidental damage and normal wear are excluded.', ['warranty', 'coverage', 'defects']],
  ['Warranty', 'Do wireless earbuds have a warranty?', 'The PulseBuds Pro include a 1-year limited warranty covering manufacturing defects.', ['warranty', 'earbuds', 'pulsebuds']],
  ['Products', 'What are the PulseBuds Pro battery specs?', 'PulseBuds Pro deliver up to 8 hours per charge and 32 hours with the charging case. They support USB-C fast charging and active noise cancellation.', ['earbuds', 'pulsebuds', 'battery', 'anc']],
  ['Products', 'Are PulseBuds Pro water resistant?', 'PulseBuds Pro are rated IPX4 for splash and sweat resistance. They are not waterproof and should not be submerged.', ['earbuds', 'pulsebuds', 'water', 'ipx4']],
  ['Products', 'What is the NovaBook Air display size?', 'The NovaBook Air has a 14-inch 2.8K OLED display with a 90Hz refresh rate.', ['laptop', 'novabook', 'display', 'oled']],
  ['Products', 'How much RAM does the NovaBook Air have?', 'The NovaBook Air includes 16GB of RAM and 512GB of SSD storage.', ['laptop', 'novabook', 'ram', 'storage']],
  ['Products', 'How long does the NovaBook Air battery last?', 'The NovaBook Air is rated for up to 14 hours of local video playback under controlled test conditions.', ['laptop', 'novabook', 'battery']],
  ['Products', 'Is the Orbit Watch compatible with iPhone?', 'Yes. Orbit Watch works with iPhone models running iOS 16 or later and Android phones running Android 11 or later.', ['smartwatch', 'orbit', 'iphone', 'android']],
  ['Products', 'Is the Orbit Watch waterproof?', 'Orbit Watch is water resistant to 5 ATM and suitable for swimming in shallow water. Do not use it for diving or high-pressure water sports.', ['smartwatch', 'orbit', 'waterproof', '5atm']],
  ['Products', 'How long does the Orbit Watch battery last?', 'Orbit Watch lasts up to 7 days in typical smartwatch mode, depending on features and usage.', ['smartwatch', 'orbit', 'battery']],
  ['Payments', 'What payment methods do you accept?', 'We accept Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, and Google Pay.', ['payment', 'checkout', 'cards']],
  ['Payments', 'Can I use a gift card online?', 'Yes. Enter your TechNest gift card code in the payment step at checkout. One gift card can be combined with a card payment.', ['gift card', 'payment', 'checkout']],
  ['Orders', 'Can I change my order after placing it?', 'We can usually update an order before it enters fulfillment. Contact support as soon as possible with your order number.', ['order', 'change', 'cancel']],
  ['Orders', 'Why has my order not shipped?', 'Most orders ship within one business day. During launches and major sales, fulfillment may take an additional 1-2 business days.', ['order', 'shipping', 'fulfillment']],
  ['Account', 'Can I check out as a guest?', 'Yes. You can check out without creating an account and use your order number and email to track the purchase.', ['account', 'guest', 'order']],
  ['Support', 'How do I contact a human support agent?', 'Use the Contact Support form or email help@technest.example. Our team replies Monday-Friday, 9am-6pm Eastern.', ['support', 'human', 'contact']]
].map(([category, question, answer, tags]) => ({ category, question, answer, tags }));

await connectDatabase();
await KnowledgeBase.deleteMany({});
await KnowledgeBase.insertMany(entries);
console.log(`Seeded ${entries.length} knowledge base entries`);
await mongoose.disconnect();
