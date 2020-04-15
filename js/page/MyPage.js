import React, {Component} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action';
import NavigatorUtil from '../navigator/NavigatorUtil';
class MyPage extends Component {
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>MyPage</Text>
        <Button
          title={'修改主题灰色'}
          onPress={() => this.props.onThemeChange('gray')}
        />
        <Text
          onPress={() => {
            NavigatorUtil.goPage({}, 'DetailPage');
          }}>
          PopularTab
        </Text>

        <Text
          onPress={() => {
            NavigatorUtil.goPage({}, 'FetchDemoPage');
          }}>
          Fetch Demo
        </Text>
        <Text
          onPress={() => {
            NavigatorUtil.goPage({}, 'AsyncStoreDemoPage');
          }}>
          AsyncStoreDemoPage Demo
        </Text>
        <Text
          onPress={() => {
            NavigatorUtil.goPage({}, 'DataStoreDemoPage');
          }}>
          DataStoreDemoPage Demo
        </Text>
        <Button
          title={'修改成蓝色'}
          onPress={() =>
            navigation.setParams({
              theme: {
                tintColor: 'blue',
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

const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme)),
});

export default connect(
  null,
  mapDispatchToProps,
)(MyPage);
