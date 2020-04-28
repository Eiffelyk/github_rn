export function handlerData(type, dispatch, storeName, data, pageSize) {
  let fixItems = [];
  if (data && data.data) {
    if (Array.isArray(data.data)) {
      fixItems = data.data;
    } else {
      fixItems = data.data.items;
    }
  }
  dispatch({
    type: type,
    items: fixItems,
    projectModes:
      pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize),
    storeName,
    pageIndex: 1,
  });
}
