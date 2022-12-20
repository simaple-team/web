import {
  PlayLog,
  RequestElapse,
  RequestUse,
  RequestUseAndElapse,
  WorkspaceConfiguration,
  WorkspaceResponse,
} from "./models";

export function getSDK({
  baseUrl = "localhost:8000",
  fetchFn = fetch,
}: {
  baseUrl: string;
  fetchFn: (url: string, init?: RequestInit) => Promise<Response>;
}) {
  async function createWorkspace(
    configuration: WorkspaceConfiguration
  ): Promise<WorkspaceResponse> {
    return fetchFn(`${baseUrl}/workspaces`, {
      method: "POST",
      body: JSON.stringify(configuration),
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => res.json());
  }

  async function use(id: string, req: RequestUse): Promise<PlayLog> {
    return fetchFn(`${baseUrl}/workspaces/use/${id}`, {
      method: "POST",
      body: JSON.stringify(req),
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => res.json());
  }

  async function elapse(id: string, req: RequestElapse): Promise<PlayLog> {
    return fetchFn(`${baseUrl}/workspaces/elapse/${id}`, {
      method: "POST",
      body: JSON.stringify(req),
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => res.json());
  }

  async function useAndElapse(
    id: string,
    req: RequestUseAndElapse
  ): Promise<PlayLog> {
    return fetchFn(`${baseUrl}/workspaces/use_and_elapse/${id}`, {
      method: "POST",
      body: JSON.stringify(req),
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => res.json());
  }

  async function rollback(id: string, index: number): Promise<void> {
    return fetchFn(`${baseUrl}/workspaces/rollback/${id}/${index}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => res.json());
  }

  async function getLogs(id: string): Promise<PlayLog[]> {
    return fetchFn(`${baseUrl}/workspaces/logs/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => res.json());
  }

  return { createWorkspace, use, elapse, useAndElapse, rollback, getLogs };
}
