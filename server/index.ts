import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { getTleByNoradId } from "./satnogs";


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

app.get("/api/tle/:noradCatId", async (req, res) => {
  try {
    const noradCatId = Number(req.params.noradCatId);

    if (!Number.isInteger(noradCatId)) {
      return res.status(400).json({
        error: "Invalid NORAD catalog ID",
      });
    }

    const tle = await getTleByNoradId(noradCatId);

    if (!tle) {
      return res.status(404).json({
        error: `No TLE found for NORAD catalog ID ${noradCatId}`,
      });
    }

    res.json(tle);
  } catch (error) {
    console.error("Failed to fetch SatNOGS TLE:");
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch TLE data",
      details: String(error),
    });
  }
});