import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import CallsSection from '@/components/CallsSection';
import MembersList from '@/components/MembersList';

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

  const handleSectionChange = (s: Section) => {
    setSection(s);
    setSelected(null);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background mesh-bg">
      <Sidebar active={section} onChange={handleSectionChange} />

      {section !== 'calls' && (
        <div className="w-72 xl:w-80 flex-shrink-0 border-r border-border flex flex-col overflow-hidden">
          <ChatList
            mode={section as 'chats' | 'groups'}
            selectedId={selected?.id}
            onSelect={chat => setSelected({ id: chat.id, name: chat.name, avatar: chat.avatar, online: chat.online })}
          />
        </div>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-hidden">
          {section === 'calls' ? (
            <CallsSection />
          ) : selected ? (
            <ChatWindow name={selected.name} avatar={selected.avatar} online={selected.online} />
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