import {
  CreateSnapshotCommand,
  MinimalSimulatorConfiguration,
  PlayLog,
  RequestElapse,
  RequestUse,
  RequestUseAndElapse,
  SimulatorResponse,
} from "./models";
import { SnapshotResponse } from "./models/SnapshotResponse";

export function getSDK({
  baseUrl = "localhost:8000",
  fetchFn = fetch,
}: {
  baseUrl: string;
  fetchFn: (url: string, init?: RequestInit) => Promise<Response>;
}) {
  async function _request(url: string, requestInit: RequestInit = {}) {
    return fetchFn(`${baseUrl}${url}`, {
      ...requestInit,
      headers: {
        ...(requestInit.headers ?? {}),
        "content-type": "application/json",
      },
    }).then((res) => res.json());
  }

  async function getAllSimulators(): Promise<SimulatorResponse[]> {
    return _request(`/workspaces`);
  }

  async function createSimulator(
    configuration: MinimalSimulatorConfiguration
  ): Promise<SimulatorResponse> {
    return _request(`/workspaces`, {
      method: "POST",
      body: JSON.stringify(configuration),
    });
  }

  async function getAllSnapshots(): Promise<SnapshotResponse[]> {
    return _request(`/snapshots`);
  }

  async function createSnapshot(
    req: CreateSnapshotCommand
  ): Promise<SnapshotResponse> {
    return _request(`/snapshots`, {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async function loadFromSnapshot(id: string): Promise<string> {
    return _request(`/snapshots/${id}/load`, {
      method: "POST",
    });
  }

  async function use(id: string, req: RequestUse): Promise<PlayLog> {
    return _request(`/workspaces/use/${id}`, {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async function elapse(id: string, req: RequestElapse): Promise<PlayLog> {
    return _request(`/workspaces/elapse/${id}`, {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async function useAndElapse(
    id: string,
    req: RequestUseAndElapse
  ): Promise<PlayLog> {
    return _request(`/workspaces/use_and_elapse/${id}`, {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async function rollback(id: string, index: number): Promise<void> {
    return _request(`/workspaces/rollback/${id}/${index}`, {
      method: "POST",
    });
  }

  async function getLogs(id: string): Promise<PlayLog[]> {
    return _request(`/workspaces/logs/${id}`);
  }

  async function getComponentSpecs(): Promise<Record<string, unknown>> {
    return _request(`/component_spec`);
  }

  return {
    getAllSimulators,
    createSimulator,
    getAllSnapshots,
    createSnapshot,
    loadFromSnapshot,
    use,
    elapse,
    useAndElapse,
    rollback,
    getLogs,
    getComponentSpecs,
  };
}
