import type { ActionStat } from "./ActionStat";
import type { Stat } from "./Stat";

export interface WorkspaceConfiguration {
  action_stat: Partial<ActionStat>;
  groups: string[];
  injected_values: Record<string, any>;
  skill_levels: Record<string, number>;
  v_improvements: Record<string, number>;
  character_stat: Stat;
}
