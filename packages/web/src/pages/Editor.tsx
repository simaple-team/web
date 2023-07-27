import { Box, Flex, Text } from "@chakra-ui/react";
import * as React from "react";
import Chart from "../components/Chart";
import { Debug } from "../components/Debug";
import RunningPanel from "../components/RunningPanel";
import { TimeControl } from "../components/TimeControl";
import ValidityPanel from "../components/ValidityPanel";
import { usePreference } from "../hooks/usePreference";
import { useWorkspace } from "../hooks/useWorkspace";

const Editor: React.FC = () => {
  const { history, rollback, playLog } = useWorkspace();
  const { chartSetting } = usePreference();

  if (!playLog) {
    return <></>;
  }

  return (
    <>
      <Box paddingX={4} paddingY={2}>
        <TimeControl />
      </Box>
      <Flex flexGrow={1}>
        <Flex
          flexDirection="column"
          flexShrink={0}
          flexBasis={450}
          paddingX={4}
        >
          <Text fontWeight="semibold">스킬</Text>
          <ValidityPanel />
          <Text fontWeight="semibold">버프</Text>
          <RunningPanel />
          <Debug />
        </Flex>
        <Box flexGrow={1}>
          <Chart history={history} rollback={rollback} setting={chartSetting} />
        </Box>
      </Flex>
    </>
  );
};

export default Editor;
