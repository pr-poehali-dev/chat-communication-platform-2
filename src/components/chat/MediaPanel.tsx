import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface MediaPanelProps {
  onClose: () => void;
}

type Tab = 'media' | 'files' | 'links';

const mediaItems = ['🏔️', '🌊', '🌇', '🎨', '🦋', '🌸', '🎭', '🚀', '🌙', '🎸', '🏖️', '🌴'];

const files = [
  { name: 'Презентация_Q4.pdf', size: '2.4 МБ', date: '07 апр', icon: '📄' },
  { name: 'Дизайн_макет_v2.fig', size: '18.7 МБ', date: '05 апр', icon: '🎨' },
  { name: 'Отчёт_март.xlsx', size: '540 КБ', date: '01 апр', icon: '📊' },
  { name: 'Договор.docx', size: '128 КБ', date: '28 мар', icon: '📝' },
];

const links = [
  { title: 'poehali.dev — запусти свой сайт', url: 'https://poehali.dev', date: '06 апр' },
  { title: 'GitHub — где живёт код', url: 'https://github.com', date: '04 апр' },
  { title: 'Figma — дизайн проекта', url: 'https://figma.com', date: '31 мар' },
];

export default function MediaPanel({ onClose }: MediaPanelProps) {
  const [tab, setTab] = useState<Tab>('media');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'media', label: 'Медиа', icon: 'Image' },
    { id: 'files', label: 'Файлы', icon: 'FileText' },
    { id: 'links', label: 'Ссылки', icon: 'Link' },
  ];

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-background animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border glass-bright flex-shrink-0">
        <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors">
          <Icon name="ArrowLeft" size={18} className="text-foreground" />
        </button>
        <span className="font-semibold text-sm text-foreground">Медиа и файлы</span>
      </div>

      <div className="flex gap-1 px-4 py-2 border-b border-border flex-shrink-0">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${tab === t.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
          >
            <Icon name={t.icon} size={13} fallback="Circle" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {tab === 'media' && (
          <div className="grid grid-cols-3 gap-1.5">
            {mediaItems.map((emoji, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-secondary flex items-center justify-center text-3xl hover:bg-primary/20 cursor-pointer transition-all hover-lift animate-fade-in"
                style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'both' }}
              >
                {emoji}
              </div>
            ))}
          </div>
        )}

        {tab === 'files' && (
          <div className="space-y-2">
            {files.map((file, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 p-3 glass rounded-xl hover:bg-secondary transition-all text-left animate-fade-in"
                style={{ animationDelay: `${i * 0.06}s`, animationFillMode: 'both' }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">{file.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{file.name}</div>
                  <div className="text-xs text-muted-foreground">{file.size} · {file.date}</div>
                </div>
                <Icon name="Download" size={15} className="text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        )}

        {tab === 'links' && (
          <div className="space-y-2">
            {links.map((link, i) => (
              <button
                key={i}
                className="w-full flex items-start gap-3 p-3 glass rounded-xl hover:bg-secondary transition-all text-left animate-fade-in"
                style={{ animationDelay: `${i * 0.06}s`, animationFillMode: 'both' }}
              >
                <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="Link" size={16} className="text-neon-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{link.title}</div>
                  <div className="text-xs text-neon-blue truncate">{link.url}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{link.date}</div>
                </div>
                <Icon name="ExternalLink" size={13} className="text-muted-foreground flex-shrink-0 mt-1" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
