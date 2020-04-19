import React, { Component } from "react";

import { Ionicons } from "@expo/vector-icons";

import {
  Text,
  View,
  TextInput,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import Card from "./components/card";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.data = [{ symbol: "ASX:NDQ", units: 37, purchasedAt: 21.6041 }];
  }

  render = () => {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.data}
          renderItem={({ item }) => (
            <Card
              symbol={item.symbol}
              units={item.units}
              purchasedAt={item.purchasedAt}
            ></Card>
          )}
          keyExtractor={(item) => item.symbol}
        />
      </View>
    );
  };
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
