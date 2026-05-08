import { create } from 'zustand';
import { questions, type Question } from '@/data/questions';
import { ideologies } from '@/data/ideologies';

export type AnswerValue = -2 | -1 | 0 | 1 | 2;

type Trail = { x: number; y: number; t: number };

type State = {
  x: number;
  y: number;
  answers: Record<number, AnswerValue>;
  queue: number[];
  cursor: number;
  trail: Trail[];
  shuffled: boolean;
  shuffle: () => void;
  answer: (qId: number, v: AnswerValue) => void;
  skip: () => void;
  reset: () => void;
};

// Stable initial order — same on server and client. Shuffle happens client-side after mount.
const initialQueue = questions.map(q => q.id);

export const useCompass = create<State>((set, get) => ({
  x: 0,
  y: 0,
  answers: {},
  queue: initialQueue,
  cursor: 0,
  trail: [{ x: 0, y: 0, t: 0 }],
  shuffled: false,
  shuffle: () => {
    if (get().shuffled) return;
    const arr = [...initialQueue];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    set({ queue: arr, shuffled: true });
  },
  answer: (qId, v) => {
    const q = questions.find(x => x.id === qId);
    if (!q) return;
    const intensity = v / 2;
    const dx = q.axisX * intensity * (q.weight ?? 1) * 0.45;
    const dy = q.axisY * intensity * (q.weight ?? 1) * 0.45;
    set(s => {
      const nx = clamp(s.x + dx, -10, 10);
      const ny = clamp(s.y + dy, -10, 10);
      const trail = [...s.trail, { x: nx, y: ny, t: s.trail.length }].slice(-40);
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
  reset: () => set({ x: 0, y: 0, answers: {}, cursor: 0, trail: [{ x: 0, y: 0, t: 0 }] }),
}));

export function useCurrentQuestion(): Question | null {
  const queue = useCompass(s => s.queue);
  const cursor = useCompass(s => s.cursor);
  const id = queue[cursor % queue.length];
  return questions.find(q => q.id === id) ?? null;
}

export function useAffinities() {
  const x = useCompass(s => s.x);
  const y = useCompass(s => s.y);
  const maxDist = Math.sqrt(800);
  const list = ideologies.map(i => {
    const d = Math.sqrt((i.x - x) ** 2 + (i.y - y) ** 2);
    const pct = Math.max(0, Math.round((1 - d / maxDist) * 100));
    return { id: i.id, name: i.name, pct, color: i.color };
  });
  list.sort((a, b) => b.pct - a.pct);
  return list.slice(0, 6);
}

function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }
