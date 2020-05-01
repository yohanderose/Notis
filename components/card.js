import React, { Component } from "react";

import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Button,
  Vibration,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

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
      // Notification stuff
      expoPushToken: "",
      notification: {},
    };

    this._updateData();
  }

  componentDidMount() {
    this.interval = setInterval(() => this._updateData(), 30000);

    this.registerForPushNotificationsAsync();
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
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
            // console.log(this.state);
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
        try {
          console.log("Data retrieved from AlphaVantage");
          Storage.setItem("temp_data", data);
        } catch (error) {
          console.error("Could not retrieve stock info at this time...");
          console.log(error);
        }
      });
  };

  _getCurrentValue = async () => {
    // TODO: Pull down and update closes instead of temp data
    try {
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

      this.setState({ currentTotal, prevTotal, diff, diffPercent }, () => {
        if (this.state.diffPercent > 5) {
          this.sendPushNotification();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();
      // console.log(token);
      this.setState({ expoPushToken: token });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("default", {
        name: "default",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  _handleNotification = (notification) => {
    Vibration.vibrate();
    // console.log(notification);
    this.setState({ notification: notification });
  };

  sendPushNotification = async () => {
    const message = {
      to: this.state.expoPushToken,
      sound: "default",
      title: `${this.state.symbol} is up ${this.state.diffPercent}%`,
      body: "Consider making a trade.",
      data: { data: "goes here" },
      _displayInForeground: true,
    };
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    console.log("Sending push notification re prospective trade.");
  };

  render = () => {
    return (
      <View>
        <View style={styles.body}>
          <View style={styles.row}>
            <Text style={styles.first}>{this.state.currentTotal}</Text>
            <Text style={styles.first}>{this.state.symbol}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.second}>{this.state.prevTotal}</Text>
            <Text style={styles.second}>
              {this.state.diff} ({this.state.diffPercent}%)
            </Text>
          </View>
        </View>

        {/* To help in visualising what comes back from notifications */}
        {/* 
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text>Origin: {this.state.notification.origin}</Text>
          <Text>Data: {JSON.stringify(this.state.notification.data)}</Text>
        </View>
        <Button
          title={"Press to Send Notification"}
          onPress={() => this.sendPushNotification()}
        /> */}
      </View>
    );
  };
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  body: {
    height: height / 7,
    width: width * 0.95,
    borderRadius: 7,
    backgroundColor: "tomato",
    marginTop: height / 12,
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
