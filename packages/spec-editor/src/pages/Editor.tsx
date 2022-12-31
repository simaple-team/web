import { Flex, Input, Select, Stack, Text, Textarea } from "@chakra-ui/react";
import * as React from "react";
import YAML from "yaml";
import { sdk } from "../sdk";

interface SpecProperty {
  title: string;
  type: "number" | "string" | "boolean" | "object";
  default?: unknown;
}

interface PropertyRef {
  $ref: string;
}

interface SpecDefinition {
  title: string;
  type: "number" | "string" | "boolean" | "object";
  properties: Record<string, SpecProperty>;
}

interface ComponentSpec {
  definitions: Record<string, SpecDefinition>;
  properties: Record<string, SpecProperty | PropertyRef>;
  required: string[];
}

function useComponentSpecs() {
  const [componentSpecs, setComponentSpecs] = React.useState<
    Record<string, ComponentSpec>
  >({});
  const names = React.useMemo(
    () => Object.keys(componentSpecs),
    [componentSpecs]
  );
  const [selectedName, setSelectedName] = React.useState<string>();

  const selectedComponentSpec = React.useMemo(
    () => (selectedName ? componentSpecs[selectedName] : undefined),
    [componentSpecs, selectedName]
  );

  React.useEffect(() => {
    sdk
      .getComponentSpecs()
      .then((res) => setComponentSpecs(res as Record<string, ComponentSpec>));
  }, []);

  return {
    componentSpecs,
    names,
    selectedName,
    selectedComponentSpec,
    setSelectedName,
  };
}

function filterData(data: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== "")
  );
}

function handleNumberLike(value: string) {
  const numberValue = Number(value);
  if (isNaN(numberValue) || value === "") {
    return value;
  }
  return numberValue;
}

const PropertyControl: React.FC<{
  spec: ComponentSpec;
  name: string;
  value: string;
  onChange: (value: string | number) => void;
}> = ({ spec, name, value, onChange }) => {
  const resolvedProperty = (prop: SpecProperty | PropertyRef) => {
    if ("$ref" in prop) {
      return spec.definitions[prop.$ref.split("definitions/")[1]];
    }
    return prop;
  };
  const specProp = resolvedProperty(spec.properties[name]);

  return (
    <Stack>
      <Text fontSize="sm">
        {specProp.title} ({specProp.type})
      </Text>
      <Input
        size="sm"
        value={value ?? ""}
        onChange={(e) => onChange(handleNumberLike(e.currentTarget.value))}
      />
    </Stack>
  );
};

const Editor: React.FC = () => {
  const { names, selectedName, selectedComponentSpec, setSelectedName } =
    useComponentSpecs();

  const [group, setGroup] = React.useState<string>("");
  const [data, setData] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    if (!selectedComponentSpec) return;
    setData(
      Object.fromEntries(
        Object.keys(selectedComponentSpec?.properties).map((key) => [key, ""])
      )
    );
  }, [selectedComponentSpec]);

  function handleYamlChange(str: string) {
    try {
      const yaml = YAML.parse(str);
      setGroup(yaml.metadata.label.group);
      setData(yaml.data);
    } catch {}
  }

  return (
    <Flex flexGrow={1} flexDirection="row">
      <Flex padding={2}>
        <Stack>
          <Select
            size="sm"
            value={selectedName}
            onChange={(e) => setSelectedName(e.currentTarget.value)}
          >
            <option value={undefined}>-</option>
            {names.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
          <Text fontSize="sm">Group</Text>
          <Input
            size="sm"
            value={group}
            onChange={(e) => setGroup(e.currentTarget.value)}
          />
          {selectedComponentSpec &&
            Object.keys(selectedComponentSpec.properties).map((key) => (
              <PropertyControl
                key={key}
                spec={selectedComponentSpec}
                name={key}
                value={data[key]}
                onChange={(value) =>
                  setData((form) => ({ ...form, [key]: value }))
                }
              />
            ))}
        </Stack>
      </Flex>
      <Flex flexBasis={600} flexDirection="column">
        <Textarea
          value={YAML.stringify(
            {
              kind: "Component",
              version: `simaple.io/${selectedName}`,
              metadata: { label: { name: data.name, group } },
              data: filterData(data),
            },
            null,
            2
          )}
          onChange={(e) => handleYamlChange(e.currentTarget.value)}
          flexGrow={1}
        ></Textarea>
      </Flex>
    </Flex>
  );
};

export default Editor;
