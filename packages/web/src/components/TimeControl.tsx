import {
  Button,
  Checkbox,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import React from "react";
import { useWorkspace } from "../hooks/useWorkspace";
import { sdk } from "../sdk";

export function TimeControl() {
  const { currentSimulatorId: workspaceId, undo, pushPlayLog } = useWorkspace();
  const [elapseAmount, setElapseAmount] = React.useState(0);
  const [autoElapse, setAutoElapse] = React.useState(true);

  function handleElapse(time: number) {
    if (!workspaceId) return;

    sdk.elapse(workspaceId, { time }).then((res) => {
      pushPlayLog(res);
    });
  }

  function handleUndo() {
    undo();
  }

  return (
    <Flex alignItems="center" gap={2}>
      <Checkbox
        isChecked={autoElapse}
        onChange={(e) => setAutoElapse(e.currentTarget.checked)}
      >
        Auto Elapse
      </Checkbox>
      <NumberInput
        maxW={160}
        flexGrow={1}
        value={elapseAmount}
        onChange={(_, value) =>
          setElapseAmount(Number.isNaN(value) ? 0 : value)
        }
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Button onClick={() => handleElapse(elapseAmount)}>Elapse</Button>
      <Button onClick={handleUndo}>Undo</Button>
    </Flex>
  );
}
