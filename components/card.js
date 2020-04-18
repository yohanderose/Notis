import React, { Component } from "react";

import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default class Card extends Component {
  render = () => {
    return <TouchableOpacity style={styles.main}></TouchableOpacity>;
  };
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  main: {
    height: height / 7,
    width: width * 0.95,
    margin: width * 0.05,
    borderRadius: 7,
    backgroundColor: "tomato",
  },
});
