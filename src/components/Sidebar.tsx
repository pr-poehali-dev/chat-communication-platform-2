import Icon from '@/components/ui/icon';

type Section = 'chats' | 'groups' | 'calls';

interface SidebarProps {
  active: Section;
  onChange: (s: Section) => void;
  onlineCount?: number;
}

const navItems = [
  { id: 'chats' as Section, icon: 'MessageCircle', label: 'Чаты' },
  { id: 'groups' as Section, icon: 'Users', label: 'Группы' },
  { id: 'calls' as Section, icon: 'Phone', label: 'Звонки' },
];

export default function Sidebar({ active, onChange, onlineCount = 12 }: SidebarProps) {
  return (
    <aside className="w-16 md:w-20 flex flex-col items-center py-6 gap-2 border-r border-border relative z-10">
      <div className="mb-6 flex flex-col items-center gap-1">
        <div className="w-9 h-9 rounded-xl gradient-border flex items-center justify-center bg-background">
          <span className="text-lg">⚡</span>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`group relative w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 hover-lift
                ${isActive
                  ? 'bg-primary/20 glow-purple'
                  : 'hover:bg-secondary'
                }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1 h-6 bg-primary rounded-full glow-purple" />
              )}
              <Icon
                name={item.icon}
                size={20}
                className={isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground transition-colors'}
              />
              <span className={`text-[9px] font-medium leading-none ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-3 mt-auto">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
          <span className="text-[10px] text-muted-foreground hidden md:block">{onlineCount}</span>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden gradient-border">
          <div className="w-full h-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-sm font-bold text-white">
            Я
          </div>
        </div>
      </div>
    </aside>
  );
}
