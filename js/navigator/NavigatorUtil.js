export default class NavigatorUtil {
  /**
   *跳转到首页
   * @param params
   */
  static resetToHomePage(params) {
    const {navigation} = params;
    navigation.navigate('Main');
  }
}
