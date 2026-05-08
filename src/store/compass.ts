import { create } from 'zustand';
import { questions, type Question } from '@/data/questions';
import { ideologies } from '@/data/ideologies';

export type AnswerValue = -2 | -1 | 0 | 1 | 2; // discordo totalmente .. concordo totalmente

type Trail = { x: number; y: number; t: number };

type State = {
  x: number;
  y: number;
  answers: Record<number, AnswerValue>;
  queue: number[]; // ids
  cursor: number;
  trail: Trail[];
  answer: (qId: number, v: AnswerValue) => void;
  skip: () => void;
  reset: () => void;
  current: () => Question | null;
  affinities: () => { id: string; name: string; pct: number; color: string }[];
};

// shuffle deterministic-ish at load
const shuffled = [...questions].sort(() => Math.random() - 0.5).map(q => q.id);

export const useCompass = create<State>((set, get) => ({
  x: 0,
  y: 0,
  answers: {},
  queue: shuffled,
  cursor: 0,
  trail: [{ x: 0, y: 0, t: Date.now() }],
  current: () => {
    const { queue, cursor } = get();
    const id = queue[cursor % queue.length];
    return questions.find(q => q.id === id) ?? null;
  },
  answer: (qId, v) => {
    const q = questions.find(x => x.id === qId);
    if (!q) return;
    const intensity = v / 2; // -1..1
    const dx = q.axisX * intensity * (q.weight ?? 1) * 0.45;
    const dy = q.axisY * intensity * (q.weight ?? 1) * 0.45;
    set(s => {
      const nx = clamp(s.x + dx, -10, 10);
      const ny = clamp(s.y + dy, -10, 10);
      const trail = [...s.trail, { x: nx, y: ny, t: Date.now() }].slice(-40);
      return {
        x: nx,
        y: ny,
        answers: { ...s.answers, [qId]: v },
        cursor: s.cursor + 1,
        trail,
      };
    });
  },
  skip: () => set(s => ({ cursor: s.cursor + 1 })),
  reset: () => set({ x: 0, y: 0, answers: {}, cursor: 0, trail: [{ x: 0, y: 0, t: Date.now() }] }),
  affinities: () => {
    const { x, y } = get();
    const maxDist = Math.sqrt(20 * 20 + 20 * 20);
    const list = ideologies.map(i => {
      const d = Math.sqrt((i.x - x) ** 2 + (i.y - y) ** 2);
      const pct = Math.max(0, Math.round((1 - d / maxDist) * 100));
      return { id: i.id, name: i.name, pct, color: i.color };
    });
    list.sort((a, b) => b.pct - a.pct);
    return list.slice(0, 6);
  },
}));

function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }
