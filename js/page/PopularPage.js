import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';

export default class PopularPage extends Component {
  _TopNavigator() {
    return createAppContainer(
      createMaterialTopTabNavigator({
        PopularTab1: {
          screen: PopularTab,
          navigationOptions: {
            title: 'Tab1',
          },
        },
        PopularTab2: {
          screen: PopularTab,
          navigationOptions: {
            title: 'Tab2',
          },
        },
      }),
    );
  }
  render() {
    const TopBar = this._TopNavigator();
    return (
      <View style={styles.container}>
        <TopBar />
      </View>
    );
  }
}
class PopularTab extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>PopularTab</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  welcome: {
    fontSize: 40,
    color: '#00f',
  },
});
