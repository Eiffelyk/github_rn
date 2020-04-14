import React, {Component} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import DataStore from '../expand/dao/DataStore';
export default class DataStoreDemoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showText: '',
    };
    this.dataStore = new DataStore();
  }
  loadData() {
    let url = 'https://api.github.com/search/repositories?q=' + this.searchKey;
    this.dataStore
      .fetchData(url)
      .then(data => {
        let dataString =
          '加载时间：' +
          new Date(data.timestamp) +
          '\nData=' +
          JSON.stringify(data.data);
        this.setState({
          showText: dataString,
        });
      })
      .catch(e => {
        e && console.error(e.toString());
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>DataStore Demo</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => {
            this.searchKey = text;
          }}
        />
        <Button title={'请求'} onPress={() => this.loadData()} />
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
