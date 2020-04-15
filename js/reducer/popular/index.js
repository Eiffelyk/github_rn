import Types from '../../action/types';

const defaultState = {};

/**
 * popular:{
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
    case Types.POPULAR_REFRESH_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...[action.storeName],
          items: action.items,
          isLoading: false,
        },
      };
    case Types.POPULAR_REFRESH:
      return {
        ...state,
        [action.storeName]: {
          ...[action.storeName],
          isLoading: true,
        },
      };
    case Types.POPULAR_REFRESH_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...[action.storeName],
          isLoading: false,
        },
      };
    default:
      return state;
  }
}
