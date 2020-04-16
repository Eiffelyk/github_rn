import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import {connect} from 'react-redux';
import actions from '../action/index';
import NavigatorUtil from '../navigator/NavigatorUtil';
import PopularItem from '../common/PopularItem';

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
    return (
      <View style={styles.container}>
        <TopBar />
      </View>
    );
  }
}

class PopularTab extends Component {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const {popularRefresh} = this.props;
    const url = this.genFetchUrl();
    popularRefresh(this.storeName, url);
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

  render() {
    const {popular} = this.props;
    let store = popular[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
      };
    }
    return (
      <View style={styles.container_tab}>
        <FlatList
          data={store.items}
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
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  popular: state.popular,
});

const mapDispatchToProps = dispatch => ({
  popularRefresh: (storeName, url) =>
    dispatch(actions.onPopularRefresh(storeName, url)),
});
const PopularTabPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PopularTab);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
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
});
