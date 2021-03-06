import React, {Component} from 'react';
import {
  View,
  Text,
  Linking,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigatorUtil from '../navigator/NavigatorUtil';
import NavigationBar from '../common/NavigationBar';
import {MORE_MENU} from '../common/MORE_MENU';
import GlobalStyles from '../res/style/GlobalStyles';
import ViewUtil from '../util/ViewUtil';
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
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
  onClick(menu) {
    const {theme} = this.props;
    let routerName,
      params = {};
    params.theme = theme;
    switch (menu) {
      case MORE_MENU.Tutorial:
        routerName = 'WebviewPage';
        params.title = '教程';
        params.url = 'https://github.com/Eiffelyk/github_rn';
        break;
      case MORE_MENU.About:
        routerName = 'AboutPage';
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
      case MORE_MENU.Custom_Key:
      case MORE_MENU.Custom_Language:
      case MORE_MENU.Remove_Key:
        routerName = 'CustomKeyPage';
        params.isRemoveKey = menu === MORE_MENU.Remove_Key;
        params.flag =
          menu === MORE_MENU.Custom_Language
            ? FLAG_LANGUAGE.flag_language
            : FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.Sort_Key:
        routerName = 'SortKeyPage';
        params.flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.Sort_Language:
        routerName = 'SortKeyPage';
        params.flag = FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.Custom_Theme:
        const {onShowThemeView} = this.props;
        onShowThemeView(true);
        break;
    }
    if (routerName) {
      NavigatorUtil.goPage(params, routerName);
    }
  }
  getItem(menu) {
    const {theme} = this.props;
    return ViewUtil.getMenuItem(
      () => this.onClick(menu),
      menu,
      theme.themeColor,
    );
  }
  render() {
    const {theme} = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };
    let NavigationBarA = (
      <NavigationBar
        title={'我的'}
        statusBar={statusBar}
        style={theme.styles.navBar}
        // leftButton={this.leftButton()}
        // rightButton={this.rightButton()}
      />
    );
    return (
      <View style={GlobalStyles.root_container}>
        {NavigationBarA}
        <ScrollView>
          <TouchableOpacity
            style={styles.about}
            onPress={() => this.onClick(MORE_MENU.About)}>
            <View style={styles.about_left}>
              <Ionicons
                name={MORE_MENU.About.icon}
                size={40}
                style={{marginRight: 10, color: theme.themeColor}}
              />
              <Text>馋猫</Text>
            </View>
            <Ionicons
              name={'ios-arrow-forward'}
              size={16}
              style={{
                marginRight: 10,
                alignSelf: 'center',
                color: theme.themeColor,
              }}
            />
          </TouchableOpacity>
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Tutorial)}
          {/*趋势管理*/}
          <Text style={styles.groupTitle}>趋势管理</Text>
          {/*自定义语言*/}
          {this.getItem(MORE_MENU.Custom_Language)}
          {/*语言排序*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Language)}

          {/*最热管理*/}
          <Text style={styles.groupTitle}>最热管理</Text>
          {/*自定义标签*/}
          {this.getItem(MORE_MENU.Custom_Key)}
          {/*标签排序*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Key)}
          {/*标签移除*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Remove_Key)}

          {/*设置*/}
          <Text style={styles.groupTitle}>设置</Text>
          {/*自定义主题*/}
          {this.getItem(MORE_MENU.Custom_Theme)}
          {/*关于作者*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.About_Author)}
          <View style={GlobalStyles.line} />
          {/*反馈*/}
          {this.getItem(MORE_MENU.Feedback)}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.CodePush)}
        </ScrollView>
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
  about: {
    backgroundColor: 'white',
    padding: 10,
    height: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  about_left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupTitle: {
    color: 'gray',
    fontSize: 12,
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 10,
  },
});
const mapStateToProps = state => ({
  theme: state.theme.theme,
});
const mapDispatchToProps = dispatch => ({
  onShowThemeView: theme => dispatch(actions.onShowThemeView(theme)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyPage);
