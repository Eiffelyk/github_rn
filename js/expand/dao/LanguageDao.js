import AsyncStorage from '@react-native-community/async-storage';
import languages from '../../res/data/langs';
import keys from '../../res/data/keys';
export const FLAG_LANGUAGE = {
  flag_language: 'language_dao_language',
  flag_key: 'language_dao_key',
};
export default class LanguageDao {
  constructor(flag) {
    this.flag = flag;
  }
  fetch() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.flag, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          let data =
            this.flag === FLAG_LANGUAGE.flag_language ? languages : keys;
          this.save(data);
          resolve(data);
        } else {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
          }
        }
      });
    });
  }
  save(dataObjet) {
    let stringData = JSON.stringify(dataObjet);
    AsyncStorage.setItem(this.flag, stringData, error => {});
  }
}
