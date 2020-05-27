import React, {Component} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  ScrollView,
  Text,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index';
import NavigatorUtil from '../navigator/NavigatorUtil';
import NavigationBar from '../common/NavigationBar';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import BackPressComponent from '../common/BackPressComponent';
import ViewUtil from '../util/ViewUtil';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ArrayUtils from '../util/ArrayUtils';
import {DragSortableView} from 'react-native-drag-sort';
const THEME_COLOR = '#F00';
type Props = {};
const {width} = Dimensions.get('window');

const parentWidth = width;
const childrenWidth = width;
const childrenHeight = 48;
class SortKeyPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.backPress = new BackPressComponent({
      backPress: e => this.onBackPress(e),
    });
    this.languageDao = new LanguageDao(this.params.flag);
    this.state = {
      checkedArray: SortKeyPage._keys(this.props),
      scrollEnabled: true,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const checkedArray = SortKeyPage._keys(nextProps, prevState);
    if (prevState.checkedArray !== checkedArray) {
      return {
        checkedArray: checkedArray,
      };
    }
    return null;
  }

  componentDidMount() {
    this.backPress.componentDidMount();
    //如果props中标签为空则从本地存储中获取标签
    if (SortKeyPage._keys(this.props).length === 0) {
      let {onLoadLanguage} = this.props;
      onLoadLanguage(this.params.flag);
    }
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  /**
   * 获取标签
   * @param props
   * @param state
   * @returns {*}
   * @private
   */
  static _keys(props, state) {
    //如果state中有checkedArray则使用state中的checkedArray
    if (state && state.checkedArray && state.checkedArray.length) {
      return state.checkedArray;
    }
    //否则从原始数据中获取checkedArray
    const flag = SortKeyPage._flag(props);
    let dataArray = props.language[flag] || [];
    let keys = [];
    for (let i = 0, j = dataArray.length; i < j; i++) {
      let data = dataArray[i];
      if (data.checked) {
        keys.push(data);
      }
    }
    return keys;
  }

  static _flag(props) {
    const {flag} = props.navigation.state.params;
    return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
  }

  onBackPress(e) {
    this.onBack();
    return true;
  }

  onSave(hasChecked) {
    if (!hasChecked) {
      //如果没有排序则直接返回
      if (
        ArrayUtils.isEqual(
          SortKeyPage._keys(this.props),
          this.state.checkedArray,
        )
      ) {
        NavigatorUtil.goBack(this.props.navigation);
        return;
      }
    }
    //保存排序后的数据
    //获取排序后的数据
    //更新本地数据
    this.languageDao.save(this.getSortResult());

    //重新加载排序后的标签，以便其他页面能够及时更新
    const {onLoadLanguage} = this.props;
    //更新store
    onLoadLanguage(this.params.flag);
    NavigatorUtil.goBack(this.props.navigation);
  }

  /**
   * 获取排序后的标签结果
   * @returns {Array}
   */
  getSortResult() {
    const flag = SortKeyPage._flag(this.props);
    //从原始数据中复制一份数据出来，以便对这份数据进行进行排序
    let sortResultArray = ArrayUtils.clone(this.props.language[flag]);
    //获取排序之前的排列顺序
    const originalCheckedArray = SortKeyPage._keys(this.props);
    //遍历排序之前的数据，用排序后的数据checkedArray进行替换
    for (let i = 0, j = originalCheckedArray.length; i < j; i++) {
      let item = originalCheckedArray[i];
      //找到要替换的元素所在位置
      let index = this.props.language[flag].indexOf(item);
      //进行替换
      sortResultArray.splice(index, 1, this.state.checkedArray[i]);
    }
    return sortResultArray;
  }

  onBack() {
    if (
      !ArrayUtils.isEqual(
        SortKeyPage._keys(this.props),
        this.state.checkedArray,
      )
    ) {
      Alert.alert('提示', '要保存修改吗？', [
        {
          text: '否',
          onPress: () => {
            NavigatorUtil.goBack(this.props.navigation);
          },
        },
        {
          text: '是',
          onPress: () => {
            this.onSave(true);
          },
        },
      ]);
    } else {
      NavigatorUtil.goBack(this.props.navigation);
    }
  }
  renderItem(item, index) {
    return (
      <View style={styles.item}>
        <MaterialCommunityIcons
          name={'sort'}
          size={16}
          style={{marginRight: 10, color: THEME_COLOR}}
        />
        <Text style={styles.txt}>{item.name}</Text>
      </View>
    );
  }

  render() {
    const {theme} = this.params;
    let title =
      this.params.flag === FLAG_LANGUAGE.flag_language
        ? '语言排序'
        : '标签排序';
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let navigationBar = (
      <NavigationBar
        title={title}
        leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
        style={statusBar}
        rightButton={ViewUtil.getRightButton('保存', () => this.onSave())}
      />
    );

    return (
      <View style={styles.container}>
        {navigationBar}
        <ScrollView
          ref={scrollView => (this.scrollView = scrollView)}
          scrollEnabled={this.state.scrollEnabled}
          style={styles.container}>
          <View style={styles.sort}>
            <DragSortableView
              dataSource={this.state.checkedArray}
              parentWidth={parentWidth}
              childrenWidth={childrenWidth}
              childrenHeight={childrenHeight}
              scaleStatus={'scaleY'}
              onDragStart={(startIndex, endIndex) => {
                this.setState({
                  scrollEnabled: false,
                });
              }}
              onDragEnd={startIndex => {
                this.setState({
                  scrollEnabled: true,
                });
              }}
              onDataChange={data => {
                // if (data.length != this.state.checkedArray.length) {
                if (!ArrayUtils.isEqual(data, this.state.checkedArray)) {
                  this.setState({
                    checkedArray: data,
                  });
                }
              }}
              keyExtractor={(item, index) => item.name} // FlatList作用一样，优化
              onClickItem={(data, item, index) => {}}
              renderItem={(item, index) => {
                return this.renderItem(item, index);
              }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapPopularStateToProps = state => ({
  language: state.language,
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: flag => dispatch(actions.onLoadLanguage(flag)),
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(
  mapPopularStateToProps,
  mapPopularDispatchToProps,
)(SortKeyPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  txt: {
    fontSize: 18,
    lineHeight: 24,
    padding: 5,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderColor: '#eee',
    width: childrenWidth,
    height: childrenHeight,
    marginLeft: 10,
    alignItems: 'center',
    borderRadius: 4,
  },
});
