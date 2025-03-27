import React, {FC, useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';

import {TabBar, TabView} from 'react-native-tab-view';

import type {
  Route as TabViewRoute,
  TabBarProps,
  TabViewProps,
} from 'react-native-tab-view';

import {AppText, Loader} from '@components/atoms';

import {scale} from '@styles/mixins';
import {Colors} from '@styles/colors';
import {WINDOW_WIDTH} from '@styles/sizes';

interface TopTabBarProps {
  renderScene: TabViewProps<TabViewRoute>['renderScene'];
  routes: TabViewRoute[];
}

const TopTabBar: FC<TopTabBarProps> = ({renderScene, routes}) => {
  const renderTabBarItem: TabBarProps<TabViewRoute>['renderTabBarItem'] = ({
    key,
    route,
    navigationState,
    renderLabel,
    onPress,
  }) => {
    const focused = key === navigationState.routes[navigationState.index].key;
    const renderLabelArg = {
      route,
      focused,
      color: focused ? Colors.white : Colors.gray8,
    };

    return (
      <Pressable
        key={key.toString()}
        disabled={focused}
        onPress={onPress}
        style={[
          styles.topTabLabelContainer,
          {backgroundColor: focused ? Colors.accent.pressed : Colors.gray1},
        ]}>
        {renderLabel && renderLabel(renderLabelArg)}
      </Pressable>
    );
  };

  const renderTabBar: TabViewProps<TabViewRoute>['renderTabBar'] = (props) => (
    <TabBar
      {...props}
      renderIndicator={() => null}
      style={styles.topTab}
      renderTabBarItem={renderTabBarItem}
      renderLabel={({route, color}) => {
        return (
          <AppText type="control" color={color}>
            {route.title}
          </AppText>
        );
      }}
    />
  );

  const [index, setIndex] = useState(0);

  const renderLazyPlaceholder = () => <Loader size="large" />;
  //#endregion

  return (
    <TabView
      lazy
      navigationState={{index, routes}}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={styles.initialLayout}
      renderLazyPlaceholder={renderLazyPlaceholder}
    />
  );
};

const styles = StyleSheet.create({
  topTab: {
    backgroundColor: Colors.gray1,
    borderBottomColor: Colors.gray3,
    borderTopColor: Colors.gray3,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  topTabLabelContainer: {
    height: scale(49),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialLayout: {
    width: WINDOW_WIDTH,
  },
});

export default TopTabBar;
