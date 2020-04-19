import React, { Component } from "react";

import { Ionicons } from "@expo/vector-icons";

import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import Storage from "./storage";

export default class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      symbol: this.props.symbol,
      units: this.props.units,
      purchasedAt: this.props.purchasedAt,
      closes: [],
      currentTotal: 0,
      prevTotal: 0,
      diff: 0,
      diffPercent: 0,
    };

    this._updateData();
  }

  componentDidMount() {
    this.interval = setInterval(() => this._updateData(), 30000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  _updateData = () => {
    this._pullDataFromServer().then(() => {
      try {
        Storage.getItem("temp_data")
          .then((data) => {
            this.setState({ data: data }, () => {
              this._getCurrentValue();
            });
          })
          .then(() => {
            console.log(this.state);
          });
      } catch (error) {
        console.log(error);
      }
    });
  };

  _pullDataFromServer = async () => {
    let apikey = "4SV97U9C4NSEY1KD";
    let func = "TIME_SERIES_INTRADAY";
    let symbol = this.state.symbol;
    let interval = "5min";
    let outputsize = "full";
    let query = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${apikey}`;

    // const data = {};
    fetch(query)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (Object.keys(data)[0] == "Meta Data") {
          console.log(data);
          Storage.setItem("temp_data", data);
        } else {
          console.error("Could not retrieve stock info at this time.");
        }
      });
  };

  _getCurrentValue = () => {
    // TODO: Pull down and update closes instead of temp data
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

    let currentTotal =
      Math.round(
        (closes[closes.length - 1] * this.state.units + Number.EPSILON) * 100
      ) / 100;
    let prevTotal =
      Math.round(
        (this.state.units * this.state.purchasedAt + Number.EPSILON) * 100
      ) / 100;
    let diff =
      Math.round((currentTotal - prevTotal + Number.EPSILON) * 100) / 100;
    let diffPercent =
      Math.round(
        ((currentTotal / prevTotal - 1) * 100 + Number.EPSILON) * 100
      ) / 100;
    this.setState({ currentTotal, prevTotal, diff, diffPercent });
  };

  render = () => {
    return (
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.first}>{this.state.currentTotal}</Text>
          <Text style={styles.first}>{this.state.symbol}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.second}>{this.state.prevTotal}</Text>
          <Text style={styles.second}>
            {this.state.diff} ({this.state.diffPercent})
          </Text>
        </View>
      </View>
    );
  };
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  body: {
    height: height / 7,
    width: width * 0.95,
    margin: width * 0.05,
    borderRadius: 7,
    backgroundColor: "tomato",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  first: {
    color: "white",
    fontSize: 24,
    marginLeft: width * 0.09,
    marginRight: width * 0.09,
    marginBottom: 0,
  },
  second: {
    color: "white",
    fontSize: 14,
    marginLeft: width * 0.12,
    marginRight: width * 0.12,
  },
});
