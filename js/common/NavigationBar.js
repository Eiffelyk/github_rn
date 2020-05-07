import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {
  ViewPropTypes,
  View,
  StatusBar,
  Text,
  StyleSheet,
  Platform,
  DeviceInfo,
} from 'react-native';
const NAV_BAR_HEIGHT_IOS = 55; //导航栏在iOS中的高度
const NAV_BAR_HEIGHT_ANDROID = 40; //导航栏在Android中的高度
const NAV_BAR_HEIGHT =
  Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID;
const STATUS_BAR_HEIGHT =
  Platform.OS === 'ios' && DeviceInfo.isIPhoneX_deprecated ? 20 : 0; //状态栏的高度
const StatusBarShape = {
  barStyle: PropTypes.oneOf(['light-content', 'default']),
  hidden: PropTypes.boolean,
  backgroundColor: PropTypes.string,
};
export default class NavigationBar extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    titleView: PropTypes.element,
    titleLayoutStyle: ViewPropTypes.style,
    hide: PropTypes.bool,
    statusBar: PropTypes.shape(StatusBarShape),
    leftButton: PropTypes.element,
    rightButton: PropTypes.element,
  };
  static defaultProps = {
    statusBar: {
      barStyle: 'light-content',
      hidden: false,
    },
  };
  render() {
    let statusBar = this.props.statusBar.hidden ? null : (
      <View style={styles.statusBar}>
        <StatusBar {...this.props.statusBar} />
      </View>
    );
    let titleView = this.props.titleView ? (
      this.props.titleView
    ) : (
      <Text style={styles.title} ellipsizeMode={'head'} numberOfLines={1}>
        {this.props.title}
      </Text>
    );
    let content = this.props.hide ? null : (
      <View style={styles.content}>
        {this.getButtonElement(this.props.leftButton)}
        <View style={[styles.titleContainer, this.props.titleLayoutStyle]}>
          {titleView}
        </View>
        {this.getButtonElement(this.props.rightButton)}
      </View>
    );
    return (
      <View style={[styles.container, this.props.style]}>
        {statusBar}
        {content}
      </View>
    );
  }
  getButtonElement(data) {
    return <View>{data ? data : null}</View>;
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F00',
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
  content: {
    height: NAV_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 60,
    right: 60,
    top: 0,
    bottom: 0,
  },
});
