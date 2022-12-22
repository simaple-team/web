import {
  MinimalSimulatorConfiguration,
  PlayLog,
  SimulatorResponse,
} from "@simaple/sdk";
import * as React from "react";
import { sdk } from "../sdk";

type WorkspaceProviderProps = { children: React.ReactNode };

function useWorkspaceState() {
  const [currentSimulatorId, setCurrentSimulatorId] = React.useState<string>();
  const [simulators, setSimulators] = React.useState<SimulatorResponse[]>([]);
  const [history, setHistory] = React.useState<PlayLog[]>([]);
  const [skillNames, setSkillNames] = React.useState<string[]>([]);
  const playLog = history[history.length - 1];

  React.useLayoutEffect(() => {
    getAllSimulators();
  }, []);

  async function getAllSimulators() {
    await sdk.getAllSimulators().then((res) => setSimulators(res));
    return;
  }

  async function createSimulator(configuration: MinimalSimulatorConfiguration) {
    const simulator = await sdk.createSimulator(configuration);
    setCurrentSimulatorId(simulator.id);

    const logs = await sdk.getLogs(simulator.id);
    setSkillNames(Object.keys(logs[0].validity_view));
    setHistory(logs);

    await getAllSimulators();
  }

  async function loadSimulator(id: string) {
    setCurrentSimulatorId(id);

    const logs = await sdk.getLogs(id);
    setSkillNames(Object.keys(logs[0].validity_view));
    setHistory(logs);

    await getAllSimulators();
  }

  const rollback = React.useCallback(
    (index: number) => {
      if (!currentSimulatorId) return;
      sdk
        .rollback(currentSimulatorId, index)
        .then(() => sdk.getLogs(currentSimulatorId))
        .then((res) => {
          setHistory(res);
        });
    },
    [sdk, currentSimulatorId]
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
    simulators,
    currentSimulatorId,
    history,
    playLog,
    skillNames,
    createSimulator,
    loadSimulator,
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
