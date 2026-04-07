import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Call {
  id: number;
  name: string;
  avatar: string;
  type: 'incoming' | 'outgoing' | 'missed';
  mode: 'audio' | 'video';
  time: string;
  duration?: string;
}

const calls: Call[] = [
  { id: 1, name: 'Алина Звёздная', avatar: '🌙', type: 'incoming', mode: 'video', time: 'Сегодня 14:30', duration: '25 мин' },
  { id: 2, name: 'Максим Dev', avatar: '💻', type: 'outgoing', mode: 'audio', time: 'Сегодня 12:15', duration: '8 мин' },
  { id: 3, name: 'Команда Альфа 🚀', avatar: '🚀', type: 'incoming', mode: 'video', time: 'Вчера 18:00', duration: '1 ч 12 мин' },
  { id: 4, name: 'Катя Фотограф', avatar: '📸', type: 'missed', mode: 'audio', time: 'Вчера 10:22' },
  { id: 5, name: 'Настя Travel', avatar: '✈️', type: 'outgoing', mode: 'video', time: '05.04', duration: '40 мин' },
  { id: 6, name: 'Дима Дизайн', avatar: '🎨', type: 'missed', mode: 'video', time: '04.04' },
];

const typeIcon = { incoming: 'PhoneIncoming', outgoing: 'PhoneOutgoing', missed: 'PhoneMissed' };
const typeColor = { incoming: 'text-neon-green', outgoing: 'text-neon-blue', missed: 'text-destructive' };
const typeLabel = { incoming: 'Входящий', outgoing: 'Исходящий', missed: 'Пропущенный' };

export default function CallsSection() {
  const [activeCall, setActiveCall] = useState(false);
  const [callTarget, setCallTarget] = useState<Call | null>(null);

  const startCall = (call: Call) => {
    setCallTarget(call);
    setActiveCall(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-unbounded text-base font-bold text-foreground">Звонки</h1>
          <button className="w-8 h-8 rounded-xl bg-primary/20 hover:bg-primary/30 flex items-center justify-center transition-colors">
            <Icon name="Plus" size={16} className="text-primary" />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <div className="flex-1 glass rounded-xl p-3 text-center">
            <div className="text-lg font-unbounded font-bold text-neon-green">4</div>
            <div className="text-xs text-muted-foreground">Звонка сегодня</div>
          </div>
          <div className="flex-1 glass rounded-xl p-3 text-center">
            <div className="text-lg font-unbounded font-bold text-destructive">2</div>
            <div className="text-xs text-muted-foreground">Пропущено</div>
          </div>
          <div className="flex-1 glass rounded-xl p-3 text-center">
            <div className="text-lg font-unbounded font-bold text-neon-purple">1ч+</div>
            <div className="text-xs text-muted-foreground">Общение</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {calls.map((call, i) => (
          <div
            key={call.id}
            className="flex items-center gap-3 px-3 py-3 mx-1 rounded-xl hover:bg-secondary transition-colors group animate-fade-in"
            style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
          >
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center text-xl">
                {call.avatar}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center`}>
                <Icon name={typeIcon[call.type]} size={10} className={typeColor[call.type]} fallback="Phone" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{call.name}</span>
                <span className="text-[10px] text-muted-foreground">{call.time}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-xs ${typeColor[call.type]}`}>{typeLabel[call.type]}</span>
                <span className="text-muted-foreground text-xs">·</span>
                <Icon name={call.mode === 'video' ? 'Video' : 'Phone'} size={11} className="text-muted-foreground" />
                {call.duration && <span className="text-xs text-muted-foreground">{call.duration}</span>}
              </div>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => startCall(call)}
                className="w-8 h-8 rounded-xl bg-neon-green/20 hover:bg-neon-green/30 flex items-center justify-center transition-colors"
              >
                <Icon name="Phone" size={13} className="text-neon-green" />
              </button>
              {call.mode === 'video' && (
                <button
                  onClick={() => startCall(call)}
                  className="w-8 h-8 rounded-xl bg-neon-purple/20 hover:bg-neon-purple/30 flex items-center justify-center transition-colors"
                >
                  <Icon name="Video" size={13} className="text-neon-purple" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeCall && callTarget && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl animate-fade-in">
          <div className="flex flex-col items-center gap-6 p-8">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/40 to-neon-blue/40 flex items-center justify-center text-5xl animate-float border-2 border-primary/30 glow-purple">
                {callTarget.avatar}
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 scale-110 animate-pulse-glow" />
              <div className="absolute inset-0 rounded-full border border-primary/10 scale-125 animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
            </div>

            <div className="text-center">
              <div className="font-unbounded text-xl font-bold text-foreground">{callTarget.name}</div>
              <div className="text-neon-green mt-1 flex items-center gap-2">
                <div className="flex gap-1 items-end">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-1 bg-neon-green rounded-full" style={{ height: `${8 + i * 4}px`, animation: `wave 0.8s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <span className="text-sm">Звонок...</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="w-14 h-14 rounded-full bg-secondary border border-border flex items-center justify-center hover-lift transition-all">
                <Icon name="MicOff" size={20} className="text-foreground" />
              </button>
              <button
                onClick={() => setActiveCall(false)}
                className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center hover-lift transition-all shadow-lg"
                style={{ boxShadow: '0 0 20px hsl(0 72% 55% / 0.5)' }}
              >
                <Icon name="PhoneOff" size={22} className="text-white" />
              </button>
              <button className="w-14 h-14 rounded-full bg-secondary border border-border flex items-center justify-center hover-lift transition-all">
                <Icon name="Volume2" size={20} className="text-foreground" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
