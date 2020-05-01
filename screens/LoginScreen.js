import React, { Component } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import * as GoogleSignIn from "expo-google-sign-in";

export default class LoginScreen extends Component {
  state = { user: null };

  componentDidMount() {
    this.initAsync();
  }

  initAsync = async () => {
    await GoogleSignIn.initAsync({
      // You may ommit the clientId when the firebase `googleServicesFile` is configured
      clientId: "<YOUR_IOS_CLIENT_ID>",
    });
    this._syncUserWithStateAsync();
  };

  _syncUserWithStateAsync = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync();
    this.setState({ user });
  };

  signOutAsync = async () => {
    await GoogleSignIn.signOutAsync();
    this.setState({ user: null });
  };

  signInAsync = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === "success") {
        this._syncUserWithStateAsync();
      }
    } catch ({ message }) {
      alert("Login Error:" + message);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Sign in with Google"
          onPress={() => {
            if (this.state.user) {
              this.signOutAsync();
            } else {
              this.signInAsync();
            }
          }}
        ></Button>
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
