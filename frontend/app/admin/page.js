'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, BookOpen, LogIn, MessageSquare, Pencil, Plus, Trash2, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const emptyEntry = { category: 'Support', question: '', answer: '', tags: [] };

export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [entries, setEntries] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeTab, setActiveTab] = useState('knowledge');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => setToken(window.localStorage.getItem('technest-admin-token')), []);
  useEffect(() => { if (token) loadData(); }, [token]);

  async function loadData() {
    const headers = { Authorization: `Bearer ${token}` };
    const [knowledge, chat] = await Promise.all([
      fetch(`${API_URL}/admin/knowledge`, { headers }),
      fetch(`${API_URL}/admin/conversations`, { headers })
    ]);
    if (knowledge.ok) setEntries(await knowledge.json());
    if (chat.ok) setConversations(await chat.json());
  }

  async function login(event) {
    event.preventDefault();
    setError('');
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (!response.ok) return setError(data.error);
    window.localStorage.setItem('technest-admin-token', data.token);
    setToken(data.token);
  }

  async function saveEntry(event) {
    event.preventDefault();
    const payload = {
      ...editing,
      tags: typeof editing.tags === 'string' ? editing.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : editing.tags
    };
    const response = await fetch(`${API_URL}/admin/knowledge${editing._id ? `/${editing._id}` : ''}`, {
      method: editing._id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (response.ok) { setEditing(null); loadData(); }
  }

  async function deleteEntry(id) {
    if (!window.confirm('Delete this knowledge entry?')) return;
    await fetch(`${API_URL}/admin/knowledge/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    loadData();
  }

  if (!token) return <main className="grid min-h-screen place-items-center bg-[#f4f8f6] px-5"><form onSubmit={login} className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-[0_25px_70px_rgba(16,35,43,.1)]"><a href="/" className="font-[family-name:var(--font-space)] text-lg font-bold tracking-[-.04em]">TechNest<span className="text-[#ff6b4a]">.</span></a><h1 className="mt-12 font-[family-name:var(--font-space)] text-3xl font-semibold tracking-[-.05em]">Team console</h1><p className="mt-2 text-sm text-[#678078]">Manage the knowledge that powers Nest.</p><div className="mt-8 space-y-4"><input required type="email" placeholder="Admin email" value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} className="w-full rounded-xl border border-[#d8e4de] px-4 py-3 text-sm outline-none focus:border-[#ff6b4a]" /><input required type="password" placeholder="Password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} className="w-full rounded-xl border border-[#d8e4de] px-4 py-3 text-sm outline-none focus:border-[#ff6b4a]" /></div>{error && <p className="mt-3 text-sm text-[#d44d34]">{error}</p>}<button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#10232b] py-3 text-sm font-bold text-white transition hover:bg-[#203e48]"><LogIn size={16} /> Sign in</button></form></main>;

  return <main className="min-h-screen bg-[#f4f8f6] px-5 py-6 text-[#10232b] sm:px-8"><header className="mx-auto flex max-w-6xl items-center justify-between"><a href="/" className="font-[family-name:var(--font-space)] text-lg font-bold tracking-[-.04em]">TechNest<span className="text-[#ff6b4a]">.</span></a><button onClick={() => { window.localStorage.removeItem('technest-admin-token'); setToken(null); }} className="text-sm font-semibold text-[#678078] hover:text-[#10232b]">Sign out</button></header><div className="mx-auto mt-12 max-w-6xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-[#ff6b4a]">Operations</p><h1 className="mt-2 font-[family-name:var(--font-space)] text-4xl font-semibold tracking-[-.06em]">Team console</h1></div><div className="flex gap-2 rounded-xl bg-white p-1"><button onClick={() => setActiveTab('knowledge')} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${activeTab === 'knowledge' ? 'bg-[#10232b] text-white' : 'text-[#678078]'}`}><BookOpen size={15} /> Knowledge</button><button onClick={() => setActiveTab('conversations')} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${activeTab === 'conversations' ? 'bg-[#10232b] text-white' : 'text-[#678078]'}`}><MessageSquare size={15} /> Conversations</button></div></div>{activeTab === 'knowledge' ? <section className="mt-8"><div className="mb-4 flex items-center justify-between"><p className="text-sm text-[#678078]">{entries.length} grounded answers</p><button onClick={() => setEditing(emptyEntry)} className="flex items-center gap-2 rounded-xl bg-[#ff6b4a] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#e95b3d]"><Plus size={16} /> Add entry</button></div><div className="space-y-3">{entries.map((entry) => <article key={entry._id} className="flex flex-col justify-between gap-4 rounded-2xl border border-[#dce8e1] bg-white p-5 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2 text-xs font-semibold text-[#ff6b4a]"><span>{entry.category}</span><span className="text-[#b0c1ba]">·</span><span>{entry.tags?.join(' · ')}</span></div><h2 className="mt-2 font-[family-name:var(--font-space)] font-semibold">{entry.question}</h2><p className="mt-1 max-w-3xl text-sm leading-6 text-[#678078]">{entry.answer}</p></div><div className="flex shrink-0 gap-2"><button onClick={() => setEditing({ ...entry, tags: entry.tags.join(', ') })} aria-label="Edit entry" className="grid h-9 w-9 place-items-center rounded-lg border border-[#dce8e1] hover:border-[#ff6b4a]"><Pencil size={15} /></button><button onClick={() => deleteEntry(entry._id)} aria-label="Delete entry" className="grid h-9 w-9 place-items-center rounded-lg border border-[#dce8e1] text-[#d44d34] hover:border-[#d44d34]"><Trash2 size={15} /></button></div></article>)}</div></section> : <section className="mt-8 space-y-4">{conversations.length ? conversations.map((conversation) => <article key={conversation._id} className="rounded-2xl border border-[#dce8e1] bg-white p-5"><div className="flex items-center justify-between text-xs text-[#678078]"><div className="flex items-center gap-2"><span>{conversation.sessionId}</span>{conversation.escalated && <span className="flex items-center gap-1 rounded-full bg-[#fff0ed] px-2 py-1 font-semibold text-[#d44d34]"><AlertCircle size={13} /> Escalated</span>}</div><span>{new Date(conversation.updatedAt).toLocaleString()}</span></div><div className="mt-4 space-y-3">{conversation.messages.map((message, index) => <p key={index} className={`max-w-2xl text-sm leading-6 ${message.role === 'user' ? 'font-semibold text-[#10232b]' : 'text-[#678078]'}`}><span className="mr-2 text-xs font-bold uppercase text-[#ff6b4a]">{message.role}</span>{message.content}</p>)}</div></article>) : <p className="rounded-2xl bg-white p-8 text-center text-sm text-[#678078]">No customer conversations yet.</p>}</section>}</div>{editing && <div className="fixed inset-0 z-10 grid place-items-center bg-[#10232b]/40 px-5"><form onSubmit={saveEntry} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="font-[family-name:var(--font-space)] text-xl font-semibold">{editing._id ? 'Edit entry' : 'New entry'}</h2><button type="button" onClick={() => setEditing(null)} aria-label="Close editor"><X size={20} /></button></div><div className="mt-6 space-y-3"><input required placeholder="Category" value={editing.category} onChange={(event) => setEditing({ ...editing, category: event.target.value })} className="w-full rounded-xl border border-[#d8e4de] px-4 py-3 text-sm outline-none focus:border-[#ff6b4a]" /><input required placeholder="Question" value={editing.question} onChange={(event) => setEditing({ ...editing, question: event.target.value })} className="w-full rounded-xl border border-[#d8e4de] px-4 py-3 text-sm outline-none focus:border-[#ff6b4a]" /><textarea required rows="5" placeholder="Answer" value={editing.answer} onChange={(event) => setEditing({ ...editing, answer: event.target.value })} className="w-full resize-none rounded-xl border border-[#d8e4de] px-4 py-3 text-sm outline-none focus:border-[#ff6b4a]" /><input placeholder="Tags, comma separated" value={editing.tags} onChange={(event) => setEditing({ ...editing, tags: event.target.value })} className="w-full rounded-xl border border-[#d8e4de] px-4 py-3 text-sm outline-none focus:border-[#ff6b4a]" /></div><button className="mt-5 w-full rounded-xl bg-[#10232b] py-3 text-sm font-bold text-white">Save entry</button></form></div>}</main>;
}
