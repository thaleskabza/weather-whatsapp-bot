import twilio from "twilio";
import axios from "axios";

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const incomingMsg = req.body.Body?.trim();
  let fromNumber = req.body.From;

  if (!incomingMsg) {
    return res.status(200).send("<Response></Response>");
  }

  // Ensure 'from' is prefixed with 'whatsapp:' for consistency
  if (!fromNumber.startsWith("whatsapp:")) {
    fromNumber = `whatsapp:${fromNumber}`;
  }

  try {
    // 1. Lookup coordinates from OpenStreetMap
    const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: incomingMsg, format: "json", limit: 1 },
      headers: { "User-Agent": "weather-whatsapp-app" }
    });

    if (!geoRes.data || geoRes.data.length === 0) {
      await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: fromNumber,
        body: `❌ Sorry, I couldn't find "${incomingMsg}". Please try another location.`
      });
      return res.status(200).send("<Response></Response>");
    }

    const { lat, lon, display_name } = geoRes.data[0];

    // 2. Fetch weather from OpenWeatherMap
    const weatherRes = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        lat,
        lon,
        appid: process.env.OPENWEATHER_API_KEY,
        units: "metric"
      }
    });

    const w = weatherRes.data;

    const messageBody = `
🌤 *Weather for ${display_name}:*

🌡 Temperature: ${w.main.temp}°C
🤗 Feels Like: ${w.main.feels_like}°C
🌦 Condition: ${w.weather[0].description}
💨 Wind Speed: ${w.wind.speed} m/s
`.trim();

    // 3. Send WhatsApp reply
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: fromNumber,
      body: messageBody
    });

    res.status(200).send("<Response></Response>");
  } catch (err) {
    console.error("Error:", err);

    // Attempt to send an error message to the user
    try {
      await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: fromNumber,
        body: "⚠️ Sorry, something went wrong while fetching the weather. Please try again later."
      });
    } catch (sendErr) {
      console.error("Failed to send error message:", sendErr);
    }

    res.status(200).send("<Response></Response>");
  }
}
