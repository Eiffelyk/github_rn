import React, {Component} from 'react';
import {View, Text, Button, TouchableOpacity, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigatorUtil from '../navigator/NavigatorUtil';
import NavigationBar from '../common/NavigationBar';
const THEME_COLOR = '#F00';
class MyPage extends Component {
  leftButton() {
    return (
      <TouchableOpacity
        onPress={() => this.leftButtonOnPress()}
        style={styles.leftButton}>
        <Ionicons name={'ios-arrow-back'} size={26} style={{color: 'white'}} />
      </TouchableOpacity>
    );
  }
  leftButtonOnPress() {}
  rightButton() {
    return (
      <TouchableOpacity
        onPress={() => this.rightButtonOnPress()}
        style={styles.rightButton}>
        <Feather name={'search'} size={26} style={{color: 'white'}} />
      </TouchableOpacity>
    );
  }
  rightButtonOnPress() {}
  render() {
    const {navigation} = this.props;
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let NavigationBarA = (
      <NavigationBar
        title={'我的'}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}
        leftButton={this.leftButton()}
        rightButton={this.rightButton()}
      />
    );
    return (
      <View style={styles.container}>
        {NavigationBarA}
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
  },
  leftButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    paddingLeft: 12,
  },
  rightButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    paddingLeft: 12,
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
