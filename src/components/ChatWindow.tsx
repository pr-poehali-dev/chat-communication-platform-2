import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  text: string;
  time: string;
  sent: boolean;
  reactions?: string[];
  sticker?: string;
}

const STICKERS = ['🎉', '🔥', '💯', '🚀', '😎', '❤️', '👏', '🙌', '✨', '💪', '😂', '🤯'];
const REACTIONS = ['❤️', '🔥', '😂', '👍', '😮', '😢'];

const initMessages: Message[] = [
  { id: 1, text: 'Привет! Как дела? 👋', time: '14:20', sent: false },
  { id: 2, text: 'Отлично, только что запустил новый проект!', time: '14:21', sent: true },
  { id: 3, text: 'Это просто огонь 🔥', time: '14:22', sent: false, reactions: ['🔥', '🔥', '❤️'] },
  { id: 4, text: 'Да, очень рад! Там крутой дизайн получился', time: '14:25', sent: true },
  { id: 5, text: '', time: '14:26', sent: false, sticker: '🎉' },
  { id: 6, text: 'Спасибо! Ты вечером свободен?', time: '14:30', sent: true },
  { id: 7, text: 'Да, давай созвонимся в 19:00', time: '14:32', sent: false },
];

interface ChatWindowProps {
  name: string;
  avatar: string;
  online?: boolean;
}

export default function ChatWindow({ name, avatar, online }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initMessages);
  const [input, setInput] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [hoveredMsg, setHoveredMsg] = useState<number | null>(null);
  const [showReactionFor, setShowReactionFor] = useState<number | null>(null);
  const [newMsgIds, setNewMsgIds] = useState<Set<number>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (text: string, sticker?: string) => {
    if (!text.trim() && !sticker) return;
    const newMsg: Message = {
      id: Date.now(),
      text: sticker ? '' : text,
      sticker,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      sent: true,
    };
    setMessages(prev => [...prev, newMsg]);
    setNewMsgIds(prev => new Set([...prev, newMsg.id]));
    setInput('');
    setShowStickers(false);
  };

  const addReaction = (msgId: number, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const existing = m.reactions || [];
      if (existing.includes(emoji)) return m;
      return { ...m, reactions: [...existing, emoji] };
    }));
    setShowReactionFor(null);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border glass-bright flex-shrink-0">
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-xl">
            {avatar}
          </div>
          {online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-neon-green rounded-full border-2 border-background" />}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-foreground">{name}</div>
          <div className="text-xs text-neon-green">{online ? 'онлайн' : 'был(а) недавно'}</div>
        </div>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors group">
            <Icon name="Phone" size={16} className="text-muted-foreground group-hover:text-neon-blue transition-colors" />
          </button>
          <button className="w-9 h-9 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors group">
            <Icon name="Video" size={16} className="text-muted-foreground group-hover:text-neon-purple transition-colors" />
          </button>
          <button className="w-9 h-9 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors group">
            <Icon name="MoreVertical" size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-3 mesh-bg">
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className={`flex ${msg.sent ? 'justify-end' : 'justify-start'} group animate-fade-in`}
            style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s`, animationFillMode: 'both' }}
            onMouseEnter={() => setHoveredMsg(msg.id)}
            onMouseLeave={() => { setHoveredMsg(null); setShowReactionFor(null); }}
          >
            <div className="relative max-w-[70%]">
              {msg.sticker ? (
                <div className={`text-5xl p-2 ${newMsgIds.has(msg.id) ? 'animate-bounce-in' : ''}`}>{msg.sticker}</div>
              ) : (
                <div className={`px-4 py-2.5 text-sm leading-relaxed ${msg.sent ? 'msg-bubble-sent text-white' : 'msg-bubble-recv text-foreground'}`}>
                  {msg.text}
                </div>
              )}

              {msg.reactions && msg.reactions.length > 0 && (
                <div className={`flex flex-wrap gap-1 mt-1 ${msg.sent ? 'justify-end' : 'justify-start'}`}>
                  {Object.entries(
                    msg.reactions.reduce((acc, r) => ({ ...acc, [r]: (acc[r] || 0) + 1 }), {} as Record<string, number>)
                  ).map(([emoji, count]) => (
                    <span key={emoji} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-secondary border border-border text-xs hover:bg-primary/20 cursor-pointer transition-colors">
                      {emoji} {count > 1 && <span className="text-muted-foreground">{count}</span>}
                    </span>
                  ))}
                </div>
              )}

              <div className={`text-[10px] text-muted-foreground mt-1 ${msg.sent ? 'text-right' : 'text-left'}`}>
                {msg.time} {msg.sent && <span className="text-neon-blue">✓✓</span>}
              </div>

              {hoveredMsg === msg.id && (
                <div className={`absolute top-0 ${msg.sent ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'} flex items-center gap-1`}>
                  <button
                    onClick={() => setShowReactionFor(showReactionFor === msg.id ? null : msg.id)}
                    className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-primary/20 transition-colors text-xs"
                  >
                    😊
                  </button>
                </div>
              )}

              {showReactionFor === msg.id && (
                <div className={`absolute z-20 top-0 ${msg.sent ? 'right-0 translate-y-8' : 'left-0 translate-y-8'} glass-bright rounded-2xl p-2 flex gap-1.5 shadow-2xl animate-fade-in`}>
                  {REACTIONS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => addReaction(msg.id, emoji)}
                      className="text-xl hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {showStickers && (
        <div className="px-4 pb-2 animate-slide-up">
          <div className="glass-bright rounded-2xl p-3">
            <div className="text-xs text-muted-foreground mb-2 font-medium">Стикеры</div>
            <div className="grid grid-cols-6 gap-2">
              {STICKERS.map(s => (
                <button
                  key={s}
                  onClick={() => send('', s)}
                  className="text-2xl hover:scale-125 transition-transform aspect-square flex items-center justify-center rounded-xl hover:bg-primary/10"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-3 border-t border-border flex-shrink-0">
        <div className="flex items-end gap-2 glass-bright rounded-2xl px-3 py-2">
          <button
            onClick={() => setShowStickers(!showStickers)}
            className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${showStickers ? 'bg-primary/20 text-primary' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
          >
            <span className="text-lg">😊</span>
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }}}
            placeholder="Напишите сообщение..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none max-h-32 overflow-y-auto leading-relaxed py-1"
          />
          <button
            onClick={() => setShowStickers(!showStickers)}
            className="flex-shrink-0 w-8 h-8 rounded-xl hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="Paperclip" size={16} />
          </button>
          <button
            onClick={() => send(input)}
            disabled={!input.trim()}
            className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-all hover:glow-purple hover-lift disabled:hover:transform-none"
          >
            <Icon name="Send" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
