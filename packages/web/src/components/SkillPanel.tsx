import {
  Box,
  Button,
  Checkbox,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from "@chakra-ui/react";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import * as React from "react";
import { useWorkspace } from "../hooks/useWorkspace";
import { sdk } from "../sdk";
import { SkillStatus } from "./SkillStatus";

const SkillPanel: React.FC = () => {
  const {
    workspaceId,
    playLog,
    skillNames,
    undo,
    pushPlayLog,
    reorderSkillNames,
  } = useWorkspace();
  const [elapseAmount, setElapseAmount] = React.useState(0);
  const [autoElapse, setAutoElapse] = React.useState(true);

  function handleElapse(time: number) {
    if (!workspaceId) return;

    sdk.elapse(workspaceId, { time }).then((res) => {
      pushPlayLog(res);
    });
  }

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
      setElapseAmount(delay);
    }
  }

  function handleDragEnd(result: DragEndEvent) {
    if (!result.over) {
      return;
    }

    reorderSkillNames(
      result.active.data.current!.sortable.index,
      result.over.data.current!.sortable.index
    );
  }

  function handleUndo() {
    undo();
  }

  return (
    <Stack>
      <Checkbox
        isChecked={autoElapse}
        onChange={(e) => setAutoElapse(e.currentTarget.checked)}
      >
        Auto Elapse
      </Checkbox>
      <Box>
        {playLog.action.method} {playLog.action.name}{" "}
        {playLog.damage.toLocaleString()}
      </Box>
      <Button onClick={handleUndo}>Undo</Button>
      <Flex gap={2}>
        <NumberInput
          flexGrow={1}
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
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <Stack>
          <SortableContext
            items={skillNames}
            strategy={verticalListSortingStrategy}
          >
            {skillNames.map((name) => (
              <SkillStatus
                key={name}
                playLog={playLog}
                name={name}
                onUse={handleUse}
              />
            ))}
          </SortableContext>
        </Stack>
      </DndContext>

      {/* {Object.entries(playLog.buff_view).map(([key, value]) => (
          <div key={key}>
            {key}: {value}
          </div>
        ))} */}
    </Stack>
  );
};

export default SkillPanel;
