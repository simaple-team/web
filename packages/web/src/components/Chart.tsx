import { Box } from "@chakra-ui/react";
import { PlayLog } from "@simaple/sdk";
import * as echarts from "echarts";
import {
  default as EChartsReact,
  default as ReactECharts,
} from "echarts-for-react";
import * as React from "react";

const MAX_CLOCK = 180 * 1000;

const colorlist = [
  "#a6cee3",
  "#1f78b4",
  "#b2df8a",
  "#33a02c",
  "#fb9a99",
  "#e31a1c",
  "#fdbf6f",
  "#ff7f00",
  "#cab2d6",
  "#6a3d9a",
  "#ffff99",
  "#b15928",
];

function getCumsumData(history: PlayLog[]) {
  return history.map((log, index) => {
    return {
      name: log.action.name,
      value: [
        log.clock,
        history.slice(0, index + 1).reduce((sum, log) => sum + log.damage, 0),
      ],
    };
  });
}

function getBarData(history: PlayLog[]) {
  const chunks: PlayLog[][] = [];

  const timeSlice = 5000;
  for (const playLog of history) {
    while (playLog.clock >= timeSlice * chunks.length) {
      chunks.push([]);
    }
    chunks[chunks.length - 1].push(playLog);
  }

  return chunks.map((chunk, index) => {
    return {
      name: `${index * timeSlice}-${(index + 1) * timeSlice}`,
      value: [
        (index + 0.5) * timeSlice,
        chunk.reduce((sum, x) => sum + x.damage, 0),
      ],
    };
  });
}

function getUptimeData(history: PlayLog[]) {
  const names = Object.keys(history[0].running_view);
  return names.flatMap((name, i) => {
    return history
      .filter(
        (log) =>
          log.action.name === name && log.running_view[name].time_left > 0
      )
      .map((log) => ({
        name,
        value: [
          i,
          log.clock,
          Math.min(log.clock + log.running_view[name].time_left, MAX_CLOCK),
        ],
        itemStyle: {
          normal: {
            color: colorlist[i],
          },
        },
      }));
  });
}

function getTotalData(history: PlayLog[]) {
  const record = history
    .flatMap((history) => history.damages)
    .reduce((obj, [name, damage]) => {
      if (!obj[name]) {
        obj[name] = 0;
      }
      obj[name] += damage;
      return obj;
    }, {} as Record<string, number>);

  return Object.entries(record)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value);
}

function renderUptime(params: any, api: any) {
  const categoryIndex = api.value(0);
  const start = api.coord([api.value(1), categoryIndex]);
  const end = api.coord([api.value(2), categoryIndex]);
  const height = api.size([0, 1])[1] * 0.6;

  const rectShape = echarts.graphic.clipRectByRect(
    {
      x: start[0],
      y: start[1] - height / 2,
      width: end[0] - start[0],
      height: height,
    },
    {
      x: params.coordSys.x,
      y: params.coordSys.y,
      width: params.coordSys.width,
      height: params.coordSys.height,
    }
  );
  return (
    rectShape && {
      type: "rect",
      transition: ["shape"],
      shape: rectShape,
      style: api.style(),
    }
  );
}

function damageFormatter(value: number) {
  return (value / 100000000).toFixed(2) + "억";
}

function clockFormatter(value: number) {
  return value + "ms";
}

const ShareChart: React.FC<{ history: PlayLog[] }> = ({ history }) => {
  const echartsRef = React.useRef<EChartsReact>(null);

  const options = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    series: [
      {
        name: "Share",
        type: "pie",
        radius: [20, 100],
        center: ["50%", "50%"],
        roseType: "radius",
        label: {
          formatter: "{b} ({d}%)",
        },
        itemStyle: {
          borderRadius: 5,
        },
        emphasis: {
          label: {
            show: true,
          },
        },
        data: getTotalData(history),
      },
    ],
  };

  return (
    <ReactECharts
      ref={echartsRef}
      style={{ height: 200 }}
      option={options}
    ></ReactECharts>
  );
};

const Chart: React.FC<{
  history: PlayLog[];
  rollback: (index: number) => void;
}> = ({ history, rollback }) => {
  const clock = history[history.length - 1].clock;
  const echartsRef = React.useRef<EChartsReact>(null);

  React.useEffect(() => {
    echartsRef?.current?.getEchartsInstance().dispatchAction({
      type: "dataZoom",
      endValue: Math.min(clock + 10000, MAX_CLOCK),
    });
  }, [clock]);

  const markLine = {
    silent: true,
    animation: true,
    symbol: "none",
    label: {
      show: false,
    },
    lineStyle: {
      type: "solid",
      color: "#bcbcbc",
    },
    data: [
      {
        xAxis: clock,
      },
    ],
  };

  const options = {
    grid: [{ bottom: "55%" }, { top: "55%" }],
    axisPointer: {
      link: [
        {
          xAxisIndex: "all",
        },
      ],
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        animation: false,
      },
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        restore: {},
        saveAsImage: {},
      },
    },
    dataZoom: [
      {
        show: true,
        realtime: true,
        xAxisIndex: [0, 1],
        filterMode: "weakFilter",
      },
      {
        type: "inside",
        realtime: true,
        xAxisIndex: [0, 1],
        filterMode: "weakFilter",
      },
    ],
    xAxis: [
      {
        type: "value",
        gridIndex: 0,
        min: 0,
        max: MAX_CLOCK,
        axisLabel: {
          formatter: clockFormatter,
        },
      },
      {
        type: "value",
        gridIndex: 1,
        min: 0,
        max: MAX_CLOCK,
        axisLabel: {
          formatter: clockFormatter,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        gridIndex: 0,
        axisLabel: {
          formatter: damageFormatter,
        },
      },
      {
        type: "value",
        gridIndex: 0,
        axisLabel: {
          formatter: damageFormatter,
        },
      },
      {
        type: "category",
        gridIndex: 1,
        data: Object.keys(history[0].running_view),
      },
    ],
    series: [
      {
        data: getCumsumData(history),
        type: "line",
        smooth: true,
        animationDuration: 100,
        showSymbol: false,
        markLine: markLine,
      },
      {
        data: getBarData(history),
        type: "bar",
        barMinWidth: 2,
        barMaxWidth: 50,
        clip: true,
        yAxisIndex: 1,
      },
      {
        data: getUptimeData(history),
        renderItem: renderUptime,
        encode: {
          x: [1, 2],
          y: 0,
        },
        type: "custom",
        xAxisIndex: 1,
        yAxisIndex: 2,
        markLine: markLine,
      },
    ],
  };

  const onEvents = React.useMemo(
    () => ({
      click: (params: any) => {
        if (params.componentIndex !== 0) return;
        rollback(params.dataIndex);
      },
    }),
    [rollback]
  );

  return (
    <Box width="100%" height="100%" padding={4}>
      <ReactECharts
        ref={echartsRef}
        onEvents={onEvents}
        style={{ height: 720 }}
        option={options}
      />
      <ShareChart history={history} />
    </Box>
  );
};

export default Chart;
