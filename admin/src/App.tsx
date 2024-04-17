import { useCallback, useMemo, useState } from "react";

import {
  Authenticator,
  CMSView,
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
import { collectionsBuilder } from "./collections/collectionsBuilder";
import MultiStepCreateParkingLotForm from "./customComponents/MultiStepCreateParkingLot/MultiStepCreateParkingLotForm";
import AuthComponent from "./customComponents/authentication/AuthComponent";
import Dashboard from "./customComponents/parkingLotDashboard/Dashboard";
import { firebaseConfig } from "./firebase-config";
function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const myAuthenticator: Authenticator<FirebaseUserWrapper> = useCallback(
    async ({ user }) => {
      const idTokenResult = await user?.firebaseUser?.getIdTokenResult();
      const { admin, parkingOwner, approved } = idTokenResult?.claims || {};
      const emailVerified = user?.firebaseUser?.emailVerified;

      if (parkingOwner && !emailVerified) {
        toast.error("Please verify your email to access this page", {
          duration: 2000,
        });
        return false;
      }

      if (admin) {
        setIsAdmin(true);
        return true;
      } else if (parkingOwner) {
        if (!approved) {
          toast.loading("Approval required", { duration: 3000 });
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

  const collections = useMemo(() => {
    return collectionsBuilder;
  }, []);

  const customViews: CMSView[] = [
    {
      path: "app/createParkingLot",
      name: "New Parking Lot",
      description: "A custom view for creating a parking lot",
      view: <MultiStepCreateParkingLotForm />,
    },
    {
      path: "app/dashboard",
      name: "Dashboard",
      description: "A custom view for the dashboard",
      view: <Dashboard />,
    },
  ];

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
    views: !isAdmin ? customViews : [],
    basePath: "/app",
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
                //used a custom auth component to allow for custom login and signup
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
                  logo="/logo/Icon-192x192.png"
                />
              );
            }

            return (
              <Scaffold
                name={isAdmin ? "E-Parking-Admin" : "Parking Owner Dashboard"}
                // autoOpenDrawer={true}
                logo="/logo/Icon-192x192.png"
                includeDrawer={true}
              >
                <NavigationRoutes
                  customRoutes={[
                    <Route
                      key={"MultiStepCreateParkingLotForm"}
                      path="createParkingLot"
                      element={<MultiStepCreateParkingLotForm />}
                    />,
                    <Route
                      key={"Dashboard"}
                      path="dashboard"
                      element={<Dashboard />}
                    />,
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
