"use client";

import dayjs from "dayjs";
import Image from "next/image";
import { Datepicker } from "flowbite-react";
import { useEffect, useState } from "react";

import { WeatherChart } from "./components";
import { WeatherData } from "./types/WeatherData";

const DATE_FORMAT = "YYYY-MM-DD";

export default function Home() {
  const [loading, setLoading] = useState(true);
  // Ensure startDate and endDate have a default value to avoid uncontrolled behavior
  const [startDate, setStartDate] = useState<Date>(() => {
    const storedStartDate = localStorage.getItem("startDate");
    return storedStartDate
      ? new Date(storedStartDate)
      : new Date(dayjs().subtract(30, "d").format());
  });
  const [endDate, setEndDate] = useState<Date>(() => {
    const storedEndDate = localStorage.getItem("endDate");
    return storedEndDate ? new Date(storedEndDate) : new Date();
  });

  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        const urlParams = new URLSearchParams({
          // TODO: Also would be great to have ability set it by input component
          latitude: "52.52",
          longitude: "13.41",
          startDate: dayjs(startDate).format(DATE_FORMAT),
          endDate: dayjs(endDate).format(DATE_FORMAT),
        });

        const res = await fetch(`/api/weather?${urlParams.toString()}`);

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await res.json();

        setData(result);
      } catch (error) {
        console.error("error", error);
      } finally {
        setLoading(false);
      }
    }

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  const handleChangeStartDate = (date: Date | null) => {
    if (date) {
      setStartDate(date);
      localStorage.setItem("startDate", date.toISOString());
    }
  };

  const handleChangeEndDate = (date: Date | null) => {
    if (date) {
      setEndDate(date);
      localStorage.setItem("endDate", date.toISOString());
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2">
        <h1 className="text-3xl font-bold text-center mb-4">
          Weather Data Visualization
        </h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow p-4">
            {data ? <WeatherChart data={data} /> : <p>Loading data...</p>}
          </div>
          <div className="flex space-x-4">
            <div className="flex flex-row items-center">
              <label htmlFor="startDate" className="text-sm font-medium mb-1">
                from:
              </label>
              <Datepicker
                id="startDate"
                className="px-2 py-1"
                placeholder="Select start date"
                value={startDate}
                disabled={loading}
                onChange={handleChangeStartDate}
              />
            </div>
            <div className="flex flex-row items-center">
              <label htmlFor="endDate" className="text-sm font-medium mb-1">
                to:
              </label>
              <Datepicker
                id="endDate"
                className="px-2 py-1"
                placeholder="Select end date"
                value={endDate}
                disabled={loading}
                onChange={handleChangeEndDate}
              />
            </div>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-3 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/rishchiv/weather-forecast-app/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Documentation
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/rishchiv/weather-forecast-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to github repo →
        </a>
      </footer>
    </div>
  );
}
