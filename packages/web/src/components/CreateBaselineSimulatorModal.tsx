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
import { SimulationSetting } from "@simaple/sdk";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { useWorkspace } from "../hooks/useWorkspace";
import RfcNumberInput from "./RfcNumberInput";

const CreateBaselineSimulatorModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { createBaselineSimulator } = useWorkspace();
  const { register, control, getValues } = useForm<SimulationSetting>({
    defaultValues: {
      tier: "Legendary",
      jobtype: "archmagefb",
      job_category: 1,
      level: 265,
      use_doping: true,
      passive_skill_level: 0,
      combat_orders_level: 1,
      union_block_count: 37,
      link_count: 12 + 1,
      armor: 300,
      mob_level: 265,
      force_advantage: 1.0,
      trait_level: 100,
      v_skill_level: 30,
      v_improvements_level: 60,
      weapon_attack_power: 0,
      weapon_pure_attack_power: 0,
    },
  });
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmit() {
    setIsLoading(true);
    await createBaselineSimulator({ simulation_setting: getValues() });
    onClose();
  }

  return (
    <ModalContent>
      <ModalHeader>Create Simulator</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack>
          <Select {...register("jobtype")}>
            <option value="archmagefb">불독</option>
            <option value="archmagetc">썬콜</option>
            <option value="bishop">비숍</option>
            <option value="mechanic">메카닉</option>
            <option value="adele">아델</option>
            <option value="dualblade">듀블</option>
            <option value="soulmaster">소마</option>
          </Select>
          <Select {...register("job_category")}>
            <option value={0}>전사</option>
            <option value={1}>마법사</option>
            <option value={2}>궁수</option>
            <option value={3}>도적</option>
            <option value={4}>해적</option>
          </Select>
          <SimpleGrid columns={2} spacingX={10}>
            <FormLabel>레벨</FormLabel>
            <Controller
              name="level"
              control={control}
              render={({ field }) => <RfcNumberInput field={field} />}
            />
            <FormLabel>몹 레벨</FormLabel>
            <Controller
              name="mob_level"
              control={control}
              render={({ field }) => <RfcNumberInput field={field} />}
            />
            <FormLabel>몹 방어력</FormLabel>
            <Controller
              name="armor"
              control={control}
              render={({ field }) => <RfcNumberInput field={field} />}
            />
            <FormLabel>패시브 스킬 레벨</FormLabel>
            <Controller
              name="passive_skill_level"
              control={control}
              render={({ field }) => <RfcNumberInput field={field} />}
            />
            <FormLabel>컴뱃 오더스 수치</FormLabel>
            <Controller
              name="combat_orders_level"
              control={control}
              render={({ field }) => <RfcNumberInput field={field} />}
            />
            <FormLabel>유니온 배치 칸</FormLabel>
            <Controller
              name="union_block_count"
              control={control}
              render={({ field }) => <RfcNumberInput field={field} />}
            />
            <FormLabel>무기 공격력</FormLabel>
            <Controller
              name="weapon_attack_power"
              control={control}
              render={({ field }) => <RfcNumberInput field={field} />}
            />
            <FormLabel>무기 순수 공격력</FormLabel>
            <Controller
              name="weapon_pure_attack_power"
              control={control}
              render={({ field }) => <RfcNumberInput field={field} />}
            />
          </SimpleGrid>
        </Stack>
      </ModalBody>

      <ModalFooter>
        <Button isLoading={isLoading} colorScheme="blue" mr={3} onClick={handleSubmit}>
          Create
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default CreateBaselineSimulatorModal;
