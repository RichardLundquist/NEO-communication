import { createPortal } from "react-dom";

interface ErrorDialogProps {
  generateMockStory: () => void;
}

const ErrorDialog = ({ generateMockStory }: ErrorDialogProps) => {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "hsl(var(--main-background) / 0.8)" }}
    >
      <div
        className="retro-panel bg-card/95 p-5 max-w-sm w-full relative z-10"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="retro-panel-corners absolute inset-0 pointer-events-none" />

        <div className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
          ERROR
        </div>
        <div className="text-sm text-primary text-glow mb-3">
          NEO TRACKING SYSTEM
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          Failed to connect to NASA NEO API. Please check your internet
          connection and API key configuration.
          <br />
          For a quick offline preview, use the sample data below.
        </p>
        <div className="grid gap-2">
          <button
            onClick={() => window.location.reload()}
            aria-label="Retry connecting to NASA API"
            className="mt-3 md:mt-4 w-full py-2 px-3 border border-primary/50 bg-primary/10 hover:bg-primary/20 hover:border-primary transition-all duration-200 text-[10px] uppercase tracking-[0.2em] text-primary text-glow cursor-pointer active:scale-[0.98]"
          >
            RETRY
          </button>
          <button
            onClick={() => generateMockStory()}
            aria-label="Load offline sample data"
            className="w-full py-2 px-3 border border-primary/50 bg-primary/10 hover:bg-primary/20 hover:border-primary transition-all duration-200 text-[10px] uppercase tracking-[0.2em] text-primary text-glow cursor-pointer active:scale-[0.98]"
          >
            GET OFFLINE SAMPLE
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ErrorDialog;