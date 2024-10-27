import { z } from "zod";

export const weatherQuerySchema = z
  .object({
    start_date: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Invalid date format. Make sure to use 'YYYY-MM-DD'"
      ),
    end_date: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Invalid date format. Make sure to use 'YYYY-MM-DD'"
      ),
    latitude: z.string().refine(
      (val) => {
        const lat = parseFloat(val);
        return lat >= -90 && lat <= 90;
      },
      {
        message: "Latitude must be between -90 and 90",
      }
    ),
    longitude: z.string().refine(
      (val) => {
        const lon = parseFloat(val);
        return lon >= -180 && lon <= 180;
      },
      {
        message: "Longitude must be between -180 and 180",
      }
    ),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      return startDate <= endDate;
    },
    {
      message: "Start date cannot be after end date",
      path: ["start_date", "end_date"],
    }
  );
