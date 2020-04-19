import React, { Component } from "react";

import { LineChart } from "react-native-chart-kit";

import { Dimensions, StyleSheet } from "react-native";

export default class Chart extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props.data);
    this.state = { closes: this.props.data };
  }

  render = () => {
    return (
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
    );
  };
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({});
