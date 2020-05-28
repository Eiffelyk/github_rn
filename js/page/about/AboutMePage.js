import React, {Component} from 'react';
import {Linking, View, Clipboard} from 'react-native';
import AboutCommon, {FLAG_ABOUT} from './AboutCommon';
import ViewUtil from '../../util/ViewUtil';
import GlobalStyles from '../../res/style/GlobalStyles';
import config from '../../res/data/config';
import NavigatorUtil from '../../navigator/NavigatorUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default class AboutMePage extends Component<Props> {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon(
      {
        ...this.params,
        navigation: this.props.navigation,
        flagAbout: FLAG_ABOUT.flag_about_me,
      },
      data => this.setState({...data}),
    );
    this.state = {
      data: config,
      showTutorial: true,
      showBlog: false,
      showQQ: false,
      showContact: false,
    };
  }
  componentDidMount() {
    this.aboutCommon.componentDidMount();
  }
  componentWillUnmount() {
    this.aboutCommon.componentWillUnmount();
  }
  onClick(tab) {
    if (!tab) {
      return;
    }
    if (tab.url) {
      NavigatorUtil.goPage({title: tab.title, url: tab.url}, 'WebviewPage');
      return;
    }
    if (tab.account && tab.account.indexOf('@') > -1) {
      let openUrl = 'mailto:' + tab.account;
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
      return;
    }
    if (tab.account) {
      Clipboard.setString(tab.title + tab.account + '已经复制到剪切板。');
    }
  }
  _item(data, isShow, key) {
    return ViewUtil.getSettingItem(
      () => {
        this.setState({[key]: !this.state[key]});
      },
      data.name,
      this.params.theme.themeColor,
      Ionicons,
      data.icon,
      isShow ? 'ios-arrow-up' : 'ios-arrow-down',
    );
  }
  renderItems(dic, isShowAccount) {
    if (!dic) {
      return null;
    }
    let views = [];
    for (let i in dic) {
      let title = isShowAccount
        ? dic[i].title + ':' + dic[i].account
        : dic[i].title;
      views.push(
        <View key={i}>
          {ViewUtil.getSettingItem(
            () => this.onClick(dic[i]),
            title,
            this.params.theme.themeColor,
          )}
          <View style={GlobalStyles.line} />
        </View>,
      );
    }
    return views;
  }
  render() {
    const content = (
      <View>
        {this._item(
          this.state.data.aboutMe.Tutorial,
          this.state.showTutorial,
          'showTutorial',
        )}
        <View style={GlobalStyles.line} />
        {this.state.showTutorial
          ? this.renderItems(this.state.data.aboutMe.Tutorial.items)
          : null}

        {this._item(
          this.state.data.aboutMe.Blog,
          this.state.showBlog,
          'showBlog',
        )}
        <View style={GlobalStyles.line} />
        {this.state.showBlog
          ? this.renderItems(this.state.data.aboutMe.Blog.items)
          : null}

        {this._item(this.state.data.aboutMe.QQ, this.state.showQQ, 'showQQ')}
        <View style={GlobalStyles.line} />
        {this.state.showQQ
          ? this.renderItems(this.state.data.aboutMe.QQ.items, true)
          : null}

        {this._item(
          this.state.data.aboutMe.Contact,
          this.state.showContact,
          'showContact',
        )}
        <View style={GlobalStyles.line} />
        {this.state.showContact
          ? this.renderItems(this.state.data.aboutMe.Contact.items, true)
          : null}
      </View>
    );
    return this.aboutCommon.render(content, this.state.data.author);
  }
}
