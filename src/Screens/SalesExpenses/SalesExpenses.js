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
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import GradientButton from '../../Components/GradientButton';
import navigationStrings from '../../navigation/navigationStrings';
import SearchBar from '../../Components/SearchBar';

export default function SalesExpenses({navigation, route}) {
  const {themeColor, themeToggle, appStyle} = useSelector(
    (state) => state?.initBoot,
  );

  const [state, setState] = useState({
    tabItems: [
      {
        id: 1,
        item: 'ALL',
      },
      {
        id: 2,
        item: 'SALES',
      },
      {
        id: 3,
        item: 'EXPENSES',
      },
    ],
    selectedItem: {
      id: 1,
      item: 'ALL',
    },
  });
  const {tabItems, selectedItem} = state;
  const updateState = (data) => setState((state) => ({...state, ...data}));

  const fontFamily = appStyle?.fontSizeData;

  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const isDarkMode =  themeColor;
  
  const getAllTransc = () => {
    return (
      <TouchableOpacity
        style={{
          height: moderateScaleVertical(75),

          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          borderBottomWidth: 0.7,
          borderColor: colors.blackOpacity20,
          marginHorizontal: moderateScale(15),
        }}>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            flex: 1,
          }}>
          <View>
            <Text>Electricity Bill</Text>
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
              Expense
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getTopTabs = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: moderateScale(15),
          justifyContent: 'space-between',
          marginTop: moderateScale(10),
        }}>
        {tabItems.map((item) => {
          return (
            <TouchableOpacity
              onPress={() =>
                updateState({
                  selectedItem: item,
                })
              }
              style={{
                justifyContent: 'center',
                flex: 0.3,
                alignItems: 'center',
                borderBottomWidth: selectedItem?.id == item.id ? 4 : 0,
                borderBottomColor:
                  selectedItem?.id == item.id
                    ? colors.seaGreen
                    : colors.transparent,
                paddingBottom: moderateScale(7),
              }}>
              <Text>{item.item}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
        // colors.white
      }
      statusBarColor={colors.backgroundGrey}
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
        centerTitle={strings.SALES_EXPENSES}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.backgroundGrey}
        }
      />
      <View style={{flex: 1}}>
        <View style={styles.topView}>
          <View style={{}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={imagePath.icUp1} />
              <Text style={{color: colors.greenB, fontSize: textScale(16)}}>
                {' '}
                ₹ 100.00
              </Text>
            </View>
            <Text style={styles.mainViewTxt}>PNL</Text>
          </View>
          <View
            style={{
              borderWidth: 0.7,
              height: '80%',
              borderColor: colors.blackOpacity20,
            }}
          />
          <View style={{}}>
            <Text style={{color: colors.greenB, fontSize: textScale(16)}}>
              ₹ 70.00
            </Text>
            <Text style={styles.mainViewTxt}>Sales</Text>
          </View>
          <View
            style={{
              borderWidth: 0.6,
              height: '80%',
              borderColor: colors.blackOpacity20,
            }}
          />
          <View style={{}}>
            <Text style={{color: colors.redE, fontSize: textScale(16)}}>
              ₹ 90.00
            </Text>
            <Text style={styles.mainViewTxt}>Expenses</Text>
          </View>
        </View>

        <View style={{height: 20}} />
        {getTopTabs()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc()}
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
            colorsArray={[colors.seaGreen, colors.seaGreen]}
            textStyle={{
              fontFamily: fontFamily.medium,
            }}
            borderRadius={5}
            marginTop={moderateScaleVertical(10)}
            btnText={`SALES`}
            containerStyle={{
              width: '45%',
              alignSelf: 'flex-end',
              marginBottom: moderateScale(10),
            }}
          />
          <GradientButton
            colorsArray={[colors.seaGreen, colors.seaGreen]}
            textStyle={{
              fontFamily: fontFamily.medium,
            }}
            borderRadius={5}
            marginTop={moderateScaleVertical(10)}
            btnText={`EXPENSES`}
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
  topView: {
    height: moderateScaleVertical(80),
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: colors.backgroundGrey,
    marginTop: moderateScaleVertical(10),
    borderWidth: 0.7,
    borderColor: colors.blackOpacity20,
    borderRadius: moderateScale(5),
    marginHorizontal: moderateScale(15),
  },
  mainViewTxt: {
    fontSize: textScale(13),
    opacity: 0.7,
    textAlign: 'center',
    marginTop: moderateScale(5),
  },
});
