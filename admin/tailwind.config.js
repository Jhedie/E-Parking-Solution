import fireCMSConfig from "@firecms/ui/tailwind.config.js";

export default {
  presets: [fireCMSConfig],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/firecms/src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@firecms/**/src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#fcd34d",

          secondary: "#93c47d",

          accent: "#c99b00",

          neutral: "#262327",

          "base-100": "#eeeeee",

          info: "#00cdff",

          success: "#6fc43a",

          warning: "#fb8700",

          error: "#ff798e",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
