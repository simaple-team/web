import { PlayLog, WorkspaceConfiguration, WorkspaceResponse } from "./models";
import { Action } from "./models/Action";

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

  async function playWorkspace(id: string, action: Action): Promise<PlayLog> {
    return fetchFn(`${baseUrl}/workspaces/play/${id}`, {
      method: "POST",
      body: JSON.stringify(action),
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => res.json());
  }

  return { createWorkspace, playWorkspace };
}
