import React from "react";
import { Ionicons } from "@expo/vector-icons";

import { View, Text } from "react-native";

import Colors from "../constants/Colors";

const ButtonFloat = (props) => {
  return (
    <View>
      <Text style={{ justifyContent: "flex-end", right: 0 }}>Comprar</Text>
    </View>
  );
};

export default ButtonFloat;
