import type { Neo } from "../types";
import AsteroidCard from "./AsteroidCard";
import InfoButton from "./InfoDialog";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";


interface AsteroidDataPanelProps {
  data?: Neo[];
  onCommunicate: (asteroid: Neo) => void;
  selectedNeoId?: string;
}

const AsteroidDataPanel = ({
  data,
  onCommunicate,
  selectedNeoId,
}: AsteroidDataPanelProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`h-full flex flex-col bg-sidebar-background/80 md:bg-sidebar-background/95 backdrop-blur-sm md:backdrop-blur-none border-r-0 md:border-r border-sidebar-border ${expanded ? 'w-80' : 'w-16'} ${expanded ? '' : 'items-center'}`}>
      {/* Header */}
      {expanded ? (
        <div className="relative p-4 border-b border-sidebar-border w-full">
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-label="Collapse sidebar"
            aria-expanded={expanded}
            className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <ChevronLeft size={24} /> 
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary pulse-amber" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              SYSTEM ONLINE
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <h1 className="text-lg font-medium text-primary text-glow tracking-wide">
              NEO TRACKING
            </h1>
            <InfoButton />
          </div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-1">
            NEAR-EARTH OBJECT MONITOR
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-4 border-b border-sidebar-border w-full">
          <button
            onClick={() => setExpanded(true)}
            aria-label="Expand sidebar"
            aria-expanded={expanded}
            className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>
          <div className="pt-1">
            <InfoButton />
          </div>
        </div>
      )}

      {/* Scrollable content */}
      <div className={`${expanded ? 'flex-1 overflow-y-auto p-4 scrollbar-thin' : 'hidden'}`}>
        {data && data.length > 0 ? (
          <>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
              {data.length} OBJECTS DETECTED ON {new Date().toLocaleDateString('en-GB')}
            </div>
            {data.map((neo, i) => (
              <AsteroidCard
                onCommunicate={onCommunicate}
                selectedNeoId={selectedNeoId}
                data={neo}
                index={i}
                key={neo.id}
              />
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-destructive text-2xl mb-2">⚠</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              NO DATA AVAILABLE
            </div>
            <div className="text-[9px] text-muted-foreground/60 mt-2">
              Check system connection
            </div>
            <Button onClick={()=> setExpanded(false)}>Close</Button>
            <Button onClick={() => window.location.reload()}>Reload</Button>

          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={`${expanded ? 'p-4 border-t border-sidebar-border' : 'hidden'}`}>
        <div className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/60">
          <p>NEO COMMUNICATION SYSTEM</p>
          <p className="mt-2">RICHARD LUNDQUIST</p>
          <p>{new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default AsteroidDataPanel;
