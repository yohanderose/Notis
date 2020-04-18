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

    this.state = { data: {}, closes: [], units: 37, purchasedAt: 21.6041 };
    this._testing1();
  }

  _testing1 = async () => {
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
    let data = Array(this.state.data["Time Series (5min)"])["0"];
    // console.log(data);
    let closes = [];
    let labels = [];
    Object.keys(data).forEach((index) => {
      // console.log(data[index]["4. close"]);
      labels.unshift(index);
      closes.unshift(parseFloat(data[index]["4. close"]));
    });
    this.setState({ closes });

    let currentPrice = closes[closes.length - 1];
    let currentTotal = currentPrice * this.state.units;
    let prevTotal = this.state.units * this.state.purchasedAt;
    let diff = currentTotal - prevTotal;
    diff = Math.round((diff + Number.EPSILON) * 100) / 100;
    let diffpercent =
      Math.round(
        ((currentTotal / prevTotal - 1) * 100 + Number.EPSILON) * 100
      ) / 100;
    console.log(diff.toString(), "(" + diffpercent.toString() + ")");
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
    return (
      <View style={styles.container}>
        <LineChart
          data={{
            datasets: [
              {
                data: this.state.closes,
              },
            ],
          }}
          width={width} // from react-native
          height={220}
          // yAxisLabel="$"
          // yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          getDotProps={(value, index) => {
            let result = {
              r: "0",
              strokeWidth: "0",
              stroke: "#ffa726",
            };

            if (index == this.state.closes.length - 1) {
              result.r = "8";
            }
            return result;
          }}
          chartConfig={{
            backgroundColor: "#6D7FB3",
            backgroundGradientFrom: "#6D7FB3",
            backgroundGradientTo: "#6D7FB3",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            // style: {
            //   alignContent: "center",
            //   margin: width * 0.02,
            // },
          }}
          bezier
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
