import React, {Component} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  DeviceInfo,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TimeSpans from '../model/TimeSpans';

export const timeSpans = [
  new TimeSpans('今天', 'since=daily'),
  new TimeSpans('本周', 'since=weekly'),
  new TimeSpans('本月', 'since=monthly'),
];
const STATUS_BAR_HEIGHT =
  Platform.OS === 'ios' && DeviceInfo.isIPhoneX_deprecated ? 20 : 0; //状态栏的高度

export default class TrendingDialog extends Component {
  state = {
    visible: false,
  };
  show() {
    this.setState({visible: true});
  }
  dismiss() {
    this.setState({visible: false});
  }
  render() {
    const {onClose, onSelect} = this.props;
    return (
      <Modal
        transparent={true}
        visible={this.state.visible}
        onRequsetClose={() => onClose}>
        <TouchableOpacity
          onPress={() => this.dismiss()}
          style={styles.container}>
          <MaterialIcons
            name={'arrow-drop-up'}
            size={36}
            style={styles.arrow}
          />
          <View style={styles.content}>
            {timeSpans.map((result, i, arr) => {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    onSelect(timeSpans[i]);
                  }}
                  underlayColor="transparent">
                  <View style={styles.textContainer}>
                    <Text style={styles.text}>{timeSpans[i].showTime}</Text>
                  </View>
                  {i === timeSpans.length - 1 ? null : (
                    <View style={styles.line} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
  },
  arrow: {
    marginTop: 40,
    color: 'white',
    padding: 0,
    margin: -15,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 3,
    paddingVertical: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 3,
  },
  textContainer: {alignItems: 'center', flexDirection: 'row'},
  text: {
    color: '#000',
    fontSize: 18,
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  line: {
    height: 0.3,
    backgroundColor: 'darkgray',
  },
});
