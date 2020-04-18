import React, { Component } from "react";

import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";

import {
  Text,
  View,
  TextInput,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import Storage from "./components/storage";
import Card from "./components/card";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = { data: {} };

    // this._pullDataServerAPI();

    this._testing1();
  }

  _testing1 = () => {
    try {
      Storage.getItem("temp_data").then((data) => {
        this.setState({ data: data }, () => {
          this._testing2();
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  _testing2 = () => {
    console.log(this.state.data);
  };

  _pullDataServerAPI = () => {
    let apikey = "4SV97U9C4NSEY1KD";
    let func = "TIME_SERIES_INTRADAY";
    let symbol = "ASX:NDQ";
    let interval = "5min";
    let outputsize = "full";
    let query = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${apikey}`;

    // const data = {};
    fetch(query)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        //Storage.setItem("temp_data", data);
      });
  };

  render = () => {
    return <View style={styles.container}></View>;
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
