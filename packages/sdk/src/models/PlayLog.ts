import { Stat } from "./Stat";
import { Event } from "./Event";
import { Validity } from "./Validity";
import { Running } from "./Running";
import { Action } from "./Action";

export interface PlayLog {
  events: Event[];
  index: number;
  validity_view: Record<string, Validity>;
  running_view: Record<string, Running>;
  buff_view: Stat;
  damage: number;
  clock: number;
  delay: number;
  action: Action;
}
