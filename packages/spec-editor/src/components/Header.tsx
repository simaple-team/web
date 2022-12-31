import { Box, HStack } from "@chakra-ui/react";
import * as React from "react";

const Header: React.FC = () => {
  return (
    <Box px={4} borderBottom={1} borderStyle={"solid"} borderColor={"gray.200"}>
      <HStack spacing={10} h={16} alignItems={"center"}>
        <Box fontFamily={"heading"} fontWeight={"bold"}>
          Simaple Editor
        </Box>
      </HStack>
    </Box>
  );
};

export default Header;
