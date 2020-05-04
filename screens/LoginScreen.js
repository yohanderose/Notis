import React, { Component } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import * as Google from "expo-google-app-auth";

import Storage from "../components/storage";

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
    this._getUser();
  }

  _getUser = async () => {
    try {
      let user = await Storage.getItem("user-google");
      if (user) {
        this.setState({ user });
      }
    } catch (error) {
      console.log("Error checking if user exists.");
    }
  };

  _setUser = async () => {
    try {
      Storage.setItem("user-google", this.state.user);
      console.log("User saved in persistent memory under 'user-google'");
    } catch (error) {
      console.log("Error saving user.");
    }
  };

  signInWithGoogleAsync = async () => {
    if (this.state.user == null) {
      try {
        const result = await Google.logInAsync({
          androidClientId:
            "64796985151-v6k968phmbccfteg3phgvmnqrfvtvhoc.apps.googleusercontent.com",
          iosClientId:
            "64796985151-nnqp4mdutcdcs7d22lq3gue1335b4j4o.apps.googleusercontent.com",
          webClientId:
            "64796985151-ajudo47hee2nfqhlq5nvvccl3kcredb4.apps.googleusercontent.com",
          scopes: ["profile", "email"],
        });

        if (result.type === "success") {
          this.setState({ user: result.user }, () => {
            this._setUser();
          });
          // console.log(result);
        } else {
          return { cancelled: true };
        }
      } catch (e) {
        return { error: true };
      }
    } else {
      this.props.navigation.navigate("DashboardScreen");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Sign in with Google"
          onPress={() => {
            this.signInWithGoogleAsync();
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
