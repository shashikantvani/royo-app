import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Keyboard,
  I18nManager,
  Text,
} from 'react-native';
// import { useDarkMode } from 'react-native-dark-mode';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import { googlePlacesApi } from '../utils/googlePlaceApi';
import SelctFromMap from './SelctFromMap';
import ModalView from '../Components/Modal';
import strings from '../constants/lang';
import * as RNLocalize from 'react-native-localize';
import actions from '../redux/actions';
import { showError } from '../utils/helperFunctions';

const SearchPlaces = ({
  containerStyle = {},
  inputStyle = {},
  mapKey = '',
  fetchArrayResult = () => { },
  value = '',
  setValue = () => { },
  placeHolder,
  onFocus = () => { },
  autoFocus = false,
  _moveToNextScreen = () => { },
  curLatLng = {},
  placeHolderColor = colors.black,
  onClear = () => { },
  showRightImg = true,
  textStyle = {},
  mapClose = () => { },
  addressDone = () => { },
  isMapSelectLocation = false,
  currentLatLong = {},
  index=0,
  isTaxiFlow = false
}) => {
  // console.log(index, 'in MapPlaceComp map key');

   // console.log(RNLocalize.getCountry(), 'timezone');
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const { appData, appStyle, themeColors, currencies, languages } = useSelector((state) => state?.initBoot);
  const { constCurrLoc } = useSelector((state) => state?.home);

  // console.log("cur lag lng", currentLatLong)

  const textChangeHandler = async (data) => {

    // console.log(appData?.profile?.preferences?.is_static_dropoff, "searching texts")
    setValue(data);
    if (!!appData?.profile?.preferences?.is_static_dropoff && index!==0) {

      let query = {}
      query['search'] = data
      actions.pickuplocationSearch(query,
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        }).then(
          (res) => {
            // console.log(res, "ressssssss")
            if (res && !!res.data) {
              let arry = res.data.map((val, i) => {
                return {
                  ...val,
                  formatted_address: val?.address,
                  name: val?.title
                }
              })
              fetchArrayResult(arry);
            }
          }
        ).catch(
          error => console.error(error, "errrorrrr")
        )
    }
    else {
      var res = await googlePlacesApi(data, mapKey, curLatLng, RNLocalize.getCountry());
      // console.log("kdjfkdkjfdf", res)
      if (res && !!res.predictions) {
        let arry = res.predictions.map((val, i) => {
          return {
            ...val,
            formatted_address: val?.description,
            name: val?.structured_formatting.main_text
          }
        })
        fetchArrayResult(arry);
      }
    }
  };

  const modalMainContent = () => {
    return (
      <View style={{ flex: 1, backgroundColor: 'green' }}>
        <SelctFromMap
          addressDone={addressDone}
          mapClose={mapClose} //address map close
          constCurrLoc={currentLatLong}
        />
      </View>
    );
  };

  return (
    <>
      <View
        style={{
          ...styles.container,
          backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.greyNew,
          ...containerStyle,
        }}>
        <TextInput
          // multiline
          autoFocus={autoFocus}
          value={value}
          placeholder={placeHolder}
          onChangeText={textChangeHandler}
          style={{
            ...styles.text,
            color: isDarkMode ? colors.textGreyB : colors.black,
            ...textStyle,
          }}
          onSubmitEditing={Keyboard.dismiss}
          onFocus={onFocus}
          placeholderTextColor={
            isDarkMode ? colors.textGreyB : placeHolderColor
          }
        />
        {value !== '' && (
          <TouchableOpacity onPress={onClear} activeOpacity={0.8}>
            <Image
              style={{
                height: moderateScale(15),
                width: moderateScale(15),
                borderRadius: moderateScale(15 / 2),
                marginHorizontal: moderateScale(4),
              }}
              resizeMode="contain"
              source={imagePath.closeButton}
            />
          </TouchableOpacity>
        )}
        {!!showRightImg && !appData?.profile?.preferences?.is_static_dropoff ? (
          <TouchableOpacity onPress={_moveToNextScreen}>
            <Image
              style={{
                height: moderateScale(20),
                width: moderateScale(20),
                borderRadius: moderateScale(10),
              }}
              source={imagePath.blackNav}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {/* <TouchableOpacity
        style={{
          borderWidth: 0.7,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: moderateScale(8),
          width: moderateScale(130),
          paddingVertical: moderateScale(5),
          paddingHorizontal: moderateScale(5),
          borderColor: colors.borderBottomColor,
          marginTop: 5,
          // flex:1
        }}
        onPress={() => openCloseMapAddress(1)} //address map open
      >
        <Image
          source={imagePath.ic_pinIcon}
          style={{
            width: moderateScale(15),
            height: moderateScaleVertical(15),
            resizeMode: 'contain',
            tintColor: themeColors.primary_color,
          }}
        />
        <Text
          style={{
            fontSize: textScale(11),
            fontFamily: fontFamily.regular,
            marginLeft: moderateScale(4),
            // color: colors.redB
          }}>
          {strings.SELECT_VIA_MAP}
        </Text>
      </TouchableOpacity> */}

      <ModalView
        isVisible={isMapSelectLocation}
        onClose={mapClose}
        modalMainContent={modalMainContent}
        mainViewStyle={{ flex: 1 }}
        modalStyle={{
          flex: 1,
          marginVertical: 0,
          marginHorizontal: 0,
        }}
      />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: moderateScale(36),
    backgroundColor: 'gray',
    borderRadius: moderateScale(4),
    paddingHorizontal: moderateScale(8),
  },
  text: {
    flex: 1,
    fontFamily: fontFamily.medium,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    fontSize: textScale(11),
  },
});

export default React.memo(SearchPlaces);
