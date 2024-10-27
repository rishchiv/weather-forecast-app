import { fetchWeatherApi } from "openmeteo";

import { NextResponse } from "next/server";

import { formTimeRanges } from "./helpers";
import { weatherQuerySchema } from "./schema";

const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export async function GET(req: Request) {
  const defaultParams = {
    daily: ["temperature_2m_max", "temperature_2m_min"],
  };

  try {
    const url = new URL(req.url);

    const params = {
      start_date: url.searchParams.get("startDate"),
      end_date: url.searchParams.get("endDate"),
      latitude: url.searchParams.get("latitude"),
      longitude: url.searchParams.get("longitude"),
    };

    const validation = weatherQuerySchema.safeParse(params);

    if (!validation.success) {
      return NextResponse.json(validation.error.format(), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await fetchWeatherApi(WEATHER_API_URL, {
      ...defaultParams,
      ...params,
    });

    const formattedData = formTimeRanges(response?.[0] ?? []);

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
