import {useFocusEffect} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import {useDarkMode} from 'react-native-dark-mode';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import actions from '../redux/actions';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {
  hapticEffects,
  playHapticEffect,
  showError,
} from '../utils/helperFunctions';
import TransparentButtonWithTxtAndIcon from './TransparentButtonWithTxtAndIcon';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';

navigator.geolocation = require('react-native-geolocation-service');

const ChooseAddressModal = ({
  isVisible = false,
  onClose,
  selectAddress,
  openAddressModal,
  selectedAddress,
}) => {
  //close yout modal
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const [state, setState] = useState({
    allAddress: [],
    isLoading: true,
    viewHeight: 0,
  });
  const {allAddress, isLoading, viewHeight} = state;
  const userData = useSelector((state) => state?.auth?.userData);
  const {appData, appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesData({fontFamily});
  const updateState = (data) => setState((state) => ({...state, ...data}));

  useFocusEffect(
    React.useCallback(() => {
      if (!!userData?.auth_token && isVisible) {
        getAllAddress();
      }
    }, [isVisible]),
  );

  //get All address
  const getAllAddress = () => {
    actions
      .getAddress(
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
        // console.log(res, 'res>>>>');
        // actions.saveAllUserAddress(res.data);
        updateState({allAddress: res.data, isLoading: false});
      })
      .catch((error) => {
        updateState({isLoading: false});
        showError(error?.message || error?.error);
      });
  };
  //address view tab
  const addressView = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          marginTop: moderateScaleVertical(10),
        }}>
        {allAddress ? (
          <>
            {allAddress.map((itm, inx) => {
              return (
                <TouchableOpacity
                  key={String(inx)}
                  onPress={() => selectAddress(itm)}>
                  <View
                    key={inx}
                    style={{
                      borderBottomColor: colors.lightGreyBorder,
                      borderBottomWidth: moderateScaleVertical(1),
                      borderTopWidth: moderateScaleVertical(1),
                      borderTopColor: colors.lightGreyBorder,
                    }}>
                    <View
                      style={{
                        marginHorizontal: moderateScale(24),
                        marginTop: moderateScaleVertical(20),
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: moderateScaleVertical(12),
                      }}>
                      <View
                        style={{
                          flex: 0.1,
                          alignItems: 'flex-start',
                          justifyContent: 'center',
                        }}>
                        <Image
                          style={
                            isDarkMode && {tintColor: MyDarkTheme.colors.text}
                          }
                          source={imagePath.home}
                        />
                      </View>
                      <View style={{flex: 0.8}}>
                        <Text
                          numberOfLines={2}
                          style={
                            isDarkMode
                              ? [
                                  styles.address,
                                  {
                                    textAlign: 'left',
                                    color: MyDarkTheme.colors.text,
                                  },
                                ]
                              : [styles.address, {textAlign: 'left'}]
                          }>
                          {!!itm?.house_number ? itm?.house_number + ', ' : ''}
                          {itm?.address}
                        </Text>
                      </View>
                      {selectedAddress ? (
                        selectedAddress.id == itm.id ? (
                          <View
                            style={{
                              flex: 0.1,
                              alignItems: 'flex-end',
                              justifyContent: 'center',
                            }}>
                            <Image source={imagePath.done} />
                          </View>
                        ) : null
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        ) : null}
        <View
          style={{
            height: moderateScale(80),
          }}
        />
      </ScrollView>
    );
  };

  if (isVisible) {
    return (
      <BottomSheet
        key={isVisible}
        index={1}
        snapPoints={[1, height / 1.8]}
        activeOffsetY={[-1, 1]}
        failOffsetX={[-5, 5]}
        animateOnMount={true}
        enablePanDownToClose
        onChange={(index) => {
          if (index === 0) {
            onClose();
          }
          playHapticEffect(hapticEffects.impactMedium);
        }}>
        <View style={{flex: 1}}>
          <BottomSheetScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={[
              styles.modalMainViewContainer,
              {
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.lightDark
                  : colors.white,
              },
            ]}>
            <View
              style={
                isDarkMode
                  ? [
                      styles.modalMainViewContainer,
                      {backgroundColor: MyDarkTheme.colors.lightDark},
                    ]
                  : styles.modalMainViewContainer
              }>
              <View style={styles.selectAndAddesssView}>
                <Text
                  numberOfLines={1}
                  style={
                    isDarkMode
                      ? [
                          styles.selectAddressText,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.selectAddressText
                  }>
                  {strings.SELECT_AN_ADDRESS}
                </Text>
              </View>
              <TransparentButtonWithTxtAndIcon
                btnText={strings.ADD_NEW_ADDRESS}
                icon={imagePath.add}
                onPress={openAddressModal}
                textStyle={
                  isDarkMode
                    ? {marginLeft: 10, color: MyDarkTheme.colors.text}
                    : {marginLeft: 10}
                }
                borderRadius={moderateScale(13)}
                containerStyle={{
                  marginHorizontal: 20,
                  alignItems: 'flex-start',
                }}
                marginBottom={moderateScaleVertical(20)}
              />
              <View style={{height: 1, backgroundColor: colors.lightGreyBg}} />
              <View style={styles.savedAddressView}>
                <Text
                  numberOfLines={1}
                  style={
                    isDarkMode
                      ? [
                          styles.savedAddressText,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.savedAddressText
                  }>
                  {strings.SAVED_ADDRESS}
                </Text>
              </View>
              {addressView()}
            </View>
          </BottomSheetScrollView>
        </View>
      </BottomSheet>
    );
  }
  return null;
};

export function stylesData({fontFamily}) {
  const commonStyles = commonStylesFun({fontFamily});

  const styles = StyleSheet.create({
    modalContainer: {
      marginHorizontal: 0,
      marginBottom: 0,
      marginTop: moderateScaleVertical(height / 10),
      overflow: 'hidden',
    },
    textInputContainer: {
      flexDirection: 'row',
      height: moderateScaleVertical(49),
      borderWidth: 1,
      // borderRadius: 13,
      // paddingVertical:moderateScaleVertical(5),
      borderColor: colors.borderLight,
    },
    closeButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: moderateScaleVertical(10),
    },
    textInput: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      opacity: 1,
      // color: colors.textGreyOpcaity7,
    },
    address: {
      fontSize: textScale(10),
      color: colors.textGrey,
      fontFamily: fontFamily.medium,
      lineHeight: moderateScale(20),
      opacity: 0.7,
    },
    modalMainViewContainer: {
      flex: 1,
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      // overflow: 'hidden',
    },
    selectAndAddesssView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // marginBottom: moderateScaleVertical(24),
      marginVertical: moderateScaleVertical(20),
      paddingHorizontal: moderateScale(24),
    },
    selectAddressText: {
      ...commonStyles.mediumFont16,
      color: colors.textGreyD,
      fontFamily: fontFamily.bold,
      fontSize: textScale(16),
    },
    savedAddressView: {
      flexDirection: 'row',
      marginTop: moderateScaleVertical(15),
      paddingHorizontal: moderateScale(24),
    },
    savedAddressText: {
      ...commonStyles.mediumFont16,
      color: colors.textGreyD,
      fontFamily: fontFamily.bold,
      fontSize: textScale(16),
    },
  });
  return styles;
}
export default React.memo(ChooseAddressModal);
