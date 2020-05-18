import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import NavigatorUtil from '../navigator/NavigatorUtil';
import WebView from 'react-native-webview';
import BackPressComponent from '../common/BackPressComponent';
import FavoriteDao from '../expand/dao/FavoriteDao';
import FavoriteUtil from '../util/FavoriteUtil';
const TRENDING_URL = 'https://github.com/';
export default class WebviewPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {title, url} = this.params;
    this.state = {
      title: title,
      url: url,
      canGoBack: false,
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
    const {projectModel, flag, callback} = this.params;
    let isFavorite = (projectModel.isFavorite = !projectModel.isFavorite);
    callback(isFavorite);
    this.setState({
      isFavorite: isFavorite,
    });
    FavoriteUtil.onFavorite(
      this.favoriteDao,
      projectModel.item,
      isFavorite,
      flag,
    );
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
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
