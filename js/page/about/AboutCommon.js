import React from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  StyleSheet,
  DeviceInfo,
  Platform,
} from 'react-native';
import BackPressComponent from '../../common/BackPressComponent';
import NavigatorUtil from '../../navigator/NavigatorUtil';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import GlobalStyles from '../../res/style/GlobalStyles';
import ViewUtil from '../../util/ViewUtil';
export const FLAG_ABOUT = {flag_about: 'about', flag_about_me: 'about_me'};
export default class AboutCommon {
  constructor(props, updateState) {
    this.props = props;
    this.updateState = updateState;
    this.backPress = new BackPressComponent({
      backPress: () => this.onBackPress(),
    });
  }
  componentDidMount() {
    this.backPress.componentDidMount();
    fetch('http://www.devio.org/io/GitHubPopular/json/github_app_config.json')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('NetWork Error');
      })
      .then(data => {
        if (data) {
          this.updateState({data: data});
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  onBackPress() {
    NavigatorUtil.goBack(this.props.navigation);
    return true;
  }
  onShare() {}
  getParallaxScrollViewConfig(params) {
    let config = {};
    let avatar =
      typeof params.avatar === 'string' ? {uri: params.avatar} : params.avatar;
    config.renderBackground = () => (
      <View key="background">
        <Image
          source={{
            uri: params.backgroundImg,
            width: window.width,
            height: PARALLAX_HEADER_HEIGHT,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: window.width,
            backgroundColor: 'rgba(0,0,0,.4)',
            height: PARALLAX_HEADER_HEIGHT,
          }}
        />
      </View>
    );
    config.renderForeground = () => (
      <View key="parallax-header" style={styles.parallaxHeader}>
        <Image style={styles.avatar} source={avatar} />
        <Text style={styles.sectionSpeakerText}>{params.name}</Text>
        <Text style={styles.sectionTitleText}>{params.description}</Text>
      </View>
    );
    config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    );
    config.renderFixedHeader = () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtil.getLeftBackButton(() =>
          NavigatorUtil.goBack(this.props.navigation),
        )}
        {ViewUtil.getShareButton(() => this.onShare())}
      </View>
    );
    return config;
  }
  render(contentView, params) {
    const parallaxConfig = this.getParallaxScrollViewConfig(params);
    return (
      <ParallaxScrollView
        backgroundColor={this.props.navigation.state.params.theme.themeColor}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        backgroundScrollSpeed={10}
        contentBackgroundColor={GlobalStyles.backgroundColor}
        {...parallaxConfig}>
        {contentView}
      </ParallaxScrollView>
    );
  }
}
const window = Dimensions.get('window');
const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 300;
const TOP =
  Platform.OS === 'ios' ? 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : 0;
const STICKY_HEADER_HEIGHT =
  Platform.OS === 'ios'
    ? GlobalStyles.nav_bar_height_ios + TOP
    : GlobalStyles.nav_bar_height_android;
const styles = StyleSheet.create({
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    alignItems: 'center',
    paddingTop: TOP,
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10,
  },
  fixedSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: TOP,
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20,
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 50,
  },
  avatar: {
    marginBottom: 10,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5,
    marginBottom: 10,
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
    marginLeft: 10,
  },
});
