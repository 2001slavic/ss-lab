import mqtt from "mqtt";

const MQTT_BROKER = "wss://192.168.9.2:8883/mqtt"; // Secure WebSockets

export const connectMQTT = () => {
  const options = {
    clientId: `camera-client-${Math.random().toString(16).substr(2, 8)}`,
    rejectUnauthorized: false, // Accept self-signed certs
  };

  const client = mqtt.connect(MQTT_BROKER, options);

  client.on("connect", () => console.log("✅ MQTT Connected"));
  client.on("error", (err) => console.error("❌ MQTT Error:", err));

  return client;
};
