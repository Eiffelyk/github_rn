import React, {Component} from 'react';
import {View} from 'react-native';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import NavigatorUtil from '../navigator/NavigatorUtil';
import ThemeDialog from './ThemeDialog';
import actions from '../action';
import {connect} from 'react-redux';
class HomePage extends Component {
  renderCustomThemeView() {
    const {customThemeViewVisible, onShowThemeView} = this.props;
    return (
      <ThemeDialog
        {...this.props}
        visible={customThemeViewVisible}
        onClose={() => onShowThemeView(false)}
      />
    );
  }
  render() {
    NavigatorUtil.navigation = this.props.navigation;
    return (
      <View style={{flex: 1}}>
        <DynamicTabNavigator />
        {this.renderCustomThemeView()}
      </View>
    );
  }
}
const mapStateToProps = state => ({
  nav: state.nav,
  customThemeViewVisible: state.theme.customThemeViewVisible,
  theme: state.theme.theme,
});
const mapDispatchToProps = dispatch => ({
  onShowThemeView: show => dispatch(actions.onShowThemeView(show)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage);
