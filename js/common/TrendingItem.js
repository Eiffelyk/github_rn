import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import BaseItem from './BaseItem';

export default class TrendingItem extends BaseItem {
  render() {
    let {projectModel} = this.props;
    let {item} = projectModel;
    if (!item) {
      return null;
    }
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          this.onItemSelect();
        }}>
        <View style={style.cell_container}>
          <Text style={style.full_name}>{item.fullName}</Text>
          <Text style={style.cell_description}>{item.description}</Text>
          <Text style={style.cell_description}>{item.meta}</Text>
          <View style={style.cell_row}>
            <View style={{flexDirection: 'row'}}>
              <Text>Build:</Text>
              {item.contributors.map((result, i, arr) => {
                return (
                  <Image
                    key={i}
                    style={{height: 22, width: 22, margin: 2}}
                    source={{uri: arr[i]}}
                  />
                );
              })}
            </View>
            <Text>{'Star:' + item.starCount}</Text>
            {this._favoriteButton()}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
const style = StyleSheet.create({
  cell_container: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 3,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 2,
    shadowColor: 'gray',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 2,
  },
  full_name: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121',
  },
  cell_description: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121',
  },
  cell_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
