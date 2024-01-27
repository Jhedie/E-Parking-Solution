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

9. An issue with react native maps:

- I encountered an error message when performing an eas build to enable google maps on IOS. The problem was fixed by reading through the github issue below:
  It indicated that there is an issue with building the module 'GoogleMapsUtils'. The provided code fixed this issue by modifying the Podfile in the iOS project. I had to create a plugin file called `react-native-maps-plugin.js`` in the root directory of the project and add this file to the app.json file.
  https://github.com/react-native-maps/react-native-maps/issues/4793

  - video for maps:
    https://www.youtube.com/watch?v=9xD4coXs6Ts&t=3739s

## Extra notes:

UI  -
https://www.figma.com/file/mklroFLA8ElqjLEyaWVW6O/Parking-App-Design-UI-%7C-Figma-(Community)?type=design&node-id=201-1100&mode=design&t=4n7ERUDiK9cpHxmx-0

https://www.figma.com/file/oRAtKh02FgKw5FhUfwuY3q/Parkir---Parking-App-UI-Kit-(Preview)?type=design&node-id=1127-9957&mode=design&t=33UDqdHsnBSBsVvz-0

https://www.figma.com/file/6B1CUowi8YAh3ncWdx993F/Parking-app-UI-UX-Kit-%7C-Case-Study-(Community)?type=design&mode=design&t=UcEZ3RiDWEH4CqyZ-0

https://www.figma.com/files/recents-and-sharing/recently-viewed?fuid=1111328759623863677


Stacks and Navigation:
https://youtu.be/QpfAyQgphgw?t=1957

https://expo.github.io/router/docs/migration/react-navigation/navigation-container/



Car Parking Finder App UI Clone in React Native #2: Scrolling/Swiping Transition:
https://dev.to/absek/car-parking-finder-app-ui-clone-in-react-native-2-scrolling-swiping-transition-kc1
