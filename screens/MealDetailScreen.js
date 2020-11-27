import React, { useEffect, useCallback, useState } from "react";
import {
  ScrollView,
  View,
  Image,
  Text,
  StyleSheet,
  Button,
  Linking,
  ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../components/HeaderButton";
import DefaultText from "../components/DefaultText";
import { toggleFavorite } from "../store/actions/meals";

import Colors from "../constants/Colors";
import { alert } from "../store/actions/alert";

const path = "https://cucei-eats.herokuapp.com";

const ListItem = (props) => {
  return (
    <View style={styles.listItem}>
      <DefaultText>{props.children}</DefaultText>
    </View>
  );
};

const MealDetailScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const availableMeals = useSelector((state) => state.meals.meals);
  const userId = useSelector((state) => state.auth.userId);

  const mealId = props.route.params.mealId;
  const currentMealIsFavorite = useSelector((state) =>
    state.meals.favoriteMeals.some((meal) => meal.id === mealId)
  );

  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

  const dispatch = useDispatch();

  const toggleFavoriteHandler = useCallback(() => {
    dispatch(toggleFavorite(mealId));
  }, [dispatch, mealId]);

  useEffect(() => {
    // props.navigation.setParams({ mealTitle: selectedMeal.title });
    props.navigation.setParams({ toggleFav: toggleFavoriteHandler });
  }, [toggleFavoriteHandler]);

  useEffect(() => {
    props.navigation.setParams({ isFav: currentMealIsFavorite });
  }, [currentMealIsFavorite]);

  const buyItem = async () => {
    setIsLoading(true);
    const response = await fetch(`${path}/api/users/buy-products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userId,
        id: mealId,
      }),
    });

    const resData = await response.json();

    if (resData.error) {
      const error = resData.msg;

      setIsLoading(false);
      return alert("Error", error);
    }
    Linking.openURL(
      `http://api.whatsapp.com/send?phone=+52${selectedMeal.cellphone}`
    );
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView>
      <Image
        source={{ uri: `data:image/gif;base64,${selectedMeal.imageUrl}` }}
        style={styles.image}
      />
      <View style={styles.details}>
        <DefaultText>$ {selectedMeal.precio}</DefaultText>
        <Button title={"Comprar"} color={Colors.primary} onPress={buyItem} />
        <DefaultText>{selectedMeal.estandar.toUpperCase()}</DefaultText>
      </View>
      <Text style={styles.title}>Ingredientes</Text>
      {selectedMeal.ingredients.map((ingredient) => (
        <ListItem key={ingredient}>{ingredient}</ListItem>
      ))}
      <Text style={styles.title}>Descripcion</Text>
      <ListItem>{selectedMeal.descripcion}</ListItem>
    </ScrollView>
  );
};

export const screenOptions = (navData) => {
  // const mealId = navigationData.navigation.getParam('mealId');
  const mealTitle = navData.route.params.mealTitle;
  const toggleFavorite =
    navData.route.params.toggleFav !== undefined
      ? navData.route.params.toggleFav
      : null;
  const isFavorite = navData.route.params.isFav;
  // const selectedMeal = MEALS.find(meal => meal.id === mealId);
  return {
    headerTitle: mealTitle,
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Favorite"
          iconName={isFavorite ? "ios-star" : "ios-star-outline"}
          onPress={toggleFavorite}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
  },
  details: {
    flexDirection: "row",
    padding: 15,
    justifyContent: "space-around",
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 22,
    textAlign: "center",
  },
  listItem: {
    marginVertical: 10,
    marginHorizontal: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
  },
  descripcion: {
    textAlign: "justify",
  },
});

export default MealDetailScreen;
