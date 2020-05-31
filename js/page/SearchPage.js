import React, {Component} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  RefreshControl,
  ActivityIndicator,
  DeviceInfo,
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index';
import Toast from 'react-native-easy-toast';
import PopularItem from '../common/PopularItem';
import NavigatorUtil from '../navigator/NavigatorUtil';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import BackPressComponent from '../common/BackPressComponent';
import Util from '../util/Util';
import ViewUtil from '../util/ViewUtil';
import GlobalStyles from '../res/style/GlobalStyles';
import NavigationUtil from '../navigator/NavigatorUtil';
const pageSize = 10;
type Props = {};
class SearchPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.backPress = new BackPressComponent({
      backPress: e => this.onBackPress(e),
    });
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.popular);
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.isKhangeKey = false;
  }
  componentDidMount() {
    this.backPress.componentDidMount();
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  loadData(isLoadMore) {
    const {onLoadMoreSearch, onSearch, search, keys} = this.props;
    if (isLoadMore) {
      // pageIndex,pageSize, dataArray,favoriteDao,callback,
      onLoadMoreSearch(
        ++search.pageIndex,
        pageSize,
        search.items,
        this.favoriteDao,
        () => {
          this.toast.show('没有更多了');
        },
      );
    } else {
      //inputKey, pageSize, token, favoriteDao, popularKeys, callback
      onSearch(
        this.inputKey,
        pageSize,
        (this.searchToken = new Date().getTime()),
        this.favoriteDao,
        keys,
        message => {
          this.toast.show(message);
        },
      );
    }
  }
  onBackPress() {
    const {onSearchCancel, onLoadLanguage} = this.props;
    onSearchCancel(this.searchToken);
    this.input.blur();
    NavigatorUtil.goBack(this.props.navigation);
    if (this.isKhangeKey) {
      onLoadLanguage(FLAG_LANGUAGE.flag_key);
    }
    return true;
  }
  onSaveKey() {
    const {keys} = this.props;
    let key = this.inputKey;
    if (Util.checkKeyIsExist(keys, key)) {
      this.toast.show(key + '已经存在了');
    } else {
      let keyLanguage = {
        path: key,
        name: key,
        checked: true,
      };
      keys.unshift(keyLanguage);
      this.languageDao.save(keys);
      this.toast.show('保存成功');
      this.isKhangeKey = true;
    }
  }
  onRightButtonClick() {
    const {onSearchCancel, search} = this.props;
    if (search.showText === '搜索') {
      this.loadData(false);
    } else {
      onSearchCancel(this.searchToken);
    }
  }
  genIndicator() {
    const {search} = this.props;
    return search.hiddenLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} />
        <Text style={{alignItems: 'center', justifyContent: 'center'}}>
          正在加载更多
        </Text>
      </View>
    );
  }
  renderItem(data) {
    const item = data.item;
    const {theme} = this.params;
    return (
      <PopularItem
        projectModel={item}
        theme={theme}
        onSelect={callback => {
          NavigationUtil.goPage(
            {
              theme,
              projectModel: item,
              flag: FLAG_STORAGE.flag_popular,
              callback,
            },
            'DetailPage',
          );
        }}
        onFavorite={(item, isFavorite) =>
          FavoriteUtil.onFavorite(
            this.favoriteDao,
            item,
            isFavorite,
            FLAG_STORAGE.flag_popular,
          )
        }
      />
    );
  }
  renderNavBar() {
    const {theme} = this.params;
    const {showText, inputKey} = this.props.search;
    const placeholder = inputKey || '请输入';
    let backButton = ViewUtil.getLeftBackButton(() => this.onBackPress());
    let inputView = (
      <TextInput
        ref={input => (this.input = input)}
        placeholder={placeholder}
        onChangeText={text => (this.inputKey = text)}
        style={styles.textInput}
      />
    );
    let rightButton = (
      <TouchableOpacity
        onPress={() => {
          this.input.blur(); //收起键盘
          this.onRightButtonClick();
        }}>
        <View style={{marginRight: 10}}>
          <Text style={styles.title}>{showText}</Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <View
        style={{
          backgroundColor: theme.themeColor,
          flexDirection: 'row',
          alignItems: 'center',
          height:
            Platform.OS === 'ios'
              ? GlobalStyles.nav_bar_height_ios
              : GlobalStyles.nav_bar_height_android,
        }}>
        {backButton}
        {inputView}
        {rightButton}
      </View>
    );
  }

  render() {
    const {
      isLoading,
      projectModels,
      showBottomButton,
      hiddenLoadingMore,
    } = this.props.search;
    const {theme} = this.params;
    let statusBar = null;
    if (Platform.OS === 'ios' && !DeviceInfo.isIPhoneX_deprecated) {
      statusBar = (
        <View style={[styles.statusBar, {backgroundColor: theme.themeColor}]} />
      );
    }
    let listView = !isLoading ? (
      <FlatList
        data={projectModels}
        renderItem={data => this.renderItem(data)}
        keyExtractor={item => '' + item.item.id}
        contentInset={{
          bottom: 45 + (DeviceInfo.isIPhoneX_deprecated ? 34 : 24),
        }}
        refreshControl={
          <RefreshControl
            title={'Loading'}
            titleColor={theme.themeColor}
            colors={[theme.themeColor]}
            refreshing={isLoading}
            onRefresh={() => this.loadData()}
            tintColor={theme.themeColor}
          />
        }
        ListFooterComponent={() => this.genIndicator()}
        onEndReached={() => {
          console.log('---onEndReached----');
          setTimeout(() => {
            if (this.canLoadMore) {
              //fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
              this.loadData(true);
              this.canLoadMore = false;
            }
          }, 100);
        }}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
          console.log('---onMomentumScrollBegin-----');
        }}
      />
    ) : null;
    let bottomButton = showBottomButton ? (
      <TouchableOpacity
        style={[styles.bottomButton, {backgroundColor: theme.themeColor}]}
        onPress={() => {
          this.onSaveKey();
        }}>
        <View style={{justifyContent: 'center'}}>
          <Text style={styles.title}>收藏</Text>
        </View>
      </TouchableOpacity>
    ) : null;
    let indicatorView = isLoading ? (
      <ActivityIndicator
        style={styles.centering}
        size="large"
        animating={isLoading}
      />
    ) : null;
    let resultView = (
      <View style={{flex: 1}}>
        {indicatorView}
        {listView}
      </View>
    );
    return (
      <View style={styles.container}>
        {statusBar}
        {this.renderNavBar()}
        {resultView}
        {bottomButton}
        <Toast ref={toast => (this.toast = toast)} />
      </View>
    );
  }
}
const mapPopularStateToProps = state => ({
  keys: state.language.keys,
  search: state.search,
});
const mapPopularDispatchToProps = dispatch => ({
  onSearch: (inputKey, pageSize, token, favoriteDao, popularKeys, callback) =>
    dispatch(
      actions.onSearch(
        inputKey,
        pageSize,
        token,
        favoriteDao,
        popularKeys,
        callback,
      ),
    ),
  onSearchCancel: token => dispatch(actions.onSearchCancel(token)),
  onLoadMoreSearch: (pageIndex, pageSize, dataArray, favoriteDao, callback) =>
    dispatch(
      actions.onLoadMoreSearch(
        pageIndex,
        pageSize,
        dataArray,
        favoriteDao,
        callback,
      ),
    ),
  onLoadLanguage: flag => dispatch(actions.onLoadLanguage(flag)),
});
export default connect(
  mapPopularStateToProps,
  mapPopularDispatchToProps,
)(SearchPage);
const styles = StyleSheet.create({
  indicatorContainer: {
    alignItems: 'center',
    flex: 1,
  },
  indicator: {
    color: 'red',
    margin: 10,
  },
  container: {
    flex: 1,
  },
  statusBar: {
    height: 20,
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    height: 40,
    position: 'absolute',
    left: 10,
    top:
      GlobalStyles.window_height -
      45 -
      (DeviceInfo.isIPhoneX_deprecated ? 34 : 24),
    right: 10,
    borderRadius: 3,
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  textInput: {
    flex: 1,
    height: Platform.OS === 'ios' ? 26 : 40,
    borderWidth: 1,
    borderColor: 'white',
    alignSelf: 'center',
    paddingLeft: 5,
    marginRight: 10,
    marginLeft: 5,
    borderRadius: 3,
    opacity: 0.7,
    color: 'white',
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
  },
});
