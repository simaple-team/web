import { Box, Button, HStack } from "@chakra-ui/react";
import * as React from "react";
import { useWorkspace } from "../hooks/useWorkspace";

const Header: React.FC = () => {
  const { initialize, workspaceId } = useWorkspace();

  return (
    <Box px={4} borderBottom={1} borderStyle={"solid"} borderColor={"gray.200"}>
      <HStack spacing={10} h={16} alignItems={"center"}>
        <Box fontFamily={"heading"} fontWeight={"bold"}>
          Simaple Editor
        </Box>
        <Button onClick={initialize} isDisabled={!!workspaceId}>
          Initalize
        </Button>
        <Box>{workspaceId}</Box>
      </HStack>
    </Box>
  );
};

export default Header;
