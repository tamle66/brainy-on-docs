import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

// ─── Skill Data Model ────────────────────────────────────────
export type SkillCategory = 'style' | 'skill';

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompt: string;
  isActive: boolean;
  category: SkillCategory;
  isSeeded?: boolean;
}

const STORAGE_KEY = 'lark_addon_skills';

const DEFAULT_SKILLS: Skill[] = [
  // ── Style category ──
  {
    id: 'seed-formal',
    name: 'Chuyên nghiệp hóa',
    description: 'Viết lại với giọng trang trọng, phù hợp công việc.',
    icon: '👔',
    prompt: 'Viết lại đoạn văn sau bằng giọng văn chuyên nghiệp, trang trọng, phù hợp với môi trường doanh nghiệp. Giữ nguyên ý nghĩa gốc, chỉ thay đổi cách diễn đạt.',
    isActive: true, isSeeded: true, category: 'style',
  },
  {
    id: 'seed-simplify',
    name: 'Đơn giản hóa',
    description: 'Viết lại đơn giản, dễ hiểu cho mọi đối tượng.',
    icon: '💡',
    prompt: 'Viết lại đoạn văn sau bằng ngôn ngữ đơn giản, dễ hiểu nhất có thể. Tránh thuật ngữ chuyên ngành, dùng câu ngắn.',
    isActive: true, isSeeded: true, category: 'style',
  },
  {
    id: 'seed-friendly',
    name: 'Thân thiện hơn',
    description: 'Viết lại với giọng gần gũi, ấm áp.',
    icon: '😊',
    prompt: 'Viết lại đoạn văn sau bằng giọng văn thân thiện, gần gũi, ấm áp. Giữ nguyên nội dung, chỉ thay đổi cách diễn đạt cho tự nhiên hơn.',
    isActive: true, isSeeded: true, category: 'style',
  },
  {
    id: 'seed-concise',
    name: 'Ngắn gọn hơn',
    description: 'Rút gọn, loại bỏ thừa, giữ ý chính.',
    icon: '✂️',
    prompt: 'Viết lại đoạn văn sau ngắn gọn hơn. Loại bỏ các từ/cụm từ thừa, giữ nguyên ý chính. Kết quả không quá 60% độ dài ban đầu.',
    isActive: true, isSeeded: true, category: 'style',
  },
  // ── Skill category ──
  {
    id: 'seed-summarize',
    name: 'Tóm tắt 3 ý chính',
    description: 'Rút gọn thành 3 bullet points ngắn gọn.',
    icon: '📋',
    prompt: 'Tóm tắt đoạn văn sau thành đúng 3 ý chính (bullet points), mỗi ý không quá 1 câu. Viết bằng tiếng Việt, ngắn gọn và súc tích.',
    isActive: true, isSeeded: true, category: 'skill',
  },
  {
    id: 'seed-translate-en',
    name: 'Dịch sang Tiếng Anh',
    description: 'Dịch nội dung sang tiếng Anh chuyên nghiệp.',
    icon: '🌐',
    prompt: 'Translate the following Vietnamese text into professional, natural-sounding English. Preserve the original meaning and tone.',
    isActive: true, isSeeded: true, category: 'skill',
  },
  {
    id: 'seed-email-reject',
    name: 'Viết email từ chối',
    description: 'Soạn email từ chối lịch sự từ nội dung gốc.',
    icon: '✉️',
    prompt: 'Dựa trên nội dung sau, hãy soạn một email từ chối lịch sự bằng tiếng Việt. Email cần: mở đầu cảm ơn, nêu lý do từ chối ngắn gọn, và kết thúc tích cực.',
    isActive: true, isSeeded: true, category: 'skill',
  },
  {
    id: 'seed-extract-action',
    name: 'Trích xuất Action Items',
    description: 'Liệt kê các hành động cần làm từ nội dung.',
    icon: '✅',
    prompt: 'Từ đoạn văn sau, hãy trích xuất tất cả các action items (việc cần làm). Liệt kê dạng checklist (- [ ]). Mỗi item phải rõ ràng, cụ thể.',
    isActive: true, isSeeded: true, category: 'skill',
  },
];

// ─── Persistence ─────────────────────────────────────────────
export function loadSkills(): Skill[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: Skill[] = JSON.parse(raw);
      // Migration: add category to old skills without it
      const migrated = parsed.map((s) => ({
        ...s,
        category: s.category || (s.id?.startsWith('seed-formal') || s.id?.startsWith('seed-simplify') || s.id?.startsWith('seed-friendly') || s.id?.startsWith('seed-concise') ? 'style' : 'skill'),
      })) as Skill[];
      return migrated;
    }
  } catch { /* fallback to seeds */ }
  saveSkills(DEFAULT_SKILLS);
  return DEFAULT_SKILLS;
}

