import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { Video } from "expo-av";

import Input from "../components/UI/Input";
import Card from "../components/UI/Card";
import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth";

const { height } = Dimensions.get("window");

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const AuthScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      user_password: "",
      firstname: "",
      lastname: "",
      code: "",
      cellphone: "",
    },
    inputValidities: {
      email: false,
      user_password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("Ocurrio Un Error", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.user_password,
        formState.inputValues.firstname,
        formState.inputValues.lastname,
        formState.inputValues.code,
        formState.inputValues.cellphone
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.user_password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
    } catch (err) {
      setError(error);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Video
          style={styles.backgroundVideo}
          source={{
            uri:
              "http://valentinalejandror6.sg-host.com/wp-content/uploads/2020/11/pexels-nataliya-vaitkevich-5794869.mp4",
          }}
          shouldPlay
          rate={1.0}
          isMuted={true}
          resizeMode="cover"
          isLooping
        />
        <Card style={styles.authContainer}>
          <ScrollView>
            <Text style={styles.title}>EATS CUCEI</Text>
            <View style={styles.authContainer1}>
              {isSignup ? (
                <View>
                  <Input
                    id="firstname"
                    label="Nombre"
                    keyboardType="default"
                    required
                    autoCapitalize="none"
                    errorText="Porfavor ingrese Su Nombre"
                    onInputChange={inputChangeHandler}
                    initialValue=""
                  />
                  <Input
                    id="lastname"
                    label="Apellido"
                    keyboardType="default"
                    required
                    autoCapitalize="none"
                    errorText="Porfavor ingrese Su Apellido"
                    onInputChange={inputChangeHandler}
                    initialValue=""
                  />

                  <Input
                    id="code"
                    label="Codigo"
                    keyboardType="default"
                    required
                    autoCapitalize="none"
                    errorText="Porfavor ingrese Su Codigo"
                    onInputChange={inputChangeHandler}
                    initialValue=""
                  />

                  <Input
                    id="cellphone"
                    label="Numero De Celular"
                    keyboardType="phone-pad"
                    required
                    autoCapitalize="none"
                    errorText="Porfavor ingrese Su Numero"
                    onInputChange={inputChangeHandler}
                    initialValue=""
                  />
                </View>
              ) : (
                <View></View>
              )}

              <Input
                id="email"
                label="E-Mail"
                keyboardType="email-address"
                required
                email
                autoCapitalize="none"
                errorText="Please enter a valid email address."
                onInputChange={inputChangeHandler}
                initialValue=""
              />
              <Input
                id="user_password"
                label="Password"
                keyboardType="default"
                secureTextEntry
                required
                minLength={5}
                autoCapitalize="none"
                errorText="Please enter a valid password."
                onInputChange={inputChangeHandler}
                initialValue=""
              />
            </View>

            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Text onPress={authHandler} style={styles.button1}>
                  {" "}
                  {isSignup ? "Sign Up" : "Login"}
                </Text>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Text
                onPress={() => {
                  props.navigation.setOptions({
                    headerTitle: isSignup ? "Login" : "Sign Up",
                  });
                  setIsSignup((prevState) => !prevState);
                }}
                style={{ ...styles.button, color: "white" }}
              >
                {" "}
                {`${isSignup ? "Login" : "Sign Up"}`}{" "}
              </Text>
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = {
  headerTitle: "UDG",
};

const styles = StyleSheet.create({
  title: {
    textAlign: "justify",
    fontSize: 40,
    color: "#f3f8ff",
    fontFamily: "open-sans-bold",
    marginBottom: 20,
  },
  button1: {
    width: 250,
    backgroundColor: "#f3f8ff",
    padding: 15,
    borderColor: "transparent",
    borderWidth: 2,
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 20,
    borderRadius: 24,
    fontFamily: "open-sans-bold",
    fontSize: 18,
    color: Colors.primary,
  },
  button: {
    color: Colors.primary,
    width: 250,
    backgroundColor: "transparent",
    padding: 15,
    borderColor: "#f3f8ff",
    borderWidth: 2,
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 20,
    borderRadius: 24,
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  backgroundVideo: {
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "stretch",
    bottom: 0,
    right: 0,
  },
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 700,
    padding: 20,
    backgroundColor: "transparent",
  },
  authContainer1: {
    maxWidth: 400,
    maxHeight: 700,
    padding: 20,
    backgroundColor: "rgba(255,255,255,.6)",
  },
  buttonContainer: {
    marginTop: 10,

    alignItems: "center",
  },
});

export default AuthScreen;
