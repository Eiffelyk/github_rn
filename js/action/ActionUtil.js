import ProjectModel from '../model/ProjectModel';
import Util from '../util/Util';

export function handlerData(
  type,
  dispatch,
  storeName,
  data,
  pageSize,
  favoriteDao,
  params,
) {
  let fixItems = [];
  if (data && data.data) {
    if (Array.isArray(data.data)) {
      fixItems = data.data;
    } else {
      fixItems = data.data.items;
    }
  }
  let showItems =
    pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize);
  _projectModels(showItems, favoriteDao, projectModels => {
    dispatch({
      type: type,
      items: fixItems,
      projectModels: projectModels,
      storeName,
      pageIndex: 1,
      ...params,
    });
  });
}
export async function _projectModels(showItems, favoriteDao, callback) {
  let keys = [];
  try {
    keys = await favoriteDao.getFavoriteKeys();
  } catch (e) {
    console.log(e);
  }
  let projectModels = [];
  for (let i = 0, length = showItems.length; i < length; i++) {
    projectModels.push(
      new ProjectModel(
        showItems[i],
        Util.checkFavorite(favoriteDao.getFavoriteType(), showItems[i], keys),
      ),
    );
  }
  doCallback(callback, projectModels);
}
export const doCallback = (callback, object) => {
  if (typeof callback === 'function') {
    callback(object);
  }
};
