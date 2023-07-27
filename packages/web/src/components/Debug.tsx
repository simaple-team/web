import { Box } from "@chakra-ui/react";
import { useWorkspace } from "../hooks/useWorkspace";

export function Debug() {
  const { playLog } = useWorkspace();

  return (
    <Box>
      {playLog.action.method} {playLog.action.name}{" "}
      {playLog.damage.toLocaleString()}
    </Box>
  );
}
