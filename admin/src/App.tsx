import { useCallback, useMemo } from "react";

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
  FirebaseSignInProvider,
  FirebaseUserWrapper,
  useFirebaseAuthController,
  useFirebaseStorageSource,
  useFirestoreDelegate,
  useInitialiseFirebase,
} from "@firecms/firebase";
import { CenteredView } from "@firecms/ui";

import toast from "react-hot-toast";
import { Route } from "react-router";
import { AdminCollection } from "./collections/admins";
import { DbChangesCollection } from "./collections/dbchanges";
import { DriverCollection } from "./collections/driver";
import { ParkingLotRatesCollection } from "./collections/parkingLotRates";
import { ParkingLotCollection } from "./collections/parkingLots";
import { ParkingOwnerCollection } from "./collections/parkingOwners";
import { ParkingSlotsCollection } from "./collections/parkingSlots";
import { UserCollection } from "./collections/users";
import { VehicleCollection } from "./collections/vehicles";
import Dance from "./customComponents/Dance";
import AuthComponent from "./customComponents/authentication/AuthComponent";
import { firebaseConfig } from "./firebase-config";
function App() {
  const myAuthenticator: Authenticator<FirebaseUserWrapper> = useCallback(
    async ({ user }) => {
      const idTokenResult = await user?.firebaseUser?.getIdTokenResult();
      const { admin, parkingOwner, approved } = idTokenResult?.claims || {};
      const emailVerified = user?.firebaseUser?.emailVerified;

      if (parkingOwner && !emailVerified) {
        toast.error("Please verify your email to access this page", { duration: 2000 });
        return false;
      }

      if (admin) {
        return true;
      } else if (parkingOwner) {
        if (!approved) {
          toast.loading("Awaiting approval...", { duration: 3000 });
          return false;
        }
        return true;
      } else {
        toast.error("You do not have access to this page", { duration: 2000 });
        return false;
      }
    },
    []
  );

  const collections = useMemo(
    () => [
      ParkingOwnerCollection,
      VehicleCollection,
      DriverCollection,
      UserCollection,
      DbChangesCollection,
      ParkingSlotsCollection,
      ParkingLotRatesCollection,
      ParkingLotCollection,
      AdminCollection,
    ],
    []
  );

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
                <AuthComponent
                  authController={authController}
                  firebaseApp={firebaseApp}
                  canAccessMainView={canAccessMainView}
                  logo="/logo/Icon-192x192.png"
                />
              );
            }

            return (
              <Scaffold
                name={"E-Parking-Admin"}
                autoOpenDrawer={true}
                logo="/logo/Icon-192x192.png"
                includeDrawer={true}
              >
                <NavigationRoutes
                  customRoutes={[
                    <Route key={"dance"} path="dance" element={<Dance />} />,
                  ]}
                />
                <SideDialogs />
              </Scaffold>
            );
          }}
        </FireCMS>
      </ModeControllerProvider>
    </SnackbarProvider>
  );
}

export default App;