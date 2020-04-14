import React, {Component} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';

export default class FetchDemoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showText: '',
    };
  }
  loadData() {
    let url = 'https://api.github.com/search/repositories?q=' + this.searchKey;
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error('no work');
        }
      })
      .then(responseText => {
        this.setState({
          showText: responseText,
        });
      })
      .catch(e => {
        this.setState({
          showtText: e,
        });
      });
  }

  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Fetch Demo</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => {
            this.searchKey = text;
          }}
        />
        <Button title={'网络请求'} onPress={() => this.loadData()} />
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
