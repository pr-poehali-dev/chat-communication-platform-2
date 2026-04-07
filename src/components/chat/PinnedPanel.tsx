import Icon from '@/components/ui/icon';

interface PinnedPanelProps {
  onClose: () => void;
}

const pinned = [
  { id: 1, text: 'Встреча в пятницу в 18:00 у Максима', time: '03 апр', author: 'Алина' },
  { id: 2, text: 'Ссылка на общий проект: https://poehali.dev/project', time: '28 мар', author: 'Вы' },
  { id: 3, text: 'Не забыть: дедлайн по дизайну 10 апреля', time: '25 мар', author: 'Алина' },
];

export default function PinnedPanel({ onClose }: PinnedPanelProps) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-background animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border glass-bright flex-shrink-0">
        <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors">
          <Icon name="ArrowLeft" size={18} className="text-foreground" />
        </button>
        <span className="font-semibold text-sm text-foreground">Закреплённые сообщения</span>
        <span className="ml-auto text-xs text-muted-foreground">{pinned.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
        {pinned.map((msg, i) => (
          <div
            key={msg.id}
            className="glass rounded-2xl p-4 border-l-2 border-primary animate-fade-in hover:bg-secondary/50 cursor-pointer transition-colors"
            style={{ animationDelay: `${i * 0.07}s`, animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon name="Pin" size={12} className="text-primary" />
                <span className="text-xs font-semibold text-primary">{msg.author}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{msg.time}</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{msg.text}</p>
          </div>
        ))}

        {pinned.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="text-4xl">📌</div>
            <p className="text-sm text-muted-foreground">Нет закреплённых сообщений</p>
          </div>
        )}
      </div>
    </div>
  );
}
