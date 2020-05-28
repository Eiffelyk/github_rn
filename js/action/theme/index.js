import Types from '../types';
import ThemeDao from '../../expand/dao/ThemeDao';

/**
 * 修改自定义主题
 * @param theme
 * @returns {{theme: *, type: string}}
 */
export function onThemeChange(theme) {
  return {type: Types.THEME_CHANGE, theme: theme};
}

/**
 * 初始化自定义主题
 * @returns {function(...[*]=)}
 */
export function onThemeInit() {
  return dispatch => {
    new ThemeDao().getTheme().then(data => {
      dispatch(onThemeChange(data));
    });
  };
}

/**
 * 显示自定主题view
 * @param show
 * @returns {{customThemeVIewVisible: *, type: string}}
 */
export function onShowThemeView(show) {
  return {type: Types.SHOW_THEME_VIEW, customThemeViewVisible: show};
}
