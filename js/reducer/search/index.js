import Types from '../../action/types';

const defaultState = {
  showText: '搜索',
  item: [],
  isLoading: false,
  projectModels: [],
  hiddenLoadingMore: true,
  showBottomButton: false,
  inputKey: '',
};

export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.SEARCH_REFRESH:
      return {
        ...state,
        isLoading: true,
        hiddenLoadingMore: true,
        showBottomButton: false,
        showText: '取消',
      };
    case Types.SEARCH_REFRESH_SUCCESS:
      return {
        ...state,
        showBottomButton: action.showBottomButton,
        showText: '搜索',
        items: action.items,
        projectModels: action.projectModels,
        isLoading: false,
        hiddenLoadingMore: false,
        pageIndex: action.pageIndex,
        inputKey: action.inputKey,
      };
    case Types.SEARCH_REFRESH_FAIL:
      return {
        ...state,
        isLoading: false,
        showText: '搜索',
      };
    case Types.SEARCH_CANCEL:
      return {
        ...state,
        isLoading: false,
        showText: '搜索',
      };
    case Types.SEARCH_LOAD_MORE_SUCCESS:
      return {
        ...state,
        projectModels: action.projectModels,
        hiddenLoadingMore: false,
        pageIndex: action.pageIndex,
      };
    case Types.SEARCH_LOAD_MORE_FAIL:
      return {
        ...state,
        hiddenLoadingMore: true,
        pageIndex: action.pageIndex,
      };
    default:
      return state;
  }
}
