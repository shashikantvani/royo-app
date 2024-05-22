import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
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
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import GradientButton from '../../Components/GradientButton';
import navigationStrings from '../../navigation/navigationStrings';
import SearchBar from '../../Components/SearchBar';
import Modal from '../../Components/Modal';
import BorderTextInputWithLable from '../../Components/BorderTextInputWithLable';

export default function CustomerEarningHistory({navigation, route}) {
  const {themeColor, themeToggle, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const [state, setState] = useState({
    isAddCustomerModal: false,
  });
  const {isAddCustomerModal} = state;
  const updateState = (data) => setState((state) => ({...state, ...data}));

  const fontFamily = appStyle?.fontSizeData;

  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const isDarkMode =  themeColor;
  const getAllDetails = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          borderTopWidth: 0.7,
          borderColor: colors.blackOpacity20,
        }}>
        <View
          style={{
            width: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FAFAFA',
            paddingVertical: moderateScale(15),
          }}>
          <View>
            <Text
              style={{
                ...styles.titleTxt,
                opacity: 1,
                fontFamily: fontFamily.bold,
              }}>
              30 Dec 21 | 10:00 A.M
            </Text>
            <Text style={{...styles.titleTxt, marginTop: moderateScale(5)}}>
              Bal ₹ 90.00
            </Text>
          </View>
        </View>
        <View
          style={{
            width: '25%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(208,2,27,0.12)',
          }}>
          <Text style={{...styles.titleTxt, color: '#D0021B'}}>₹ 20.00</Text>
        </View>
        <View
          style={{
            width: '25%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(148,255,31,0.06)',
          }}>
          <Text style={{...styles.titleTxt, color: '#7ED321'}}>₹ 20.00</Text>
        </View>
      </View>
    );
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
        centerTitle={'John Doe'}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />
      <View style={{flex: 1}}>
        <ScrollView>
          <View style={{flexDirection: 'row', marginTop: moderateScale(20)}}>
            <View
              style={{
                width: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FAFAFA',
                paddingVertical: moderateScale(15),
              }}>
              <Text style={styles.titleTxt}>ENTRIES</Text>
            </View>
            <View
              style={{
                width: '25%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(208,2,27,0.12)',
              }}>
              <Text style={styles.titleTxt}>UDHAAR</Text>
            </View>
            <View
              style={{
                width: '25%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(148,255,31,0.06)',
              }}>
              <Text style={styles.titleTxt}>PAYMENT</Text>
            </View>
          </View>

          {getAllDetails()}
          {getAllDetails()}
          {getAllDetails()}
          {getAllDetails()}
          {getAllDetails()}
          {getAllDetails()}
          {getAllDetails()}
          {getAllDetails()}
          {getAllDetails()}
          {getAllDetails()}
          <View style={{height: moderateScale(80)}} />
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            bottom: 5,
            width: '100%',
            justifyContent: 'space-between',
            paddingHorizontal: moderateScale(15),
          }}>
          <GradientButton
            colorsArray={['#D0021B', '#D0021B']}
            textStyle={{
              fontFamily: fontFamily.medium,
            }}
            borderRadius={5}
            marginTop={moderateScaleVertical(10)}
            btnText={`UDHAAR`}
            containerStyle={{
              width: '45%',
              alignSelf: 'flex-end',
              marginBottom: moderateScale(10),
            }}
          />
          <GradientButton
            colorsArray={['#7ED321', '#7ED321']}
            textStyle={{
              fontFamily: fontFamily.medium,
            }}
            borderRadius={5}
            marginTop={moderateScaleVertical(10)}
            btnText={`PAYMENT`}
            containerStyle={{
              width: '45%',
              alignSelf: 'flex-end',
              marginBottom: moderateScale(10),
            }}
          />
        </View>
      </View>
    </WrapperContainer>
  );
}

const styles = StyleSheet.create({
  titleTxt: {
    opacity: 0.7,
  },
});
