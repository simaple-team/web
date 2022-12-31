export interface Validity {
  name: string;
  time_left: number;
  cooldown_duration: number;
  valid: boolean;
  stack: number | null;
}
