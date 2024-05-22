import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import commonStylesFun from '../../styles/commonStyles';

export default ({fontFamily}) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    header: {
      color: colors.black,
      fontSize: moderateScale(24),
      fontFamily: fontFamily.bold,
      textAlign: 'center',
    },
    header2: {
      color: colors.black,
      fontSize: moderateScale(24),
      fontFamily: fontFamily.bold,
    },
    txtSmall: {
      ...commonStyles.mediumFont14,
      lineHeight: 24,
      textAlign: 'center',
      fontFamily: fontFamily.medium,
      marginTop: moderateScaleVertical(15),
    },

    bottomContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: moderateScaleVertical(30),
    },
    bottomContainer2: {
      position: 'absolute',
      bottom: moderateScale(80),
      alignItems: 'center',
      width: '100%',
    },
    guestBtn: {
      marginTop: moderateScaleVertical(20),
      backgroundColor: colors.lightSky,
      borderWidth: 0,
    },
    orText: {
      ...commonStyles.mediumFont14,
      lineHeight: 24,
      textAlign: 'center',
      fontFamily: fontFamily.medium,
      opacity: 0.6,
      marginTop: 0,
      marginHorizontal: moderateScale(16),
    },
    viewStyleForUploadImage: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      // justifyContent: 'space-between',
    },
    imageUpload: {
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: moderateScaleVertical(10),
    },
    imageStyle2: {
      height: 100,
      width: 100,
      borderRadius: moderateScale(4),
    },
    label3: {
      marginBottom: moderateScaleVertical(10),
      textAlign: 'center',
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      color: colors.greyLight,
    },
    uploadStyle: {
      color: colors.blue,
      fontFamily: fontFamily.medium,
    },
  });
  return styles;
};
