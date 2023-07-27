import { Center, Text } from "@chakra-ui/react";
import { PlayLog } from "@simaple/sdk";
import React from "react";

export const SkillStatus: React.FC<{
  playLog: PlayLog;
  name: string;
  onUse: (name: string) => void;
}> = ({ playLog, name, onUse }) => {
  const validity = playLog.validity_view[name];
  const ratio =
    validity.cooldown_duration > 0
      ? Math.min(
          validity.time_left / Math.min(validity.cooldown_duration, 60 * 1000),
          1
        )
      : 0;

  return (
    <Center
      as="button"
      cursor="pointer"
      width="48px"
      height="48px"
      position="relative"
      onClick={() => onUse(name)}
    >
      <img src="icon.png" />
      <div style={{ position: "absolute" }}>
        {validity && <Text color="black">{validity.time_left}</Text>}
      </div>
      <div
        style={{
          position: "absolute",
          top: `${(1 - ratio) * 100}%`,
          bottom: 0,
          right: 0,
          left: 0,
          background: "rgba(0,0,0,0.3)",
        }}
      ></div>
    </Center>
  );
};
