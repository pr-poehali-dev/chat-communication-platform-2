import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface NotificationsPanelProps {
  onClose: () => void;
}

export default function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const [sound, setSound] = useState(true);
  const [preview, setPreview] = useState(true);
  const [muted, setMuted] = useState(false);
  const [muteUntil, setMuteUntil] = useState('');

  const muteOptions = [
    { label: '1 час', value: '1h' },
    { label: '8 часов', value: '8h' },
    { label: '2 дня', value: '2d' },
    { label: 'Навсегда', value: 'forever' },
  ];

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-background animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border glass-bright flex-shrink-0">
        <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors">
          <Icon name="ArrowLeft" size={18} className="text-foreground" />
        </button>
        <span className="font-semibold text-sm text-foreground">Уведомления</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        <div className="glass rounded-2xl overflow-hidden">
          <ToggleRow
            icon="BellOff"
            iconColor="text-neon-pink"
            iconBg="bg-neon-pink/15"
            label="Отключить уведомления"
            value={muted}
            onChange={setMuted}
          />
        </div>

        {muted && (
          <div className="glass rounded-2xl p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest font-medium">Отключить на</p>
            <div className="grid grid-cols-2 gap-2">
              {muteOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setMuteUntil(opt.value)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${muteUntil === opt.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-primary/20'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="glass rounded-2xl overflow-hidden">
          <ToggleRow
            icon="Volume2"
            iconColor="text-neon-blue"
            iconBg="bg-neon-blue/15"
            label="Звук"
            value={sound}
            onChange={setSound}
          />
          <div className="h-px bg-border mx-4" />
          <ToggleRow
            icon="Eye"
            iconColor="text-neon-purple"
            iconBg="bg-neon-purple/15"
            label="Предпросмотр"
            description="Показывать текст в уведомлении"
            value={preview}
            onChange={setPreview}
          />
        </div>

        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest font-medium">Звук уведомления</p>
          {['По умолчанию', 'Тихий', 'Звонок', 'Пульс'].map(s => (
            <button key={s} className="w-full flex items-center gap-3 py-2.5 hover:bg-secondary rounded-xl px-2 transition-colors">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${s === 'По умолчанию' ? 'border-primary' : 'border-border'}`}>
                {s === 'По умолчанию' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </div>
              <span className="text-sm text-foreground">{s}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  icon, iconColor, iconBg, label, description, value, onChange
}: {
  icon: string; iconColor: string; iconBg: string;
  label: string; description?: string;
  value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon name={icon} size={15} className={iconColor} fallback="Bell" />
        </div>
        <div>
          <div className="text-sm text-foreground">{label}</div>
          {description && <div className="text-xs text-muted-foreground">{description}</div>}
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${value ? 'bg-primary' : 'bg-secondary border border-border'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${value ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
