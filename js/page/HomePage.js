import React, {Component} from 'react';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import NavigatorUtil from '../navigator/NavigatorUtil';
export default class HomePage extends Component {
  render() {
    NavigatorUtil.navigation = this.props.navigation;
    return <DynamicTabNavigator />;
  }
}
