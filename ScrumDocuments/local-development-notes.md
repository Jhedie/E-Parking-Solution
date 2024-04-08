# Development Notes:

Below are the development notes for the project. It comprises of links and resources discovered along the way for achieving the project goals. This will be used for future reference.

1. https://learn.mongodb.com/learn/course/intro-to-atlas-device-sync/learning-byte/learn
2. https://www.youtube.com/watch?v=NjadyNF4-34&t=287s
   With user expectations shaped by popular apps, building successful mobile experiences for internal or consumer use has become challenging. Reactive experiences and real-time data are now expected. This requires developers to build complicated logic and reinvent the wheel – to sync data between users, platforms, and the cloud, handle unreliable internet connectivity and exceptions, and more. We'll explore the various options on MongoDB that were designed to make this simple.

3. https://www.moncefbelyamani.com/how-to-install-xcode-homebrew-git-rvm-ruby-on-mac/#make-sure-your-computer-is-plugged-in-and-has-a-stable-internet-connection

4. https://bartlomiej-klocek.medium.com/how-to-integrate-react-native-firebase-into-expo-d34712eaf64d

5. Setting up Firebase:

   - https://www.youtube.com/watch?v=mZlKwRV4MC8&t=551s
   - Add docs for firebase and expo

6. Removing secret files from repo:

   - https://dev.to/isaacadams/git-bfg-installation-5ee1

7. App.config.ts and dynamic fields:

   - https://stackoverflow.com/questions/72745990/how-to-use-eas-secret-variable-in-app-json

8. Authentication state management using react native firebase

   Resolving the error: Attempted to navigate before mounting the Root Layout component

   - https://github.com/expo/router/issues/740#:~:text=aaronksaunders%20commented%20on%20Jul%2025%2C%202023

   Guide to implement auth and protected routes in expo router v2:

   - https://docs.expo.dev/router/reference/authentication/

   Formik and Yup for forms:

   - https://www.youtube.com/watch?v=bttOjT0jfzs&list=PLG02JlJZbKbsrFy-sKyz0PJBkWCajj1i9

   Auth context and provider

   - https://youtu.be/BM72He8W3SE
   - https://www.youtube.com/watch?v=zh6Sc1flK2g&t=7s
   - For the first time there is no current user
   - When a user sign up, they are taken to a verification page
   - Once the user verifies, they are taken to the welcome page to sign in
   - Once signed in, they are taken to the home page
   - when the user signs out, they are taken to the welcome page
   - when the app is closed and reopened, the user is taken to the home page if they are signed in, otherwise they are taken to the welcome page
   - when the app is closed and the is user but not verified, they are taken to the verification page
   - when the app is closed after verification and reopened, the user is taken to the welcome page

   https://jscrambler.com/blog/how-to-integrate-firebase-authentication-with-an-expo-app

9. An issue with react native maps:

