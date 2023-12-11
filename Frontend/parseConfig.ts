import AsyncStorage from "@react-native-async-storage/async-storage";
import Parse from "parse/react-native.js";

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize("myAppId");
Parse.serverURL = "http://localhost:1337/parse";

export default Parse;
