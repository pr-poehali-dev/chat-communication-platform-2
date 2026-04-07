import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';

export interface MyProfile {
  name: string;
  username: string;
  bio: string;
  avatar: string;
  status: 'online' | 'away' | 'dnd' | 'offline';
}

const STATUS_OPTIONS = [
  { value: 'online', label: 'Онлайн', color: 'bg-neon-green' },
  { value: 'away', label: 'Отошёл', color: 'bg-yellow-400' },
  { value: 'dnd', label: 'Не беспокоить', color: 'bg-destructive' },
  { value: 'offline', label: 'Не виден', color: 'bg-muted-foreground' },
] as const;

const AVATAR_OPTIONS = ['😎', '🚀', '🦋', '🌙', '⚡', '🎯', '🔥', '💫', '🎸', '🐉', '🦊', '🌊'];

interface MyProfilePanelProps {
  profile: MyProfile;
  onSave: (p: MyProfile) => void;
  onClose: () => void;
}

export default function MyProfilePanel({ profile, onSave, onClose }: MyProfilePanelProps) {
  const [draft, setDraft] = useState<MyProfile>({ ...profile });
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [saved, setSaved] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const currentStatus = STATUS_OPTIONS.find(s => s.value === draft.status)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-sm glass-bright rounded-3xl border border-border shadow-2xl overflow-hidden">
        {/* Хэдер */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors">
            <Icon name="ArrowLeft" size={18} className="text-foreground" />
          </button>
          <span className="font-unbounded text-sm font-bold text-foreground flex-1">Мой профиль</span>
          <button
            onClick={handleSave}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${saved ? 'bg-neon-green/20 text-neon-green' : 'bg-primary text-primary-foreground hover:opacity-90'}`}
          >
            {saved ? '✓ Сохранено' : 'Сохранить'}
          </button>
        </div>

        <div className="overflow-y-auto scrollbar-thin max-h-[80vh]">
          {/* Аватар */}
          <div className="flex flex-col items-center gap-3 py-6 px-6 mesh-bg">
            <div className="relative">
              <button
                onClick={() => setShowAvatarPicker(p => !p)}
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/30 to-neon-blue/30 flex items-center justify-center text-5xl border-2 border-primary/30 hover:border-primary/60 transition-all hover-lift glow-purple"
              >
                {draft.avatar}
              </button>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                <Icon name="Camera" size={13} className="text-primary-foreground" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Нажмите чтобы сменить аватар</p>

            {showAvatarPicker && (
              <div className="grid grid-cols-6 gap-2 w-full animate-fade-in">
                {AVATAR_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => { setDraft(p => ({ ...p, avatar: emoji })); setShowAvatarPicker(false); }}
                    className={`text-2xl aspect-square flex items-center justify-center rounded-xl transition-all hover-lift
                      ${draft.avatar === emoji ? 'bg-primary/30 ring-1 ring-primary' : 'hover:bg-secondary'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 pb-6 space-y-3">
            {/* Статус */}
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">Статус присутствия</p>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setDraft(p => ({ ...p, status: opt.value }))}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all
                      ${draft.status === opt.value ? 'bg-primary/20 border border-primary/40 text-foreground' : 'bg-secondary hover:bg-primary/10 text-muted-foreground'}`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${opt.color}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Поля */}
            <div className="glass rounded-2xl overflow-hidden">
              <FieldRow
                icon="User"
                label="Имя"
                value={draft.name}
                onChange={v => setDraft(p => ({ ...p, name: v }))}
                ref={nameRef}
              />
              <div className="h-px bg-border mx-4" />
              <FieldRow
                icon="AtSign"
                label="Имя пользователя"
                value={draft.username}
                onChange={v => setDraft(p => ({ ...p, username: v }))}
                prefix="@"
              />
              <div className="h-px bg-border mx-4" />
              <FieldRow
                icon="Info"
                label="О себе"
                value={draft.bio}
                onChange={v => setDraft(p => ({ ...p, bio: v }))}
                maxLength={70}
              />
            </div>

            {/* Превью */}
            <div className="glass rounded-2xl p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">Предпросмотр</p>
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-2xl">{draft.avatar}</div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background ${currentStatus.color}`} />
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">{draft.name || 'Имя'}</div>
                  <div className="text-xs text-muted-foreground">@{draft.username || 'username'}</div>
                  {draft.bio && <div className="text-xs text-muted-foreground mt-0.5 italic">"{draft.bio}"</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FieldRowProps {
  icon: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  maxLength?: number;
  ref?: React.RefObject<HTMLInputElement>;
}

function FieldRow({ icon, label, value, onChange, prefix, maxLength }: FieldRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
        <Icon name={icon} size={14} className="text-muted-foreground" fallback="Circle" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            maxLength={maxLength}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50 min-w-0"
            placeholder={label}
          />
        </div>
      </div>
      {maxLength && (
        <span className="text-[10px] text-muted-foreground flex-shrink-0">{value.length}/{maxLength}</span>
      )}
    </div>
  );
}
