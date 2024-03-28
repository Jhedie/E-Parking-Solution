import React, { useCallback, useEffect, useMemo } from "react";

import {
  Authenticator,
  CircularProgressCenter,
  FireCMS,
  ModeControllerProvider,
  NavigationRoutes,
  Scaffold,
  SideDialogs,
  SnackbarProvider,
  useBuildLocalConfigurationPersistence,
  useBuildModeController,
  useBuildNavigationController,
  useValidateAuthenticator,
} from "@firecms/core";
import {
  FirebaseAuthController,
  FirebaseLoginView,
  FirebaseSignInProvider,
  FirebaseUserWrapper,
  useFirebaseAuthController,
  useFirebaseStorageSource,
  useFirestoreDelegate,
  useInitialiseFirebase,
} from "@firecms/firebase";
import { CenteredView } from "@firecms/ui";
import { demoCollection } from "./collections/demo";

import { useLocation } from "react-router";
import AuthComponent from "./customComponents/authentication/AuthComponent";
import LoginView from "./customComponents/authentication/SignIn";
import { firebaseConfig } from "./firebase-config";
import { ConfigProvider } from "./providers/Config/ConfigProvider";
function App() {
  const location = useLocation();

  // Use your own authentication logic here
  const myAuthenticator: Authenticator<FirebaseUserWrapper> = useCallback(
    async ({ user, authController }) => {
      if (user?.email?.includes("flanders")) {
        // You can throw an error to prevent access
        throw Error("Stupid Flanders!");
      }

      const idTokenResult = await user?.firebaseUser?.getIdTokenResult();
      const userIsAdmin =
        idTokenResult?.claims.admin || user?.email?.endsWith("@firecms.co");

      console.log(idTokenResult?.claims);

      console.log("Allowing access to", user);

      // we allow access to every user in this case
      // return true;
      if (userIsAdmin) {
        return true;
      }
      return false;
    },
    []
  );

  const collections = useMemo(() => [demoCollection], []);

  const { firebaseApp, firebaseConfigLoading, configError } =
    useInitialiseFirebase({
      firebaseConfig,
    });

  // Controller used to manage the dark or light color mode
  const modeController = useBuildModeController();

  const signInOptions: FirebaseSignInProvider[] = ["password"];

  // Controller for managing authentication
  const authController: FirebaseAuthController = useFirebaseAuthController({
    firebaseApp,
    signInOptions,
  });

  // Controller for saving some user preferences locally.
  const userConfigPersistence = useBuildLocalConfigurationPersistence();

  // Delegate used for fetching and saving data in Firestore
  const firestoreDelegate = useFirestoreDelegate({
    firebaseApp,
  });

  // Controller used for saving and fetching files in storage
  const storageSource = useFirebaseStorageSource({
    firebaseApp,
  });

  const { authLoading, canAccessMainView, notAllowedError } =
    useValidateAuthenticator({
      authController,
      authenticator: myAuthenticator,
      dataSourceDelegate: firestoreDelegate,
      storageSource,
    });

  console.log("authLoading", {
    authenticationEnabled: Boolean(myAuthenticator),
    authLoading,
    canAccessMainView,
  });

  const navigationController = useBuildNavigationController({
    collections,
    authController,
    dataSourceDelegate: firestoreDelegate,
  });

  if (firebaseConfigLoading || !firebaseApp) {
    return (
      <>
        <CircularProgressCenter />
      </>
    );
  }

  if (configError) {
    return <CenteredView>{configError}</CenteredView>;
  }

  return (
    <SnackbarProvider>
      <ModeControllerProvider value={modeController}>
        <ConfigProvider>
          <FireCMS
            navigationController={navigationController}
            authController={authController}
            userConfigPersistence={userConfigPersistence}
            dataSourceDelegate={firestoreDelegate}
            storageSource={storageSource}
          >
            {({ context, loading }) => {
              if (loading || authLoading) {
                return <CircularProgressCenter size={"large"} />;
              }

              if (!canAccessMainView) {
                return (
                  // <FirebaseLoginView
                  //   authController={authController}
                  //   firebaseApp={firebaseApp}
                  //   signInOptions={signInOptions}
                  //   notAllowedError={notAllowedError}
                  //   logo="/logo/Icon-192x192.png"
                  // />
                  // eslint-disable-next-line react/jsx-no-undef
                  <AuthComponent
                    authController={authController}
                    firebaseApp={firebaseApp}
                    notAllowedError={notAllowedError}
                    logo="/logo/Icon-192x192.png"
                  />
                );
              }

              return (
                <Scaffold name={"E-Parking Admin"} autoOpenDrawer={false}>
                  <NavigationRoutes />
                  <SideDialogs />
                </Scaffold>
              );
            }}
          </FireCMS>
        </ConfigProvider>
      </ModeControllerProvider>
    </SnackbarProvider>
  );
}

export default App;
