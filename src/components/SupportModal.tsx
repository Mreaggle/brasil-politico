import { Check, Copy, ExternalLink, HeartHandshake, Smartphone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const PIX_CODE =
  "00020126490014BR.GOV.BCB.PIX0111470052348470212ReligioMundi5204000053039865802BR5916Kauan Crema Dias6009SAO PAULO62140510cdnPXAbnWg63044819";
const NUBANK_URL = "https://nubank.com.br/cobrar/18cvy/6a6cf6ad-6522-42b5-aa7d-32bbb73f1efa";

export function SupportModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 3200);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(PIX_CODE);
      setCopied(true);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = PIX_CODE;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const succeeded = document.execCommand("copy");
      textarea.remove();
      setCopied(succeeded);
    }
  };

  return (
    <div className="support-backdrop">
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
        aria-label="Fechar janela de apoio"
      />

      <section
        className="support-dialog glass-strong hud-corner"
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-title"
      >
        <header className="support-dialog-header">
          <div className="flex items-center gap-2">
            <HeartHandshake size={17} className="text-accent" aria-hidden="true" />
            <h2 id="support-title">APOIAR O BRASIL POLÍTICO</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="support-close"
            onClick={onClose}
            aria-label="Fechar APOIAR O BRASIL POLÍTICO"
          >
            <X size={18} />
          </button>
        </header>

        <div className="support-content scroll-cyber">
          <section className="mb-5">
            <p className="support-eyebrow">CONHECIMENTO ABERTO · PESQUISA INDEPENDENTE</p>
            <h3 className="support-title">Ajude este projeto a continuar crescendo.</h3>
            <p className="support-description">
              Seu apoio contribui para pesquisa, revisão de dados, infraestrutura e novas
              ferramentas de educação política. Escolha a opção mais prática para o seu dispositivo.
            </p>
          </section>

          <div className="support-payment-grid">
            <section className="support-qr-panel">
              <div
                className="support-qr-frame"
                role="img"
                aria-label="QR Code para apoiar o Brasil Político via Pix"
              >
                <img src={`${import.meta.env.BASE_URL}qrcodepix.png`} alt="" />
              </div>
              <h3>Escaneie com o aplicativo do seu banco</h3>
              <p>
                Em um só aparelho, salve uma captura e use a opção de ler QR Code pela galeria do
                banco. Se ela não estiver disponível, copie o código Pix.
              </p>
            </section>

            <section className="support-actions-panel">
              <div className="support-method">
                <span className="support-method-icon" aria-hidden="true">
                  <Copy size={18} />
                </span>
                <div>
                  <small>PIX COPIA E COLA</small>
                  <strong>Kauan Crema Dias</strong>
                </div>
              </div>

              <code className="support-pix-code">{PIX_CODE}</code>
              <button type="button" className="support-copy-button" onClick={copyPixCode}>
                {copied ? <Check size={17} /> : <Copy size={17} />}
                {copied ? "Código Pix copiado" : "Copiar código Pix"}
              </button>
              <p className="support-copy-status" role="status" aria-live="polite">
                {copied ? "Agora é só colar na área Pix do seu banco." : "\u00a0"}
              </p>

              <div className="support-divider" aria-hidden="true">
                <span>OU</span>
              </div>

              <a className="support-bank-link" href={NUBANK_URL} target="_blank" rel="noreferrer">
                <Smartphone size={18} />
                <span>
                  <small>ABRIR COBRANÇA DIRETA</small>
                  <strong>Continuar pelo Nubank</strong>
                </span>
                <ExternalLink size={16} />
              </a>
              <p className="support-security-note">
                Confira o nome do destinatário antes de confirmar qualquer pagamento.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
