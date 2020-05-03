import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as firebase from "firebase";

import Storage from "../components/storage";

export default class LoadingScreen extends Component {
  componentDidMount = () => {
    this.checkIfLoggedIn();
  };

  checkIfLoggedIn = async () => {
    try {
      let user = await Storage.getItem("user-google");
      if (user) {
        console.log("User Found\n", user);
        this.props.navigation.navigate("DashboardScreen");
      } else {
        this.props.navigation.navigate("LoginScreen");
      }
    } catch (error) {
      this.props.navigation.navigate("LoginScreen");
    }
    // firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     this.props.navigation.navigate("DashboardScreen");
    //   } else {
    //     // this.props.navigation.navigate("DashboardScreen");
    //     this.props.navigation.navigate("LoginScreen");
    //   }
    // });
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="tomato"></ActivityIndicator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
