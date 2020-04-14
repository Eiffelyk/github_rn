import React, {Component} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
const KEY = 'Save_Key';
export default class AsyncStoreDemoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showText: '',
    };
  }

  saveData() {
    AsyncStorage.setItem(KEY, this.searchKey, error => {
      error && console.log(error.toString());
    });
  }

  async getData() {
    try {
      let value = await AsyncStorage.getItem(KEY);
      this.setState({
        showText: value,
      });
    } catch (e) {
      this.setState({
        showText: e.toString,
      });
    }
  }
  removeData() {
    AsyncStorage.removeItem(KEY).catch(r => {
      this.setState({
        showText: r.toString,
      });
    });
  }

  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>AsyncStore Demo</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => {
            this.searchKey = text;
          }}
        />
        <Button title={'存储-'} onPress={() => this.saveData()} />
        <Button title={'读取'} onPress={() => this.getData()} />
        <Button title={'删除'} onPress={() => this.removeData()} />
        <Text>{this.state.showText}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderColor: 'black',
    borderWidth: 2,
    height: 40,
    width: 350,
  },
  welcome: {
    fontSize: 40,
    color: '#00f',
  },
});
