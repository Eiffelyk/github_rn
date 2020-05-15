import Types from '../../action/types';

const defaultState = {};

/**
 * favorite:{
 *   popular:{
 *     projectModels:[],
 *     isLoading:false
 *   },
 *   trending:{
 *     projectModels:[],
 *     isLoading:false
 *   }
 * }
 * @param state
 * @param action
 * @returns {{}|{theme: *}}
 */
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.FAVORITE_LOADING:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
        },
      };
    case Types.FAVORITE_LOAD_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
          isLoading: false,
        },
      };
    case Types.POPULAR_REFRESH_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false,
        },
      };
    default:
      return state;
  }
}
