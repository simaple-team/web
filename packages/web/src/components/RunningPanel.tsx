import { Wrap } from "@chakra-ui/react";
import * as React from "react";
import { useWorkspace } from "../hooks/useWorkspace";
import { RunningCell } from "./RunningCell";

const RunningPanel: React.FC = () => {
  const { currentSimulatorId: workspaceId, playLog } = useWorkspace();
  const runningView = Object.values(playLog.running_view);

  return (
    <Wrap>
      {runningView
        .filter((running) => running.time_left > 0)
        .map((running) => (
          <RunningCell key={running.name} running={running} />
        ))}
    </Wrap>
  );
};

export default RunningPanel;
