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
import {onLoadMoreSearch, onSearchCancel, onSearch} from './search';
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
  onLoadMoreSearch,
  onSearchCancel,
  onSearch,
};
