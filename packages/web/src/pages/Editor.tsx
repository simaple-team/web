import { Box, Flex } from "@chakra-ui/react";
import * as React from "react";
import Chart from "../components/Chart";
import SkillPanel from "../components/SkillPanel";
import { useWorkspace } from "../hooks/useWorkspace";

const Editor: React.FC = () => {
  const { history, rollback, playLog, preferences } = useWorkspace();

  if (!playLog) {
    return <></>;
  }

  return (
    <Flex flexGrow={1}>
      <Flex flexDirection="column" flexShrink={0} flexBasis={450} padding={4}>
        <SkillPanel />
      </Flex>
      <Box flexGrow={1}>
        <Chart
          history={history}
          rollback={rollback}
          setting={preferences.chart}
        />
      </Box>
    </Flex>
  );
};

export default Editor;
