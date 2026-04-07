import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  text: string;
  time: string;
  sent: boolean;
}

interface SearchPanelProps {
  messages: Message[];
  onClose: () => void;
  onJumpTo: (id: number) => void;
}

export default function SearchPanel({ messages, onClose, onJumpTo }: SearchPanelProps) {
  const [query, setQuery] = useState('');

  const results = query.trim()
    ? messages.filter(m => m.text.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-background animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border glass-bright flex-shrink-0">
        <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors">
          <Icon name="ArrowLeft" size={18} className="text-foreground" />
        </button>
        <div className="flex-1 relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск в сообщениях..."
            className="w-full pl-8 pr-3 py-2 text-sm bg-secondary rounded-xl outline-none focus:ring-1 ring-primary/50 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        {query && (
          <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {!query && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
            <div className="text-4xl">🔍</div>
            <p className="text-sm text-muted-foreground">Введите текст для поиска по сообщениям</p>
          </div>
        )}
        {query && results.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
            <div className="text-4xl">😶</div>
            <p className="text-sm text-muted-foreground">Ничего не найдено по запросу «{query}»</p>
          </div>
        )}
        {results.map(msg => (
          <button
            key={msg.id}
            onClick={() => { onJumpTo(msg.id); onClose(); }}
            className="w-full flex items-start gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name={msg.sent ? 'ArrowUpRight' : 'ArrowDownLeft'} size={14} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-0.5">{msg.time} · {msg.sent ? 'Вы' : 'Собеседник'}</div>
              <p className="text-sm text-foreground leading-relaxed">
                {msg.text.split(new RegExp(`(${query})`, 'gi')).map((part, i) =>
                  part.toLowerCase() === query.toLowerCase()
                    ? <mark key={i} className="bg-primary/30 text-primary rounded px-0.5">{part}</mark>
                    : part
                )}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
