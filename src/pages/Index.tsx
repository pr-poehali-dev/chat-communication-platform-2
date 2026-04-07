import { useState, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatList, { Chat, initialChats, initialGroups } from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import CallsSection from '@/components/CallsSection';
import MembersList from '@/components/MembersList';
import MyProfilePanel, { MyProfile } from '@/components/chat/MyProfilePanel';
import AddFriendPanel, { Contact } from '@/components/chat/AddFriendPanel';
import Icon from '@/components/ui/icon';

type Section = 'chats' | 'groups' | 'calls';

interface SelectedChat {
  id: number;
  name: string;
  avatar: string;
  online?: boolean;
}

const defaultProfile: MyProfile = {
  name: 'Я',
  username: 'my_account',
  bio: 'Привет, я использую Вспышку!',
  avatar: '😎',
  status: 'online',
};

export default function Index() {
  const [section, setSection] = useState<Section>('chats');
  const [selected, setSelected] = useState<SelectedChat | null>({
    id: 1, name: 'Алина Звёздная', avatar: '🌙', online: true,
  });
  const [listCollapsed, setListCollapsed] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [showMyProfile, setShowMyProfile] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [myProfile, setMyProfile] = useState<MyProfile>(defaultProfile);

  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [groups] = useState<Chat[]>(initialGroups);
  const [friends, setFriends] = useState<Contact[]>([]);

  const touchStartX = useRef<number | null>(null);

  const handleSectionChange = (s: Section) => {
    setSection(s);
    setSelected(null);
    setListCollapsed(false);
    setMembersOpen(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (section === 'groups' && selected && listCollapsed) {
      if (dx > 60) setMembersOpen(true);
      if (dx < -60) setMembersOpen(false);
    } else {
      if (dx > 60) setListCollapsed(true);
      if (dx < -60) setListCollapsed(false);
    }
    touchStartX.current = null;
  };

  // Создать чат с другом и сразу открыть
  const startChatWithContact = (contact: Contact) => {
    const exists = chats.find(c => c.id === contact.id);
    if (!exists) {
      const newChat: Chat = {
        id: contact.id,
        name: contact.name,
        avatar: contact.avatar,
        lastMsg: 'Начните общение',
        time: 'сейчас',
        online: true,
      };
      setChats(prev => [newChat, ...prev]);
    }
    setSection('chats');
    setSelected({ id: contact.id, name: contact.name, avatar: contact.avatar, online: true });
    setListCollapsed(true);
    setShowAddFriend(false);
  };

  const handleFriendAdded = (contact: Contact) => {
    setFriends(prev => prev.find(f => f.id === contact.id) ? prev : [...prev, { ...contact, status: 'friend' }]);
  };

  const currentChats = section === 'chats' ? chats : groups;

  const statusColor = {
    online: 'bg-neon-green',
    away: 'bg-yellow-400',
    dnd: 'bg-destructive',
    offline: 'bg-muted-foreground',
  }[myProfile.status];

  return (
    <div
      className="h-screen flex overflow-hidden bg-background mesh-bg"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {showMyProfile && (
        <MyProfilePanel
          profile={myProfile}
          onSave={p => setMyProfile(p)}
          onClose={() => setShowMyProfile(false)}
        />
      )}

      <Sidebar
        active={section}
        onChange={handleSectionChange}
        myProfile={myProfile}
        statusColor={statusColor}
        onProfileClick={() => setShowMyProfile(true)}
      />

      {section !== 'calls' && (
        <div className={`chat-list-panel flex-shrink-0 border-r border-border flex flex-col w-72 xl:w-80 ${listCollapsed ? 'collapsed' : ''}`}>
          <ChatList
            mode={section as 'chats' | 'groups'}
            chats={currentChats}
            selectedId={selected?.id}
            onSelect={chat => {
              setSelected({ id: chat.id, name: chat.name, avatar: chat.avatar, online: chat.online });
              setListCollapsed(true);
              setMembersOpen(false);
            }}
            onAddClick={() => setShowAddFriend(true)}
          />
        </div>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Панель добавления друзей */}
          {showAddFriend && (
            <AddFriendPanel
              friends={friends}
              onFriendAdded={handleFriendAdded}
              onStartChat={startChatWithContact}
              onClose={() => setShowAddFriend(false)}
            />
          )}

          {section === 'calls' ? (
            <CallsSection />
          ) : selected ? (
            <>
              {listCollapsed && (
                <div className="absolute top-3 left-3 z-20">
                  <button
                    onClick={() => { setListCollapsed(false); setMembersOpen(false); }}
                    className="w-9 h-9 rounded-xl glass-bright border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Icon name="ChevronLeft" size={18} className="text-foreground" />
                  </button>
                </div>
              )}
              <ChatWindow name={selected.name} avatar={selected.avatar} online={selected.online} />
            </>
          ) : (
            <EmptyState section={section} onAddClick={() => setShowAddFriend(true)} />
          )}
        </div>

        {section === 'groups' && selected && (
          <div className="hidden md:block">
            <MembersList chatId={selected.id} />
          </div>
        )}

        {section === 'groups' && selected && (
          <div className={`md:hidden absolute inset-y-0 right-0 z-30 transition-transform duration-300 ease-in-out ${membersOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="h-full w-64 bg-background border-l border-border flex flex-col shadow-2xl">
              <div className="flex items-center gap-2 px-3 py-3 border-b border-border">
                <button
                  onClick={() => setMembersOpen(false)}
                  className="w-8 h-8 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors"
                >
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                </button>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Участники</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <MembersList chatId={selected.id} hideHeader />
              </div>
            </div>
          </div>
        )}

        {section === 'groups' && selected && listCollapsed && !membersOpen && (
          <div className="md:hidden absolute bottom-20 right-3 z-20">
            <button
              onClick={() => setMembersOpen(true)}
              className="w-9 h-9 rounded-xl glass-bright border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Icon name="Users" size={16} className="text-primary" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ section, onAddClick }: { section: Section; onAddClick: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8 mesh-bg">
      <div className="text-6xl animate-float">
        {section === 'groups' ? '👥' : '💬'}
      </div>
      <div>
        <h2 className="font-unbounded text-xl font-bold text-foreground mb-2">
          Выберите чат
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Выберите разговор из списка слева, чтобы начать общение
        </p>
      </div>
      {section === 'chats' && (
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover-lift transition-all"
        >
          <Icon name="UserPlus" size={16} />
          Найти людей
        </button>
      )}
    </div>
  );
}