- I encountered an error message when performing an eas build to enable google maps on IOS. The problem was fixed by reading through the github issue below:
  It indicated that there is an issue with building the module 'GoogleMapsUtils'. The provided code fixed this issue by modifying the Podfile in the iOS project. I had to create a plugin file called `react-native-maps-plugin.js`` in the root directory of the project and add this file to the app.json file.
  https://github.com/react-native-maps/react-native-maps/issues/4793

  - video for maps:
    https://www.youtube.com/watch?v=9xD4coXs6Ts&t=3739s

10. Error:WARN The redirect prop on <Screen /> is deprecated and will be removed. Please use router.redirect
    Solution: https://github.com/expo/router/issues/834#:~:text=6-,branaust%20commented%20on%20Sep%2015%2C%202023,-%E2%80%A2

11. Error with react native maps on android. The streets were in colour black see example in
    https://github.com/react-native-maps/react-native-maps/issues/4920
    After reading some documentation I discovered that there had been a change in the google maps renderer. The solution is available at the github issue link below:
    https://github.com/react-native-maps/react-native-maps/pull/4055#:~:text=feat(android)%3A%20add%20support%20for%20new%20google%20maps%20renderer%20%234055

## Extra notes:

UI -
https://www.figma.com/file/mklroFLA8ElqjLEyaWVW6O/Parking-App-Design-UI-%7C-Figma-(Community)?type=design&node-id=201-1100&mode=design&t=4n7ERUDiK9cpHxmx-0

https://www.figma.com/file/oRAtKh02FgKw5FhUfwuY3q/Parkir---Parking-App-UI-Kit-(Preview)?type=design&node-id=1127-9957&mode=design&t=33UDqdHsnBSBsVvz-0

https://www.figma.com/file/6B1CUowi8YAh3ncWdx993F/Parking-app-UI-UX-Kit-%7C-Case-Study-(Community)?type=design&mode=design&t=UcEZ3RiDWEH4CqyZ-0

https://www.figma.com/files/recents-and-sharing/recently-viewed?fuid=1111328759623863677

Stacks and Navigation:
https://youtu.be/QpfAyQgphgw?t=1957

https://expo.github.io/router/docs/migration/react-navigation/navigation-container/

https://reactnavigation.org/docs/nesting-navigators#navigating-to-a-screen-in-a-nested-navigator

Car Parking Finder App UI Clone in React Native #2: Scrolling/Swiping Transition:
https://dev.to/absek/car-parking-finder-app-ui-clone-in-react-native-2-scrolling-swiping-transition-kc1

https://shopify.github.io/flash-list/

https://wix.github.io/react-native-calendars/docs/Components/Calendar
https://youtu.be/RZtULGjtG_U

Sliders:
https://youtu.be/jlSWxkITOW8
https://www.npmjs.com/package/@react-native-community/slider

Fast 2kB alternative to Moment.js with the same modern API
https://day.js.org/

Icons:
https://icons.expo.fyi/Index/Feather/check-circle

Icons and Photos For Everything
https://thenounproject.com/

DateTime picker
https://docs.expo.dev/versions/latest/sdk/date-time-picker/
How to use date time picker:
https://youtu.be/UEfFjfW7Zes

Buttons:
https://github.com/rcaferati/react-native-really-awesome-button?tab=readme-ov-file

Approach to development:
https://www.linkedin.com/pulse/12-frontend-first-development-key-fast-scalable-e-commerce/

https://www.quora.com/Which-approach-do-you-consider-better-backend-first-then-frontend-or-vice-versa

https://www.reddit.com/r/reactjs/comments/11ejggq/frontend_or_backend_first/

https://en.wikipedia.org/wiki/Vertical_slice

Firebase Environment Configuration:
https://firebase.google.com/docs/functions/config-env?gen=2nd

Admin Panel:
https://apexcharts.com/

https://refine.dev/docs/getting-started/quickstart/

RBAC with firebase:

https://jscrambler.com/blog/how-to-integrate-firebase-authentication-with-an-expo-app
https://www.toptal.com/firebase/role-based-firebase-authentication#:~:text=up%20and%20running.-,Role%2Dbased%20Auth,a%20user%20to%20execute%20it.

REST:
https://github.com/ebenezerdon/journal-rest-api/blob/main/functions/src/index.ts

React native Animations:
Interpolation:
https://youtu.be/ybcL8e6ImSo

Custom Animated Markers and Region Focus when Content is Scrolled in React Native:
https://youtu.be/sueqYRRarso

Handling multiple dates logic:

```
// State variables to track if the start and end dates have been picked
  const [isStartDatePicked, setIsStartDatePicked] = useState(false);
  const [isEndDatePicked, setIsEndDatePicked] = useState(false);

  // Function to handle when a day is pressed
  const onDayPress = (day: DateData) => {
    console.log("selected day", day.dateString);

    // If the start date hasn't been picked or both dates have been picked, set the start date
    if (!isStartDatePicked || (isStartDatePicked && isEndDatePicked)) {
      setStartDate(day.dateString);
      setEndDate("");
      setIsStartDatePicked(true);
      setIsEndDatePicked(false);
    }
    // If the start date has been picked but the end date hasn't, set the end date
    else if (!isEndDatePicked) {
      // If the selected day is before the start date, swap the start and end dates
      if (dayjs(day.dateString).isBefore(startDate)) {
        setEndDate(startDate);
        setStartDate(day.dateString);
      }
      // Otherwise, just set the end date
      else {
        setEndDate(day.dateString);
      }
      setIsEndDatePicked(true);
    }
  };

  // State variables to store the start and end dates
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Function to generate the marked dates object
  const getMarkedDates = () => {
    let marked = {};
    if (startDate === endDate) {
      marked = {
        [startDate]: {
          startingDay: true,
          endingDay: true,
          color: "green",
          textColor: "white"
        }
      };
    } else {
      // Initialize the marked dates object with the start and end dates
      marked = {
        [startDate]: { startingDay: true, color: "green", textColor: "white" },
        [endDate]: { endingDay: true, color: "green", textColor: "white" }
      };

      // Start from the day after the start date
      let start = dayjs(startDate).add(1, "day");
      const end = dayjs(endDate);

      // Iterate over the dates between the start and end dates
      while (start.isBefore(end)) {
        // Add each date to the marked dates object
        marked[start.format("YYYY-MM-DD")] = {
          selected: true,
          marked: true,
          selectedColor: "blue"
        };
        // Move to the next date
        start = start.add(1, "day");
      }
    }
    return marked;
  };
