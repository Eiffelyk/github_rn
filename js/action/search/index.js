import Types from '../types';
import {_projectModels, doCallback, handlerData} from '../ActionUtil';
import ArrayUtils from '../../util/ArrayUtils';
import Util from '../../util/Util';

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const CANCEL_TOKENS = [];
export function onSearch(
  inputKey,
  pageSize,
  token,
  favoriteDao,
  popularKeys,
  callback,
) {
  return dispatch => {
    dispatch({type: Types.SEARCH_REFRESH});
    fetch(getUrl(inputKey))
      .then(response => {
        return !hasCancel(token) && response.ok ? response.json() : null;
      })
      .then(reqJson => {
        if (hasCancel(token, true)) {
          console.log('user cancel');
          return;
        }
        if (!reqJson || !reqJson.items || reqJson.items.length === 0) {
          dispatch({
            type: Types.SEARCH_REFRESH_FAIL,
            message: '没找到' + inputKey + '相关项目',
          });
          doCallback(callback, '没找到' + inputKey + '相关项目');
          return;
        }
        let items = reqJson.items;
        handlerData(
          Types.SEARCH_REFRESH_SUCCESS,
          dispatch,
          '',
          {data: items},
          pageSize,
          favoriteDao,
          {showBottomButton: !Util.checkKeyIsExist(popularKeys, inputKey)},
        );
      })
      .catch(error => {
        console.log(error);
        dispatch({type: Types.SEARCH_REFRESH_FAIL});
      });
  };
}

export function onSearchCancel(token) {
  return dispatch => {
    CANCEL_TOKENS.push(token);
    dispatch({type: Types.SEARCH_CANCEL});
  };
}

export function onLoadMoreSearch(
  pageIndex,
  pageSize,
  dataArray = [],
  favoriteDao,
  callBack,
) {
  return dispatch => {
    setTimeout(() => {
      //模拟网络请求
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        //已加载完全部数据
        if (typeof callBack === 'function') {
          callBack('no more');
        }
        dispatch({
          type: Types.SEARCH_LOAD_MORE_FAIL,
          error: 'no more',
          pageIndex: --pageIndex,
        });
      } else {
        //本次和载入的最大数量
        let max =
          pageSize * pageIndex > dataArray.length
            ? dataArray.length
            : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max), favoriteDao, data => {
          dispatch({
            type: Types.SEARCH_LOAD_MORE_SUCCESS,
            pageIndex,
            projectModels: data,
          });
        });
      }
    }, 500);
  };
}

function getUrl(inputKey) {
  return API_URL + inputKey + QUERY_STR;
}
function hasCancel(token, isRemove) {
  if (CANCEL_TOKENS.includes(token)) {
    isRemove && ArrayUtils.removeArray(CANCEL_TOKENS, token);
  }
  return false;
}
