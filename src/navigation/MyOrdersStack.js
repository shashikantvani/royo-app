import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {MyOrders, OrderDetail} from '../Screens';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function ({navigation}) {
  const {appData, appStyle} = useSelector((state) => state?.initBoot);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.MY_ORDERS}
        component={MyOrders}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