export function saveSkills(skills: Skill[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
}

export function resetSkillsToDefaults(): Skill[] {
  saveSkills(DEFAULT_SKILLS);
  return DEFAULT_SKILLS;
}

// ─── Available icons ────────────────────────────────────────
const ICON_OPTIONS = ['📋', '🌐', '✉️', '👔', '💡', '✅', '🔧', '📝', '🎯', '🚀', '💬', '📊', '🔍', '✨', '📎'];

// ─── Component ───────────────────────────────────────────────
interface SkillsTabProps {
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
}

export const SkillsTab = ({ skills, onSkillsChange }: SkillsTabProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrompt, setFormPrompt] = useState('');
  const [formIcon, setFormIcon] = useState('🔧');
  const [formCategory, setFormCategory] = useState<SkillCategory>('skill');

  const persist = (updated: Skill[]) => {
    saveSkills(updated);
    onSkillsChange(updated);
  };

  const resetForm = () => {
    setFormName('');
    setFormDesc('');
    setFormPrompt('');
    setFormIcon('🔧');
    setFormCategory('skill');
    setEditingId(null);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormName('');
    setFormDesc('');
    setFormPrompt('');
    setFormIcon('🔧');
    setFormCategory('skill');
  };

  const handleEdit = (skill: Skill) => {
    setIsCreating(false);
    setEditingId(skill.id);
    setFormName(skill.name);
    setFormDesc(skill.description);
    setFormPrompt(skill.prompt);
    setFormIcon(skill.icon);
    setFormCategory(skill.category);
  };

  const handleSave = () => {
    if (!formName.trim() || !formPrompt.trim()) return;

    let updated: Skill[];
    if (isCreating) {
      const newSkill: Skill = {
        id: `skill-${Date.now()}`,
        name: formName.trim(),
        description: formDesc.trim(),
        icon: formIcon,
        prompt: formPrompt.trim(),
        isActive: true,
        category: formCategory,
      };
      updated = [...skills, newSkill];
    } else if (editingId) {
      updated = skills.map((s) =>
        s.id === editingId
          ? { ...s, name: formName.trim(), description: formDesc.trim(), prompt: formPrompt.trim(), icon: formIcon, category: formCategory }
          : s
      );
    } else {
      return;
    }

    persist(updated);
    resetForm();
  };

  const handleDelete = (id: string) => {
    persist(skills.filter((s) => s.id !== id));
    if (editingId === id) resetForm();
  };

  const handleToggleActive = (id: string) => {
    persist(skills.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)));
  };

  const isEditing = isCreating || editingId !== null;
  const styleSkills = skills.filter((s) => s.category === 'style');
  const quickSkills = skills.filter((s) => s.category === 'skill');

  const renderGroup = (label: string, groupSkills: Skill[]) => {
    if (groupSkills.length === 0) return null;
    return (
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground px-1">{label}</span>
        {groupSkills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            isEditing={editingId === skill.id}
            formName={formName}
            formDesc={formDesc}
            formPrompt={formPrompt}
            formIcon={formIcon}
            formCategory={formCategory}
            setFormName={setFormName}
            setFormDesc={setFormDesc}
            setFormPrompt={setFormPrompt}
            setFormIcon={setFormIcon}
            setFormCategory={setFormCategory}
            onEdit={() => handleEdit(skill)}
            onDelete={() => handleDelete(skill.id)}
            onToggleActive={() => handleToggleActive(skill.id)}
            onSave={handleSave}
            onCancel={resetForm}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Quản lý Skills</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {skills.filter(s => s.isActive).length} active / {skills.length} tổng
          </p>
        </div>
        {!isEditing && (
          <Button size="sm" variant="outline" onClick={handleCreate} className="h-7 px-3 text-xs rounded-full font-medium gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Tạo mới
          </Button>
        )}
      </div>

      {/* Create form */}
      {isCreating && (
        <SkillForm
          formName={formName} formDesc={formDesc} formPrompt={formPrompt} formIcon={formIcon} formCategory={formCategory}
          setFormName={setFormName} setFormDesc={setFormDesc} setFormPrompt={setFormPrompt} setFormIcon={setFormIcon} setFormCategory={setFormCategory}
          onSave={handleSave} onCancel={resetForm} title="Tạo skill mới" saveLabel="Tạo skill"
        />
      )}

      {/* Grouped skills */}
      {renderGroup('🎨 Phong cách viết', styleSkills)}
      {renderGroup('⚡ Kỹ năng nhanh', quickSkills)}

      {/* Empty state */}
      {skills.length === 0 && !isEditing && (
        <Card className="border-dashed border-2 border-border/60 bg-muted/20 rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-8 gap-2">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"><span className="text-lg">⚡</span></div>
            <p className="text-xs text-muted-foreground text-center max-w-[200px]">Tạo Skills để nhanh chóng biến đổi văn bản.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ─── Subcomponents ───────────────────────────────────────────

interface SkillFormProps {
  formName: string;
  formDesc: string;
  formPrompt: string;
  formIcon: string;
  formCategory: SkillCategory;
  setFormName: (v: string) => void;
  setFormDesc: (v: string) => void;
  setFormPrompt: (v: string) => void;
  setFormIcon: (v: string) => void;
  setFormCategory: (v: SkillCategory) => void;
  onSave: () => void;
  onCancel: () => void;
  title: string;
  saveLabel: string;
}

const SkillForm = ({
  formName, formDesc, formPrompt, formIcon, formCategory,
  setFormName, setFormDesc, setFormPrompt, setFormIcon, setFormCategory,
  onSave, onCancel, title, saveLabel,
}: SkillFormProps) => (
  <Card className="rounded-xl border border-primary/30 shadow-sm overflow-hidden bg-card ring-1 ring-primary/20">
    <CardContent className="p-3 flex flex-col gap-2.5">
      <Label className="text-xs font-semibold text-foreground">{title}</Label>

      {/* Category toggle */}
      <div className="flex gap-1.5">
        <button
          onClick={() => setFormCategory('style')}
          className={`flex-1 text-[11px] font-medium py-1.5 rounded-lg transition-all ${
            formCategory === 'style' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >🎨 Phong cách</button>
        <button
          onClick={() => setFormCategory('skill')}
          className={`flex-1 text-[11px] font-medium py-1.5 rounded-lg transition-all ${
            formCategory === 'skill' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >⚡ Kỹ năng</button>
      </div>

      {/* Icon picker */}
      <div className="flex flex-wrap gap-1">
        {ICON_OPTIONS.map((ico) => (
          <button
            key={ico}
            onClick={() => setFormIcon(ico)}
            className={`w-7 h-7 rounded-md text-sm flex items-center justify-center transition-all ${
              formIcon === ico ? 'bg-primary/10 ring-1 ring-primary/40 scale-110' : 'hover:bg-muted'
            }`}
          >
            {ico}
          </button>
        ))}
      </div>

      <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Tên skill" className="h-8 text-sm rounded-lg" />
      <Input value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Mô tả ngắn" className="h-8 text-xs rounded-lg" />
      <Textarea value={formPrompt} onChange={(e) => setFormPrompt(e.target.value)} placeholder="System prompt cho AI..." className="min-h-[80px] text-xs resize-none rounded-lg" />
      <div className="flex gap-2">
        <Button size="sm" onClick={onSave} disabled={!formName.trim() || !formPrompt.trim()} className="flex-1 h-8 text-xs rounded-full">{saveLabel}</Button>
        <Button size="sm" variant="ghost" onClick={onCancel} className="h-8 text-xs rounded-full">Hủy</Button>
      </div>
    </CardContent>
  </Card>
);

interface SkillCardProps {
  skill: Skill;
  isEditing: boolean;
  formName: string;
  formDesc: string;
  formPrompt: string;
  formIcon: string;
  formCategory: SkillCategory;
  setFormName: (v: string) => void;
  setFormDesc: (v: string) => void;
  setFormPrompt: (v: string) => void;
  setFormIcon: (v: string) => void;
  setFormCategory: (v: SkillCategory) => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const SkillCard = ({
  skill, isEditing,
  formName, formDesc, formPrompt, formIcon, formCategory,
  setFormName, setFormDesc, setFormPrompt, setFormIcon, setFormCategory,
  onEdit, onDelete, onToggleActive, onSave, onCancel,
}: SkillCardProps) => (
  <Card
    className={`group rounded-2xl border transition-all duration-200 ${
      skill.isActive 
        ? 'border-border bg-card shadow-sm' 
        : 'border-transparent bg-muted/40 opacity-60'
    } ${isEditing ? 'ring-2 ring-primary/20 border-primary/30' : 'hover:shadow-md hover:border-border'}`}
  >
    <CardContent className="p-4 flex flex-col gap-3">
      {isEditing ? (
        <SkillForm
          formName={formName} formDesc={formDesc} formPrompt={formPrompt} formIcon={formIcon} formCategory={formCategory}
          setFormName={setFormName} setFormDesc={setFormDesc} setFormPrompt={setFormPrompt} setFormIcon={setFormIcon} setFormCategory={setFormCategory}
          onSave={onSave} onCancel={onCancel} title="Chỉnh sửa skill" saveLabel="Lưu thay đổi"
        />
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner ${skill.isActive ? 'bg-primary/5' : 'bg-muted'}`}>
                {skill.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">{skill.name}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-tight">
                  {skill.category === 'style' ? '🎨 Phong cách' : '⚡ Kỹ năng'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
              {/* Premium CSS Switch */}
              <label className="relative inline-flex items-center cursor-pointer mr-1">
                <input 
                  type="checkbox" 
                  checked={skill.isActive} 
                  onChange={onToggleActive} 
                  className="sr-only peer"
                />
                <div className="w-10 h-5.5 bg-slate-200 border border-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#007AFF] peer-checked:border-[#007AFF] shadow-inner"></div>
              </label>

              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 pl-[52px]">
            {skill.description}
          </p>
        </>
      )}
    </CardContent>
  </Card>
);
