export const Servers = {
  LiveServer: process.env.NEXT_PUBLIC_API_SERVER_BASE_URL,
  GoogleAPIkey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  AppEnv: process.env.NEXT_PUBLIC_APP_ENV,
  DemoEnvToken: process.env.NEXT_PUBLIC_DEMO_USER_TOKEN,
  TrackerProjectID: process.env.NEXT_PUBLIC_TRACKER_ID,
  TrackerProjectToken: process.env.NEXT_PUBLIC_TRACKER_TOKEN,
  TrackerEnabled: process.env.NEXT_PUBLIC_TRACKER_ENABLED,
  SentryDSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  SentryAppName: process.env.NEXT_PUBLIC_SENTRY_APP_NAME,
  SentryProjectName: process.env.NEXT_PUBLIC_SENTRY_PROJECT_NAME,
  SentryEnabled: process.env.NEXT_PUBLIC_SENTRY_ENABLED,
};

export const isTrackerEnabled = (): boolean => {
  return Servers.TrackerEnabled === "true";
};

export const isSentryEnabled = (): boolean => {
  return Servers.SentryEnabled === "true";
};

export const isDemoEnv = (): boolean => {
  return Servers.AppEnv === "demo";
};

export const isProdEnv = (): boolean => {
  return Servers.AppEnv === "production";
};

export const isStageEnv = (): boolean => {
  return Servers.AppEnv === "staging";
};
export const isDevEnv = (): boolean => {
  return Servers.AppEnv === "development";
};
