import { useState, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import CallsSection from '@/components/CallsSection';
import MembersList from '@/components/MembersList';
import Icon from '@/components/ui/icon';

type Section = 'chats' | 'groups' | 'calls';

interface SelectedChat {
  id: number;
  name: string;
  avatar: string;
  online?: boolean;
}

export default function Index() {
  const [section, setSection] = useState<Section>('chats');
  const [selected, setSelected] = useState<SelectedChat | null>({
    id: 1,
    name: 'Алина Звёздная',
    avatar: '🌙',
    online: true,
  });
  const [listCollapsed, setListCollapsed] = useState(false);

  const touchStartX = useRef<number | null>(null);

  const handleSectionChange = (s: Section) => {
    setSection(s);
    setSelected(null);
    setListCollapsed(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (dx > 60) setListCollapsed(true);
    if (dx < -60) setListCollapsed(false);
    touchStartX.current = null;
  };

  return (
    <div
      className="h-screen flex overflow-hidden bg-background mesh-bg"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Sidebar active={section} onChange={handleSectionChange} />

      {section !== 'calls' && (
        <div className={`chat-list-panel flex-shrink-0 border-r border-border flex flex-col w-72 xl:w-80 ${listCollapsed ? 'collapsed' : ''}`}>
          <ChatList
            mode={section as 'chats' | 'groups'}
            selectedId={selected?.id}
            onSelect={chat => {
              setSelected({ id: chat.id, name: chat.name, avatar: chat.avatar, online: chat.online });
              setListCollapsed(true);
            }}
          />
        </div>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-hidden">
          {section === 'calls' ? (
            <CallsSection />
          ) : selected ? (
            <>
              {listCollapsed && (
                <div className="absolute top-3 left-3 z-20">
                  <button
                    onClick={() => setListCollapsed(false)}
                    className="w-9 h-9 rounded-xl glass-bright border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Icon name="ChevronLeft" size={18} className="text-foreground" />
                  </button>
                </div>
              )}
              <ChatWindow name={selected.name} avatar={selected.avatar} online={selected.online} />
            </>
          ) : (
            <EmptyState section={section} />
          )}
        </div>
        {section === 'groups' && selected && (
          <MembersList chatId={selected.id} />
        )}
      </div>
    </div>
  );
}

function EmptyState({ section }: { section: Section }) {
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
    </div>
  );
}