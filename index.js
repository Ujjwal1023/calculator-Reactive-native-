/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Provider, createStore } from 'jotai';

const myStore = createStore();
export default function Main()  {
    return(<Provider store={myStore}><App/></Provider>)
}

AppRegistry.registerComponent(appName, () => Main);
