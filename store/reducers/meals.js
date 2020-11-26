import {
  TOGGLE_FAVORITE,
  SET_FILTERS,
  SET_PRODUCTS_MEALS,
} from "../actions/meals";

const initialState = {
  meals: [],
  filteredMeals: [],
  favoriteMeals: [],
  filters: {
    glutenFree: false,
    lactoseFree: false,
    vegetarian: false,
    vegan: false,
  },
};

const mealsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS_MEALS:
      return {
        ...state,
        meals: action.products,
      };
    case TOGGLE_FAVORITE:
      const existingIndex = state.favoriteMeals.findIndex(
        (meal) => meal.id === action.mealId
      );
      if (existingIndex >= 0) {
        const updatedFavMeals = [...state.favoriteMeals];
        updatedFavMeals.splice(existingIndex, 1);
        return { ...state, favoriteMeals: updatedFavMeals };
      } else {
        const meal = state.meals.find((meal) => meal.id === action.mealId);
        return { ...state, favoriteMeals: state.favoriteMeals.concat(meal) };
      }
    case SET_FILTERS:
      const appliedFilters =
        action.filters !== undefined ? action.filters : state.filters;
      const updatedFilteredMeals = state.meals.filter((meal) => {
        if (appliedFilters.glutenFree && !meal.isGlutenFree) {
          return false;
        }
        if (appliedFilters.lactoseFree && !meal.isLactoseFree) {
          return false;
        }
        if (appliedFilters.vegetarian && !meal.isVegetarian) {
          return false;
        }
        if (appliedFilters.vegan && !meal.isVegan) {
          return false;
        }
        return true;
      });
      return {
        ...state,
        filteredMeals: updatedFilteredMeals,
        filters: action.filters !== undefined ? action.filters : state.filters,
      };
    default:
      return state;
  }
};

export default mealsReducer;
