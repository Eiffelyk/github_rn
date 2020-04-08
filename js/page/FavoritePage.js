import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

export default class FavoritePage extends Component {
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>FavoritePage</Text>
        <Button
          title={'修改成橙色'}
          onPress={() =>
            navigation.setParams({
              theme: {
                tintColor: 'orange',
                updateTime: new Date().getTime(),
              },
            })
          }
        />
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
