import {
  Button,
  Checkbox,
  Flex,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { Action, PlayLog } from "@simaple/sdk";
import ReactECharts from "echarts-for-react";
import { useState } from "react";
import { SkillStatus } from "./components/SkillStatus";
import { sdk } from "./sdk";

const Chart: React.FC<{ history: PlayLog[] }> = ({ history }) => {
  const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: "time",
      axisLabel: {
        formatter: (value: number) => {
          return value.toString();
        },
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: history.map((log, index) => {
          const time = new Date(0);
          time.setMilliseconds(log.clock);
          return {
            name: log.action.name,
            value: [
              time.toISOString(),
              history
                .slice(0, index + 1)
                .reduce((sum, log) => sum + log.damage, 0),
            ],
          };
        }),
        type: "line",
        smooth: true,
      },
    ],
    tooltip: {
      trigger: "axis",
      formatter: (params: any[]) => {
        return params
          .map((param) => `${param.name}: ${param.value[1].toFixed(0)}`)
          .join("<br/>");
      },
    },
  };
  return <ReactECharts option={options} />;
};

function App() {
  const [workspaceId, setWorkspaceId] = useState<string>();
  const [elapseAmount, setElapseAmount] = useState(0);
  const [playLog, setPlayLog] = useState<PlayLog>();
  const [history, setHistory] = useState<PlayLog[]>([]);
  const [autoElapse, setAutoElapse] = useState(true);

  function handleCreateWorkspace() {
    sdk
      .createWorkspace({
        action_stat: {},
        groups: ["archmagefb", "common", "adventurer.magician"],
        injected_values: { character_level: 260 },
        skill_levels: {},
        v_improvements: {},
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
      })
      .then((res) => {
        setWorkspaceId(res.id);
        return sdk.playWorkspace(res.id, {
          method: "elapse",
          name: "*",
          payload: 0,
        });
      })
      .then((res) => setPlayLog(res));
  }

  function handleElapse(amount: number) {
    if (!workspaceId) return;

    const action = {
      method: "elapse",
      name: "*",
      payload: amount,
    };
    sdk.playWorkspace(workspaceId, action).then((res) => {
      setPlayLog(res);
      setHistory((prev) => [...prev, res]);
    });
  }

  function handleUse(name: string) {
    return () => {
      if (!workspaceId || !name) return;

      const action = {
        method: "use",
        name: name,
        payload: elapseAmount,
      };
      sdk.playWorkspace(workspaceId, action).then((res) => {
        setPlayLog(res);
        setHistory((prev) => [...prev, res]);
        const delay = res.events
          .filter((evt) => evt.tag === "global.delay")
          .reduce((sum, x) => sum + x.payload.time, 0);
        if (autoElapse) {
          handleElapse(delay);
        } else {
          setElapseAmount(delay);
        }
      });
    };
  }

  return (
    <div>
      <Chart history={history} />
      <Button isDisabled={!!workspaceId} onClick={handleCreateWorkspace}>
        Create Workspace
      </Button>
      {workspaceId}
      {playLog && (
        <Stack>
          <Checkbox
            isChecked={autoElapse}
            onChange={(e) => setAutoElapse(e.currentTarget.checked)}
          >
            Auto Elapse
          </Checkbox>
          {playLog.damage}
          {/* {playLog.events.map((event, i) => (
            <div key={i}>
              {event.method === "elapse"
                ? `${event.name} ${event.method} ${event.payload.time}`
                : `${event.name} ${event.method} ${JSON.stringify(
                    event.payload
                  )}`}
            </div>
          ))} */}
          <Flex>
            <NumberInput
              value={elapseAmount}
              onChange={(_, value) => setElapseAmount(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Button onClick={() => handleElapse(elapseAmount)}>Elapse</Button>
          </Flex>
          <SimpleGrid minChildWidth="240px" spacing={4}>
            {Object.values(playLog.validity_view).map(({ name }) => (
              <SkillStatus
                key={name}
                playLog={playLog}
                name={name}
                onUse={handleUse}
              />
            ))}
          </SimpleGrid>
          {Object.entries(playLog.buff_view).map(([key, value]) => (
            <div key={key}>
              {key}: {value}
            </div>
          ))}
        </Stack>
      )}
    </div>
  );
}

export default App;
