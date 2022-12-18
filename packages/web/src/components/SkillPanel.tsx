import {
  Stack,
  Checkbox,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
} from "@chakra-ui/react";
import * as React from "react";
import { useWorkspace } from "../hooks/useWorkspace";
import { sdk } from "../sdk";
import { SkillStatus } from "./SkillStatus";

const SkillPanel: React.FC = () => {
  const { workspaceId, playLog, pushPlayLog } = useWorkspace();
  const [elapseAmount, setElapseAmount] = React.useState(0);
  const [autoElapse, setAutoElapse] = React.useState(true);

  function handleElapse(time: number) {
    if (!workspaceId) return;

    sdk.elapse(workspaceId, { time }).then((res) => {
      pushPlayLog(res);
    });
  }

  function handleUse(name: string) {
    return () => {
      if (!workspaceId || !name) return;

      sdk.use(workspaceId, { name }).then((res) => {
        pushPlayLog(res);

        const delay = res.events
          .filter((evt) => evt.tag === "global.delay")
          .reduce((sum, x) => sum + x.payload.time, 0);

        if (autoElapse) {
          return handleElapse(delay);
        }

        setElapseAmount(delay);
      });
    };
  }

  return (
    <Stack>
      <Checkbox
        isChecked={autoElapse}
        onChange={(e) => setAutoElapse(e.currentTarget.checked)}
      >
        Auto Elapse
      </Checkbox>
      {playLog.damage}
      <Flex>
        <NumberInput
          value={elapseAmount}
          onChange={(_, value) => setElapseAmount(value)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Button onClick={() => handleElapse(elapseAmount)}>Elapse</Button>
      </Flex>
      <Stack>
        {Object.values(playLog.validity_view).map(({ name }) => (
          <SkillStatus
            key={name}
            playLog={playLog}
            name={name}
            onUse={handleUse}
          />
        ))}
      </Stack>
      {/* {Object.entries(playLog.buff_view).map(([key, value]) => (
          <div key={key}>
            {key}: {value}
          </div>
        ))} */}
    </Stack>
  );
};

export default SkillPanel;
