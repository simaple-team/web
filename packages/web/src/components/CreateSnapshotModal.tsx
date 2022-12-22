import {
  Button,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
} from "@chakra-ui/react";
import * as React from "react";
import { useWorkspace } from "../hooks/useWorkspace";

const CreateSnapshotModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { createSnapshot } = useWorkspace();
  const [name, setName] = React.useState<string>("Snapshot");

  async function handleSubmit() {
    createSnapshot(name);
    onClose();
  }

  return (
    <ModalContent>
      <ModalHeader>Create Snapshot</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack>
          <FormLabel>Name</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </Stack>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
          Create
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default CreateSnapshotModal;
