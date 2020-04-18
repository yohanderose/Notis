import { AsyncStorage } from "react-native";

export default class Storage {
  static getItem = async (key) => {
    let item = await AsyncStorage.getItem(key);
    //You'd want to error check for failed JSON parsing...
    return JSON.parse(item);
  };

  static setItem = async (key, value) => {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
  };

  static removeItem = async (key) => {
    return await AsyncStorage.removeItem(key);
  };
}
