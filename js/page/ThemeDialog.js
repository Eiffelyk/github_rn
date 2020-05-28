import React, {Component} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  DeviceInfo,
  Platform,
} from 'react-native';
import ThemeDao from '../expand/dao/ThemeDao';
import ThemeFactory, {ThemeFlags} from '../res/style/ThemeFactory';
import GlobalStyles from '../res/style/GlobalStyles';
import actions from '../action';
import {connect} from 'react-redux';
class ThemeDialog extends Component {
  constructor(props) {
    super(props);
    this.themeDao = new ThemeDao();
  }
  onSelectTheme(key) {
    this.props.onClose();
    this.themeDao.save(key);
    const {onThemeChange} = this.props;
    onThemeChange(ThemeFactory.createTheme(ThemeFlags[key]));
  }
  getThemeItem(key) {
    return (
      <TouchableOpacity
        style={{flex: 1}}
        underlayColor={'white'}
        onPress={() => this.onSelectTheme(key)}>
        <View style={[{backgroundColor: ThemeFlags[key]}, styles.themeItem]}>
          <Text style={styles.themeText}>{key}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  renderThemeItems() {
    const views = [];
    for (
      let i = 0, keys = Object.keys(ThemeFlags), length = keys.length;
      i < length;
      i += 3
    ) {
      const key1 = keys[i],
        key2 = keys[i + 1],
        key3 = keys[i + 2];
      views.push(
        <View key={i} style={{flexDirection: 'row'}}>
          {this.getThemeItem(key1)}
          {this.getThemeItem(key2)}
          {this.getThemeItem(key3)}
        </View>,
      );
    }
    return views;
  }
  renderContentView() {
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.onClose();
        }}>
        <View style={styles.modalContainer}>
          <ScrollView>{this.renderThemeItems()}</ScrollView>
        </View>
      </Modal>
    );
  }
  render() {
    return this.props.visible ? (
      <View style={GlobalStyles.root_container}>
        {this.renderContentView()}
      </View>
    ) : null;
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => {
    dispatch(actions.onThemeChange(theme));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThemeDialog);
const styles = StyleSheet.create({
  themeItem: {
    flex: 1,
    height: 120,
    margin: 3,
    padding: 3,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    margin: 10,
    marginBottom: 10 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0),
    marginTop:
      Platform.OS === 'ios'
        ? 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0)
        : 10,
    backgroundColor: 'white',
    borderRadius: 3,
    shadowColor: 'gray',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    padding: 3,
  },
  themeText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
});
