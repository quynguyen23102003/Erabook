import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabBottomBarCustom from '../customs/TabBottomBarCustom';
import {RootBottomTabsStackName} from './types';
import HomeScreen from '../screens/Home/HomeScreen';
import Account from '../screens/Setting';
import DiscoverScreen from '../screens/Discover/DiscoverScreen';
import WishlistScreen from '@screens/Wishlist/WishlistScreen';
import PurchasedScreen from '@screens/Purchased/PurchasedScreen';

const Tab = createBottomTabNavigator();
export const RootBottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <TabBottomBarCustom {...props} />}>
      <Tab.Screen
        name={RootBottomTabsStackName.HomeBottomTabScreen}
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name={RootBottomTabsStackName.DiscoverBottomTabScreen}
        options={{headerShown: false}}
        component={DiscoverScreen}
      />
      <Tab.Screen
        name={RootBottomTabsStackName.WishlistBottomTabScreen}
        options={{headerShown: false}}
        component={WishlistScreen}
      />
      <Tab.Screen
        name={RootBottomTabsStackName.PurchasedBottomTabScreen}
        component={PurchasedScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name={RootBottomTabsStackName.AccountBottomTabScreen}
        component={Account}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};
