import { Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface InfoButtonProps {
  className?: string;
}

const InfoDialog = ({ className = "" }: InfoButtonProps) => {
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowInfo(false);
    };
    if (showInfo) {
      document.addEventListener("keydown", onKey);
      // prevent background scroll while modal is open
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }
    return () => {};
  }, [showInfo]);

  return (
    <>
      <button
        onClick={() => setShowInfo(true)}
        className={`p-1.5 text-muted-foreground hover:text-primary hover:cursor-pointer transition-colors ${className}`}
        aria-label="About this application"
      >
        <Info size={16} />
      </button>

      {showInfo &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
            style={{ background: "hsl(var(--main-background) / 0.8)" }}
            onClick={() => setShowInfo(false)}
            aria-hidden={!showInfo}
          >
            <div
              className="retro-panel p-5 max-w-sm w-full relative z-10"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Bottom corners overlay */}
              <div className="retro-panel-corners absolute inset-0 pointer-events-none" />
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-primary hover:cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <div className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                ABOUT
              </div>
              <div className="text-sm text-primary text-glow mb-3">
                NEO TRACKING SYSTEM
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Near-Earth Objects (NEOs) are comets and asteroids that have
                been nudged by the gravitational attraction of nearby planets
                into orbits that allow them to enter the Earth’s neighborhood.
                <br />
                <br />
                In this web app, you can talk to them!
                <br />
                <br />
                Collisions in the past have had a significant role in shaping
                the geological and biological history of Earth
                <br />
                <br />
                Data is from NASA, the LLM used is TNG-R1T-Chimera
              </p>
              <div className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/70">
                Created by Richard Lundquist in 2025
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default InfoDialog;
