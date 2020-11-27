export const SET_BUYS = "SET_BUYS";

import CONFIG from "https://cucei-eats.herokuapp.com";

const path =
  process.env.NODE_ENV == "development" ? CONFIG.development : CONFIG.deploy;

export const fetchBuys = (email) => {
  return async (dispatch) => {
    // any async code you want!

    const response = await fetch(`${path}/api/users/buy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    const resData = await response.json();

    if (resData.error) {
      const error = resData.msg;
      // Dispatch error

      return alert("Hay Un Error", error);
    }

    var loadedBuys = resData.buys;

    dispatch({
      type: SET_BUYS,
      buys: loadedBuys,
    });
  };
};
