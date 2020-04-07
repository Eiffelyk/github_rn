/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import WelcomePage from './js/page/WelcomePage';
import {name as appName} from './app.json';
import AppNavigator from './js/navigator/AppNavigator';

AppRegistry.registerComponent(appName, () => AppNavigator);
