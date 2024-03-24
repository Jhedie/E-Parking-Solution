import { useAuth } from "@providers/Authentication/AuthProvider";
import { useEffect, useState } from "react";

const useToken = () => {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (user) {
        const fetchedToken = await user.getIdToken();
        setToken(fetchedToken);
      }
    };

    fetchToken();
  }, [user]);

  return token;
};

export default useToken;
