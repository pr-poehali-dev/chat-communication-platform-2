interface Member {
  id: number;
  name: string;
  avatar: string;
  role?: 'admin' | 'mod';
  online: boolean;
  status?: string;
}

const groupMembers: Record<number, Member[]> = {
  101: [
    { id: 1, name: 'Алина Звёздная', avatar: '🌙', role: 'admin', online: true, status: 'Деплоит сервер' },
    { id: 2, name: 'Максим Dev', avatar: '💻', role: 'mod', online: true, status: 'В коде' },
    { id: 3, name: 'Катя Фотограф', avatar: '📸', online: false },
    { id: 4, name: 'Дима Дизайн', avatar: '🎨', online: true, status: 'Делает макет' },
    { id: 5, name: 'Настя Travel', avatar: '✈️', online: false },
    { id: 6, name: 'Роберт Музыкант', avatar: '🎵', online: false },
  ],
  102: [
    { id: 1, name: 'Алина Звёздная', avatar: '🌙', role: 'admin', online: true },
    { id: 3, name: 'Катя Фотограф', avatar: '📸', online: true, status: 'В сети' },
    { id: 5, name: 'Настя Travel', avatar: '✈️', online: true, status: 'На Кубе 🌴' },
    { id: 6, name: 'Роберт Музыкант', avatar: '🎵', online: false },
    { id: 7, name: 'Лена Повар', avatar: '👩‍🍳', online: false },
  ],
  103: [
    { id: 2, name: 'Максим Dev', avatar: '💻', role: 'admin', online: true, status: 'В игре' },
    { id: 4, name: 'Дима Дизайн', avatar: '🎨', online: true, status: 'В игре' },
    { id: 6, name: 'Роберт Музыкант', avatar: '🎵', online: false },
  ],
  104: [
    { id: 5, name: 'Настя Travel', avatar: '✈️', role: 'admin', online: true, status: 'Токио 🗼' },
    { id: 1, name: 'Алина Звёздная', avatar: '🌙', online: false },
    { id: 3, name: 'Катя Фотограф', avatar: '📸', online: false },
  ],
  105: [
    { id: 7, name: 'Лена Повар', avatar: '👩‍🍳', role: 'admin', online: true, status: 'Читает' },
    { id: 1, name: 'Алина Звёздная', avatar: '🌙', online: false },
    { id: 6, name: 'Роберт Музыкант', avatar: '🎵', online: false },
  ],
};

const defaultMembers: Member[] = [
  { id: 1, name: 'Алина Звёздная', avatar: '🌙', role: 'admin', online: true },
  { id: 2, name: 'Максим Dev', avatar: '💻', online: true },
  { id: 3, name: 'Катя Фотограф', avatar: '📸', online: false },
];

interface MembersListProps {
  chatId: number;
}

export default function MembersList({ chatId }: MembersListProps) {
  const members = groupMembers[chatId] ?? defaultMembers;
  const online = members.filter(m => m.online);
  const offline = members.filter(m => !m.online);

  return (
    <div className="w-52 flex-shrink-0 border-l border-border flex flex-col overflow-hidden">
      <div className="px-3 py-3 border-b border-border">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Участники — {members.length}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {online.length > 0 && (
          <>
            <div className="px-3 py-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neon-green/70">
                Онлайн — {online.length}
              </span>
            </div>
            {online.map(m => <MemberRow key={m.id} member={m} />)}
          </>
        )}

        {offline.length > 0 && (
          <>
            <div className="px-3 py-1.5 mt-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Не в сети — {offline.length}
              </span>
            </div>
            {offline.map(m => <MemberRow key={m.id} member={m} />)}
          </>
        )}
      </div>
    </div>
  );
}

function MemberRow({ member }: { member: Member }) {
  return (
    <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg mx-1 hover:bg-secondary transition-colors group text-left"
      style={{ width: 'calc(100% - 8px)' }}>
      <div className="relative flex-shrink-0">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition-all
          ${member.online ? 'bg-secondary' : 'bg-secondary/50 grayscale opacity-50'}`}>
          {member.avatar}
        </div>
        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background
          ${member.online ? 'bg-neon-green' : 'bg-muted-foreground/30'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className={`text-xs font-medium truncate transition-colors
            ${member.online ? 'text-foreground group-hover:text-primary' : 'text-muted-foreground/60'}`}>
            {member.name.split(' ')[0]}
          </span>
          {member.role === 'admin' && (
            <span className="text-[9px] px-1 rounded bg-neon-pink/20 text-neon-pink font-bold flex-shrink-0">ADM</span>
          )}
          {member.role === 'mod' && (
            <span className="text-[9px] px-1 rounded bg-neon-blue/20 text-neon-blue font-bold flex-shrink-0">MOD</span>
          )}
        </div>
        {member.status && member.online && (
          <div className="text-[10px] text-muted-foreground truncate">{member.status}</div>
        )}
      </div>
    </button>
  );
}
