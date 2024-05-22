import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import ButtonComponent from '../../Components/ButtonComponent';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import stylesFunc from './styles';
// import { useDarkMode } from 'react-native-dark-mode';
import { MyDarkTheme } from '../../styles/theme';

export default function OrderSuccess({ navigation, route }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const currentTheme = useSelector((state) => state.appTheme);
  const { appStyle, themeColors } = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily });
  const paramData = route?.params?.data;
  console.log(paramData, 'paramData');
  const [state, setState] = useState({});
  const { } = state;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  // const {themeColors, themeLayouts} = currentTheme;

  const viewOrderDetail = () => {
    
    navigation.navigate(navigationStrings.ORDER_DETAIL, {
      orderId: paramData?.orderDetail?.id,
      fromActive: true, // this value use for useInterval
      from:"cart"
    });
  };
  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}>
      <KeyboardAwareScrollView
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
        style={{ marginHorizontal: moderateScaleVertical(20) }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={isDarkMode && { tintColor: MyDarkTheme.colors.text }}
            source={imagePath.cross}
          />
        </TouchableOpacity>
        <View style={styles.doneIconView}>
          <Image
            source={imagePath.successfulIcon}
            style={{
              marginBottom: moderateScaleVertical(30),
              tintColor: 'green',
              opacity: 0.5,
            }}
          />
          <Text
            style={
              isDarkMode
                ? [styles.requestSubmitText, { color: MyDarkTheme.colors.text }]
                : styles.requestSubmitText
            }>
            {strings.YOUR_ORDER_HAS_BEEN_SUBMITTED} {''}
            {/* <Text style={
              isDarkMode
                ? [styles.thanksForyourPurchase, { color: MyDarkTheme.colors.text }]
                : styles.thanksForyourPurchase
            } >{ strings.THANKS_FOR_YOUR_PURCHASE}</Text> */}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles.successfully, { color: MyDarkTheme.colors.text }]
                : styles.successfully
            }>
            {strings.THANKS_FOR_YOUR_PURCHASE}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginVertical: moderateScaleVertical(50),
          }}>
          <Text
            style={
              isDarkMode
                ? [styles.yourAWBText, { color: MyDarkTheme.colors.text }]
                : styles.yourAWBText
            }>
            {`${strings.YOUR_ORDER_NUMBER} ${paramData && paramData?.orderDetail
                ? paramData?.orderDetail?.order_number
                : ''
              }`}
          </Text>
        </View>
      </KeyboardAwareScrollView>
      <View
        style={{
          alignItems: 'center',
          marginBottom: moderateScaleVertical(90),
        }}>
        <ButtonComponent
          btnText={strings.VIEW_DETAIL}
          onPress={viewOrderDetail}
          textStyle={{ color: themeColors.secondary_color }}
          borderRadius={moderateScale(13)}
          containerStyle={{
            backgroundColor: themeColors.primary_color,
            width: width / 1.2,
          }}
        />
      </View>
      {/* */}
    </WrapperContainer>
  );
}
