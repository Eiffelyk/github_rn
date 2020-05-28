import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {PropTypes} from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
export default class BaseItem extends Component {
  static propTypes = {
    projectModel: PropTypes.object,
    onSelect: PropTypes.func,
    onFavorite: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      isFavorite: this.props.projectModel.isFavorite,
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const isFavorite = nextProps.projectModel.isFavorite;
    const id = nextProps.projectModel.item.id.toString();
    if (prevState.isFavorite !== isFavorite) {
      return {
        isFavorite: isFavorite,
      };
    } else {
      return null;
    }
  }
  onItemSelect() {
    this.props.onSelect(isFavorite => {
      this.setFavoriteState(isFavorite);
    });
  }
  onPressFavorite() {
    this.setFavoriteState(!this.state.isFavorite);
    this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite);
  }
  setFavoriteState(isFavorite) {
    this.props.projectModel.isFavorite = isFavorite;
    this.setState({
      isFavorite: isFavorite,
    });
  }
  _favoriteButton() {
    const {theme} = this.props;
    return (
      <TouchableOpacity
        style={{padding: 6}}
        activeOpacity={1}
        onPress={() => {
          this.onPressFavorite();
        }}>
        <FontAwesome
          name={this.state.isFavorite ? 'star' : 'star-o'}
          size={26}
          style={{color: theme.themeColor}}
        />
      </TouchableOpacity>
    );
  }
}
