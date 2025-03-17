import React, { useRef, useEffect, useState } from "react";
import { connectMQTT } from "./mqtt";

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mqttClient, setMqttClient] = useState(null);

  useEffect(() => {
    const client = connectMQTT();
    setMqttClient(client);

    // Request camera access
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Camera Access Error:", err));

    return () => {
      if (client) client.end();
    };
  }, []);

  const captureImage = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Set canvas size to match video feed
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    // Capture frame from video
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Convert to Base64 (JPEG format)
    const imageData = canvas.toDataURL("image/jpeg", 0.7); // 70% quality
    const base64Image = imageData.split(",")[1]; // Remove data prefix

    console.log("📸 Image Captured");

    // Send image via MQTT
    if (mqttClient && mqttClient.connected) {
      mqttClient.publish("camera/images", base64Image, { qos: 1 }, (err) => {
        if (err) console.error("❌ MQTT Publish Error:", err);
        else console.log("✅ Image Sent via MQTT");
      });
    }
  };

  // Capture images every 5 seconds
  useEffect(() => {
    const interval = setInterval(captureImage, 5000);
    return () => clearInterval(interval);
  }, [mqttClient]);

  return (
    <div>
      <h2>📷 Camera Capture</h2>
      <video ref={videoRef} autoPlay playsInline />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraCapture;
