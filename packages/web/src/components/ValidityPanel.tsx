import { Wrap } from "@chakra-ui/react";
import * as React from "react";
import { usePreference } from "../hooks/usePreference";
import { useWorkspace } from "../hooks/useWorkspace";
import { sdk } from "../sdk";
import { ValidityCell } from "./ValidityCell";

const ValidityPanel: React.FC = () => {
  const {
    currentSimulatorId: workspaceId,
    playLog,
    pushPlayLog,
  } = useWorkspace();
  const { autoElapse } = usePreference();
  const validityView = Object.values(playLog.validity_view);

  async function handleUse(name: string) {
    if (!workspaceId || !name) return;

    const usePlayLog = await sdk.use(workspaceId, { name });
    const delay = usePlayLog.events
      .filter((evt) => evt.tag === "global.delay")
      .reduce((sum, x) => sum + x.payload.time, 0);

    if (autoElapse) {
      const elapsePlayLog = await sdk.elapse(workspaceId, { time: delay });
      pushPlayLog(usePlayLog, elapsePlayLog);
    } else {
      pushPlayLog(usePlayLog);
      // setElapseAmount(delay);
    }
  }

  return (
    <Wrap>
      {validityView.map((validity) => (
        <ValidityCell
          key={validity.name}
          validity={validity}
          onClick={() => handleUse(validity.name)}
        />
      ))}
    </Wrap>
  );
};

export default ValidityPanel;
