import React, {Component} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

export default class MyPage extends Component {
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>MyPage</Text>
        <Button
          title={'修改主题灰色'}
          onPress={() =>
            navigation.setParams({
              theme: {
                tintColor: 'gray',
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
