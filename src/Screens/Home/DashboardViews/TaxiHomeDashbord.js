import React, {useEffect, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useSelector} from 'react-redux';
import BannerHome from '../../../Components/BannerHome';
import BrickList from '../../../Components/BrickList';
import ImgCardForBrickList from '../../../Components/ImgCardForBrickList';
import CardLoader from '../../../Components/Loaders/CardLoader';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import {appIds} from '../../../utils/constants/DynamicAppKeys';
import DeviceInfo from 'react-native-device-info';
import {
  height,
  itemWidth,
  moderateScale,
  moderateScaleVertical,
  sliderWidth,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError,
  showSuccess,
} from '../../../utils/helperFunctions';
import stylesFunc from '../styles';
import ToggleTabBar from './ToggleTabBar';
import {mapStyleGrey} from '../../../utils/constants/MapStyle';

import navigationStrings from '../../../navigation/navigationStrings';
import {useNavigation} from '@react-navigation/native';

import HomeCategoryCard2 from '../../../Components/HomeCategoryCard2';
import actions from '../../../redux/actions';
import BottomViewModal from '../../../Components/BottomViewModal';
//import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';
import TaxiHomeCategoryCard from '../../../Components/TaxiHomeCategoryCard';
import TaxiBannerHome from '../../../Components/TaxiBannerHome';
import SelectTimeModalView from '../../CourierService/ChooseCarTypeAndTime/SelectTimeModalView';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import GradientButton from '../../../Components/GradientButton';
import AddressModal3 from '../../../Components/AddressModal3';
import AddressModal from '../../../Components/AddressModal';
import Loader from '../../../Components/Loader';
import staticStrings from '../../../constants/staticStrings';
import Modal from 'react-native-modal';
import Geocoder from 'react-native-geocoding';
import {locationPermission} from '../../../utils/permissions';
import {
  getAddressFromLatLong,
  getCurrentLocationFromApi,
} from '../../../utils/googlePlaceApi';

