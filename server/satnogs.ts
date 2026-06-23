export type SatnogsTleRecord = {
  tle0: string;
  tle1: string;
  tle2: string;
  tle_source: string;
  sat_id: string;
  norad_cat_id: number;
  updated: string;
};

export type TleResponse = {
  satelliteName: string;
  line1: string;
  line2: string;
  noradCatId: number;
  satId: string;
  tleSource: string;
  updatedAt: string;
};

const SATNOGS_TLE_URL = "https://db.satnogs.org/api/tle/";
const CACHE_DURATION_MS = 10 * 60 * 1000;

let cachedTles: SatnogsTleRecord[] | null = null;
let cacheExpiresAt = 0;

async function fetchAllSatnogsTles(): Promise<SatnogsTleRecord[]> {
  const now = Date.now();

  if (cachedTles && now < cacheExpiresAt) {
    return cachedTles;
  }

  const response = await fetch(SATNOGS_TLE_URL, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`SatNOGS TLE request failed: ${response.status}`);
  }

  const data = (await response.json()) as SatnogsTleRecord[];

  cachedTles = data;
  cacheExpiresAt = now + CACHE_DURATION_MS;

  return data;
}

function normalizeSatelliteName(tle0: string): string {
  return tle0.replace(/^0\s+/, "").trim();
}

export async function getTleByNoradId(
  noradCatId: number
): Promise<TleResponse | null> {
  const allTles = await fetchAllSatnogsTles();

  const match = allTles.find((tle) => tle.norad_cat_id === noradCatId);

  if (!match) {
    return null;
  }

  return {
    satelliteName: normalizeSatelliteName(match.tle0),
    line1: match.tle1,
    line2: match.tle2,
    noradCatId: match.norad_cat_id,
    satId: match.sat_id,
    tleSource: match.tle_source,
    updatedAt: match.updated,
  };
}