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
   *跳转到首页
   * @param params
   */
  static resetToHomePage(params) {
    const {navigation} = params;
    navigation.navigate('Main');
  }
}
