import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from "expo-router";
import { storage } from '../utils/asyncStorage';



const OnboardingContext = createContext(
    {
        onBoarding: null as boolean | number | string | null,
        setOnBoarding: (value: boolean | number | string | null) => {}
    }
    );

export const OnboardingProvider = ({ children }) => {
  const [onBoarding, setOnBoarding] = useState<boolean | string  | number | null>(null);
  const router = useRouter();


  useEffect(() => {
    const checkOnboarding = async () => {
    const value = await storage.getItem('onBoarding');

    if (value == 1) {
      setOnBoarding(value === 'false' );
      return;
    }

    setOnBoarding(value === 'false' );

    if (value === null) {
        setOnBoarding(null);
        return;
      }
    };

    

    checkOnboarding();

  }, []);

  useEffect(() => {
    if (onBoarding) {
      router.replace("/(auth)/home");
    } else {
      router.replace("/(public)/onBoarding");
    }
  }, [onBoarding]);

  return (
    <OnboardingContext.Provider value={{ onBoarding, setOnBoarding }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within a OnboardingProvider');
  }
  return context;
};