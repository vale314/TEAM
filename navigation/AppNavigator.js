import React from "react";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import { MainNavigator, AuthNavigator } from "./MealsNavigator";
import StartupScreen from "../screens/StartupScreen";

const AppNavigator = (props) => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

  return (
    <NavigationContainer>
      <MainNavigator />
      {/* {isAuth && <MainNavigator />} */}
      {/* {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <StartupScreen />} */}
    </NavigationContainer>
  );
};

export default AppNavigator;
