import { Button, Center, Flex, Heading, HStack, Text } from "@chakra-ui/react";
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

  return (
    <Flex
      ref={setNodeRef}
      style={style}
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
  );
};
