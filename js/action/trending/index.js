import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {_projectModels, handlerData} from '../ActionUtil';

/**
 * 刷新首页数据
 * @param storeName
 * @param url
 * @param pageSize
 * @returns {function(...[*]=)}
 */
export function onTrendingRefresh(storeName, url, pageSize, favoriteDao) {
  return dispatch => {
    dispatch({type: Types.TRENDING_REFRESH, storeName: storeName});
    let dataStore = new DataStore();
    dataStore
      .fetchData(url, FLAG_STORAGE.trending)
      .then(data => {
        handlerData(
          Types.TRENDING_REFRESH_SUCCESS,
          dispatch,
          storeName,
          data,
          pageSize,
          favoriteDao,
        );
      })
      .catch(error => {
        dispatch({
          type: Types.TRENDING_REFRESH_FAIL,
          storeName,
          error,
        });
      });
  };
}

export function onTrendingLoadMore(
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  callback,
  favoriteDao,
) {
  return dispatch => {
    setTimeout(() => {
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        //数据加载完成
        if (typeof callback === 'function') {
          callback('no more');
        }
        dispatch({
          type: Types.TRENDING_LOAD_MORE_FAIL,
          storeName,
          error: 'no more 1',
          pageIndex: --pageIndex,
        });
      } else {
        let max =
          pageSize * pageIndex > dataArray.length
            ? dataArray.length
            : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max), favoriteDao, projectModels => {
          dispatch({
            type: Types.TRENDING_LOAD_MORE_SUCCESS,
            storeName,
            items: dataArray,
            pageIndex,
            projectModels: projectModels,
          });
        });
      }
    }, 500);
  };
}
export function onFlushTrendingFavorite(
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  favoriteDao,
) {
  return dispatch => {
    let max =
      pageSize * pageIndex > dataArray.length
        ? dataArray.length
        : pageSize * pageIndex;
    _projectModels(dataArray.slice(0, max), favoriteDao, projectModels => {
      dispatch({
        type: Types.TRENDING_FLUSH_FAVORITE,
        storeName,
        pageIndex,
        projectModels: projectModels,
      });
    });
  };
}