```

- How to send emails using Python Django and Google SMTP server at no cost.

https://medium.com/@elijahobara/how-to-send-emails-using-python-django-and-google-smtp-server-at-no-cost-bbcbb8e8638b#:~:text=Configuring%20django%20for%20Gmail%20SMTP%20server.&text=The%20EMAIL_BACKEND%20setting%20specifies%20the,server%2C%20as%20specified%20by%20Google.

- Creating QR codes
  https://dev.to/dallington256/how-to-generate-and-download-qr-code-in-a-react-native-application-1k8e

- Stripe Docs:

  - https://github.com/jonasgroendahl/yt-react-native-payment-sheet/blob/main/App.tsx

  - https://docs.stripe.com/payments/accept-a-payment?platform=react-native&ui=payment-sheet&lang=node#react-native-add-server-endpoint

- How to set up node typescript express
  https://blog.logrocket.com/how-to-set-up-node-typescript-express/

- Adding SVG,PNGS etc
  https://stackoverflow.com/questions/71099924/cannot-find-module-file-name-png-or-its-corresponding-type-declarations-type

- Boiler plate for node typescript express REST API
  https://github.com/vinicostaa/node-typescript-restify
  https://github.com/RodrigoBertotti/firebase-cloud-functions-typescript-example?tab=readme-ov-file
  https://www.reddit.com/r/Firebase/comments/18bnou6/i_created_a_nodejs_rest_api_example_for_firebase/

- Http request
  Fetch and Axios are both JavaScript libraries used for making HTTP requests in mobile/web applications.
  https://www.linkedin.com/pulse/fetch-vs-axios-react-native-rohit-bansal/

- Ensuring Verification security:
  A token is required to send a verification email.
  Further validation is made to ensure that a different token is not used before proceeding to sending a verificaiton email.

- Firebase auth tokens:
  https://medium.com/@jwngr/demystifying-firebase-auth-tokens-e0c533ed330c

- Calculating distance between two points:
  https://www.geodatasource.com/developers/javascript
  https://en.wikipedia.org/wiki/Haversine_formula
  https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates

- validating number plate:
  https://gist.github.com/danielrbradley/7567269

- Error: Can't set headers after they are sent to the client
  https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client

- Custom Claims
  using custom claims for storing the isApproved status for several reasons:

  1. Security and Integrity: Custom claims are securely managed on the server side and cannot be tampered with by the client. This ensures that once an admin approves a parking owner, the status cannot be altered without proper authorization.
  2. Centralized Access Control: By using custom claims, you can leverage Firebase's built-in mechanisms for access control both in your application's backend (e.g., Firebase Functions) and directly in Firebase Security Rules for Firestore and Firebase Storage. This allows for a more streamlined and efficient way to manage access based on the approval status.
  3. Scalability and Maintenance: As your application grows, the security and integrity of user roles and statuses become increasingly critical. Custom claims provide a scalable way to manage user permissions and statuses across different parts of your application without requiring changes to your database structure or additional queries to Firestore for each access check.
  4. Efficiency: Although there's a propagation delay for custom claims (they're refreshed in the user's ID token on the next sign-in), this can be mitigated by forcing a token refresh in critical flows or by designing the user experience to accommodate this (e.g., informing users that approval may take a few minutes to process).
     Implementation Considerations
     Admin Tooling: To manage the complexity of updating custom claims, you can build or use existing admin tools. Firebase Admin SDK can be used in Cloud Functions or a secure backend environment to update custom claims based on admin actions.
     User Experience: To address the token propagation delay, you can implement a mechanism to prompt users to refresh their session or automatically refresh the ID token after an admin has approved their account.
     Security Rules: Leverage Firebase Security Rules to ensure that only users with the isApproved claim can access certain resources or perform specific actions. This adds an extra layer of security and ensures that your application's access control logic is closely aligned with Firebase's authentication model.
     By choosing custom claims, you're opting for a solution that prioritizes security, scalability, and efficient access control, which are crucial for applications dealing with sensitive user roles and permissions.

- Expo push notifications
  https://docs.expo.dev/push-notifications/push-notifications-setup/#install-libraries

- Modals
  https://github.com/jmarioste/daisyui-modal/blob/main/components/Modal.tsx

- Event triggers on deletion (side note given that I made use of firebase data intergrity has to be manually managed hence the need to set up event triggers to handle cascading deletes and other actions as and when needed. Event triggers are powerful but this may be a bad design decision choosing a nosql data but at least there is a work around to handle this issue). Below are some further notes:
  Triggering Mechanism
  With the correction in place, here's how the triggers would be activated:
  User Creation (onCreated): This trigger is activated whenever a new document is created in the users collection. The Firestore path "users/{userId}" specifies that the trigger listens to the users collection and captures the userId of the created document. When a new user document is added to this collection, the function executes the logic defined in the handler, which, in this case, involves logging the creation event and potentially other business logic.
  User Deletion (onDeleted): After correcting the trigger to use onDocumentDeleted, this trigger will activate whenever a document in the users collection is deleted. Similar to the creation trigger, it listens to the users collection but is specifically interested in document deletions. When a user document is deleted, the function executes the deletion logic, which includes deleting related documents in other collections based on the user's role.
  How to Trigger These Functions
  Creating a User: Simply add a new document to the users collection in Firestore. This can be done through a Firestore client in your app or directly via the Firebase Console.
  Deleting a User: Remove a document from the users collection. As with creation, this can be done programmatically through your app or manually via the Firebase Console.
  Summary
  These triggers are part of the serverless architecture provided by Firebase, allowing you to execute backend logic in response to database events without needing to manage a server. The corrected onDeleted trigger will ensure that when a user is deleted, not only is their authentication record removed (if you're also deleting the user from Firebase Auth), but all related documents in Firestore are cleaned up based on the user's role, maintaining data integrity and preventing orphaned records.

- securely querying data:
  https://firebase.google.com/docs/firestore/security/rules-query

  https://geofirestore.com/#examples

  https://github.com/wmandai/geofire

  https://github.com/MichaelSolati/geofirestore-js#geofirestorequeryquerycriteria

  https://firebase.google.com/docs/firestore/solutions/geoqueries#web-modular-api
