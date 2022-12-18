import { Box, Button, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { PlayLog } from "@simaple/sdk";
import React from "react";

export const SkillStatus: React.FC<{
  playLog: PlayLog;
  name: string;
  onUse: (name: string) => () => void;
}> = ({ playLog, name, onUse }) => {
  const validity = playLog.validity_view[name];

  return (
    <Flex
      padding={2}
      justifyContent="space-between"
      alignItems="center"
      borderColor="gray.200"
      borderWidth={1}
    >
      <Heading size="sm">{name}</Heading>
      <HStack>
        {validity && <Text>쿨타임: {validity?.time_left}</Text>}
        <Button isDisabled={!validity?.valid} key={name} onClick={onUse(name)}>
          Use
        </Button>
      </HStack>
    </Flex>
  );
};
