import { useState } from "react";
/* import { mockAsteroids, type Asteroid } from "@/data/asteroids"; */
import InfoButton from "./InfoDialog";
import type { Neo } from "../types";

interface MobileNeoStripProps {
  onCommunicate?: (asteroid: Neo) => void;
  neos?: Neo[];
  selectedNeoId?: string;
}

const MobileNeoStrip = ({
  onCommunicate,
  neos,
  selectedNeoId,
}: MobileNeoStripProps) => {
  const [selectedAsteroid, setSelectedAsteroid] = useState<Neo | null>(null);

  const handleSelect = (asteroid: Neo) => {
    setSelectedAsteroid(selectedAsteroid?.id === asteroid.id ? null : asteroid);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-30 md:hidden safe-area-top">
      {/* Compact header strip */}
      <div className="bg-card/90 backdrop-blur-md border-b border-primary/20">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary pulse-amber" />
            <span className="text-[9px] uppercase tracking-[0.15em] text-primary text-glow">
              {neos ? neos.length : 0} NEOs DETECTED
            </span>
          </div>
          <InfoButton />
        </div>

        {/* Horizontal scrollable NEO chips */}
        {/* What if no neos here? */}

        {neos && (
          <div className="overflow-x-auto scrollbar-none pb-2 px-2">
            <div className="flex gap-2">
              {neos.map((neo) => (
                <button
                  key={neo.id}
                  onClick={() => handleSelect(neo)}
                  className={`flex-shrink-0 px-3 py-1.5 border text-[10px] uppercase tracking-wider transition-all ${
                    selectedAsteroid?.id === neo.id
                      ? "border-primary bg-primary/20 text-primary text-glow"
                      : "border-border/50 bg-card/50 text-muted-foreground"
                  }`}
                >
                  {neo.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected asteroid quick info + action */}
        {selectedAsteroid && (
          <div className="px-3 pb-3 animate-fade-in">
            <div className="retro-panel p-3 bg-card/95">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-2 min-w-0">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                      NAME
                    </p>
                    <p className="text-sm text-primary text-glow truncate">
                      {selectedAsteroid.name}
                    </p>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                      CLOSE APPROACH TIME
                    </div>
                    <p className="text-sm text-primary text-glow truncate">
                      {selectedAsteroid.time}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div
                    className={`flex items-center gap-1.5 ${
                      selectedAsteroid.hazardous
                        ? "text-destructive"
                        : "text-terminal-green"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedAsteroid.hazardous
                          ? "bg-destructive pulse-amber"
                          : "bg-terminal-green"
                      }`}
                    />
                    <span className="text-[9px] uppercase">
                      {selectedAsteroid.hazardous ? "HAZARDOUS" : "SAFE"}
                    </span>
                  </div>
                  {onCommunicate && (
                    <button
                      disabled={selectedAsteroid.id === selectedNeoId}
                      onClick={() => onCommunicate(selectedAsteroid)}
                      className="px-3 py-1.5 border border-primary/50 bg-primary/10 text-[9px] uppercase tracking-[0.15em] text-primary text-glow active:scale-95 transition-all"
                    >
                      {selectedAsteroid.id !== selectedNeoId ? (
                        <span className="flex items-center justify-center gap-2">
                          COMMUNICATE
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-amber" />
                          COMMUNICATING
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNeoStrip;
