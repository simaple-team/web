import { Box, Button, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlayLog } from "@simaple/sdk";
import React from "react";

export const SkillStatus: React.FC<{
  playLog: PlayLog;
  name: string;
  onUse: (name: string) => void;
}> = ({ playLog, name, onUse }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: name,
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const validity = playLog.validity_view[name];
  const running = playLog.running_view[name];

  return (
    <Box ref={setNodeRef} style={style}>
      <Box position="relative">
        <Flex
          alignItems="center"
          borderColor="gray.200"
          borderWidth={1}
          paddingLeft={2}
        >
          <Heading flexGrow={1} {...attributes} {...listeners} size="sm">
            {name}
          </Heading>
          <HStack>
            {validity && <Text>쿨타임: {validity?.time_left}</Text>}
            <Button
              isDisabled={!validity?.valid}
              key={name}
              onClick={() => onUse(name)}
            >
              Use
            </Button>
          </HStack>
        </Flex>
        {running && running.time_left > 0 && (
          <Box
            zIndex={-1}
            position="absolute"
            left={0}
            right={`${100 - (running.time_left / running.duration) * 100}%`}
            top={0}
            bottom={0}
            background="blue.100"
          />
        )}
        {validity.time_left > 0 && (
          <Box
            zIndex={-2}
            position="absolute"
            left={0}
            right={`${100 - (validity.time_left / validity.cooldown) * 100}%`}
            top={0}
            bottom={0}
            background="gray.100"
          />
        )}
      </Box>
    </Box>
  );
};
