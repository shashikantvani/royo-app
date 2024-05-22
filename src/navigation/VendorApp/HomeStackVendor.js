import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {RoyoHome, RoyoOrder, RoyoOrderDetail} from '../../Screens';
import navigationStrings from '../navigationStrings';

const Stack = createStackNavigator();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.ROYO_VENDOR_HOME}
        component={RoyoHome}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={RoyoOrderDetail}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
