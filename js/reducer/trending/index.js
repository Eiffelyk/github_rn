import Types from '../../action/types';
import {Type} from 'react-native/ReactCommon/hermes/inspector/tools/msggen/src/Type';

const defaultState = {};

/**
 * trending:{
 *   java:{
 *     items:[],
 *     isLoading:false
 *   },
 *   ios:{
 *     items:[],
 *     isLoading:false
 *   }
 * }
 * @param state
 * @param action
 * @returns {{}|{theme: *}}
 */
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.TRENDING_REFRESH:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
          hiddenLoadingMore: true,
        },
      };
    case Types.TRENDING_REFRESH_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          items: action.items,
          projectModels: action.projectModels,
          isLoading: false,
          hiddenLoadingMore: false,
          pageIndex: action.pageIndex,
        },
      };
    case Types.TRENDING_REFRESH_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false,
        },
      };
    case Types.TRENDING_LOAD_MORE_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          items: action.items,
          projectModels: action.projectModels,
          hiddenLoadingMore: false,
          pageIndex: action.pageIndex,
        },
      };
    case Types.TRENDING_LOAD_MORE_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          hiddenLoadingMore: true,
          pageIndex: action.pageIndex,
        },
      };
    case Types.TRENDING_FLUSH_FAVORITE:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
        },
      };
    default:
      return state;
  }
}
