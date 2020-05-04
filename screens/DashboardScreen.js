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
    this.state = { data: [] };

    // Load in some dummy data for testing
    this._TEMP().then(() => {
      this._getInvestmets();
    });
  }

  _TEMP = async () => {
    await Storage.setItem("user-investments", [
      { symbol: "ASX:NDQ", units: 43, purchasedAt: 23.19 },
    ]);
  };

  _getInvestmets = async () => {
    try {
      let data = await Storage.getItem("user-investments");
      this.setState({ data }, () => {
        console.log("User Investent Data", data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  _setInvestments = async () => {
    try {
      await Storage.setItem("user-investments", this.state.data);
    } catch (error) {
      console.log(error);
    }
  };

  // _addInvestment = () => {};

  _removeInvestment = (symbol) => {
    console.log(symbol);
    let data = this.state.data;
    for (let i = 0; i < data.length; i++) {
      if (data[i].symbol == symbol) {
        data.splice(i, 1);
        console.log(data);
        this.setState({ data }, () => {
          this._setInvestments();
        });
        return;
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <FlatList
            data={this.state.data}
            extraData={this.state}
            renderItem={({ item }) => (
              <Card
                symbol={item.symbol}
                units={item.units}
                purchasedAt={item.purchasedAt}
                removeInvestment={this._removeInvestment}
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
