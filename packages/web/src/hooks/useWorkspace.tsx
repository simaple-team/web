import { PlayLog } from "@simaple/sdk";
import * as React from "react";
import { sdk } from "../sdk";

type WorkspaceProviderProps = { children: React.ReactNode };

function useWorkspaceState() {
  const [workspaceId, setWorkspaceId] = React.useState<string>();
  const [history, setHistory] = React.useState<PlayLog[]>([]);
  const [skillNames, setSkillNames] = React.useState<string[]>([]);
  const playLog = history[history.length - 1];

  function initialize() {
    sdk
      .createWorkspace({
        action_stat: {},
        groups: ["mechanic", "common", "resistance", "pirate"],
        injected_values: { character_level: 260, weapon_attack_power: 400 },
        skill_levels: {},
        v_improvements: {},
        character_stat: {
          STR: 907.0,
          LUK: 2224.0,
          INT: 4932.0,
          DEX: 832.0,
          STR_multiplier: 86.0,
          LUK_multiplier: 86.0,
          INT_multiplier: 573.0,
          DEX_multiplier: 86.0,
          STR_static: 420.0,
          LUK_static: 500.0,
          INT_static: 15460.0,
          DEX_static: 200.0,
          attack_power: 1200.0,
          magic_attack: 2075.0,
          attack_power_multiplier: 0.0,
          magic_attack_multiplier: 81.0,
          critical_rate: 100.0,
          critical_damage: 83.0,
          boss_damage_multiplier: 144.0,
          damage_multiplier: 167.7,
          final_damage_multiplier: 110.0,
          ignored_defence: 94.72006176400876,
          MHP: 23105.0,
          MMP: 12705.0,
          MHP_multiplier: 0.0,
          MMP_multiplier: 0.0,
        },
      })
      .then((res) => {
        setWorkspaceId(res.id);
        return sdk.getLogs(res.id);
      })
      .then((res) => {
        setSkillNames(Object.keys(res[0].validity_view));
        setHistory(res);
      });
  }

  const rollback = React.useCallback(
    (index: number) => {
      if (!workspaceId) return;
      sdk
        .rollback(workspaceId, index)
        .then(() => sdk.getLogs(workspaceId))
        .then((res) => {
          setHistory(res);
        });
    },
    [sdk, workspaceId]
  );

  const undo = React.useCallback(() => {
    rollback(history.length - 2);
  }, [rollback, history.length]);

  function pushPlayLog(...logs: PlayLog[]) {
    setHistory((history) => [...history, ...logs]);
  }

  function reorderSkillNames(startIndex: number, endIndex: number) {
    const result = Array.from(skillNames);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    setSkillNames(result);
  }

  return {
    workspaceId,
    history,
    playLog,
    skillNames,
    initialize,
    rollback,
    undo,
    pushPlayLog,
    reorderSkillNames,
  };
}

const WorkspaceStateContext = React.createContext<
  ReturnType<typeof useWorkspaceState> | undefined
>(undefined);

function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const value = useWorkspaceState();

  return (
    <WorkspaceStateContext.Provider value={value}>
      {children}
    </WorkspaceStateContext.Provider>
  );
}

function useWorkspace() {
  const context = React.useContext(WorkspaceStateContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}

export { WorkspaceProvider, useWorkspace };
