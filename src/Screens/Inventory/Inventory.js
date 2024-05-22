import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
// import {useDarkMode} from 'react-native-dark-mode';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import colors from '../../styles/colors';
import {MyDarkTheme} from '../../styles/theme';
import InventoryComp from '../../Components/InventoryComp';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import GradientButton from '../../Components/GradientButton';
import navigationStrings from '../../navigation/navigationStrings';

export default function Inventory({navigation, route}) {
  const {themeColor, themeToggle, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;

  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const isDarkMode =  themeColor;
  return (
    <WrapperContainer
      bgColor={
        // isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
        colors.white
      }
      statusBarColor={colors.white}
      // isLoadingB={isLoadingB}
      source={loaderOne}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={strings.INVENTORY}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />
      <View style={{flex: 1, marginHorizontal: moderateScale(15)}}>
        <InventoryComp />
        <InventoryComp />
        <InventoryComp />
      </View>
      <GradientButton
        colorsArray={[colors.seaGreen, colors.seaGreen]}
        textStyle={{
          fontFamily: fontFamily.medium,
        }}
        marginTop={moderateScaleVertical(10)}
        btnText={`+ ${strings.ADD_PRODUCT}`}
        onPress={() => navigation.navigate(navigationStrings.ADD_PRODUCT)}
        containerStyle={{
          width: '40%',
          borderRadius: moderateScale(5),
          alignSelf: 'flex-end',
          marginBottom: moderateScale(10),
          marginRight: moderateScale(10),
        }}></GradientButton>
    </WrapperContainer>
  );
}

const styles = StyleSheet.create({});
