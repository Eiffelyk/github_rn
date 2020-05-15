import Types from '../types';
import FavoriteDao from '../../expand/dao/FavoriteDao';
import ProjectModel from '../../model/ProjectModel';

/**
 * 获取收藏数据
 * @param storeName
 * @param isShowLoading
 * @returns {function(...[*]=)}
 */
export function onFavoriteData(storeName, isShowLoading) {
  return dispatch => {
    if (isShowLoading) {
      dispatch({type: Types.FAVORITE_LOADING, storeName: storeName});
    }
    new FavoriteDao(storeName)
      .getItemAll()
      .then(items => {
        let resultData = [];
        for (let i = 0, length = items.length; i < length; i++) {
          resultData.push(new ProjectModel(items[i], true));
        }
        dispatch({
          type: Types.FAVORITE_LOAD_SUCCESS,
          projectModels: resultData,
          storeName: storeName,
        });
      })
      .catch(e => {
        console.log(e);
        dispatch({
          type: Types.FAVORITE_LOAD_FAIL,
          error: e,
          storeName: storeName,
        });
      });
  };
}
