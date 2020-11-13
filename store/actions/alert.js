import { Alert } from "react-native";

export const alert = (title, error) => {
  Alert.alert(title, error, [{ text: "Okay" }]);
};
