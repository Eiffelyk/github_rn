import {onThemeChange} from './theme';
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

export default {
  onThemeChange,
  onPopularRefresh,
  onPopularLoadMore,
  onFlushPopularFavorite,
  onTrendingRefresh,
  onTrendingLoadMore,
  onFavoriteData,
  onFlushTrendingFavorite,
};
