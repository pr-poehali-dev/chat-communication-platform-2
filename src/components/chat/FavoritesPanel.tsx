import Icon from '@/components/ui/icon';

interface FavoritesPanelProps {
  onClose: () => void;
}

const favorites = [
  { id: 1, text: 'Идея для нового проекта: мессенджер с ИИ-ассистентом 🚀', time: '06 апр 15:20' },
  { id: 2, text: 'Пароль от Wi-Fi в офисе: Flash2024!', time: '01 апр 10:05' },
  { id: 3, text: 'Рецепт от Лены: 200г муки, 2 яйца, 300мл молока...', time: '29 мар 18:44' },
];

export default function FavoritesPanel({ onClose }: FavoritesPanelProps) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-background animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border glass-bright flex-shrink-0">
        <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors">
          <Icon name="ArrowLeft" size={18} className="text-foreground" />
        </button>
        <span className="font-semibold text-sm text-foreground">Избранное</span>
        <span className="ml-auto text-xs text-muted-foreground">{favorites.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
        {favorites.map((item, i) => (
          <div
            key={item.id}
            className="glass rounded-2xl p-4 hover:bg-secondary/50 cursor-pointer transition-colors animate-fade-in group"
            style={{ animationDelay: `${i * 0.07}s`, animationFillMode: 'both' }}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-foreground leading-relaxed flex-1">{item.text}</p>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg hover:bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Trash2" size={13} className="text-destructive" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <Icon name="Star" size={11} className="text-neon-pink" />
              <span className="text-[10px] text-muted-foreground">{item.time}</span>
            </div>
          </div>
        ))}

        {favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="text-4xl">⭐</div>
            <p className="text-sm text-muted-foreground">Сохраняйте важные сообщения в избранное</p>
          </div>
        )}
      </div>
    </div>
  );
}
