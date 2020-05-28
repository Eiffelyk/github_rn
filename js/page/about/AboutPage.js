import React, {Component} from 'react';
import {Linking, View} from 'react-native';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import ViewUtil from '../../util/ViewUtil';
import {MORE_MENU} from '../../common/MORE_MENU';
import GlobalStyles from '../../res/style/GlobalStyles';
import config from '../../res/data/config';
import NavigatorUtil from '../../navigator/NavigatorUtil';
export default class AboutPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon(
      {
        ...this.params,
        navigation: this.props.navigation,
        flagAbout: FLAG_ABOUT.flag_about,
      },
      data => this.setState({...data}),
    );
    this.state = {
      data: config,
    };
  }
  componentDidMount() {
    this.aboutCommon.componentDidMount();
  }
  componentWillUnmount() {
    this.aboutCommon.componentWillUnmount();
  }
  onClick(menu) {
    let routerName,
      params = {};
    switch (menu) {
      case MORE_MENU.Tutorial:
        routerName = 'WebviewPage';
        params.title = '教程';
        params.url = 'https://github.com/Eiffelyk/github_rn';
        break;
      case MORE_MENU.About_Author:
        routerName = 'AboutMePage';
        break;
      case MORE_MENU.Feedback:
        // 本机应用
        // 电话：Linking.openURL(`tel:${'10086'}`);
        // 浏览器：Linking.openURL('http://www.baidu.com');
        // 短信：Linking.openURL('smsto:10086');
        // 邮箱：Linking.openURL('mailto:10000@qq. com');
        // 地图：Linking.openURL('geo:37.2122 , 12.222');
        const openUrl = 'mailto:eiffelyk@gmail.com';
        Linking.canOpenURL(openUrl)
          .then(support => {
            if (support) {
              Linking.openURL(openUrl);
            } else {
              console.log("Can't handle url:" + openUrl);
            }
          })
          .catch(err => {
            console.log(err);
          });
        break;
    }
    if (routerName) {
      NavigatorUtil.goPage(params, routerName);
    }
  }
  getItem(menu) {
    return ViewUtil.getMenuItem(
      () => this.onClick(menu),
      menu,
      this.params.theme.themeColor,
    );
  }
  render() {
    const content = (
      <View>
        {this.getItem(MORE_MENU.Tutorial)}
        <View style={GlobalStyles.line} />
        {this.getItem(MORE_MENU.About_Author)}
        <View style={GlobalStyles.line} />
        {this.getItem(MORE_MENU.Feedback)}
      </View>
    );
    return this.aboutCommon.render(content, this.state.data.app);
  }
}
