import {
  Button,
  Checkbox,
  CheckboxGroup,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  FormLabel,
  ModalHeader,
  Stack,
} from "@chakra-ui/react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { ChartSetting } from "../hooks/preferences.interface";
import { useWorkspace } from "../hooks/useWorkspace";
import RfcNumberInput from "./RfcNumberInput";

const ChartSettingModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { preferences, history, setChartSetting } = useWorkspace();
  const { control, getValues } = useForm<ChartSetting>({
    defaultValues: preferences.chart,
  });

  const skillNames = React.useMemo(
    () =>
      Object.keys(history[0].running_view).filter(
        (name) => history[0].running_view[name].stack != null
      ),
    [history[0]]
  );

  async function handleSubmit() {
    setChartSetting(getValues());
    onClose();
  }

  return (
    <ModalContent>
      <ModalHeader>Chart Settings</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack>
          <Heading size="sm">Stack Group 1</Heading>
          <FormLabel>Max</FormLabel>
          <Controller
            name="stackAxis1.max"
            control={control}
            render={({ field }) => <RfcNumberInput field={field} />}
          />
          <FormLabel>Skills</FormLabel>
          <Controller
            name="stackAxis1.skillNames"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CheckboxGroup value={value} onChange={onChange}>
                <Stack spacing={[1, 5]} direction={["column", "row"]}>
                  {skillNames.map((skillName) => (
                    <Checkbox key={skillName} value={skillName}>
                      {skillName}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            )}
          />
        </Stack>
        <Stack>
          <Heading size="sm">Stack Group 2</Heading>
          <FormLabel>Max</FormLabel>
          <Controller
            name="stackAxis2.max"
            control={control}
            render={({ field }) => <RfcNumberInput field={field} />}
          />
          <FormLabel>Skills</FormLabel>
          <Controller
            name="stackAxis2.skillNames"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CheckboxGroup value={value} onChange={onChange}>
                <Stack spacing={[1, 5]} direction={["column", "row"]}>
                  {skillNames.map((skillName) => (
                    <Checkbox key={skillName} value={skillName}>
                      {skillName}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            )}
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

export default ChartSettingModal;
