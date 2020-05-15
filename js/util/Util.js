import {FLAG_STORAGE} from '../expand/dao/DataStore';

export default class Util {
  static checkFavorite(favoriteType, item, keys) {
    if (!keys) {
      return false;
    }
    for (let i = 0, len = keys.length; i < len; i++) {
      let id = favoriteType === FLAG_STORAGE.popular ? item.id : item.fullName;
      if (id.toString() === keys[i]) {
        return true;
      }
    }
    return false;
  }
}
