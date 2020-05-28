import AsyncStorage from '@react-native-community/async-storage';
import ThemeFactory, {ThemeFlags} from '../../res/style/ThemeFactory';
const THEME_KEY = 'theme_key';
export default class ThemeDao {
  constructor() {}
  save(themeFlag) {
    AsyncStorage.setItem(THEME_KEY, themeFlag, error => {});
  }
  getTheme() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(THEME_KEY, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          this.save(ThemeFlags.Default);
          result = ThemeFlags.Default;
        }
        resolve(ThemeFactory.createTheme(result));
      });
    });
  }
}
