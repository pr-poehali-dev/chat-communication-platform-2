import { useState } from 'react';
import Icon from '@/components/ui/icon';

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread?: number;
  online?: boolean;
  pinned?: boolean;
}

export const initialChats: Chat[] = [
  { id: 1, name: 'Алина Звёздная', avatar: '🌙', lastMsg: 'Это просто огонь 🔥', time: '14:32', unread: 3, online: true, pinned: true },
  { id: 2, name: 'Максим Dev', avatar: '💻', lastMsg: 'Отправил пулл реквест', time: '13:15', online: true },
  { id: 3, name: 'Катя Фотограф', avatar: '📸', lastMsg: 'Смотри что снял вчера...', time: '12:05', unread: 1 },
  { id: 4, name: 'Дима Дизайн', avatar: '🎨', lastMsg: 'Макет готов, смотри', time: '11:50' },
  { id: 5, name: 'Настя Travel', avatar: '✈️', lastMsg: 'Куба это нереально!', time: '09:22', unread: 7, online: true },
  { id: 6, name: 'Роберт Музыкант', avatar: '🎵', lastMsg: 'Новый трек вышел', time: 'вч.' },
  { id: 7, name: 'Лена Повар', avatar: '👩‍🍳', lastMsg: 'Рецепт скинула', time: 'вч.' },
];

export const initialGroups: Chat[] = [
  { id: 101, name: 'Команда Альфа 🚀', avatar: '🚀', lastMsg: 'Максим: Деплой прошёл!', time: '15:01', unread: 12, pinned: true },
  { id: 102, name: 'Друзья навсегда', avatar: '🎉', lastMsg: 'Катя: Завтра встречаемся?', time: '14:44', unread: 5 },
  { id: 103, name: 'Игровой клуб', avatar: '🎮', lastMsg: 'Дима: Кто играет?', time: '13:30' },
  { id: 104, name: 'Путешественники', avatar: '🌍', lastMsg: 'Настя: Токио 2026!', time: '10:12', unread: 3 },
  { id: 105, name: 'Книжный клуб', avatar: '📚', lastMsg: 'Рекомендации недели...', time: 'вч.' },
];

interface ChatListProps {
  mode: 'chats' | 'groups';
  chats: Chat[];
  onSelect: (chat: Chat) => void;
  selectedId?: number;
  onAddClick?: () => void;
}

export default function ChatList({ mode, chats, onSelect, selectedId, onAddClick }: ChatListProps) {
  const [search, setSearch] = useState('');
  const filtered = chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-unbounded text-base font-bold text-foreground">
            {mode === 'chats' ? 'Личные чаты' : 'Группы'}
          </h1>
          <button
            onClick={onAddClick}
            className="w-8 h-8 rounded-xl bg-primary/20 hover:bg-primary/30 flex items-center justify-center transition-colors hover-lift"
            title={mode === 'chats' ? 'Новый чат' : 'Создать группу'}
          >
            <Icon name="Plus" size={16} className="text-primary" />
          </button>
        </div>
        <div className="relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="w-full pl-8 pr-3 py-2 text-sm bg-secondary rounded-xl outline-none focus:ring-1 ring-primary/50 text-foreground placeholder:text-muted-foreground transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 gap-3 px-4 text-center">
            <span className="text-3xl">💬</span>
            <p className="text-sm text-muted-foreground">
              {search ? 'Ничего не найдено' : 'Нет чатов — нажмите «+» чтобы добавить'}
            </p>
          </div>
        )}

        {filtered.filter(c => c.pinned).length > 0 && (
          <div className="px-3 py-1">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Закреплённые</span>
          </div>
        )}
        {filtered.filter(c => c.pinned).map(chat => (
          <ChatItem key={chat.id} chat={chat} selected={selectedId === chat.id} onClick={() => onSelect(chat)} />
        ))}
        {filtered.filter(c => c.pinned).length > 0 && filtered.filter(c => !c.pinned).length > 0 && (
          <div className="px-3 py-1 mt-1">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              Все {mode === 'chats' ? 'чаты' : 'группы'}
            </span>
          </div>
        )}
        {filtered.filter(c => !c.pinned).map(chat => (
          <ChatItem key={chat.id} chat={chat} selected={selectedId === chat.id} onClick={() => onSelect(chat)} />
        ))}
      </div>
    </div>
  );
}

function ChatItem({ chat, selected, onClick }: { chat: Chat; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 mx-1 rounded-xl transition-all duration-150 text-left hover-lift
        ${selected ? 'bg-primary/15 border border-primary/20' : 'hover:bg-secondary'}`}
      style={{ width: 'calc(100% - 8px)' }}
    >
      <div className="relative flex-shrink-0">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl
          ${selected ? 'bg-primary/20' : 'bg-secondary'}`}>
          {chat.avatar}
        </div>
        {chat.online && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-neon-green rounded-full border-2 border-background" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-sm font-semibold text-foreground truncate">{chat.name}</span>
          <span className="text-[10px] text-muted-foreground flex-shrink-0">{chat.time}</span>
        </div>
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <span className="text-xs text-muted-foreground truncate">{chat.lastMsg}</span>
          {chat.unread && (
            <span className="flex-shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
