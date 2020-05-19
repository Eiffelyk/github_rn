import React, {Component} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import CheckBox from 'react-native-check-box';
import {connect} from 'react-redux';
import actions from '../action/index';
import NavigationBar from '../common/NavigationBar';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import BackPressComponent from '../common/BackPressComponent';
import ViewUtil from '../util/ViewUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigatorUtil from '../navigator/NavigatorUtil';
import ArrayUtils from '../util/ArrayUtils';

const THEME_COLOR = '#F00';
class CustomKeyPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.changeValues = [];
    this.isRemoveKey = !!this.params.isRemoveKey;
    this.languageDao = new LanguageDao(this.params.flag);
    this.backPress = new BackPressComponent({
      backPress: e => this.onBackPress(e),
    });
    this.state = {
      keys: [],
    };
  }
  componentDidMount() {
    this.backPress.componentDidMount();
    if (CustomKeyPage._key(this.props).length === 0) {
      let {onLoadLanguage} = this.props;
      onLoadLanguage(this.params.flag);
    }
    this.setState({
      keys: CustomKeyPage._key(this.props),
    });
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  static _key(props, original, state) {
    const {flag, isRemoveKey} = props.navigation.state.params;
    let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
    if (isRemoveKey && !original) {
      return (
        (state && state.keys && state.keys.length !== 0 && state.keys) ||
        props.language[key].map(val => {
          return {
            ...val,
            checked: false,
          };
        })
      );
    } else {
      return props.language[key];
    }
  }
  onBackPress(e) {
    this.onBack();
    return true;
  }
  onBack() {
    NavigatorUtil.goBack(this.props.navigation);
  }
  onSave() {}
  renderItem() {
    let dataArray = this.state.keys;
    if (!dataArray || dataArray.length === 0) {
      return;
    }
    let length = dataArray.length;
    let views = [];
    for (let i = 0; i < length; i += 2) {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(dataArray[i], i)}
            {i + 1 < length && this.renderCheckBox(dataArray[i + 1], i + 1)}
          </View>
          <View style={styles.line} />
        </View>,
      );
    }
    return views;
  }
  onClick(data, index) {
    data.checked = !data.checked;
    ArrayUtils.updateArray(this.changeValues, data);
    this.state.keys[index] = data;
    this.setState({
      keys: this.state.keys,
    });
  }
  _checkedImage(checked) {
    return (
      <Ionicons
        name={checked ? 'ios-checkbox' : 'md-square-outline'}
        size={20}
        style={{
          color: THEME_COLOR,
        }}
      />
    );
  }
  renderCheckBox(data, index) {
    return (
      <CheckBox
        style={{padding: 10, flex: 1}}
        onClick={() => this.onClick(data, index)}
        isChecked={data.checked}
        leftText={data.name}
        checkedImage={this._checkedImage(true)}
        unCheckedImage={this._checkedImage(false)}
      />
    );
  }
  render() {
    let title = this.isRemoveKey ? '移除标签' : '自定义标签';
    title =
      this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
    let rightButtonText = this.isRemoveKey ? '移除' : '保存';
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let NavigationBarA = (
      <NavigationBar
        hide={false}
        title={title}
        statusBar={statusBar}
        leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
        rightButton={ViewUtil.getRightButton(rightButtonText, () =>
          this.onSave(),
        )}
        style={{backgroundColor: THEME_COLOR}}
      />
    );
    return (
      <View style={styles.container}>
        {NavigationBarA}
        <ScrollView>{this.renderItem()}</ScrollView>
      </View>
    );
  }
}
const mapCustomStateToProps = state => ({
  language: state.language,
});
const mapCustomDispatchToProps = dispatch => ({
  onLoadLanguage: flag => dispatch(actions.onLoadLanguage(flag)),
});
export default connect(
  mapCustomStateToProps,
  mapCustomDispatchToProps,
)(CustomKeyPage);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'darkgray',
  },
});
