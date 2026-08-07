"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, BookOpen, Code2, Lightbulb, MessageSquare, RotateCcw, Send, Target } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMentorMessages, sendCareerGuidance, type MentorMessage } from "@/lib/api/resources";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-hydrated";

const prompts = [
  ["Review my resume", BookOpen], ["Interview tips", MessageSquare], ["Learning roadmap", Target], ["Career advice", Lightbulb], ["Code review", Code2],
] as const;

export default function MentorPage() {
  const mounted = useHydrated();
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMentorMessages().then((data) => {
      const mockData = data && data.length > 0 ? data : [
        { id: "m1", role: "assistant", content: "Hi there! I'm your AI Career Mentor. I've analyzed your skill passport and noticed you have strong React skills. How can I help you today?", timestamp: new Date(Date.now() - 3600000).toISOString() }
      ];
      setMessages(mockData as MentorMessage[]);
    }).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load mentor history."));
  }, []);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, sending]);

  const send = (content = input) => {
    if (!content.trim() || sending) return;
    const optimistic: MentorMessage = { id: `local-${Date.now()}`, role: "user", content, timestamp: new Date().toISOString() };
    setMessages((items) => [...items, optimistic]); setInput(""); setSending(true); setError(null);
    sendCareerGuidance(content).then((response) => setMessages((items) => [...items, response])).catch((cause) => { setMessages((items) => items.filter((item) => item.id !== optimistic.id)); setError(cause instanceof Error ? cause.message : "Could not send message."); }).finally(() => setSending(false));
  };

  if (!mounted) {
    return <DashboardLayout><div className="mx-auto grid h-[calc(100vh-8rem)] max-w-[1400px] gap-6 lg:grid-cols-4">
      <Card className="flex min-h-0 flex-col overflow-hidden !p-0 lg:col-span-3">
        <div className="flex items-center gap-3 border-b border-border-subtle px-6 py-4">
          <div className="gradient-bg grid h-10 w-10 place-items-center rounded-xl"><Bot className="h-5 w-5 text-white" /></div>
          <div><h1 className="font-semibold">AI Career Mentor</h1><p className="text-xs text-emerald-400">Initializing chat …</p></div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 py-4 text-sm text-text-muted">Loading mentor interface…</div>
      </Card>
      <aside className="hidden lg:block"><Card><p className="text-sm text-text-muted">This page is loading secure career guidance.</p></Card></aside>
    </div></DashboardLayout>;
  }
  return <DashboardLayout><div className="mx-auto grid h-[calc(100vh-8rem)] max-w-[1400px] gap-6 lg:grid-cols-4">
    <Card className="flex min-h-0 flex-col overflow-hidden !p-0 lg:col-span-3"><div className="flex items-center gap-3 border-b border-border-subtle px-6 py-4"><div className="gradient-bg grid h-10 w-10 place-items-center rounded-xl"><Bot className="h-5 w-5 text-white" /></div><div><h1 className="font-semibold">AI Career Mentor</h1><p className="text-xs text-emerald-400">Online · uses your assessment progress</p></div><Button variant="ghost" size="sm" className="ml-auto" onClick={() => setMessages([])}><RotateCcw className="h-4 w-4" /> Clear view</Button></div><div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">{error && <p className="text-sm text-red-400">{error}</p>}{messages.length === 0 && <p className="text-sm text-text-muted">Ask for career guidance, a study plan, or interview preparation.</p>}{messages.map((message) => <div key={message.id} className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}><div className={cn("max-w-[80%] rounded-2xl px-4 py-3 text-sm", message.role === "user" ? "border border-brand-orange/20 bg-brand-orange/10" : "glass-card")}><p className="whitespace-pre-wrap">{message.content}</p><p className="mt-2 text-[10px] text-text-muted">{new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p></div></div>)}{sending && <div className="flex gap-2 text-sm text-text-muted"><Bot className="h-4 w-4" /> Thinking…</div>}<div ref={bottom} /></div><div className="flex gap-3 border-t border-border-subtle px-6 py-4"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} placeholder="Ask anything about your career…" className="flex-1 rounded-xl border border-border-subtle bg-glass px-4 py-3 text-sm outline-none focus:border-brand-orange/30" /><Button onClick={() => send()} disabled={!input.trim() || sending}><Send className="h-4 w-4" /></Button></div></Card>
    <aside className="hidden space-y-6 lg:block"><Card><h2 className="mb-3 text-sm font-medium">Quick prompts</h2><div className="space-y-2">{prompts.map(([label, Icon]) => <button key={label} onClick={() => send(label)} className="flex w-full items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 text-left text-sm text-text-muted hover:bg-white/10"><Icon className="h-4 w-4 text-brand-orange" />{label}</button>)}</div></Card><Card><p className="text-sm italic text-text-muted">“Consistency compounds. Pick one skill and make progress today.”</p></Card></aside>
  </div></DashboardLayout>;
}
