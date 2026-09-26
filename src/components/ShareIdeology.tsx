import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, Download, LockKeyhole, Share2, X } from "lucide-react";
import { getCandidateAffinity, type Candidate } from "@/data/election2026";
import { RESULT_QUESTIONS } from "@/data/config";
import { ideologies, type Ideology } from "@/data/ideologies";
import { useCompass } from "@/store/compass";

const SHARE_URL = "tinyurl.com/brasilpolitico";
const REQUIRED_ANSWERS = RESULT_QUESTIONS;

async function copyPageLink() {
  await navigator.clipboard.writeText(window.location.href.split("#")[0]);
}

export function ShareIdeology() {
  const x = useCompass((state) => state.x);
  const y = useCompass((state) => state.y);
  const answered = useCompass((state) => Object.keys(state.answers).length);
  const [open, setOpen] = useState(false);
  const [linkStatus, setLinkStatus] = useState("");

  const unlocked = answered >= REQUIRED_ANSWERS;
  const progress = Math.min(100, (answered / REQUIRED_ANSWERS) * 100);
  const remaining = Math.max(0, REQUIRED_ANSWERS - answered);
  const stage = remaining === 0 ? "ready" : remaining <= 15 ? "near" : "start";

  return (
    <>
      <div className={`share-unlock share-${stage}`}>
        <div className="share-count" aria-live="polite">
          <strong>{remaining}</strong>
          <span>{unlocked ? "resultado liberado" : "perguntas para liberar seu card"}</span>
        </div>
        <div className="share-progress-area">
          <div className="share-progress-label">
            <span>SEU RESULTADO PARA COMPARTILHAR</span>
            <span>
              {Math.min(answered, REQUIRED_ANSWERS)}/{REQUIRED_ANSWERS}
            </span>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-border/60"
            role="progressbar"
            aria-label="Progresso para liberar o compartilhamento"
            aria-valuemin={0}
            aria-valuemax={REQUIRED_ANSWERS}
            aria-valuenow={Math.min(answered, REQUIRED_ANSWERS)}
          >
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${progress}%`,
                background: "var(--share-stage-color)",
              }}
            />
          </div>
        </div>
        <button
          type="button"
          disabled={!unlocked}
          onClick={() => setOpen(true)}
          className="share-trigger"
          title={
            unlocked
              ? "Criar imagem do seu resultado"
              : `Responda mais ${REQUIRED_ANSWERS - answered} perguntas para compartilhar`
          }
        >
          {unlocked ? <Share2 size={14} /> : <LockKeyhole size={14} />}
          <span>{unlocked ? "CRIAR MEU CARD" : "CARD BLOQUEADO"}</span>
        </button>
        <button
          type="button"
          className="copy-page-link"
          onClick={async () => {
            try {
              await copyPageLink();
              setLinkStatus("Link copiado!");
            } catch {
              setLinkStatus("Não foi possível copiar o link.");
            }
          }}
        >
          {linkStatus === "Link copiado!" ? <Check size={14} /> : <Copy size={14} />}
          {linkStatus || "Copiar link da página"}
        </button>
      </div>

      {open && <ShareDialog x={x} y={y} onClose={() => setOpen(false)} />}
    </>
  );
}

function ShareDialog({ x, y, onClose }: { x: number; y: number; onClose: () => void }) {
  const ideology = useMemo(() => getClosestIdeology(x, y), [x, y]);
  const candidate = useMemo(() => getCandidateAffinity(x, y)[0], [x, y]);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState("Gerando sua imagem…");

  useEffect(() => {
    let active = true;
    let objectUrl = "";

    createShareImage(ideology, candidate, x, y)
      .then((imageBlob) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(imageBlob);
        setBlob(imageBlob);
        setPreviewUrl(objectUrl);
        setStatus("");
      })
      .catch(() => {
        if (active) setStatus("Não foi possível gerar a imagem. Tente novamente.");
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [ideology, candidate, x, y]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const fileName = `brasil-politico-${ideology.id}.png`;

  const share = async () => {
    if (!blob) return;
    const file = new File([blob], fileName, { type: "image/png" });

    try {
      if (!navigator.share) {
        setStatus("O compartilhamento por apps não está disponível neste navegador.");
        return;
      }
      if (navigator.canShare && !navigator.canShare({ files: [file] })) {
        setStatus("Este navegador não permite enviar imagens por apps. Use Baixar imagem.");
        return;
      }
      await navigator.share({
        files: [file],
        title: `Minha ideologia: ${ideology.name}`,
        text: `Meu resultado no Brasil Político foi ${ideology.name}; meu candidato mais próximo no mapa é ${candidate.ballotName}. Faça o teste: ${window.location.href.split("#")[0]}`,
      });
      setStatus("Imagem compartilhada.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("Não foi possível abrir o compartilhamento. Você ainda pode baixar a imagem.");
    }
  };

  const download = () => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Imagem baixada.");
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/85 p-3 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="share-dialog glass-strong hud-corner">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 text-[9px] font-mono tracking-[0.24em] text-cyber-cyan">
              SEU MAPA IDEOLÓGICO
            </div>
            <h2 id="share-title" className="text-lg font-semibold leading-tight">
              Pronto para compartilhar
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-border p-2 transition-colors hover:border-cyber-cyan hover:text-cyber-cyan"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="share-preview">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={`Mapa ideológico com resultado ${ideology.name} nas coordenadas X ${x.toFixed(2)} e Y ${y.toFixed(2)}`}
            />
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center font-mono text-xs opacity-60">
              PROCESSANDO MAPA…
            </div>
          )}
        </div>

        <p className="share-candidate-caption">
          Maior afinidade no mapa: <strong>{candidate.name}</strong> · {candidate.proximity}% de
          proximidade estimada
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button type="button" onClick={share} disabled={!blob} className="share-action primary">
            <Share2 size={16} />
            Compartilhar por apps
          </button>
          <button type="button" onClick={download} disabled={!blob} className="share-action">
            <Download size={16} />
            Baixar imagem
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                await copyPageLink();
                setStatus("Link da página copiado.");
              } catch {
                setStatus("Não foi possível copiar o link.");
              }
            }}
            className="share-action"
          >
            <Copy size={16} />
            Copiar link
          </button>
        </div>
        <p
          className="min-h-4 text-center text-[10px] font-mono text-foreground/65"
          aria-live="polite"
        >
          {status}
        </p>
      </div>
    </div>,
    document.body,
  );
}

function getClosestIdeology(x: number, y: number) {
  return ideologies.reduce((closest, ideology) => {
    const distance = (ideology.x - x) ** 2 + (ideology.y - y) ** 2;
    const closestDistance = (closest.x - x) ** 2 + (closest.y - y) ** 2;
    return distance < closestDistance ? ideology : closest;
  });
}

function plainDescription(markdown: string) {
  return markdown
    .replace(/^#.+$/m, "")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function createShareImage(
  ideology: Ideology,
  candidate: Candidate & { proximity: number },
  x: number,
  y: number,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível");

  const accent = ideology.color;

  const background = ctx.createLinearGradient(0, 0, 1080, 1350);
  background.addColorStop(0, "#10293a");
  background.addColorStop(0.52, "#091a2b");
  background.addColorStop(1, "#07101e");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 1080, 1350);

  ctx.strokeStyle = "rgba(104, 224, 229, .06)";
  ctx.lineWidth = 1;
  for (let p = 0; p <= 1080; p += 54) {
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, 1350);
    ctx.stroke();
  }
  for (let p = 0; p <= 1350; p += 54) {
    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(1080, p);
    ctx.stroke();
  }

  ctx.fillStyle = "#f4d84a";
  ctx.font = "700 25px system-ui, sans-serif";
  ctx.fillText("BRASIL POLÍTICO", 64, 72);
  ctx.fillStyle = "#74e4e9";
  ctx.font = "500 17px ui-monospace, monospace";
  ctx.fillText("MEU MAPA IDEOLÓGICO", 64, 104);
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,.68)";
  ctx.fillText("RESULTADO ATUAL", 1016, 85);
  ctx.textAlign = "left";

  const map = { x: 64, y: 145, w: 952, h: 500 };
  roundedRect(ctx, map.x, map.y, map.w, map.h, 24);
  ctx.fillStyle = "rgba(8, 24, 42, .92)";
  ctx.fill();
  ctx.strokeStyle = "rgba(116, 228, 233, .48)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.save();
  roundedRect(ctx, map.x, map.y, map.w, map.h, 24);
  ctx.clip();
  const quadrants = [
    ["rgba(190, 61, 65, .13)", map.x, map.y],
    ["rgba(93, 76, 184, .13)", map.x + map.w / 2, map.y],
    ["rgba(39, 163, 101, .13)", map.x, map.y + map.h / 2],
    ["rgba(235, 194, 43, .12)", map.x + map.w / 2, map.y + map.h / 2],
  ] as const;
  quadrants.forEach(([color, qx, qy]) => {
    ctx.fillStyle = color;
    ctx.fillRect(qx, qy, map.w / 2, map.h / 2);
  });

  ctx.strokeStyle = "rgba(116, 228, 233, .32)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(map.x + map.w / 2, map.y);
  ctx.lineTo(map.x + map.w / 2, map.y + map.h);
  ctx.moveTo(map.x, map.y + map.h / 2);
  ctx.lineTo(map.x + map.w, map.y + map.h / 2);
  ctx.stroke();

  ideologies.forEach((item) => {
    const point = project(item.x, item.y, map);
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,.24)";
    ctx.fill();
  });

  // Os seis candidatos também aparecem no mesmo mapa do card exportado.
  getCandidateAffinity(x, y).forEach((item) => {
    const point = project(item.x, item.y, map);
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, item.id === candidate.id ? 9 : 6, 0, Math.PI * 2);
    ctx.fill();
  });

  const position = project(x, y, map);
  ctx.shadowColor = "#f4d84a";
  ctx.shadowBlur = 28;
  ctx.strokeStyle = "#f4d84a";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(position.x, position.y, 21, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#f4d84a";
  ctx.beginPath();
  ctx.arc(position.x, position.y, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();

  ctx.font = "600 15px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,.72)";
  ctx.fillText("ESQUERDA", map.x + 18, map.y + map.h / 2 - 14);
  ctx.textAlign = "right";
  ctx.fillText("DIREITA", map.x + map.w - 18, map.y + map.h / 2 - 14);
  ctx.textAlign = "center";
  ctx.fillText("AUTORITÁRIO", map.x + map.w / 2, map.y + 29);
  ctx.fillText("LIBERTÁRIO", map.x + map.w / 2, map.y + map.h - 18);
  ctx.textAlign = "left";

  roundedRect(ctx, 64, 683, 952, 154, 22);
  ctx.fillStyle = "rgba(255,255,255,.055)";
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.fillRect(64, 683, 8, 154);
  ctx.fillStyle = "rgba(255,255,255,.62)";
  ctx.font = "500 17px ui-monospace, monospace";
  ctx.fillText(`X ${x.toFixed(2)}  ·  Y ${y.toFixed(2)}`, 96, 724);
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 42px system-ui, sans-serif";
  fitText(ctx, ideology.name, 96, 783, 850);
  ctx.fillStyle = "rgba(255,255,255,.62)";
  ctx.font = "500 18px ui-monospace, monospace";
  ctx.fillText("IDEOLOGIA MAIS PRÓXIMA DA SUA COORDENADA", 96, 815);

  ctx.fillStyle = "#74e4e9";
  ctx.font = "600 17px ui-monospace, monospace";
  ctx.fillText("EM POUCAS PALAVRAS", 64, 885);
  ctx.fillStyle = "rgba(255,255,255,.88)";
  ctx.font = "400 25px system-ui, sans-serif";
  wrapText(ctx, plainDescription(ideology.markdown), 64, 925, 940, 35, 3);

  ctx.fillStyle = "#74e4e9";
  ctx.font = "600 17px ui-monospace, monospace";
  ctx.fillText("CANDIDATO MAIS PRÓXIMO NO MAPA", 64, 1044);
  roundedRect(ctx, 64, 1070, 952, 112, 18);
  ctx.fillStyle = "rgba(255,255,255,.055)";
  ctx.fill();
  ctx.fillStyle = candidate.color;
  ctx.fillRect(64, 1070, 8, 112);
  ctx.font = "700 31px system-ui, sans-serif";
  ctx.fillText(candidate.name, 92, 1115);
  ctx.fillStyle = "rgba(255,255,255,.72)";
  ctx.font = "500 18px system-ui, sans-serif";
  ctx.fillText(candidate.spectrum, 92, 1150);
  ctx.textAlign = "right";
  ctx.fillStyle = candidate.color;
  ctx.font = "700 34px system-ui, sans-serif";
  ctx.fillText(`${candidate.proximity}%`, 985, 1117);
  ctx.font = "500 14px system-ui, sans-serif";
  ctx.fillText("PROXIMIDADE ESTIMADA", 985, 1149);
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,.48)";
  ctx.font = "400 13px system-ui, sans-serif";
  ctx.fillText(
    "Afinidade editorial pelas coordenadas dos planos; não é intenção de voto.",
    64,
    1201,
  );

  const cta = ctx.createLinearGradient(64, 1213, 1016, 1292);
  cta.addColorStop(0, "#1b8b66");
  cta.addColorStop(1, "#155589");
  roundedRect(ctx, 64, 1213, 952, 79, 20);
  ctx.fillStyle = cta;
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 22px system-ui, sans-serif";
  ctx.fillText("DESCUBRA A SUA IDEOLOGIA TAMBÉM", 91, 1248);
  ctx.fillStyle = "#f4d84a";
  ctx.font = "700 23px ui-monospace, monospace";
  ctx.textAlign = "right";
  ctx.fillText(SHARE_URL, 989, 1265);
  ctx.textAlign = "left";

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (imageBlob) =>
        imageBlob ? resolve(imageBlob) : reject(new Error("Falha ao exportar imagem")),
      "image/png",
      1,
    );
  });
}

function project(x: number, y: number, map: { x: number; y: number; w: number; h: number }) {
  return {
    x: map.x + ((x + 10) / 20) * map.w,
    y: map.y + ((10 - y) / 20) * map.h,
  };
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
) {
  let size = 42;
  while (ctx.measureText(text).width > maxWidth && size > 27) {
    size -= 1;
    ctx.font = `700 ${size}px system-ui, sans-serif`;
  }
  ctx.fillText(text, x, y);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  lines.slice(0, maxLines).forEach((value, index) => {
    const isTruncated = index === maxLines - 1 && lines.length > maxLines;
    ctx.fillText(
      isTruncated ? `${value.replace(/[.,;:]?$/, "")}…` : value,
      x,
      y + index * lineHeight,
    );
  });
}
