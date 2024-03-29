import {
  BaselineConfiguration,
  MinimalSimulatorConfiguration,
  PlayLog,
  SimulatorResponse,
  SnapshotResponse,
} from "@simaple/sdk";
import * as React from "react";
import { sdk } from "../sdk";
import { ChartSetting, Preferences } from "./preferences.interface";

type WorkspaceProviderProps = { children: React.ReactNode };

function useWorkspaceState() {
  const [currentSimulatorId, setCurrentSimulatorId] = React.useState<string>();
  const [simulators, setSimulators] = React.useState<SimulatorResponse[]>([]);
  const [snapshots, setSnapshots] = React.useState<SnapshotResponse[]>([]);
  const [history, setHistory] = React.useState<PlayLog[]>([]);
  const [skillNames, setSkillNames] = React.useState<string[]>([]);
  const playLog = history[history.length - 1];

  React.useLayoutEffect(() => {
    sdk.getSkills().then(console.log);
    getAllSimulators();
    getAllSnapshots();
  }, []);

  async function updateSimulatorId(id: string) {
    setCurrentSimulatorId(id);

    const logs = await sdk.getLogs(id);
    setSkillNames(Object.keys(logs[0].validity_view));
    setHistory(logs);
  }

  async function getAllSimulators() {
    await sdk.getAllSimulators().then((res) => setSimulators(res));
    return;
  }

  async function createMinimalSimulator(
    configuration: MinimalSimulatorConfiguration
  ) {
    const simulator = await sdk.createMinimalSimulator(configuration);

    await updateSimulatorId(simulator.id);
    await getAllSimulators();
  }

  async function createBaselineSimulator(configuration: BaselineConfiguration) {
    const simulator = await sdk.createBaselineSimulator(configuration);

    await updateSimulatorId(simulator.id);
    await getAllSimulators();
  }

  async function loadSimulator(id: string) {
    await updateSimulatorId(id);
    await getAllSimulators();
  }

  async function getAllSnapshots() {
    await sdk.getAllSnapshots().then((res) => setSnapshots(res));
    return;
  }

  async function createSnapshot(name: string) {
    if (!currentSimulatorId) return;

    await sdk.createSnapshot({
      name,
      simulator_id: currentSimulatorId,
    });

    await getAllSnapshots();
  }

  async function loadFromSnapshot(id: string) {
    const simulatorId = await sdk.loadFromSnapshot(id);

    await updateSimulatorId(simulatorId);
    await getAllSimulators();
  }

  const rollback = React.useCallback(
    (index: number) => {
      if (!currentSimulatorId) return;
      sdk
        .rollback(currentSimulatorId, index)
        .then(() => sdk.getLatestLog(currentSimulatorId))
        .then(() => {
          setHistory((history) => history.slice(0, index));
        });
    },
    [sdk, currentSimulatorId]
  );

  const undo = React.useCallback(() => {
    rollback(history.length - 1);
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
    snapshots,
    history,
    playLog,
    skillNames,
    createMinimalSimulator,
    createBaselineSimulator,
    loadSimulator,
    createSnapshot,
    loadFromSnapshot,
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
