import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import {useDarkMode} from 'react-native-dark-mode';
import {useSelector} from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import SearchBar from '../../Components/SearchBar';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';

export default function UdhaarLedger({navigation, route}) {
  const {themeColor, themeToggle, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;

  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const isDarkMode = themeColor;
  
  const getAllTransc = (lastIndx) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(navigationStrings.CUSTOMER_EARNING_HISTORY)
        }
        style={{
          height: moderateScaleVertical(75),
          borderTopWidth: 0.7,
          borderBottomWidth: lastIndx ? 0.7 : 0,
          borderColor: colors.blackOpacity20,
          paddingHorizontal: moderateScale(15),
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}>
        <View
          style={{
            height: moderateScale(45),
            width: moderateScale(45),
            borderRadius: 23,
            backgroundColor: '#F5A623',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: colors.white,
              fontSize: textScale(14),
              fontFamily: fontFamily.bold,
            }}>
            JD
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginLeft: moderateScale(25),
            flex: 1,
          }}>
          <View>
            <Text>John Doe</Text>
            <Text
              style={{
                color: colors.blackOpacity30,
                marginTop: moderateScaleVertical(3),
              }}>
              1 day ago
            </Text>
          </View>
          <View style={{alignSelf: 'flex-end'}}>
            <Text style={{color: '#D0021B'}}>₹ 20.00</Text>
            <Text
              style={{
                color: colors.blackOpacity30,
                marginTop: moderateScaleVertical(3),
              }}>
              To give
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const errorMethod = (error) => {
    showError(error?.message || error?.error || error);
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.white
        // colors.white
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
        centerTitle={strings.UDHAARLEDGER}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />
      <View style={{flex: 1}}>
        <View style={styles.topView}>
          <View style={{}}>
            <Text style={{color: colors.greyC, fontSize: textScale(16)}}>
              ₹ 100.00
            </Text>
            <Text style={styles.mainViewTxt}>Udhaar</Text>
          </View>
          <View
            style={{
              borderWidth: 0.7,
              height: '80%',
              borderColor: colors.blackOpacity20,
            }}
          />
          <View style={{}}>
            <Text style={{color: '#7ED321', fontSize: textScale(16)}}>
              ₹ 70.00
            </Text>
            <Text style={styles.mainViewTxt}>Payment</Text>
          </View>
        </View>
        <SearchBar
          containerStyle={{
            borderRadius: 15,
            marginTop: moderateScale(30),
            borderWidth: 0.7,
            borderRadius: moderateScale(3),
            borderColor: colors.blackOpacity20,
            marginHorizontal: moderateScale(15),
            backgroundColor: colors.white,
          }}
          // searchValue={searchInput}
          placeholder={strings.SEARCH_FOR_PRODUCT}
          // onChangeText={(value) => onChangeText(value)}
          // showRightIcon={showRightIcon}
          rightIconPress={() =>
            updateState({searchInput: '', isLoading: false})
          }
        />
        <View style={{height: 20}} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: colors.backgroundGrey,
            flexGrow: 1,
          }}>
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc(true)}
          <View style={{height: 80}} />
        </ScrollView>
        <GradientButton
          colorsArray={[colors.seaGreen, colors.seaGreen]}
          textStyle={{
            fontFamily: fontFamily.medium,
          }}
          marginTop={moderateScaleVertical(10)}
          btnText={`+ ${strings.ADD_CUSTOMER}`}
          onPress={() => {
            moveToNewScreen(navigationStrings.ADD_NEW_CUSTOMER)();
          }}
          borderRadius={moderateScale(5)}
          containerStyle={{
            width: '40%',
            borderRadius: moderateScale(5),
            alignSelf: 'flex-end',
            position: 'absolute',
            bottom: 5,
            right: 5,
          }}></GradientButton>
      </View>
    </WrapperContainer>
  );
}

const styles = StyleSheet.create({
  topView: {
    height: moderateScaleVertical(80),
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginTop: moderateScaleVertical(10),
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
    marginHorizontal: moderateScale(15),
  },
  mainViewTxt: {
    fontSize: textScale(13),
    opacity: 0.7,
    textAlign: 'center',
    marginTop: moderateScale(5),
  },
});
