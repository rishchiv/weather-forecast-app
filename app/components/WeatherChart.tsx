"use client";

import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  ResponsiveContainer,
} from "recharts";

import { WeatherData } from "../types/WeatherData";

interface WeatherChartProps {
  data: WeatherData;
}

function WeatherChart({ data }: WeatherChartProps) {
  const [chartData, setChartData] = useState<
    { date: string; minTemp: number; maxTemp: number }[]
  >([]);

  useEffect(() => {
    if (data) {
      const formattedData = data.daily.time.map(
        (time: string, index: number) => ({
          date: time,
          minTemp: Math.round(data.daily.temperature2mMin[index] * 10) / 10,
          maxTemp: Math.round(data.daily.temperature2mMax[index] * 10) / 10,
        })
      );

      setChartData(formattedData);
    }
  }, [data]);

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-center mb-4">
        Temperature Over Time
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} width={800} height={500}>
          <XAxis
            dataKey="date"
            tickFormatter={(date) => dayjs(date).format("D MMM")}
          />
          <YAxis tickFormatter={(temperature) => `${temperature}°C`} />
          <Tooltip
            labelFormatter={(label) => dayjs(label).format("D MMM YYYY")}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="maxTemp"
            stroke="red"
            name="Max Temperature"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="minTemp"
            stroke="blue"
            name="Min Temperature"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export { WeatherChart };
