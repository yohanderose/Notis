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

import Card from "../components/card";
import Storage from "../components/storage";

export default class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.data = [{ symbol: "ASX:NDQ", units: 37, purchasedAt: 21.6041 }];
  }

  // _EXAMPLE() {
  //   Storage.setItem("EXAMPLE", )
  // }

  // _getInvestmets = () => {

  // }

  _addInvestment = () => {};

  render() {
    return (
      <View style={styles.container}>
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
          <TouchableOpacity style={styles.add} onPress={this._addInvestment}>
            <Ionicons style={styles.add_icon} name="ios-add" color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    width: width / 7,
    height: width / 7,
    borderRadius: 50,
    backgroundColor: "tomato",
    position: "absolute",
    bottom: 20,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  add_icon: {
    fontSize: 32,
  },
});
