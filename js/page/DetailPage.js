import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigatorUtil from '../navigator/NavigatorUtil';
import WebView from 'react-native-webview';
import BackPressComponent from '../common/BackPressComponent';
const TRENDING_URL = 'https://github.com/';
export default class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {projectModel} = this.params;
    this.url = projectModel.html_url || TRENDING_URL + projectModel.fullName;
    const title = projectModel.full_name || projectModel.fullName;
    this.state = {
      title: title,
      url: this.url,
      canGoBack: false,
      isFavorite: false,
    };
    this.backPress = new BackPressComponent({
      backPress: () => this.onBackPress(),
    });
  }
  componentDidMount(): void {
    this.backPress.componentDidMount();
  }
  componentWillUnmount(): void {
    this.backPress.componentWillUnmount();
  }

  onBackPress() {
    this.back();
    return true;
  }
  back() {
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      NavigatorUtil.goBack(this.props.navigation);
    }
  }
  favorite() {
    this.setState({
      isFavorite: !this.state.isFavorite,
    });
  }
  share() {}
  onNavigationStateChange(navigator) {
    this.setState({
      canGoBack: navigator.canGoBack,
    });
  }
  render() {
    const titleStyle = this.state.title.length > 20 ? {paddingRight: 30} : null;
    return (
      <View style={styles.container}>
        <NavigationBar
          title={this.state.title}
          titleLayoutStyle={titleStyle}
          leftButton={ViewUtil.getLeftBackButton(() => this.back())}
          rightButton={this.renderRightButton()}
        />
        <WebView
          style={{flex: 1, backgroundColor: '#0ff'}}
          ref={webView => (this.webView = webView)}
          startInLoadingState={true}
          onNavigationStateChange={navigator =>
            this.onNavigationStateChange(navigator)
          }
          source={{uri: this.state.url}}
        />
      </View>
    );
  }
  renderRightButton() {
    return (
      <View style={{flexDirection: 'row'}}>
        {ViewUtil.getFavoriteButton(
          () => this.favorite(),
          this.state.isFavorite,
        )}
        {ViewUtil.getShareButton(() => this.share())}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
