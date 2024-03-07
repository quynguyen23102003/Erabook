import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {LoginStackName, LoginStackParamList} from './types';
import React from 'react';
import WelcomeScreen from '../screens/Authentication/WelcomeScreen';
import SignInScreen from '../screens/Authentication/SignInScreen';
import SignUpScreen from '../screens/Authentication/SignUpScreen';
import OTPCodeVerification from '@screens/ForgotPassword/OTPCodeVerification';
import CreatePassword from '@screens/ForgotPassword/CreatePassword';
import ForgotPassword from '@screens/ForgotPassword/ForgotPassword';

const LoginStack = createStackNavigator<LoginStackParamList>();
export const LoginNavigator = () => {
  return (
    <LoginStack.Navigator
      initialRouteName={LoginStackName.WelcomeScreen}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}>
      <LoginStack.Screen
        name={LoginStackName.WelcomeScreen}
        component={WelcomeScreen}
      />
      <LoginStack.Screen
        name={LoginStackName.SignInScreen}
        component={SignInScreen}
      />
      <LoginStack.Screen
        name={LoginStackName.SignUpScreen}
        component={SignUpScreen}
      />

      <LoginStack.Screen
        name={LoginStackName.ForgotPassword}
        component={ForgotPassword}
      />

      <LoginStack.Screen
        name={LoginStackName.OTPCodeVerification}
        component={OTPCodeVerification}
      />

      <LoginStack.Screen
        name={LoginStackName.CreatePassword}
        component={CreatePassword}
      />
    </LoginStack.Navigator>
  );
};
