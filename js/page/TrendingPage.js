import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import {connect} from 'react-redux';
import actions from '../action/index';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../common/NavigationBar';
import TrendingItem from '../common/TrendingItem';
import TrendingDialog, {timeSpans} from '../common/TrendingDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavigatorUtil from '../navigator/NavigatorUtil';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import EventBus from 'react-native-event-bus';
import EventType from '../util/EventType';
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import ArrayUtils from '../util/ArrayUtils';
export const TRENDING_URL = 'https://github.com/trending/';
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.trending);
class TrendingPage extends Component {
  constructor(props) {
    super(props);
    const {onLoadLanguage} = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_language);
    this.state = {
      timeSpan: timeSpans[0],
    };
    this.preLanguage = [];
  }

  _getTabs() {
    const {languages, theme} = this.props;
    this.preLanguage = languages;
    const tabs = {};
    languages.forEach((item, index) => {
      if (item.checked) {
        tabs['tab' + index] = {
          screen: props => (
            <TrendingTabPage
              {...props}
              timeSpan={this.state.timeSpan}
              tabLabel={item.name}
              theme={theme}
            />
          ),
          navigationOptions: {
            title: item.name,
          },
        };
      }
    });
    return tabs;
  }

  _TopNavigator() {
    const {theme} = this.props;
    if (
      this.appContainer &&
      ArrayUtils.isEqual(this.preLanguage, this.props.languages) &&
      this.theme === theme
    ) {
      return this.appContainer;
    } else {
      this.theme = theme;
      return (this.appContainer = createAppContainer(
        createMaterialTopTabNavigator(this._getTabs(), {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            upperCaseLabel: false,
            scrollEnabled: true,
            style: {
              backgroundColor: theme.themeColor,
            },
            indicatorStyle: styles.indicatorStyle,
            labelStyle: styles.labelStyle,
          },
          lazy: true,
        }),
      ));
    }
  }
  onSelectTimeSpan(tab) {
    this.dialog.dismiss();
    this.setState({
      timeSpan: tab,
    });
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
  }
  renderTrendingDialog() {
    return (
      <TrendingDialog
        ref={dialog => (this.dialog = dialog)}
        onSelect={tab => this.onSelectTimeSpan(tab)}
      />
    );
  }
  renderTitleView() {
    return (
      <View>
        <TouchableOpacity
          // underlayColor={'transparent'}
          onPress={() => this.dialog.show()}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 18, color: '#fff'}}>
              趋势 {this.state.timeSpan.showTime}
            </Text>
            <MaterialIcons
              name={'arrow-drop-down'}
              size={22}
              style={{color: '#fff'}}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    const {languages, theme} = this.props;
    const TopBar = languages.length ? this._TopNavigator() : null;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content',
    };
    let NavigationBarA = (
      <NavigationBar
        titleView={this.renderTitleView()}
        statusBar={statusBar}
        style={theme.styles.navBar}
      />
    );
    return (
      <View style={styles.container}>
        {NavigationBarA}
        {TopBar && <TopBar />}
        {this.renderTrendingDialog()}
      </View>
    );
  }
}
const mapTrendingStateToProps = state => ({
  languages: state.language.languages,
  theme: state.theme.theme,
});
const mapTrendingDispatchToProps = dispatch => ({
  onLoadLanguage: flag => dispatch(actions.onLoadLanguage(flag)),
});
export default connect(
  mapTrendingStateToProps,
  mapTrendingDispatchToProps,
)(TrendingPage);
const pageSize = 10;
class TrendingTab extends Component {
  constructor(props) {
    super(props);
    const {tabLabel, timeSpan} = this.props;
    this.storeName = tabLabel;
    this.timeSpan = timeSpan;
    this.isFavoriteChanged = false;
  }

  componentDidMount() {
    this.loadData();
    this.timeSpanDeviceEventEmitter = DeviceEventEmitter.addListener(
      EVENT_TYPE_TIME_SPAN_CHANGE,
      tab => {
        this.timeSpan = tab;
        this.loadData(false);
      },
    );
    EventBus.getInstance().addListener(
      EventType.favorite_change_trending,
      (this.favoriteChangeListener = () => {
        this.isFavoriteChanged = true;
      }),
    );
    EventBus.getInstance().addListener(
      EventType.bottom_tab_select,
      (this.bottomTabSelectListener = data => {
        if (data.to === 1 && this.isFavoriteChanged) {
          this.loadData(null, true);
          this.isFavoriteChanged = false;
        }
      }),
    );
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
    if (this.timeSpanDeviceEventEmitter) {
      this.timeSpanDeviceEventEmitter.remove();
    }
  }

  loadData(loadMore, refreshFavorite) {
    const {
      trendingRefresh,
      trendingLoadMore,
      onFlushTrendingFavorite,
    } = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      trendingLoadMore(
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
      onFlushTrendingFavorite(
        this.storeName,
        store.pageIndex,
        pageSize,
        store.items,
        favoriteDao,
      );
    } else {
      trendingRefresh(this.storeName, url, pageSize, favoriteDao);
    }
  }
  _store() {
    const {trending} = this.props;
    let store = trending[this.storeName];
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
    if (key === 'ALL') {
      return TRENDING_URL + '?' + this.timeSpan.selectTime;
    } else {
      return TRENDING_URL + key + '?' + this.timeSpan.selectTime;
    }
  }

  renderItem(data) {
    const {theme} = this.props;
    const item = data.item;
    return (
      <TrendingItem
        theme={theme}
        projectModel={item}
        onSelect={callback => {
          NavigatorUtil.goPage(
            {theme, projectModel: item, flag: FLAG_STORAGE.trending, callback},
            'DetailPage',
          );
        }}
        onFavorite={(item, isFavorite) => {
          FavoriteUtil.onFavorite(
            favoriteDao,
            item,
            isFavorite,
            FLAG_STORAGE.trending,
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
    const {theme} = this.props;
    return (
      <View style={styles.container_tab}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + item.item.fullName}
          refreshControl={
            <RefreshControl
              title={'loading'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={theme.themeColor}
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
  trending: state.trending,
});

const mapDispatchToProps = dispatch => ({
  trendingRefresh: (storeName, url, pageSize, favoriteDao) =>
    dispatch(actions.onTrendingRefresh(storeName, url, pageSize, favoriteDao)),
  trendingLoadMore: (
    storeName,
    pageIndex,
    pageSize,
    dataArray,
    callback,
    favoriteDao,
  ) =>
    dispatch(
      actions.onTrendingLoadMore(
        storeName,
        pageIndex,
        pageSize,
        dataArray,
        callback,
        favoriteDao,
      ),
    ),
  onFlushTrendingFavorite: (
    storeName,
    pageIndex,
    pageSize,
    dataArray,
    favoriteDao,
  ) =>
    dispatch(
      actions.onFlushTrendingFavorite(
        storeName,
        pageIndex,
        pageSize,
        dataArray,
        favoriteDao,
      ),
    ),
});
const TrendingTabPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrendingTab);
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
