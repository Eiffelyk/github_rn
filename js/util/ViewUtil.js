import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {MORE_MENU} from '../common/MORE_MENU';
export default class ViewUtil {
  static getSettingItem(callback, text, color, Icons, icon, expandableIco) {
    return (
      <TouchableOpacity style={styles.about} onPress={callback}>
        <View style={styles.about_left}>
          {Icons && icon ? (
            <Icons
              name={icon}
              size={16}
              style={{marginRight: 10, color: color}}
            />
          ) : (
            <View
              style={{opacity: 1, width: 16, height: 16, marginRight: 10}}
            />
          )}
          <Text>{text}</Text>
        </View>
        <Ionicons
          name={expandableIco ? expandableIco : 'ios-arrow-forward'}
          size={16}
          style={{
            color: color ? color : 'back',
            marginRight: 10,
            alignSelf: 'center',
          }}
        />
      </TouchableOpacity>
    );
  }
  static getMenuItem(callback, menu, color, expandableIco) {
    return ViewUtil.getSettingItem(
      callback,
      menu.name,
      color,
      menu.Icons,
      menu.icon,
      expandableIco,
    );
  }
  static getLeftBackButton(callBack) {
    return (
      <TouchableOpacity
        style={{padding: 8, paddingLeft: 12}}
        onPress={callBack}>
        <Ionicons name={'ios-arrow-back'} size={26} style={{color: '#fff'}} />
      </TouchableOpacity>
    );
  }
  static getFavoriteButton(callBack, isFavorite) {
    return (
      <TouchableOpacity
        style={{padding: 8, paddingLeft: 12}}
        onPress={callBack}>
        <FontAwesome
          name={isFavorite ? 'star' : 'star-o'}
          size={26}
          style={{color: '#fff'}}
        />
      </TouchableOpacity>
    );
  }
  static getShareButton(callBack) {
    return (
      <TouchableOpacity
        style={{padding: 8, paddingLeft: 12}}
        onPress={callBack}>
        <Ionicons name={'md-share'} size={26} style={{color: '#fff'}} />
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  about: {
    backgroundColor: 'white',
    padding: 10,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  about_left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
