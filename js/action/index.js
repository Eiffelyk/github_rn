import {onThemeChange, onThemeInit, onShowThemeView} from './theme';
import {
  onPopularRefresh,
  onPopularLoadMore,
  onFlushPopularFavorite,
} from './popular';
import {
  onTrendingRefresh,
  onTrendingLoadMore,
  onFlushTrendingFavorite,
} from './trending';
import {onFavoriteData} from './favorite';
import {onLoadLanguage} from './language';

export default {
  onThemeInit,
  onShowThemeView,
  onThemeChange,
  onPopularRefresh,
  onPopularLoadMore,
  onFlushPopularFavorite,
  onTrendingRefresh,
  onTrendingLoadMore,
  onFavoriteData,
  onFlushTrendingFavorite,
  onLoadLanguage,
};
