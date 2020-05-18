import Types from '../types';
import LanguageDao from '../../expand/dao/LanguageDao';

/**
 * 获取最热和趋势的分组
 * @param flag
 * @returns {function(...[*]=)}
 */
export function onLoadLanguage(flag) {
  return async dispatch => {
    try {
      let languages = await new LanguageDao(flag).fetch();
      dispatch({
        type: Types.LANGUAGE_LOAD_SUCCESS,
        languages: languages,
        flag: flag,
      });
    } catch (e) {
      console.log(e);
    }
  };
}
