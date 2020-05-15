import AsyncStorage from '@react-native-community/async-storage';
import Trending from 'GitHubTrending';
export const FLAG_STORAGE = {popular: 'popular', trending: 'trending'};
export default class DataStore {
  /***
   * 获取数据，包含缓存机制
   * @param url
   * @param flag
   * @returns {Promise<R>}
   */
  fetchData(url, flag) {
    return new Promise((resolve, reject) => {
      this.fetchDataFromLocal(url)
        .then(wrapData => {
          console.log('wrapData==' + JSON.stringify(wrapData));
          if (wrapData && this._checkTimestampValid(wrapData.timestamp)) {
            resolve(wrapData);
          } else {
            this.fetchDataFromNet(url, flag)
              .then(data => {
                resolve(this._warpData(data));
              })
              .catch(e => {
                reject(e);
              });
          }
        })
        .catch(e => {
          this.fetchDataFromNet(url, flag)
            .then(data => {
              resolve(this._warpData(data));
            })
            .catch(e => {
              reject(e);
            });
        });
    });
  }

  /***
   * 网络请求
   * @param url
   * @param flag
   * @returns {Promise<R>}
   */
  fetchDataFromNet(url, flag) {
    return new Promise((resolve, reject) => {
      if (flag === FLAG_STORAGE.popular) {
        fetch(url)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('net not work');
          })
          .then(responseText => {
            this.saveData(url, responseText);
            resolve(responseText);
          })
          .catch(e => {
            reject(e);
            console.log(e.toString());
          });
      } else {
        new Trending('fd82d1e882462e23b8e88aa82198f166')
          .fetchTrending(url)
          .then(items => {
            if (!items) {
              throw new Error('responseData is null');
            }
            this.saveData(url, items);
            resolve(items);
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  }

  /***
   * 读取本地缓存
   * @param url 获取数据的url
   * @returns {Promise<R>}
   */
  fetchDataFromLocal(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (error) {
          reject(error);
          console.log(error.toString());
        } else {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
            console.log(e.toString());
          }
        }
      });
    });
  }
  /**
   * 存储缓存
   * @param url 使用url做key
   * @param data 需要存储的数据
   * @param callBack 异常回调
   */
  saveData(url, data, callBack) {
    if (!url || !data) {
      return;
    }
    AsyncStorage.setItem(url, JSON.stringify(this._warpData(data)), error => {
      error && console.log(error.toString());
    });
  }

  /**
   * 数据包装成data，time格式
   * @param data 原始数据
   * @returns {{data: *, timestamp: number}}
   * @private
   */
  _warpData(data) {
    return {data, timestamp: new Date().getTime()};
  }

  /***
   *
   * @param timestamp
   * @returns {boolean}
   */
  _checkTimestampValid(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setTime(timestamp);
    if (currentDate.getMonth() !== targetDate.getMonth()) {
      return false;
    }
    if (currentDate.getDate() !== targetDate.getDate()) {
      return false;
    }
    if (currentDate.getHours() - targetDate.getHours() > 4) {
      return false;
    } //有效期4个小时
    // if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
    return true;
  }
}
