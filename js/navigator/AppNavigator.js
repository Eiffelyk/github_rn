import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
import FetchDemoPage from '../page/FetchDemoPage';
import AsyncStoreDemoPage from '../page/AsyncStoreDemoPage';
import DataStoreDemoPage from '../page/DataStoreDemoPage';
import WebviewPage from '../page/WebviewPage';
import AboutPage from '../page/about/AboutPage';
import AboutMePage from '../page/about/AboutMePage';

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
    navigationOptions: {
      headerShown: false,
    },
  },
  WebviewPage: {
    screen: WebviewPage,
    navigationOptions: {
      headerShown: false,
    },
  },
  AboutPage: {
    screen: AboutPage,
    navigationOptions: {
      headerShown: false,
    },
  },
  AboutMePage: {
    screen: AboutMePage,
    navigationOptions: {
      headerShown: false,
    },
  },
  FetchDemoPage: {
    screen: FetchDemoPage,
  },
  AsyncStoreDemoPage: {
    screen: AsyncStoreDemoPage,
  },
  DataStoreDemoPage: {
    screen: DataStoreDemoPage,
  },
});

export default createAppContainer(
  createSwitchNavigator({
    Init: InitNavigator,
    Main: MainNavigator,
  }),
);
