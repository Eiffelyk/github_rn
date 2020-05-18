import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import {connect} from 'react-redux';
import actions from '../action/index';
import Toast from 'react-native-easy-toast';
import PopularItem from '../common/PopularItem';
import NavigationBar from '../common/NavigationBar';
import NavigatorUtil from '../navigator/NavigatorUtil';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import EventBus from 'react-native-event-bus';
import EventType from '../util/EventType';
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#F00';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.popular);
class PopularPage extends Component {
  constructor(props) {
    super(props);
    const {onLoadLanguage} = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_key);
  }

  _getTabs() {
    const {keys} = this.props;
    const tabs = {};
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs['tab' + index] = {
          screen: props => <PopularTabPage {...props} tabLabel={item.name} />,
          navigationOptions: {
            title: item.name,
          },
        };
      }
    });
    return tabs;
  }

  _TopNavigator() {
    return createAppContainer(
      createMaterialTopTabNavigator(this._getTabs(), {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          scrollEnabled: true,
          style: {
            backgroundColor: '#098',
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle,
        },
      }),
    );
  }

  render() {
    const {keys} = this.props;
    const TopBar = keys.length ? this._TopNavigator() : null;
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let NavigationBarA = (
      <NavigationBar
        hide={false}
        title={'最热'}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}
      />
    );
    return (
      <View style={styles.container}>
        {NavigationBarA}
        {TopBar && <TopBar />}
      </View>
    );
  }
}
const mapPopularStateToProps = state => ({
  keys: state.language.keys,
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: flag => dispatch(actions.onLoadLanguage(flag)),
});
export default connect(
  mapPopularStateToProps,
  mapPopularDispatchToProps,
)(PopularPage);
const pageSize = 10;
class PopularTab extends Component {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
    this.isFavoriteChanged = false;
  }

  componentDidMount() {
    this.loadData();
    EventBus.getInstance().addListener(
      EventType.favorite_change_popular,
      (this.favoriteChangeListener = () => {
        this.isFavoriteChanged = true;
      }),
    );
    EventBus.getInstance().addListener(
      EventType.bottom_tab_select,
      (this.bottomTabSelectListener = data => {
        if (data.to === 0 && this.isFavoriteChanged) {
          this.loadData(null, true);
        }
      }),
    );
  }
  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }

  loadData(loadMore, refreshFavorite) {
    const {popularRefresh, popularLoadMore, flushPopularFavorite} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      popularLoadMore(
        this.storeName,
        ++store.pageIndex,
        pageSize,
        store.items,
        callback => {
          this.toast.show('没数据了');
        },
        favoriteDao,
      );
    } else if (refreshFavorite) {
      flushPopularFavorite(
        this.storeName,
        store.pageIndex,
        pageSize,
        store.items,
        favoriteDao,
      );
      this.isFavoriteChanged = false;
    } else {
      popularRefresh(this.storeName, url, pageSize, favoriteDao);
    }
  }
  _store() {
    const {popular} = this.props;
    let store = popular[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],
        hiddenLoadingMore: true,
      };
    }
    return store;
  }
  genFetchUrl(key) {
    return URL + key + QUERY_STR;
  }

  renderItem(data) {
    const item = data.item;
    return (
      <PopularItem
        projectModel={item}
        onSelect={callback => {
          NavigatorUtil.goPage(
            {projectModel: item, flag: FLAG_STORAGE.popular, callback},
            'DetailPage',
          );
        }}
        onFavorite={(item, isFavorite) => {
          FavoriteUtil.onFavorite(
            favoriteDao,
            item,
            isFavorite,
            FLAG_STORAGE.popular,
          );
        }}
      />
    );
  }
  footerComponent() {
    return this._store().hiddenLoadingMore ? null : (
      <View style={styles.footer}>
        <ActivityIndicator style={styles.footerActivityIndicator} />
        <Text>加载更多</Text>
      </View>
    );
  }
  render() {
    let store = this._store();
    return (
      <View style={styles.container_tab}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + item.item.id}
          refreshControl={
            <RefreshControl
              title={'loading'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={THEME_COLOR}
            />
          }
          ListFooterComponent={() => this.footerComponent()}
          onEndReached={() => {
            setTimeout(() => {
              if (this.canLoadMore) {
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true;
          }}
        />
        <Toast ref={toast => (this.toast = toast)} position={'center'} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  popular: state.popular,
});

const mapDispatchToProps = dispatch => ({
  popularRefresh: (storeName, url, pageSize, favoriteDao) =>
    dispatch(actions.onPopularRefresh(storeName, url, pageSize, favoriteDao)),
  popularLoadMore: (
    storeName,
    pageIndex,
    pageSize,
    dataArray,
    callback,
    favoriteDao,
  ) =>
    dispatch(
      actions.onPopularLoadMore(
        storeName,
        pageIndex,
        pageSize,
        dataArray,
        callback,
        favoriteDao,
      ),
    ),
  flushPopularFavorite: (
    storeName,
    pageIndex,
    pageSize,
    dataArray,
    favoriteDao,
  ) =>
    dispatch(
      actions.onFlushPopularFavorite(
        storeName,
        pageIndex,
        pageSize,
        dataArray,
        favoriteDao,
      ),
    ),
});
const PopularTabPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PopularTab);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container_tab: {
    flex: 1,
  },
  welcome: {
    fontSize: 40,
    color: '#00f',
  },
  tabStyle: {
    minWidth: 20,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white',
  },
  labelStyle: {
    fontSize: 13,
    marginVertical: 6,
  },
  footer: {
    alignItems: 'center',
  },
  footerActivityIndicator: {
    color: 'red',
    margin: 10,
  },
});
