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
  globalCounts: Record<string, number>;
  tick: number;
  shuffle: () => void;
  answer: (qId: number, v: AnswerValue) => void;
  skip: () => void;
  reset: () => void;
  startSimulation: () => () => void;
};

const initialQueue = questions.map(q => q.id);

// Seeded baseline so the ranking starts populated and feels "national".
// Deterministic — same on server/client to avoid hydration mismatch.
function seedCounts(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const i of ideologies) {
    let h = 0;
    for (let k = 0; k < i.id.length; k++) h = (h * 131 + i.id.charCodeAt(k)) | 0;
    const dist = Math.sqrt(i.x * i.x + i.y * i.y);
    // Centristas e moderados começam com mais "votos" — distribuição realista.
    const base = Math.round(800 - dist * 35 + (Math.abs(h) % 220));
    out[i.id] = Math.max(40, base);
  }
  return out;
}

function bumpClosest(counts: Record<string, number>, x: number, y: number, n = 3) {
  const ranked = ideologies
    .map(i => ({ id: i.id, d: Math.sqrt((i.x - x) ** 2 + (i.y - y) ** 2) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, n);
  const next = { ...counts };
  ranked.forEach((r, idx) => { next[r.id] = (next[r.id] ?? 0) + (n - idx) * 2; });
  return next;
}

export const useCompass = create<State>((set, get) => ({
  x: 0,
  y: 0,
  answers: {},
  queue: initialQueue,
  cursor: 0,
  trail: [{ x: 0, y: 0, t: 0 }],
  shuffled: false,
  globalCounts: seedCounts(),
  tick: 0,
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
        globalCounts: bumpClosest(s.globalCounts, nx, ny, 3),
      };
    });
  },
  skip: () => set(s => ({ cursor: s.cursor + 1 })),
  reset: () => set({ x: 0, y: 0, answers: {}, cursor: 0, trail: [{ x: 0, y: 0, t: 0 }] }),
  startSimulation: () => {
    // Simula respostas de "outros usuários" para o ranking parecer vivo.
    const id = setInterval(() => {
      set(s => {
        // amostra um ponto aleatório ponderado para o centro
        const sx = (Math.random() - 0.5) * 16;
        const sy = (Math.random() - 0.5) * 16;
        return { globalCounts: bumpClosest(s.globalCounts, sx, sy, 2), tick: s.tick + 1 };
      });
    }, 1400);
    return () => clearInterval(id);
  },
}));

export function useCurrentQuestion(): Question | null {
  const queue = useCompass(s => s.queue);
  const cursor = useCompass(s => s.cursor);
  const id = queue[cursor % queue.length];
  return questions.find(q => q.id === id) ?? null;
}

export function useAffinities(limit = 8) {
  const x = useCompass(s => s.x);
  const y = useCompass(s => s.y);
  const cursor = useCompass(s => s.cursor);
  const maxDist = Math.sqrt(800);
  const list = ideologies.map(i => {
    const d = Math.sqrt((i.x - x) ** 2 + (i.y - y) ** 2);
    const confidence = Math.min(1, cursor / 25);
    const raw = Math.max(0, 1 - d / maxDist);
    const pct = Math.round(raw * 100 * confidence);
    return { id: i.id, name: i.name, pct, color: i.color, x: i.x, y: i.y };
  });
  list.sort((a, b) => b.pct - a.pct);
  return list.slice(0, limit);
}

export function useGlobalRanking(limit = 20) {
  const counts = useCompass(s => s.globalCounts);
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const list = ideologies.map(i => {
    const c = counts[i.id] ?? 0;
    return { id: i.id, name: i.name, color: i.color, count: c, pct: (c / total) * 100, markdown: i.markdown, short: i.short };
  });
  list.sort((a, b) => b.count - a.count);
  return { list: list.slice(0, limit), total };
}

function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }
