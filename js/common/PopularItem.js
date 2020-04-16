import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React, {Component} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class PopularItem extends Component {
  render() {
    let {item} = this.props;
    if (!item && !item.owner) {
      return null;
    }
    let FavoriteButton = (
      <TouchableOpacity
        style={{padding: 6}}
        activeOpacity={1}
        onPress={() => {
          console.log('FavoriteButton is press');
          this.props.onFavorite;
        }}>
        <FontAwesome name={'star-o'} size={26} style={{color: 'red'}} />
      </TouchableOpacity>
    );
    return (
      <TouchableOpacity
        style={style.cell_container}
        activeOpacity={1}
        onPress={() => {
          console.log('PopularItem is press');
          this.props.onSelect;
        }}>
        <Text style={style.full_name}>{item.full_name}</Text>
        <Text style={style.cell_description}>{item.description}</Text>
        <View style={style.cell_row}>
          <View style={{flexDirection: 'row'}}>
            <Text>Author:</Text>
            <Image
              style={{height: 22, width: 22}}
              source={{uri: item.owner.avatar_url}}
            />
          </View>
          <Text>{'Star:' + item.stargazers_count}</Text>
          {FavoriteButton}
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
