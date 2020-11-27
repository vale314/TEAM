export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";
export const SET_PRODUCTS_MEALS = "SET_PRODUCTS_MEALS";
export const SET_FILTERS = "SET_FILTERS";

import Meal from "../../models/meal";

const path = "https://cucei-eats.herokuapp.com";

const arrayConvert = (json) => {
  var arrayJson = [];

  if (json.desayuno) arrayJson.push("c1");
  if (json.comida) arrayJson.push("c2");
  if (json.snack) arrayJson.push("c3");
  if (json.lonche) arrayJson.push("c4");
  if (json.sandiwch) arrayJson.push("c5");
  if (json.taco) arrayJson.push("c6");
  if (json.pan) arrayJson.push("c7");
  if (json.dulce) arrayJson.push("c8");

  return arrayJson;
};

export const fetchProducts = () => {
  return async (dispatch) => {
    // any async code you want!

    const response = await fetch(`${path}/api/users/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resData = await response.json();

    if (resData.error) {
      const error = resData.msg;
      // Dispatch error

      return alert("Hay Un Error", error);
    }

    var loadedProducts = [];

    loadedProducts = resData.products;

    var productsClass = [];

    loadedProducts.map((i) => {
      const convert = arrayConvert(i);
      productsClass.push(
        new Meal(
          i.id,
          convert,
          i.title,
          "cheap",
          i.imageurl,
          parseInt(i.price),
          i.ingredients.split(","),
          i.description_product.split(),
          i.glutenFree,
          i.vegan,
          i.vegetarian,
          i.lactosaFree,
          i.cellphone
        )
      );
    });

    await dispatch({
      type: SET_PRODUCTS_MEALS,
      products: productsClass,
    });

    dispatch({
      type: SET_FILTERS,
    });

    dispatch({
      type: SET_PRODUCTS,
      products: productsClass,
    });
  };
};
