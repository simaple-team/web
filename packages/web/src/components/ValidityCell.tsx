import { Center, Text } from "@chakra-ui/react";
import { Validity } from "@simaple/sdk";
import React from "react";

export const ValidityCell: React.FC<{
  validity: Validity;
  onClick: () => void;
}> = ({ validity, onClick }) => {
  const ratio =
    validity.cooldown_duration > 0
      ? validity.time_left / validity.cooldown_duration
      : 0;

  return (
    <Center
      as="button"
      cursor="pointer"
      width="48px"
      height="48px"
      position="relative"
      title={validity.name}
      onClick={() => onClick()}
    >
      <img
        width="100%"
        height="100%"
        src={`icons/${validity.id.split("-")[0]}.png`}
      />
      <div style={{ position: "absolute" }}>
        {validity && (
          <Text
            color="yellow.300"
            fontSize="18px"
            fontWeight="semibold"
            textShadow="2px 0 0 black, 0 2px 0 black, -2px 0 0 black, 0 -2px 0 black;"
          >
            {Math.floor(validity.time_left / 1000)}
          </Text>
        )}
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
