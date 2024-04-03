import React, { PropsWithChildren, createContext, useContext } from "react";

// Define the shape of your context
interface ConfigContextType {
  BASE_URL: string;
}

// Create the context with a default value
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {}

// Create a provider component
export const ConfigProvider: React.FC<ConfigProviderProps> = ({
  children,
}: PropsWithChildren<ConfigProviderProps>) => {
  const config: ConfigContextType = {
    BASE_URL: import.meta.env.VITE_FRONTEND_SERVER_BASE_URL,
  };

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};

// Custom hook to use the config
export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};