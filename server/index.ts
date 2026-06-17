import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/telemetry", async (_req, res) => {
  try {
    const filePath = path.join(
      process.cwd(),
      "server",
      "data",
      "Sample_Telemetry.json"
    );

    const fileText = await fs.readFile(filePath, "utf-8");
    const telemetry = JSON.parse(fileText);

    res.json(telemetry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load telemetry data" });
  }
});

app.get("/api/telemetry", async (_req, res) => {
  try {
    const filePath = path.join(
      process.cwd(),
      "server",
      "data",
      "Sample_Telemetry.json"
    );

    console.log("Looking for telemetry file at:");
    console.log(filePath);

    const fileText = await fs.readFile(filePath, "utf-8");
    console.log("Telemetry file contents:");
    console.log(fileText);

    const telemetry = JSON.parse(fileText);

    res.json(telemetry);
  } catch (error) {
    console.error("Telemetry route failed:");
    console.error(error);

    res.status(500).json({
      error: "Failed to load telemetry data",
      details: String(error),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});