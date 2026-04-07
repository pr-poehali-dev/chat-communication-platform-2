import { useState } from 'react';
import Icon from '@/components/ui/icon';

export interface Contact {
  id: number;
  name: string;
  avatar: string;
  username: string;
  mutual?: number;
  status: 'none' | 'pending' | 'friend';
}

const ALL_USERS: Contact[] = [
  { id: 201, name: 'Артём Космос', avatar: '🌌', username: 'artem_space', mutual: 3, status: 'none' },
  { id: 202, name: 'Соня Арт', avatar: '🎨', username: 'sonya_art', mutual: 1, status: 'none' },
  { id: 203, name: 'Влад Техно', avatar: '🤖', username: 'vlad_tech', mutual: 5, status: 'none' },
  { id: 204, name: 'Миша Спорт', avatar: '⚽', username: 'misha_sport', mutual: 0, status: 'none' },
  { id: 205, name: 'Даша Кино', avatar: '🎬', username: 'dasha_cinema', mutual: 2, status: 'none' },
  { id: 206, name: 'Кирилл Музыка', avatar: '🎹', username: 'kirill_music', mutual: 4, status: 'none' },
  { id: 207, name: 'Полина Наука', avatar: '🔬', username: 'polina_sci', mutual: 1, status: 'none' },
];

interface AddFriendPanelProps {
  friends: Contact[];
  onFriendAdded: (contact: Contact) => void;
  onStartChat: (contact: Contact) => void;
  onClose: () => void;
}

export default function AddFriendPanel({ friends, onFriendAdded, onStartChat, onClose }: AddFriendPanelProps) {
  const [tab, setTab] = useState<'search' | 'friends' | 'requests'>('friends');
  const [query, setQuery] = useState('');
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());

  const friendIds = new Set(friends.map(f => f.id));

  const searchResults = query.trim().length > 0
    ? ALL_USERS.filter(u =>
        !friendIds.has(u.id) &&
        (u.name.toLowerCase().includes(query.toLowerCase()) ||
         u.username.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const sendRequest = (contact: Contact) => {
    setPendingIds(prev => new Set([...prev, contact.id]));
  };

  const acceptFriend = (contact: Contact) => {
    onFriendAdded(contact);
    setPendingIds(prev => { const s = new Set(prev); s.delete(contact.id); return s; });
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-background animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border glass-bright flex-shrink-0">
        <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors">
          <Icon name="ArrowLeft" size={18} className="text-foreground" />
        </button>
        <span className="font-unbounded text-sm font-bold text-foreground flex-1">Люди</span>
      </div>

      {/* Табы */}
      <div className="flex gap-1 px-4 py-2 border-b border-border flex-shrink-0">
        {[
          { id: 'friends', label: 'Друзья', count: friends.length },
          { id: 'search', label: 'Найти', count: 0 },
          { id: 'requests', label: 'Заявки', count: pendingIds.size },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${tab === t.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
          >
            {t.label}
            {t.count > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Поиск */}
        {tab === 'search' && (
          <div className="flex flex-col h-full">
            <div className="px-4 pt-3 pb-2 flex-shrink-0">
              <div className="relative">
                <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Имя или @username..."
                  className="w-full pl-8 pr-3 py-2.5 text-sm bg-secondary rounded-xl outline-none focus:ring-1 ring-primary/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
            {!query && (
              <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center px-6">
                <div className="text-4xl">👥</div>
                <p className="text-sm text-muted-foreground">Введите имя или @username для поиска</p>
              </div>
            )}
            {query && searchResults.length === 0 && (
              <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center px-6">
                <div className="text-4xl">🤷</div>
                <p className="text-sm text-muted-foreground">Никого не найдено</p>
              </div>
            )}
            <div className="px-2">
              {searchResults.map((user, i) => (
                <UserRow
                  key={user.id}
                  user={user}
                  delay={i * 0.05}
                  isPending={pendingIds.has(user.id)}
                  isFriend={friendIds.has(user.id)}
                  onAdd={() => sendRequest(user)}
                  onMessage={() => { onStartChat(user); onClose(); }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Друзья */}
        {tab === 'friends' && (
          <div className="px-2 py-2">
            {friends.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
                <div className="text-4xl">🫂</div>
                <p className="text-sm text-muted-foreground">Пока нет друзей — найди их через поиск!</p>
              </div>
            )}
            {friends.map((user, i) => (
              <UserRow
                key={user.id}
                user={user}
                delay={i * 0.05}
                isFriend
                isPending={false}
                onMessage={() => { onStartChat(user); onClose(); }}
              />
            ))}
          </div>
        )}

        {/* Заявки */}
        {tab === 'requests' && (
          <div className="px-2 py-2">
            {pendingIds.size === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
                <div className="text-4xl">📬</div>
                <p className="text-sm text-muted-foreground">Нет входящих заявок</p>
              </div>
            )}
            {ALL_USERS.filter(u => pendingIds.has(u.id)).map((user, i) => (
              <div
                key={user.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl mx-1 hover:bg-secondary transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
              >
                <div className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center text-xl flex-shrink-0">
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">{user.name}</div>
                  <div className="text-xs text-muted-foreground">@{user.username}</div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => acceptFriend(user)}
                    className="w-8 h-8 rounded-xl bg-neon-green/20 hover:bg-neon-green/30 flex items-center justify-center transition-colors"
                  >
                    <Icon name="Check" size={14} className="text-neon-green" />
                  </button>
                  <button
                    onClick={() => setPendingIds(prev => { const s = new Set(prev); s.delete(user.id); return s; })}
                    className="w-8 h-8 rounded-xl bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-colors"
                  >
                    <Icon name="X" size={14} className="text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserRow({
  user, delay, isFriend, isPending, onAdd, onMessage,
}: {
  user: Contact;
  delay: number;
  isFriend: boolean;
  isPending: boolean;
  onAdd?: () => void;
  onMessage?: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl mx-1 hover:bg-secondary transition-colors animate-fade-in"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}
    >
      <div className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center text-xl flex-shrink-0">
        {user.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-foreground">{user.name}</div>
        <div className="text-xs text-muted-foreground">
          @{user.username}
          {user.mutual !== undefined && user.mutual > 0 && (
            <span className="ml-1.5 text-primary">{user.mutual} общих</span>
          )}
        </div>
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        {isFriend ? (
          <button
            onClick={onMessage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary text-xs font-medium transition-all hover-lift"
          >
            <Icon name="MessageCircle" size={13} />
            Написать
          </button>
        ) : isPending ? (
          <span className="px-3 py-1.5 rounded-xl bg-secondary text-muted-foreground text-xs font-medium">
            Отправлено
          </span>
        ) : (
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neon-green/15 hover:bg-neon-green/25 text-neon-green text-xs font-medium transition-all hover-lift"
          >
            <Icon name="UserPlus" size={13} />
            Добавить
          </button>
        )}
      </div>
    </div>
  );
}
