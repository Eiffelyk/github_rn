import React, {Component} from 'react';
import {View, FlatList, StyleSheet, RefreshControl} from 'react-native';
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
import TrendingItem from '../common/TrendingItem';
import EventBus from 'react-native-event-bus';
import EventType from '../util/EventType';
const THEME_COLOR = '#F00';
export default class FavoritePage extends Component {
  constructor(props) {
    super(props);
    const {flag} = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag);
  }

  _TopNavigator() {
    return createAppContainer(
      createMaterialTopTabNavigator(
        {
          Popular: {
            screen: props => (
              <FavoriteTabPage {...props} flag={FLAG_STORAGE.popular} />
            ),
            navigationOptions: {
              title: '最热',
            },
          },
          Trending: {
            screen: props => (
              <FavoriteTabPage {...props} flag={FLAG_STORAGE.trending} />
            ),
            navigationOptions: {
              title: '趋势',
            },
          },
        },
        {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            upperCaseLabel: false,
            style: {
              backgroundColor: '#098',
            },
            indicatorStyle: styles.indicatorStyle,
            labelStyle: styles.labelStyle,
          },
        },
      ),
    );
  }

  render() {
    const TopBar = this._TopNavigator();
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let NavigationBarA = (
      <NavigationBar
        hide={false}
        title={'收藏'}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}
      />
    );
    return (
      <View style={styles.container}>
        {NavigationBarA}
        <TopBar />
      </View>
    );
  }
}
class FavoriteTab extends Component {
  constructor(props) {
    super(props);
    const {flag} = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag);
  }

  componentDidMount() {
    this.loadData();
    EventBus.getInstance().addListener(
      EventType.bottom_tab_select,
      (this.listener = data => {
        if (data.to === 2) {
          this.loadData(false);
        }
      }),
    );
  }
  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
  }
  loadData(isShowLoading) {
    const {onFavoriteData} = this.props;
    onFavoriteData(this.storeName, isShowLoading);
  }
  _store() {
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],
      };
    }
    return store;
  }
  onFavorite(item, isFavorite) {
    FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.storeName);
    if (this.storeName === FLAG_STORAGE.popular) {
      EventBus.getInstance().fireEvent(EventType.favorite_change_popular);
    } else {
      EventBus.getInstance().fireEvent(EventType.favorite_change_trending);
    }
  }
  renderItem(data) {
    const item = data.item;
    const ItemView =
      this.storeName === FLAG_STORAGE.popular ? PopularItem : TrendingItem;
    return (
      <ItemView
        projectModel={item}
        onSelect={callback => {
          NavigatorUtil.goPage(
            {projectModel: item, flag: this.storeName, callback},
            'DetailPage',
          );
        }}
        onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
      />
    );
  }
  render() {
    let store = this._store();
    return (
      <View style={styles.container_tab}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + (item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl
              title={'loading'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}
              tintColor={THEME_COLOR}
            />
          }
        />
        <Toast ref={toast => (this.toast = toast)} position={'center'} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  favorite: state.favorite,
});

const mapDispatchToProps = dispatch => ({
  onFavoriteData: (storeName, isShowLoading) =>
    dispatch(actions.onFavoriteData(storeName, isShowLoading)),
});
const FavoriteTabPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FavoriteTab);
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
