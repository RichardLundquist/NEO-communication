export interface Neo {
  hazardous: boolean;
  name: string;
  time: string;
  id: string;
  size: {
    min: number;
    max: number;
  };
  relativeVelocity: number;
  missDistance: number;
}

export interface RawNeoData {
  links:
  { self: string; };
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: MinMax;
    meters: MinMax;
    miles: MinMax;
    feet: MinMax;
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproachDatum[];
  is_sentry_object: boolean;
}


interface CloseApproachDatum {
  close_approach_date: Date;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
    miles_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
    miles: string;
  };
  orbiting_body: string;
}

interface MinMax {
  estimated_diameter_min: number;
  estimated_diameter_max: number;
}