export const Servers = {
  LiveServer: process.env.API_SERVER_BASE_URL || "https://stagingapi.joinotto.com/api/v1/",
  GoogleAPIkey: process.env.GOOGLE_API_KEY || "AIzaSyDOQ7N0NgZt8OFcioja-gHnX5hKjk-Su_8",
  AppEnv: process.env.APP_ENV || 'development',
  NodeEnv: process.env.NODE_ENV || 'development'
};