export default function TaxiHomeDashbord({
  handleRefresh = () => {},
  bannerPress = () => {},
  //   appMainData = {},
  isLoading = false,
  isRefreshing = false,
  onPressCategory = () => {},
  selectedToggle,
  toggleData,
  isDineInSelected = false,
  location = {},
  onClose,
  onPressSubscribe,
  isSubscription
}) {
  const mapRef = React.createRef();
  const navigation = useNavigation();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const userData = useSelector((state) => state?.auth?.userData);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    newCategoryData: [],
    date: new Date(),
    region: {
      latitude: parseFloat(location?.latitude),
      longitude: parseFloat(location?.longitude),
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    coordinate: {
      latitude: parseFloat(location?.latitude),
      longitude: parseFloat(location?.longitude),
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    allSavedAddress: [],
    isVisible: false,
    availAbleTimes: [
      {
        id: 1,
        label: 'in 20 min.',
      },
      {
        id: 2,
        label: 'in 50 min.',
      },
      {
        id: 3,
        label: 'in 80 min.',
      },
    ],
    isVisible1: false,
    updateData: {},
    indicator: false,
    type: 'addAddress',
    selectedAvailableTimeOption: null,
    selectedTime: null,
    selectedDateAndTime: null,
    slectedDate: null,
    newAddressAdded: null,
    isLoadingModal: false,
    fullMapShow: false,
    isVisibleAddressModal: false,
    pickupAddress: {},
  });
  console.log(location, 'loaction');
  console.log(region, 'region');
  const appMainData = useSelector((state) => state?.home?.appMainData);
  
  let findCabCategory = appMainData?.categories?.find(
    (x) => x?.redirect_to == staticStrings.PICKUPANDDELIEVRY,
  );

  console.log(appMainData?.categories, 'findCabCategory');
  const {appData, themeColors, appStyle, languages} = useSelector(
    (state) => state?.initBoot,
  );
  console.log(languages, 'languages>new');
  const fontFamily = appStyle?.fontSizeData;
  const {bannerRef} = useRef();
  const {
    slider1ActiveSlide,
    newCategoryData,
    homeCategoryData,
    region,
    coordinate,
    allSavedAddress,
    isVisible,
    date,
    availAbleTimes,
    selectedAvailableTimeOption,
    selectedTime,
    selectedDateAndTime,
    slectedDate,
    isVisible1,
    updateData,
    indicator,
    type,
    del,
    isLoadingModal,
    fullMapShow,
    selectViaMap
  } = state;
  const styles = stylesFunc({themeColors, fontFamily});

  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  useFocusEffect(
    React.useCallback(() => {
      updateState({
        selectedTime: null,
        selectedDateAndTime: null,
        slectedDate: null,
      });
      if (!!userData?.auth_token) {
        getAllAddress();
      }
    }, []),
  );

  useEffect(() => {
    if (!!userData?.auth_token) {
      getAllAddress();
    }
  }, [del]);

  const getAllAddress = () => {
    actions
      .getAddress(
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
        // actions.saveAllUserAddress(res.data);
        console.log('res?>>>>>>>>>>>>>>', res);
        updateState({
          allSavedAddress: res.data,
          isLoading: false,
          indicator: false,
        });
      })
      .catch((error) => {
        updateState({isLoading: false});
        showError(error?.message || error?.error);
      });
  };

  const continueWithNaxtScreen = (item) => {
    onPressCategory(item);
  };

  const _modalClose = () => {
    updateState({
      isVisible: false,
    });
  };
  // console.log(slectedDate, selectedTime, 'jskjsnsdkjgndsgkdsgj');
  const _onDateChange = (date) => {
    // alert(213);
    console.log(date, 'date');
    let time = moment(date).format('HH:mm');
    let dateSelectd = moment(date).format('YYYY-MM-DD');

    console.log(time, 'time');
    console.log(dateSelectd, 'dateSelectd');
    updateState({
      selectedDateAndTime: `${dateSelectd} ${time}`,
      slectedDate: dateSelectd,
      selectedTime: moment(date).format('HH:mm'),
      date: date,
    });
  };
  const onDateChange = (value) => {
    console.log(value, 'value');
    _onDateChange(value);
  };

  const addUpdateLocation = (childData) => {
    //setModalVisible(false);
    console.log(childData, 'childData>childData');
    updateState({isLoading: true});

    actions
      .addAddress(childData, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        console.log(res, 'res>res>res');
        updateState({del: del ? false : true});
        showSuccess(res.message);
       setModalVisible(false)
      })
      .catch((error) => {
        updateState({isLoading: false});
        showError(error?.message || error?.error);
      });
  };


  const openCloseMapAddress = (type) => {
    updateState({ selectViaMap: type == 1 ? true : false });
  };


  const setModalVisible = (visible, type, id, data) => {
    updateState({ selectViaMap: false });
    if (!!userData?.auth_token) {
      updateState({
        updateData: data,
        isVisible1: visible,
        type: type,
        selectedId: id,
      });
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  const _renderItem = ({item}) => {
    return (
      <TaxiHomeCategoryCard
        data={item}
        onPress={() => continueWithNaxtScreen(item)}
      />
    );
  };

  const _ModalMainView = () => {
    return (
      <View style={styles.modalContainer}>
        <View>
          <View
            style={{
              alignItems: 'center',
              height: height / 3.5,
            }}>
            <DatePicker
              date={date}
              locale={
                languages?.primary_language?.sort_code
                  ? languages?.primary_language?.sort_code
                  : 'en'
              }
              mode="datetime"
              textColor={isDarkMode ? colors.black : colors.blackB}
              minimumDate={new Date()}
              style={{
                width: width - 20,
                height: height / 4.4,
              }}
              // onDateChange={setDate}
              onDateChange={(value) => onDateChange(value)}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 16,
                marginBottom: 24,
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  height: 40,
                  backgroundColor: themeColors.primary_color,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: moderateScale(10),
                }}
                onPress={_modalClose}>
                <Text
                  style={{color: colors.white, fontFamily: fontFamily.regular}}>
                  {strings.CANCEL}
                </Text>
              </TouchableOpacity>

              <View style={{marginHorizontal: 4}} />
              <TouchableOpacity
                style={{
                  flex: 1,
                  height: 40,
                  backgroundColor: themeColors.primary_color,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: moderateScale(10),
                }}
                onPress={() => {
                  updateState({
                    isVisible: false,
                    isLoadingModal: true,
                  });

                  setTimeout(() => {
                    updateState({isLoadingModal: false});
                    actions.saveSchduleTime(
                      slectedDate || selectedTime ? '' : 'now',
                    );
                    navigation.navigate(navigationStrings.ADDADDRESS, {
                      cat: appMainData?.categories[0],
                      datetime: {slectedDate, selectedTime},
                    });
                  }, 2000);
                }}>
                <Text
                  style={{color: colors.white, fontFamily: fontFamily.regular}}>
                  {strings.SET}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  console.log('location location', location);
  const moveToScreen = (details) => {
    updateState({fullMapShow: false});
    if (!!userData?.auth_token) {
      let prefillAdress = null;
      if (!!details) {
        prefillAdress = {
          longitude: Number(details?.longitude),
          latitude: Number(details?.latitude),
          address: details?.address,
          task_type_id: 1,
          pre_address: details?.address,
        };
      }
      actions.saveSchduleTime('now');
      navigation.navigate(navigationStrings.ADDADDRESS, {
        cat: appMainData?.categories[0],
        datetime: {slectedDate, selectedTime},
        prefillAdress: !!prefillAdress ? prefillAdress : null,
      });
    } else {
      actions.setAppSessionData('on_login');
    }
  };

  const addressView = (image) => {
    return (
      allSavedAddress &&
      allSavedAddress.map((itm, inx) => {
        return (
          <ScrollView
            keyboardShouldPersistTaps={'handled'}
            style={{width: width}}>
            <TouchableOpacity
              key={inx}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                justifyContent: 'space-between',
                marginLeft: moderateScale(20),
                width: width - 60,
              }}
              onPress={() => moveToScreen(itm)}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  marginRight: 20,
                  width: width - 70,
                }}>
                <View>
                  <Image source={image} />
                </View>
                <View
                  style={{
                    marginHorizontal: moderateScale(10),
                  }}>
                  <Text
                    numberOfLines={2}
                    style={{
                      ...styles.addressTitle,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}>
                    {itm?.street}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      ...styles.address,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}>
                    {itm?.address}
                  </Text>
                </View>
              </View>
              <Image
                style={{
                  tintColor: colors.textGreyLight,
                  marginRight: moderateScale(20),
                }}
                source={imagePath.goRight}
              />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: getColorCodeWithOpactiyNumber(
                  colors.textGreyLight,
                  40,
                ),
                width: width / 1.2,
                marginLeft: moderateScale(60),
                height: 0.5,
              }}></View>
          </ScrollView>
        );
      })
    );
  };
  const savedPlaceView1 = (image) => {
    return (
      <ScrollView keyboardShouldPersistTaps={'handled'} style={{width: width}}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            justifyContent: 'space-between',
            marginLeft: moderateScale(20),
            width: width - 20,
          }}
          onPress={() => {
            actions.saveSchduleTime('now');
            userData?.auth_token
              ? navigation.navigate(navigationStrings.ADDADDRESS, {
                  data: appMainData?.categories[0],
                })
              : actions.setAppSessionData('on_login');
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <View>
              <Image source={image} />
            </View>
            <View style={{marginHorizontal: moderateScale(10)}}>
              <Text
                numberOfLines={2}
                style={{
                  ...styles.address,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {strings.CHOOSESAVEDPLACE}
              </Text>
            </View>
          </View>
          <Image
            style={{
              tintColor: colors.textGreyLight,
              marginRight: moderateScale(20),
            }}
            source={imagePath.goRight}
          />
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: getColorCodeWithOpactiyNumber(
              colors.textGreyLight,
              40,
            ),
            width: width / 1.2,
            marginLeft: moderateScale(60),
            height: 0.5,
          }}></View>
      </ScrollView>
    );
  };

  console.log(slectedDate, 'selectedTimeselectedTime');

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}>
      <ScrollView
        // bounces={false}
        refreshing={isRefreshing}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        style={{flex: 1, zIndex: 1000}}>
        <>
          <TaxiBannerHome
            bannerRef={bannerRef}
            slider1ActiveSlide={slider1ActiveSlide}
            bannerData={[...appData?.mobile_banners]}
            sliderWidth={sliderWidth + 20}
            itemWidth={itemWidth + 20}
            onSnapToItem={(index) => updateState({slider1ActiveSlide: index})}
            // onPress={(item) => bannerPress(item)}
          />
          <View style={{height: moderateScaleVertical(5)}} />
        </>
        <Loader isLoading={isLoadingModal} />

        <FlatList
          horizontal
          data={appMainData?.categories}
          style={{
            marginTop: moderateScaleVertical(10),
            // marginHorizontal: moderateScale(10),
          }}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={_renderItem}
          ItemSeparatorComponent={() => (
            <View style={{marginRight: moderateScale(12)}} />
          )}
          ListHeaderComponent={() => (
            <View style={{marginLeft: moderateScale(12)}} />
          )}
          ListFooterComponent={() => (
            <View style={{marginRight: moderateScale(12)}} />
          )}
        />

        {/* findCabCategory */}
        {true && (
          <>
            <View
              style={{
                marginHorizontal: moderateScale(10),
                height: moderateScaleVertical(50),
                backgroundColor: getColorCodeWithOpactiyNumber(
                  colors.taxiCategoryGrayColor,
                  30,
                ),
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: moderateScale(10),
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={{width: width - width / 3}}
                onPress={() => {
                  actions.saveSchduleTime('now');
                  userData?.auth_token
                    ? navigation.navigate(navigationStrings.ADDADDRESS, {
                        cat: appMainData?.categories[0],
                        datetime: {slectedDate, selectedTime},
                      })
                    : actions.setAppSessionData('on_login');
                }}>
                <Text
                  style={{
                    fontSize: textScale(14),
                    fontFamily: fontFamily.Medium,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
                  {strings.WHERETO}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  userData?.auth_token
                    ? updateState({
                        isVisible: true,
                      })
                    : actions.setAppSessionData('on_login');
                }}>
                <View
                  style={{
                    backgroundColor: colors.white,
                    width: moderateScale(80),
                    height: moderateScaleVertical(26),
                    borderRadius: 20,
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: moderateScale(5),
                  }}>
                  <Image source={imagePath.clock} />
                  <Text>{strings.NOW}</Text>
                  <Image
                    style={{
                      transform: [{rotate: '90deg'}],
                      height: moderateScaleVertical(8),
                      width: moderateScale(8),
                    }}
                    source={imagePath.goRight}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {allSavedAddress.length > 0 && userData?.auth_token ? (
              <></>
            ) : (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  justifyContent: 'space-between',
                  marginLeft: moderateScale(20),
                  width: width - 20,
                  marginTop: moderateScaleVertical(10),
                }}
                onPress={() => {
                  userData?.auth_token
                    ? setModalVisible(true, 'addAddress')
                    : actions.setAppSessionData('on_login');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                  }}>
                  <View>
                    <Image source={imagePath.plushRoundedBackground} />
                  </View>
                  <View style={{marginHorizontal: moderateScale(10)}}>
                    <Text
                      numberOfLines={2}
                      style={{
                        ...styles.addressTitle,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                      }}>
                      {strings.ADD_NEW_ADDRESS}
                    </Text>
                  </View>
                </View>
                <Image
                  style={{
                    tintColor: colors.textGreyLight,
                    marginRight: moderateScale(20),
                  }}
                  source={imagePath.goRight}
                />
              </TouchableOpacity>
            )}
            <View
              style={{
                alignItems: 'center',
                marginHorizontal: moderateScale(20),
                marginBottom: moderateScaleVertical(20),
              }}>
              {addressView(imagePath.locationRoundedBackground)}
              {savedPlaceView1(imagePath.starRoundedBackground)}
            </View>

            <View style={{marginHorizontal: moderateScale(20)}}>
              <Text
                style={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.medium,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {strings.AROUNDYOU}
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  height: height / 4,
                  width: width - 45,
                  borderRadius: 12,
                  marginTop: moderateScaleVertical(20),
                  alignItems: 'center',
                }}
                onPress={() => updateState({fullMapShow: true})}>
                {/* <View
                  pointerEvents="none"
                  style={{
                    height: height / 4,
                    width: width - 45,
                    borderRadius: 12,
                    marginTop: moderateScaleVertical(20),
                    alignItems: 'center',
                  }}> */}
                {!!location && (
                  <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    // customMapStyle={mapStyleGrey}
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      borderRadius: 12,
                    }}
                    // provider={MapView.PROVIDER_GOOGLE}
                    region={{
                      latitude: !!location?.latitude
                        ? parseFloat(location?.latitude)
                        : 30.7333,
                      longitude: !!location?.longitude
                        ? parseFloat(location?.longitude)
                        : 76.7794,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                    }}
                    // initialRegion={region}
                    showsUserLocation={true}
                    //showsMyLocationButton={true}
                    // pointerEvents={'none'}
                  >
                    <Marker
                      coordinate={{
                        latitude: !!location?.latitude
                          ? parseFloat(location?.latitude)
                          : 30.7333,
                        longitude: !!location?.latitude
                          ? parseFloat(location?.longitude)
                          : 76.7794,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                      }}
                    />
                  </MapView>
                )}
                {/* </View> */}
              </TouchableOpacity>
            </View>
          </>
        )}

        {isVisible && (
          <BottomViewModal
            isDatetimePicker={true}
            show={isVisible}
            mainContainView={_ModalMainView}
            closeModal={_modalClose}
          />
        )}

        <View style={{height: moderateScaleVertical(95)}} />
      </ScrollView>
      <AddressModal3
        navigation={navigation}
        updateData={updateData}
        isVisible={isVisible1}
        indicator={indicator}
        onClose={() => setModalVisible(!isVisible1)}
        type={type}
        passLocation={(data) => addUpdateLocation(data)}
        selectViaMap={selectViaMap}
        openCloseMapAddress={openCloseMapAddress}
        constCurrLoc={location}
      />

      <Modal
        isVisible={fullMapShow}
        style={{
          margin: 0,
        }}
        animationInTiming={600}>
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              // customMapStyle={mapStyleGrey}
              customMapStyle={
                appIds.cabway == DeviceInfo.getBundleId() ? null : mapStyleGrey
              }
              style={{...StyleSheet.absoluteFillObject}}
              region={{
                latitude: !!location?.latitude
                  ? parseFloat(location?.latitude)
                  : 30.7333,
                longitude: !!location?.longitude
                  ? parseFloat(location?.longitude)
                  : 76.7794,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
              // initialRegion={region}
              showsUserLocation={true}
              // onRegionChangeComplete={_onRegionChange}
              // showsMyLocationButton={true}
              // pointerEvents={'none'}
            />
            <SafeAreaView>
              <TouchableOpacity
                onPress={() => updateState({fullMapShow: false})}
                style={{
                  marginTop: moderateScaleVertical(24),
                  height: moderateScale(40),
                  width: moderateScale(40),
                  borderRadius: moderateScale(16),
                  backgroundColor: colors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: moderateScale(24),
                }}>
                <Image
                  style={{
                    tintColor: colors.black,
                  }}
                  source={imagePath.backArrowCourier}
                />
              </TouchableOpacity>
            </SafeAreaView>
          </View>
          <View
            style={{
              height: moderateScale(100),
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : colors.white,
            }}>
            <SafeAreaView>
              <TouchableOpacity
                onPress={() => moveToScreen()}
                style={{
                  height: moderateScale(48),
                  backgroundColor: isDarkMode
                    ? colors.whiteOpacity15
                    : colors.greyNew,
                  justifyContent: 'center',
                  paddingHorizontal: moderateScale(16),
                  margin: moderateScale(16),
                }}>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(16),
                    textAlign: 'left',
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
                  {strings.WHERETO}
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
      {!!userData?.auth_token &&
        !!appData?.profile?.preferences?.show_subscription_plan_popup && (
          <SubscriptionModal
            isVisible={isSubscription}
            onClose={onClose}
            onPressSubscribe={onPressSubscribe}
          />
        )}
    </View>
  );
}
