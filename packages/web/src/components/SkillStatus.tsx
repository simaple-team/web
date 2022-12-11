import { Heading, Stack, Text, Button, Card, Box } from "@chakra-ui/react";
import { PlayLog } from "@simaple/sdk";
import React from "react";

export const SkillStatus: React.FC<{
  playLog: PlayLog;
  name: string;
  onUse: (name: string) => () => void;
}> = ({ playLog, name, onUse }) => {
  const running = playLog.running_view[name];
  const validity = playLog.validity_view[name];

  return (
    <Card padding={2} minH={160} justifyContent="space-between">
      <Stack>
        <Heading size="sm">{name}</Heading>
        {validity && <Text>쿨타임: {validity?.time_left}</Text>}
        {running && <Text>지속시간: {Math.max(running?.time_left, 0)}</Text>}
      </Stack>
      <Button isDisabled={!validity?.valid} key={name} onClick={onUse(name)}>
        Use
      </Button>
    </Card>
  );
};
