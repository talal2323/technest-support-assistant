'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, ChevronDown, Headphones, LifeBuoy, Menu, PackageSearch, ShieldCheck, Sparkles, X } from 'lucide-react';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api`;
const suggestions = ['Track my order', 'Return policy', 'PulseBuds battery', 'Talk to a human'];
const openingMessage = { role: 'assistant', content: "Hey, I'm Nest. Ask me anything about your TechNest order, products, or policies and I'll find the clearest answer I can." };

function MessageBubble({ message }) {
  const isAssistant = message.role === 'assistant';
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, ease: [.22, 1, .36, 1] }} className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
    <div className={`max-w-[86%] rounded-[22px] px-4 py-3 text-[15px] leading-6 shadow-sm sm:max-w-[72%] ${isAssistant ? 'rounded-bl-md bg-white text-[#10232b]' : 'rounded-br-md bg-[#10232b] text-white'}`}>
      {message.content}
    </div>
  </motion.div>;
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([openingMessage]);
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Math.random().toString(36).slice(2)}`);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, loading]);

  async function sendMessage(value = message) {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    setMessage('');
    setOpen(true);
    setMessages((current) => [...current, { role: 'user', content: trimmed }]);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: trimmed, sessionId }) });
      const data = await response.json();
      setMessages((current) => [...current, { role: 'assistant', content: data.response || 'I could not reach the support desk just now.' }]);
    } catch {
      setMessages((current) => [...current, { role: 'assistant', content: 'The support desk is offline right now. Please try again in a moment.' }]);
    } finally { setLoading(false); }
  }

  return <main className="min-h-screen overflow-hidden bg-[#f4f8f6]">
    <section className="mx-auto flex min-h-screen max-w-[1500px] flex-col px-5 py-5 sm:px-8 lg:px-12 lg:py-8">
      <nav className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-[family-name:var(--font-space)] text-lg font-bold tracking-[-.04em]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#10232b] text-[#b9e8d3]"><Sparkles size={18} /></span>TechNest</a>
        <div className="flex items-center gap-2 text-sm font-medium text-[#4c6268]"><a href="/admin" className="whitespace-nowrap rounded-full border border-[#c6d9d0] px-3 py-1.5 text-xs font-semibold transition-colors hover:border-[#ff6b4a] hover:text-[#10232b] sm:text-sm">Team console</a><span className="hidden h-1 w-1 rounded-full bg-[#ff6b4a] sm:block" /><span className="hidden sm:inline">Support, made clear</span></div>
      </nav>

      <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(420px,540px)] lg:gap-16 lg:py-16">
        <div className="max-w-2xl">
          <div className="mb-7 flex items-center gap-3 text-sm font-semibold text-[#ff6b4a]"><span className="h-2 w-2 rounded-full bg-[#ff6b4a] shadow-[0_0_0_5px_rgba(255,107,74,.12)]" /> The calm side of tech support</div>
          <h1 className="max-w-xl font-[family-name:var(--font-space)] text-5xl font-semibold leading-[.98] tracking-[-.065em] text-[#10232b] sm:text-7xl">Your setup, <span className="text-[#ff6b4a]">unstuck.</span></h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-[#587077]">Product questions, order updates, and the little things that get in the way. Nest finds the answer in TechNest's support library so you can get back to what you were making.</p>
          <div className="mt-10 grid max-w-lg grid-cols-2 gap-3 border-t border-[#d8e4de] pt-6 sm:grid-cols-3"><div><ShieldCheck size={19} className="mb-3 text-[#ff6b4a]" /><p className="text-sm font-semibold">Grounded answers</p></div><div><PackageSearch size={19} className="mb-3 text-[#ff6b4a]" /><p className="text-sm font-semibold">Order support</p></div><div className="col-span-2 sm:col-span-1"><Headphones size={19} className="mb-3 text-[#ff6b4a]" /><p className="text-sm font-semibold">Human backup</p></div></div>
        </div>

        <div className="relative mx-auto w-full max-w-[540px]">
          <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-[#f5c76a] opacity-60 blur-2xl" />
          <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-[#dcebe4] p-2 shadow-[0_25px_80px_rgba(16,35,43,.12)]">
            <div className="flex items-center justify-between rounded-[23px] bg-[#10232b] px-5 py-4 text-white"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#ff6b4a]"><Sparkles size={19} /></div><div><p className="font-[family-name:var(--font-space)] font-semibold">Nest support</p><p className="text-xs text-[#b9e8d3]">Online now · grounded in TechNest</p></div></div><button onClick={() => setOpen(!open)} aria-label={open ? 'Close chat' : 'Open chat'} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20">{open ? <X size={17} /> : <ChevronDown size={17} />}</button></div>
            <AnimatePresence initial={false} mode="wait">
              {open ? <motion.div key="chat" initial={{ opacity: 0, height: 0, y: 15 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: 15 }} transition={{ type: 'spring', stiffness: 280, damping: 27 }}>
                <div ref={scrollRef} className="chat-scroll flex h-[390px] flex-col gap-3 overflow-y-auto px-3 py-5 sm:h-[420px] sm:px-4"><div className="mb-2 flex items-center gap-2 px-1 text-xs font-medium text-[#678078]"><span className="h-2 w-2 rounded-full bg-[#63bd8a]" /> Nest is here to help</div>{messages.map((item, index) => <MessageBubble key={`${item.role}-${index}`} message={item} />)}{loading && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1 self-start rounded-[20px] rounded-bl-md bg-white px-4 py-4 shadow-sm"><span className="thinking-dot h-2 w-2 rounded-full bg-[#ff6b4a]" /><span className="thinking-dot h-2 w-2 rounded-full bg-[#ff6b4a]" /><span className="thinking-dot h-2 w-2 rounded-full bg-[#ff6b4a]" /></motion.div>}</div>
                <div className="px-3 pb-3 sm:px-4"><div className="mb-3 flex gap-2 overflow-x-auto pb-1">{suggestions.map((item, index) => <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .06 }} key={item} onClick={() => sendMessage(item)} className="shrink-0 rounded-full border border-[#c6d9d0] bg-white px-3 py-2 text-xs font-semibold text-[#456069] transition hover:-translate-y-0.5 hover:border-[#ff6b4a] hover:text-[#10232b] active:translate-y-0">{item}</motion.button>)}</div><form onSubmit={(event) => { event.preventDefault(); sendMessage(); }} className="flex items-center gap-2 rounded-2xl bg-white p-2 pl-4 transition-shadow focus-within:shadow-[0_0_0_3px_rgba(255,107,74,.18)]"><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask Nest anything..." className="min-w-0 flex-1 bg-transparent text-sm text-[#10232b] outline-none placeholder:text-[#8ba09a]" /><button disabled={!message.trim() || loading} aria-label="Send message" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#ff6b4a] text-white transition hover:bg-[#e95b3d] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"><ArrowUp size={18} /></button></form></div>
              </motion.div> : <motion.div key="closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pb-5 pt-7"><p className="max-w-sm text-2xl font-[family-name:var(--font-space)] font-medium leading-tight tracking-[-.04em] text-[#10232b]">Questions are lighter when you don't have to search alone.</p><button onClick={() => setOpen(true)} className="mt-6 flex items-center gap-2 rounded-full bg-[#ff6b4a] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#e95b3d]"><LifeBuoy size={16} /> Start a conversation</button></motion.div>}
            </AnimatePresence>
          </div>
          {!open && <button onClick={() => setOpen(true)} aria-label="Open support chat" className="absolute -bottom-5 -right-2 grid h-14 w-14 place-items-center rounded-2xl bg-[#ff6b4a] text-white shadow-xl transition hover:scale-105 active:scale-95 sm:-right-5"><Menu size={21} /></button>}
        </div>
      </div>
      <footer className="flex flex-col gap-2 border-t border-[#d8e4de] pt-5 text-xs text-[#739087] sm:flex-row sm:items-center sm:justify-between"><span>TechNest · electronics, thoughtfully supported</span><span>Mon–Fri, 9am–6pm ET · Human support available</span></footer>
    </section>
  </main>;
}
