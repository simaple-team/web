import { Box } from "@chakra-ui/react";
import { PlayLog } from "@simaple/sdk";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import * as React from "react";
import EChartsReact from "echarts-for-react";

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
          Math.min(log.clock + log.running_view[name].time_left, 180 * 1000),
        ],
        itemStyle: {
          normal: {
            color: colorlist[i],
          },
        },
      }));
  });
}

function renderItem(params: any, api: any) {
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

const Chart: React.FC<{ history: PlayLog[] }> = ({ history }) => {
  const clock = history[history.length - 1].clock;
  const echartsRef = React.useRef<EChartsReact>(null);

  React.useEffect(() => {
    echartsRef?.current?.getEchartsInstance().dispatchAction({
      type: "dataZoom",
      endValue: clock,
    });
  }, [clock]);

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
        filterMode: "none",
      },
      {
        type: "inside",
        realtime: true,
        xAxisIndex: [0, 1],
        filterMode: "none",
      },
    ],
    xAxis: [
      {
        type: "value",
        gridIndex: 0,
        min: 0,
        max: 180 * 1000,
        axisLabel: {
          formatter: (val: number) => {
            return Math.max(0, val) + " ms";
          },
        },
      },
      {
        type: "value",
        gridIndex: 1,
        min: 0,
        max: 180 * 1000,
        axisLabel: {
          formatter: (val: number) => {
            return Math.max(0, val) + " ms";
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        gridIndex: 0,
      },
      {
        type: "value",
        gridIndex: 0,
      },
      {
        type: "category",
        gridIndex: 1,
        data: Object.keys(history[0].running_view),
      },
    ],
    series: [
      { data: getCumsumData(history), type: "line", smooth: true },
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
        renderItem: renderItem,
        encode: {
          x: [1, 2],
          y: 0,
        },
        type: "custom",
        clip: false,
        xAxisIndex: 1,
        yAxisIndex: 2,
      },
    ],
  };

  return (
    <Box width="100%" height="100%" padding={4}>
      <ReactECharts ref={echartsRef} opts={{ height: 720 }} option={options} />
    </Box>
  );
};

export default Chart;
