import type { Neo } from "../types";
import DataField from "./AsteroidDataField";
import Button from "./Button";

interface AsteroidCardProps {
  data: Neo;
  index: number;
  onCommunicate: (asteroid: Neo) => void;
  selectedNeoId?: string;
}

const AsteroidCard = ({
  data,
  index,
  onCommunicate,
  selectedNeoId,
}: AsteroidCardProps) => (
  <div
    className="retro-panel p-4 mb-4 animate-fade-in"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    {/* Bottom corners overlay */}
    <div className="retro-panel-corners absolute inset-0 pointer-events-none" />

    {/* Header */}
    <div className="flex items-start justify-between mb-4 border-b border-border/30 pb-3">
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          NAME
        </div>
        <div className="text-lg font-medium text-primary text-glow">
          {data.name}
        </div>
      </div>
      <div className="text-right">
        <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
          ID
        </div>
        <div className="text-[10px] text-muted-foreground/70 font-mono">
          {data.id}
        </div>
      </div>
    </div>

    {/* Data grid */}
    <div className="grid grid-cols-2 gap-x-4">
      <DataField
        label="EST. DIAMETER"
        value={`${data.size.min}-${data.size.max}`}
        unit={"M"}
      />
      <DataField label="MISS DISTANCE" value={data.missDistance} unit="KM" />
      <DataField
        label="REL. VELOCITY"
        value={data.relativeVelocity}
        unit="KM/S"
      />
      <DataField label="APPROACH TIME" value={data.time} />
    </div>

    {/* Hazard status */}
    <div className="mt-4 pt-3 border-t border-border/30">
      <div className="label-text">THREAT LEVEL</div>
      <HazardIndicator isHazardous={data.hazardous} />
    </div>
  
    <Button
      disabled={data.id === selectedNeoId}
      aria-label={
        data.id === selectedNeoId
          ? "Currently communicating with asteroid"
          : "Communicate with asteroid"
      }
      aria-busy={data.id === selectedNeoId}
      onClick={() => onCommunicate(data)}
    >
      <span className="flex items-center justify-center gap-2">
        {data.id === selectedNeoId && (
          <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-amber" />
        )}
        {data.id === selectedNeoId ? "COMMUNICATING" : "COMMUNICATE"}
      </span>
    </Button>
  </div>
);

const HazardIndicator = ({ isHazardous }: { isHazardous: boolean }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-2 h-2 rounded-full ${
        isHazardous
          ? "bg-destructive pulse-amber"
          : "bg-terminal-green pulse-amber"
      }`}
    />
    <span
      className={`value-text ${
        isHazardous ? "text-destructive" : "text-muted-foreground"
      }`}
    >
      {isHazardous ? "HAZARDOUS" : "NON-HAZARDOUS"}
    </span>
  </div>
);

export default AsteroidCard;
