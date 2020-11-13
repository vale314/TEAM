import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

import Input from "../components/UI/Input";
import Card from "../components/UI/Card";
import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth";

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
      image: "",
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
        formState.inputValues.image,
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
        <Card style={styles.authContainer}>
          <ScrollView>
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
                  id="image"
                  label="Image"
                  keyboardType="default"
                  required
                  autoCapitalize="none"
                  errorText="Porfavor ingrese Su Imagen"
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

            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title={isSignup ? "Sign Up" : "Login"}
                  color={Colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignup ? "Login" : "Sign Up"}`}
                color={Colors.accent}
                onPress={() => {
                  props.navigation.setOptions({
                    headerTitle: isSignup ? "Login" : "Sign Up",
                  });
                  setIsSignup((prevState) => !prevState);
                }}
              />
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
    maxHeight: 600,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default AuthScreen;
