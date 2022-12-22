export interface Validity {
  name: string;
  time_left: number;
  cooldown: number;
  valid: boolean;
  stack: number | null;
}
