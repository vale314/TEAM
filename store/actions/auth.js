import { AsyncStorage } from "react-native";

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
export const SET_DID_TRY_AL = "SET_DID_TRY_AL";

import CONFIG from "../../config";

import { alert } from "./alert";

const path =
  process.env.NODE_ENV == "development" ? CONFIG.development : CONFIG.deploy;

let timer;

export const setDidTryAL = () => {
  return { type: SET_DID_TRY_AL };
};

export const authenticate = (userId = "", token, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

export const signup = (
  email,
  password,
  cellphone,
  firstname,
  lastname,
  code,
  image,
  abort
) => {
  return async (dispatch) => {
    const response = await fetch(`${path}/api/auth/user-new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        user_password: password,
        firstname: firstname,
        lastname: lastname,
        cellphone: cellphone,
        code: code,
        image: image,
      }),
    });

    const resData = await response.json();

    if (resData.error) {
      const error = resData.msg;
      // Dispatch error

      return alert("Hay Un Error", error);
    }

    dispatch(
      authenticate(resData.localId, resData.token, parseInt(resData.expires))
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expires)
    );
    saveDataToStorage(resData.token, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(`${path}/api/auth/user-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        user_password: password,
      }),
    });

    const resData = await response.json();

    if (resData.error) {
      const error = resData.msg;

      return alert("Hay Un Error", error);
    }
    dispatch(
      authenticate(resData.localId, resData.token, parseInt(resData.expires))
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expires)
    );
    saveDataToStorage(resData.token, resData.localId, expirationDate);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
