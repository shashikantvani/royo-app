//import liraries
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import Communications from 'react-native-communications';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import imagePath from '../constants/imagePath';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
// import { useDarkMode } from 'react-native-dark-mode';
import { getImageUrl } from '../utils/helperFunctions';
import { appIds } from '../utils/constants/DynamicAppKeys';
import { getBundleId } from 'react-native-device-info';
import Share from 'react-native-share';

// create a component
const UserDetail = ({
  data,
  type,
  containerStyle,
  imgStyle,
  isDriver = false,
  textStyle,
  _onRateDriver = () => { },
  startChatWithAgent = () => { }
}) => {
  const { toggleTheme, themeColors, theme, appStyle, appData } = useSelector(
    (state) => state.initBoot,
  );
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const fontFamily = appStyle?.fontSizeData;

  const userData = useSelector((state) => state?.auth?.userData);

  const dialCall = (number, type = 'phone') => {
    type === 'phone'
      ? Linking.openURL(`tel:${number}`)
      : Linking.openURL(`sms:${number}`);
  };

  const onWhatsapp = async () => {
    let url = `whatsapp://send?phone= ${userData?.dial_code}${data?.vendor?.phone_no || data?.order?.phone_number
      }`;
    Linking.openURL(url)
      .then((data) => {
        console.log('WhatsApp Opened successfully ' + data); //<---Success
      })
      .catch(() => {
        alert('Make sure WhatsApp installed on your device'); //<---Error
      });
    if (link) {
      Linking.canOpenURL(link)
        .then((supported) => {
          if (!supported) {
            Alert.alert('Please install Whatsapp to send direct message.');
          } else {
            return Linking.openURL(link);
          }
        })
        .catch((err) => console.error('An error occurred', err));
    } else {
      console.log('sendWhatsAppMessage -----> ', 'message link is undefined');
    }
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
        alignItems: 'center',
        ...containerStyle,
        // backgroundColor: 'red'
        // width: '100%'
      }}>
      <Image
        source={{
          uri: !!data?.agent_image
            ? data?.agent_image
            : getImageUrl(
              data?.vendor?.banner?.image_fit,
              data?.vendor?.banner?.image_path,
              '600/600',
            ),
        }}
        style={{
          height: moderateScale(40),
          width: moderateScale(40),
          borderRadius: moderateScale(20),
          backgroundColor: colors.blackOpacity10,
          ...imgStyle,
        }}
      // resizeMode="cover"
      />

      <View
        style={{
          flexDirection: 'row',
          marginLeft: moderateScale(18),
          justifyContent: 'space-between',
          flex: 1,
          alignItems: 'center',
        }}>
        <View>
          <Text
            style={{
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
              fontSize: textScale(13),
              fontFamily: fontFamily.bold,
              ...textStyle
            }}>
            {data?.vendor_name || data?.order?.name}
          </Text>
          <Text
            style={{
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity43,
              fontSize: textScale(10),
              fontFamily: fontFamily.regular,
              ...textStyle
            }}>
            {type}
          </Text>
          {isDriver && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: moderateScaleVertical(10), }}>
              <TouchableOpacity
                onPress={_onRateDriver}
                style={{
                  justifyContent: 'center',
                  backgroundColor: themeColors.primary_color,
                  alignItems: 'center',
                  borderRadius: moderateScale(3),
                  paddingVertical: moderateScaleVertical(2),

                  paddingHorizontal: 2,
                }}>
                <Text style={{ color: colors.white }}>Rate Driver</Text>
              </TouchableOpacity>
           
            </View>
          )}
        </View>

        {getBundleId() == appIds.masa || appIds.hokitch ? null :

          (data?.vendor?.phone_no || data?.order?.phone_number) && (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={onWhatsapp} >
                <Image
                  style={{
                    height: moderateScale(20),
                    width: moderateScale(20),
                    marginRight: moderateScale(20)
                  }}
                  source={imagePath.whatsAppRoyo}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  dialCall(
                    data?.order?.phone_number || data?.vendor?.phone_no,
                    (type = 'phone'),
                  )
                }>
                <Image
                  source={imagePath.call2}
                  style={{
                    height: moderateScale(20),
                    width: moderateScale(20),
                    tintColor: themeColors.primary_color,
                    marginRight: moderateScale(20),
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  dialCall(
                    data?.order?.phone_number || data?.vendor?.phone_no,
                    'text',
                  )
                }>
                <Image
                  source={imagePath.msg}
                  style={{
                    height: moderateScale(20),
                    width: moderateScale(20),
                    tintColor: themeColors.primary_color,
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // paddingHorizontal: moderateScale(4),
    paddingVertical: moderateScaleVertical(8),
    borderBottomRightRadius: moderateScale(16),
    borderBottomLeftRadius: moderateScale(16),
    alignItems: 'center',
  },
});

export default React.memo(UserDetail);
