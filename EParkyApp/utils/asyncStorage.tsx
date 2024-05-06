import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  setItem: async (key: string, value: number): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error(`[AsyncStorage] Error setting item: ${key}`, error);
      throw error;
    }
  },
  getItem: async (key: string): Promise<number | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return parseInt(value);
      }
      return null;
    } catch (error) {
      console.error(`[AsyncStorage] Error getting item: ${key}`, error);
      throw error;
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[AsyncStorage] Error removing item: ${key}`, error);
      throw error;
    }
  }
};
