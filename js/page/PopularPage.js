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

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#F00';
export default class PopularPage extends Component {
  constructor(props) {
    super(props);
    this.tabNames = ['Java', 'Android', 'iOS', 'React', 'React Native', 'PHP'];
  }

  _getTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs['tab' + index] = {
        screen: props => <PopularTabPage {...props} tabLabel={item} />,
        navigationOptions: {
          title: item,
        },
      };
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
    const TopBar = this._TopNavigator();
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let NavigationBarA = (
      <NavigationBar
        title={'最热'}
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
const pageSize = 10;
class PopularTab extends Component {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
  }

  componentDidMount() {
    this.loadData();
  }

  loadData(loadMore) {
    const {popularRefresh, popularLoadMore} = this.props;
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
      );
    } else {
      popularRefresh(this.storeName, url, pageSize);
    }
  }
  _store() {
    const {popular} = this.props;
    let store = popular[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModes: [],
        hiddenLoadingMore: true,
      };
    }
    return store;
  }
  genFetchUrl(key) {
    return URL + key + QUERY_STR;
  }

  renderItem(data) {
    return (
      <PopularItem
        item={data.item}
        onSelect={() => {
          console.log('PopularItem is select');
        }}
        onFavorite={() => {
          console.log('PopularItem is onFavorite');
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
          data={store.projectModes}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + item.id}
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
  popularRefresh: (storeName, url, pageSize) =>
    dispatch(actions.onPopularRefresh(storeName, url, pageSize)),
  popularLoadMore: (storeName, pageIndex, pageSize, dataArray, callback) =>
    dispatch(
      actions.onPopularLoadMore(
        storeName,
        pageIndex,
        pageSize,
        dataArray,
        callback,
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
