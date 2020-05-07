import AsynStorage from '@react-native-community/async-storage';
const FAVORITE_ = 'favorite_';
export default class FavoriteDao {
  constructor(type) {
    this.favoriteKey = FAVORITE_ + type;
  }
  saveFavoriteItem(key, value) {
    AsynStorage.setItem(key, value, (error, result) => {
      if (!error) {
        this.updateFavoriteKeys(key, true);
      }
    });
  }
  removeFavoriteItem(key) {
    AsynStorage.removeItem(key, (error, resulut) => {
      if (!error) {
        this.updateFavoriteKeys(key, false);
      }
    });
  }
  updateFavoriteKeys(key, isAdd) {
    AsynStorage.getItem(this.favoriteKey, (error, result) => {
      if (!error) {
        let favorites = [];
        if (result) {
          favorites = JSON.parse(result);
        }
        let index = favorites.indexOf(key);
        if (isAdd) {
          if (index === -1) {
            favorites.push(key);
          }
        } else {
          if (index !== -1) {
            favorites.splice(index, 1);
          }
        }
        AsynStorage.setItem(this.favoriteKey, JSON.stringify(favorites));
      }
    });
  }
  getFavoriteKeys() {
    return new Promise((resolve, reject) => {
      AsynStorage.getItem(this.favoriteKey, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
          }
        } else {
          reject(error);
        }
      });
    });
  }
  getItemAll() {
    return new Promise((resolve, reject) => {
      this.getFavoriteKeys()
        .then(keys => {
          let items = [];
          if (keys) {
            AsynStorage.multiGet(keys, (errors, stores) => {
              try {
                stores.map((result, i, store) => {
                  let key = store[i][0];
                  let value = store[i][1];
                  if (value) {
                    items.push(JSON.parse(value));
                  }
                });
                resolve(items);
              } catch (e) {
                resolve(e);
              }
            });
          } else {
            resolve(items);
          }
        })
        .catch(e => {
          reject(e);
        });
    });
  }
}
