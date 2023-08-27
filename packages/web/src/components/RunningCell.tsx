import { Center, Text } from "@chakra-ui/react";
import { Running } from "@simaple/sdk";
import React from "react";

export const RunningCell: React.FC<{
  running: Running;
}> = ({ running }) => {
  const ratio =
    running.lasting_duration > 0
      ? running.time_left / running.lasting_duration
      : 0;

  const timeToRender =
    running.time_left < 9999999
      ? Math.floor(running.time_left / 1000)
      : undefined;

  return (
    <Center
      as="button"
      width="48px"
      height="48px"
      position="relative"
      title={running.name}
    >
      <img
        width="100%"
        height="100%"
        src={`icons/${running.id.split("-")[0]}.png`}
      />
      <div style={{ position: "absolute" }}>
        {running && (
          <Text
            color="yellow.300"
            fontSize="18px"
            fontWeight="semibold"
            textShadow="2px 0 0 black, 0 2px 0 black, -2px 0 0 black, 0 -2px 0 black;"
          >
            {timeToRender}
          </Text>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          top: `${ratio * 100}%`,
          bottom: 0,
          right: 0,
          left: 0,
          background: "rgba(0,0,0,0.3)",
        }}
      ></div>
    </Center>
  );
};
