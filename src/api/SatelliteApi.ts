export type TleResponse = {
  satelliteName: string;
  line1: string;
  line2: string;
  updatedAt: string;
};

export type TelemetryResponse = {
  timestamp: string;
  batteryVoltage: number;
  batteryPercent: number;
  temperatureC: number;
  radioStatus: string;
  mode: string;
};

const API_BASE_URL = "http://localhost:3001";

export async function getTle(): Promise<TleResponse> {
  const response = await fetch(`${API_BASE_URL}/api/tle`);

  if (!response.ok) {
    throw new Error("Failed to fetch TLE");
  }

  return response.json();
}

export async function getTelemetry(): Promise<TelemetryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/telemetry`);

  if (!response.ok) {
    throw new Error("Failed to fetch telemetry");
  }

  return response.json();
}