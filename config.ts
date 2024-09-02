export const Servers = {
  LiveServer: process.env.NEXT_PUBLIC_API_SERVER_BASE_URL,
  GoogleAPIkey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  AppEnv: process.env.NEXT_PUBLIC_APP_ENV,
  DemoEnvToken: process.env.NEXT_PUBLIC_DEMO_USER_TOKEN,
  TrackerProjectID: process.env.NEXT_PUBLIC_TRACKER_ID,
  TrackerProjectToken: process.env.NEXT_PUBLIC_TRACKER_TOKEN,
  TrackerEnabled:
    process.env.NEXT_PUBLIC_TRACKER_ENABLED === "true" ? true : false,
};

export const isDemoEnv = (): boolean => {
  return process.env.NEXT_PUBLIC_APP_ENV === "demo";
};

export const isProdEnv = (): boolean => {
  return process.env.NEXT_PUBLIC_APP_ENV === "production";
};

export const isStageEnv = (): boolean => {
  return process.env.NEXT_PUBLIC_APP_ENV === "staging";
};
export const isDevEnv = (): boolean => {
  return process.env.NEXT_PUBLIC_APP_ENV === "development";
};
