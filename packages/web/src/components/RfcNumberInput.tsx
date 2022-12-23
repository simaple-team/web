import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { Noop, RefCallBack } from "react-hook-form";

const RfcNumberInput: React.FC<{
  field: {
    onChange: (...event: any[]) => void;
    onBlur: Noop;
    value: number | undefined;
    name: string;
    ref: RefCallBack;
  };
}> = ({ field: { name, onBlur, onChange, ref, value } }) => {
  return (
    <NumberInput
      size="sm"
      name={name}
      onBlur={onBlur}
      onChange={(_, value) => onChange(value)}
      ref={ref}
      value={value}
    >
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};

export default RfcNumberInput;
