import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NavigatorUtil from '../navigator/NavigatorUtil';

export default class WelcomePage extends Component {
  componentDidMount() {
    this.timer = setTimeout(() => {
      // go home Page
      NavigatorUtil.resetToHomePage(this.props);
    }, 500);
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>WelcomePage</Text>
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
});
