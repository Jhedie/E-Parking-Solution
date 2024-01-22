import { ConfigContext, ExpoConfig } from "@expo/config";
import * as dotenv from "dotenv";
// initialize dotenv
dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Frontend",
  slug: "frontend",

  extra: {
    ...config.extra,
    eas: {
      projectId: process.env.PROJECT_ID
    }
  },
  android: {
    ...config.android,
    config: {
      ...config.android?.config,

      googleMaps: {
        apiKey: process.env.GOOGLE_API_KEY
      }
    }
  },
  ios: {
    ...config.ios,
    config: {
      ...config.ios?.config,
      googleMapsApiKey: process.env.IOS_GOOGLE_API_KEY
    }
  }
});
