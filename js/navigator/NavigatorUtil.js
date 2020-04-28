export default class NavigatorUtil {
  static goPage(params, page) {
    const navigation = NavigatorUtil.navigation;
    if (!navigation) {
      console.log('navigation is lost');
    } else {
      navigation.navigate(page, {...params});
    }
  }
  /**
   * 返回上一页
   * @param navigation
   */
  static goBack(navigation) {
    navigation.goBack();
  }
  /**
   *跳转到首页
   * @param params
   */
  static resetToHomePage(params) {
    const {navigation} = params;
    navigation.navigate('Main');
  }
}
