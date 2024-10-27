import { fetchWeatherApi } from "openmeteo";
import type { NextApiRequest, NextApiResponse } from "next";

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const defaultParams = {
    hourly: "temperature_2m",
  };

  const { startDate, endDate, latitude, longitude } = req.query;

  try {
    const response = await fetchWeatherApi(WEATHER_API_URL, {
      ...defaultParams,
      latitude,
      longitude,
      start_date: startDate,
      end_date: endDate,
    });

    res.status(200).json(response);
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
