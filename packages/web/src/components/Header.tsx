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
import { useHotkeys } from "react-hotkeys-hook";
import { useWorkspace } from "../hooks/useWorkspace";
import ChartSettingModal from "./ChartSettingModal";
import CreateSimulatorModal from "./CreateBaselineSimulatorModal";
import CreateSnapshotModal from "./CreateSnapshotModal";

const Header: React.FC = () => {
  const { snapshots, currentSimulatorId, loadFromSnapshot } = useWorkspace();
  const simulatorDisclosure = useDisclosure();
  const snapshotDisclosure = useDisclosure();
  const preferencesDisclosure = useDisclosure();
  const [idToLoad, setIdToLoad] = React.useState<string>();

  useHotkeys(
    ["shift+s"],
    () => {
      if (!currentSimulatorId) return;
      snapshotDisclosure.onOpen();
    },
    { preventDefault: true }
  );

  function handleLoad() {
    if (!idToLoad) return;
    loadFromSnapshot(idToLoad);
  }

  return (
    <Box px={4} borderBottom={1} borderStyle={"solid"} borderColor={"gray.200"}>
      <HStack spacing={10} h={16} alignItems={"center"}>
        <Box fontFamily={"heading"} fontWeight={"bold"}>
          Simaple Editor
        </Box>

        <Button onClick={simulatorDisclosure.onOpen}>New</Button>
        <Modal
          scrollBehavior="inside"
          isOpen={simulatorDisclosure.isOpen}
          onClose={simulatorDisclosure.onClose}
        >
          <ModalOverlay />
          <CreateSimulatorModal onClose={simulatorDisclosure.onClose} />
        </Modal>

        <Box>{currentSimulatorId}</Box>
        <Spacer />

        <Button onClick={preferencesDisclosure.onOpen}>Settings</Button>
        <Modal
          scrollBehavior="inside"
          isOpen={preferencesDisclosure.isOpen}
          onClose={preferencesDisclosure.onClose}
        >
          <ModalOverlay />
          <ChartSettingModal onClose={preferencesDisclosure.onClose} />
        </Modal>

        <HStack>
          <Button onClick={snapshotDisclosure.onOpen}>Save</Button>
          <Modal
            scrollBehavior="inside"
            isOpen={snapshotDisclosure.isOpen}
            onClose={snapshotDisclosure.onClose}
          >
            <ModalOverlay />
            <CreateSnapshotModal onClose={snapshotDisclosure.onClose} />
          </Modal>

          <Select
            w={200}
            value={idToLoad}
            onChange={(e) => setIdToLoad(e.currentTarget.value)}
          >
            <option value={undefined}>-</option>
            {snapshots.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
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
