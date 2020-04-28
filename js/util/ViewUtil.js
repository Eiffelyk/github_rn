import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
export default class ViewUtil {
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
