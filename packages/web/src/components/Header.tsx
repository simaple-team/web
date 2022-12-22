import {
  Box,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  Select,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { useWorkspace } from "../hooks/useWorkspace";
import CreateSimulatorModal from "./CreateSimulatorModal";

const Header: React.FC = () => {
  const { simulators, currentSimulatorId, loadSimulator } = useWorkspace();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [idToLoad, setIdToLoad] = React.useState<string>();

  function handleLoad() {
    if (!idToLoad) return;
    loadSimulator(idToLoad);
  }

  return (
    <Box px={4} borderBottom={1} borderStyle={"solid"} borderColor={"gray.200"}>
      <HStack spacing={10} h={16} alignItems={"center"}>
        <Box fontFamily={"heading"} fontWeight={"bold"}>
          Simaple Editor
        </Box>
        <Button onClick={onOpen}>New</Button>
        <Modal scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <CreateSimulatorModal onClose={onClose} />
        </Modal>
        <Box>{currentSimulatorId}</Box>
        <Spacer />
        <HStack>
          <Select
            value={idToLoad}
            onChange={(e) => setIdToLoad(e.currentTarget.value)}
          >
            <option value={undefined}>-</option>
            {simulators.map(({ id }) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </Select>
          <Button onClick={handleLoad}>Load</Button>
        </HStack>
      </HStack>
    </Box>
  );
};

export default Header;
