import twilio from "twilio";
import axios from "axios";

export default async function handler(req, res) {
  const dependencies = {};

  // Check OpenStreetMap
  try {
    const osm = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: "Cape Town", format: "json", limit: 1 },
      headers: { "User-Agent": "weather-whatsapp-app" },
      timeout: 5000
    });
    dependencies.openStreetMap = osm.status === 200 ? "Connected and Healthy" : "error";
  } catch {
    dependencies.openStreetMap = "error";
  }

  // Check OpenWeatherMap
  try {
    const owm = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        q: "Cape Town",
        appid: process.env.OPENWEATHER_API_KEY,
        units: "metric"
      },
      timeout: 5000
    });
    dependencies.openWeatherMap = owm.status === 200 ? "Connected and Healthy" : "error";
  } catch {
    dependencies.openWeatherMap = "error";
  }

  // Check Twilio
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    dependencies.twilio = "Connected and Healthy";
  } catch {
    dependencies.twilio = "error";
  }

  const allHealthy = Object.values(dependencies).every(s => s === "ok" || s === "Connected and Healthy");
  res.status(allHealthy ? 200 : 500).json({
    status: allHealthy ? "Healthy" : "error",
    dependencies
  });
}
