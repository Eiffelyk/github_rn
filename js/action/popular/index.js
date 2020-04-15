import Types from '../types';
import DataStore from '../../expand/dao/DataStore';
export function onPopularRefresh(storeName, url) {
  return dispatch => {
    dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});
    let dataStore = new DataStore();
    dataStore
      .fetchData(url)
      .then(data => {
        handlerData(dispatch, storeName, data);
      })
      .catch(error => {
        dispatch({
          type: Types.POPULAR_REFRESH_FAIL,
          storeName,
          error,
        });
      });
  };
}

function handlerData(dispatch, storeName, data) {
  dispatch({
    type: Types.POPULAR_REFRESH_SUCCESS,
    items: data && data.data && data.data.items,
    storeName,
  });
}
