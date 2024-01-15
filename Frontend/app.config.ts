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
  }
});
