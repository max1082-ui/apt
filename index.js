/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';

import {name as appName} from './app.json';

import App from './src';
import {store} from './src/state';

function AppRoot() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => AppRoot);
