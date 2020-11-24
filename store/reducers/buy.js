import { SET_BUYS } from "../actions/buy";

const initialState = {
  buys: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_BUYS:
      return {
        ...state,
        buys: action.buys,
      };
  }
  return state;
};
