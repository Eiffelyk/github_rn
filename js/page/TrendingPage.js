import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default class TrendingPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>TrendingPage</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 40,
    color: '#00f',
  },
});
