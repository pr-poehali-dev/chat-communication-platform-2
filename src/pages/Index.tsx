import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';
import CallsSection from '@/components/CallsSection';

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
    if (s === 'calls') setSelected(null);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background mesh-bg">
      <Sidebar active={section} onChange={handleSectionChange} />

      <div className="w-72 xl:w-80 flex-shrink-0 border-r border-border flex flex-col overflow-hidden">
        {section !== 'calls' ? (
          <ChatList
            mode={section as 'chats' | 'groups'}
            selectedId={selected?.id}
            onSelect={chat => setSelected({ id: chat.id, name: chat.name, avatar: chat.avatar, online: chat.online })}
          />
        ) : (
          <CallsSection />
        )}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {section === 'calls' ? (
          <CallsEmptyRight />
        ) : selected ? (
          <ChatWindow name={selected.name} avatar={selected.avatar} online={selected.online} />
        ) : (
          <EmptyState section={section} />
        )}
      </div>
    </div>
  );
}

function CallsEmptyRight() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center p-8 mesh-bg">
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon-green/20 to-neon-blue/20 flex items-center justify-center text-5xl border border-neon-green/20 animate-float">
          📞
        </div>
        <div className="absolute inset-0 rounded-full border border-neon-green/10 scale-125 animate-pulse-glow" />
      </div>
      <div>
        <h2 className="font-unbounded text-xl font-bold text-foreground mb-2">Новый звонок</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Выберите контакт из истории звонков или нажмите «+» для нового вызова
        </p>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2">
          <button className="w-14 h-14 rounded-2xl bg-neon-green/20 border border-neon-green/30 flex items-center justify-center hover:bg-neon-green/30 transition-all hover-lift">
            <span className="text-2xl">📞</span>
          </button>
          <span className="text-xs text-muted-foreground">Аудио</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center hover:bg-primary/30 transition-all hover-lift">
            <span className="text-2xl">📹</span>
          </button>
          <span className="text-xs text-muted-foreground">Видео</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button className="w-14 h-14 rounded-2xl bg-neon-blue/20 border border-neon-blue/30 flex items-center justify-center hover:bg-neon-blue/30 transition-all hover-lift">
            <span className="text-2xl">👥</span>
          </button>
          <span className="text-xs text-muted-foreground">Конфа</span>
        </div>
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
