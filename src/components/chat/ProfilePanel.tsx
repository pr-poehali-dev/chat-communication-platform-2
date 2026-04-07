import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ProfilePanelProps {
  name: string;
  avatar: string;
  online?: boolean;
  onClose: () => void;
}

export default function ProfilePanel({ name, avatar, online, onClose }: ProfilePanelProps) {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-background animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border glass-bright flex-shrink-0">
        <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors">
          <Icon name="ArrowLeft" size={18} className="text-foreground" />
        </button>
        <span className="font-semibold text-sm text-foreground">Профиль</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="flex flex-col items-center gap-3 py-8 px-6 mesh-bg">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/30 to-neon-blue/30 flex items-center justify-center text-5xl border-2 border-primary/30 glow-purple">
              {avatar}
            </div>
            {online && <span className="absolute bottom-1 right-1 w-4 h-4 bg-neon-green rounded-full border-2 border-background" />}
          </div>
          <div className="text-center">
            <h2 className="font-unbounded text-lg font-bold text-foreground">{name}</h2>
            <p className={`text-sm mt-1 ${online ? 'text-neon-green' : 'text-muted-foreground'}`}>
              {online ? 'онлайн' : 'был(а) недавно'}
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <button className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-all hover-lift">
              <Icon name="MessageCircle" size={18} className="text-primary" />
              <span className="text-xs text-primary font-medium">Сообщение</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl bg-neon-blue/10 border border-neon-blue/20 hover:bg-neon-blue/20 transition-all hover-lift">
              <Icon name="Phone" size={18} className="text-neon-blue" />
              <span className="text-xs text-neon-blue font-medium">Звонок</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl bg-neon-pink/10 border border-neon-pink/20 hover:bg-neon-pink/20 transition-all hover-lift">
              <Icon name="Video" size={18} className="text-neon-pink" />
              <span className="text-xs text-neon-pink font-medium">Видео</span>
            </button>
          </div>
        </div>

        <div className="px-4 pb-4 space-y-3">
          <div className="glass rounded-2xl overflow-hidden">
            <InfoRow icon="Phone" label="Телефон" value="+7 999 123-45-67" />
            <div className="h-px bg-border mx-4" />
            <InfoRow icon="AtSign" label="Имя пользователя" value={`@${name.toLowerCase().replace(' ', '_')}`} />
            <div className="h-px bg-border mx-4" />
            <InfoRow icon="Info" label="О себе" value="Привет, я использую Вспышку!" />
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neon-blue/15 flex items-center justify-center">
                  <Icon name="Bell" size={15} className="text-neon-blue" />
                </div>
                <span className="text-sm text-foreground">Уведомления</span>
              </div>
              <button
                onClick={() => setNotifications(p => !p)}
                className={`w-11 h-6 rounded-full transition-all duration-300 relative ${notifications ? 'bg-primary' : 'bg-secondary border border-border'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${notifications ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <ActionRow icon="Image" label="Общие медиафайлы" count="24" color="text-neon-purple" />
            <div className="h-px bg-border mx-4" />
            <ActionRow icon="FileText" label="Общие файлы" count="8" color="text-neon-blue" />
            <div className="h-px bg-border mx-4" />
            <ActionRow icon="Link" label="Общие ссылки" count="12" color="text-neon-green" />
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-destructive/15 flex items-center justify-center">
                <Icon name="Ban" size={15} className="text-destructive" />
              </div>
              <span className="text-sm text-destructive">Заблокировать</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
        <Icon name={icon} size={15} className="text-muted-foreground" fallback="Circle" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm text-foreground truncate">{value}</div>
      </div>
      <button className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
        <Icon name="Copy" size={13} className="text-muted-foreground" />
      </button>
    </div>
  );
}

function ActionRow({ icon, label, count, color }: { icon: string; label: string; count: string; color: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left">
      <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
        <Icon name={icon} size={15} className={color} fallback="Circle" />
      </div>
      <span className="flex-1 text-sm text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground">{count}</span>
      <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
    </button>
  );
}
