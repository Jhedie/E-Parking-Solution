import * as Location from "expo-location";
import { PropsWithChildren, createContext, useEffect, useState } from "react";
export const UserLocationContext = createContext<{
  location: Location.LocationObject | null;
  setLocation: React.Dispatch<
    React.SetStateAction<Location.LocationObject | null>
  >;
} | null>(null);
interface UserLocationProviderProps {}
export function UserLocationProvider({
  children
}: PropsWithChildren<UserLocationProviderProps>) {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      console.log("status", status);

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      console.log("location", location);
      console.log("location.coords", location.coords);
    })();
  }, []);
  return (
    <UserLocationContext.Provider value={{ location, setLocation }}>
      {children}
    </UserLocationContext.Provider>
  );
}
