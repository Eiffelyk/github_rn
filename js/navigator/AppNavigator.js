import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
import FetchDemoPage from '../page/FetchDemoPage';
import AsyncStoreDemoPage from '../page/AsyncStoreDemoPage';

const InitNavigator = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage,
    navigationOptions: {
      headerShown: false,
    },
  },
});
const MainNavigator = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      headerShown: false,
    },
  },
  DetailPage: {
    screen: DetailPage,
  },
  FetchDemoPage: {
    screen: FetchDemoPage,
  },
  AsyncStoreDemoPage: {
    screen: AsyncStoreDemoPage,
  },
});

export default createAppContainer(
  createSwitchNavigator({
    Init: InitNavigator,
    Main: MainNavigator,
  }),
);
