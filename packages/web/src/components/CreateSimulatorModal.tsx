import {
  Button,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { MinimalSimulatorConfiguration } from "@simaple/sdk";
import * as React from "react";
import { Fragment } from "react";
import { Controller, useForm } from "react-hook-form";
import { useWorkspace } from "../hooks/useWorkspace";
import RfcNumberInput from "./RfcNumberInput";

const STAT_KEYS = [
  ["character_stat.STR", "STR"],
  ["character_stat.LUK", "LUK"],
  ["character_stat.INT", "INT"],
  ["character_stat.DEX", "DEX"],
  ["character_stat.STR_multiplier", "STR%"],
  ["character_stat.LUK_multiplier", "LUK%"],
  ["character_stat.INT_multiplier", "INT%"],
  ["character_stat.DEX_multiplier", "DEX%"],
  ["character_stat.STR_static", "고정 STR"],
  ["character_stat.LUK_static", "고정 LUK"],
  ["character_stat.INT_static", "고정 INT"],
  ["character_stat.DEX_static", "고정 DEX"],
  ["character_stat.attack_power", "공격력"],
  ["character_stat.magic_attack", "마력"],
  ["character_stat.attack_power_multiplier", "공격력%"],
  ["character_stat.magic_attack_multiplier", "마력%"],
  ["character_stat.critical_rate", "크확%"],
  ["character_stat.critical_damage", "크뎀%"],
  ["character_stat.boss_damage_multiplier", "보공%"],
  ["character_stat.damage_multiplier", "데미지%"],
  ["character_stat.final_damage_multiplier", "최종뎀%"],
  ["character_stat.ignored_defence", "방무%"],
  ["character_stat.MHP", "MaxHP"],
  ["character_stat.MMP", "MaxMP"],
  ["character_stat.MHP_multiplier", "MaxHP%"],
  ["character_stat.MMP_multiplier", "MaxMP%"],
] as const;

const CreateSimulatorModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { createSimulator } = useWorkspace();
  const { register, control, getValues } =
    useForm<MinimalSimulatorConfiguration>({
      defaultValues: {
        action_stat: {},
        job: "archmagefb",
        character_level: 260,
        weapon_attack_power: 295,
        character_stat: {
          STR: 907.0,
          LUK: 2224.0,
          INT: 4932.0,
          DEX: 832.0,
          STR_multiplier: 86.0,
          LUK_multiplier: 86.0,
          INT_multiplier: 573.0,
          DEX_multiplier: 86.0,
          STR_static: 420.0,
          LUK_static: 500.0,
          INT_static: 15460.0,
          DEX_static: 200.0,
          attack_power: 1200.0,
          magic_attack: 2075.0,
          attack_power_multiplier: 0.0,
          magic_attack_multiplier: 81.0,
          critical_rate: 100.0,
          critical_damage: 83.0,
          boss_damage_multiplier: 144.0,
          damage_multiplier: 167.7,
          final_damage_multiplier: 110.0,
          ignored_defence: 94.72006176400876,
          MHP: 23105.0,
          MMP: 12705.0,
          MHP_multiplier: 0.0,
          MMP_multiplier: 0.0,
        },
      },
    });

  async function handleSubmit() {
    createSimulator(getValues());
    onClose();
  }

  return (
    <ModalContent>
      <ModalHeader>Create Simulator</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack>
          <Select {...register("job")}>
            <option value="archmagefb">archmagefb</option>
            <option value="archmagetc">archmagetc</option>
            <option value="bishop">bishop</option>
            <option value="mechanic">mechanic</option>
            <option value="adele">adele</option>
          </Select>
          <SimpleGrid columns={2} spacingX={10}>
            <FormLabel>Level</FormLabel>
            <Controller
              name="character_level"
              control={control}
              render={({ field }) => <RfcNumberInput field={field} />}
            />
            <FormLabel>Weapon Att</FormLabel>
            <Controller
              name="weapon_attack_power"
              control={control}
              render={({ field }) => <RfcNumberInput field={field} />}
            />
            {STAT_KEYS.map(([key, name]) => (
              <Fragment key={key}>
                <FormLabel>{name}</FormLabel>
                <Controller
                  name={key}
                  control={control}
                  render={({ field }) => <RfcNumberInput field={field} />}
                />
              </Fragment>
            ))}
          </SimpleGrid>
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

export default CreateSimulatorModal;
