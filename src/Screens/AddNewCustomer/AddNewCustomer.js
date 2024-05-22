import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  PermissionsAndroid,
} from 'react-native';
// import {useDarkMode} from 'react-native-dark-mode';
import {useSelector} from 'react-redux';
import BorderTextInputWithLable from '../../Components/BorderTextInputWithLable';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import Modal from '../../Components/Modal';
import SearchBar from '../../Components/SearchBar';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import Contacts from 'react-native-contacts';

export default function AddNewCustomer({navigation, route}) {
  const paramData = route?.params;
  const {themeColor, themeToggle, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const [state, setState] = useState({
    isAddCustomerModal: false,
    allContacts: [],
  });
  const {isAddCustomerModal, allContacts} = state;
  const updateState = (data) => setState((state) => ({...state, ...data}));

  const fontFamily = appStyle?.fontSizeData;

  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const isDarkMode =  themeColor;
  
  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    }).then(
      Contacts.getAll()
        .then((contacts) => {
          console.log(contacts, 'allContacts');
          updateState({
            allContacts: contacts,
          });
        })
        .catch((e) => {
          console.log(e, 'errorcontacts');
        }),
    );
  }, []);

  const getAllTransc = ({item, index}) => {
    return (
      <View
        style={{
          height: moderateScaleVertical(75),
          borderBottomWidth: 0.7,
          borderColor: colors.blackOpacity30,
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
            {(item?.displayName || item?.givenName).charAt(0).toUpperCase()}
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginLeft: moderateScale(25),
            flex: 1,
          }}>
          <TouchableOpacity
            style={{
              borderTopWidth: index !== 0 ? 0.7 : 0,
              borderColor: colors.backgroundGreyB,
            }}>
            <Text>
              {item?.displayName || `${item?.givenName} ${item?.familyName}`}
            </Text>

            <Text>{item?.phoneNumbers[0]?.number}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const modalMainContent = () => {
    return (
      <View
        style={{
          backgroundColor: colors.white,
          marginHorizontal: moderateScale(20),
        }}>
        <BorderTextInputWithLable
          placeholder={''}
          label={'Customer Name'}
          textInputStyle={{
            fontFamily: fontFamily.regular,
            color: colors.black,
            backgroundColor: colors.greyColor,
            borderRadius: moderateScale(5),
          }}
          //   value={houseNo}
          multiline={false}
          borderWidth={0}
          marginBottomTxt={0}
          labelStyle={{
            marginBottom: moderateScale(10),
            fontFamily: fontFamily.regular,
          }}
        />
        <BorderTextInputWithLable
          placeholder={''}
          label={'Phone number'}
          textInputStyle={{
            fontFamily: fontFamily.regular,
            color: colors.black,
            backgroundColor: colors.greyColor,
            borderRadius: moderateScale(5),
          }}
          //   value={houseNo}
          multiline={false}
          borderWidth={0}
          marginBottomTxt={0}
          labelStyle={{
            marginBottom: moderateScale(10),
            fontFamily: fontFamily.regular,
          }}
        />
        <GradientButton
          colorsArray={[colors.seaGreen, colors.seaGreen]}
          textStyle={{
            fontFamily: fontFamily.medium,
          }}
          borderRadius={moderateScale(5)}
          btnText={`Add Customer`}
          containerStyle={{
            marginTop: moderateScaleVertical(20),
            marginBottom: moderateScaleVertical(10),
          }}
        />
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
        centerTitle={strings.ADD_NEW_CUSTOMER}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />
      <View style={{flex: 1, marginHorizontal: moderateScale(15)}}>
        <SearchBar
          containerStyle={{
            borderRadius: 15,
            marginTop: moderateScale(10),
            borderWidth: 0.7,
            borderRadius: moderateScale(3),
            borderColor: colors.blackOpacity30,
            backgroundColor: colors.white,
          }}
          // searchValue={searchInput}
          placeholder={strings.SEARCH_FOR_PRODUCT}
          onChangeText={(value) => onChangeText(value)}
          // showRightIcon={showRightIcon}
          rightIconPress={() =>
            updateState({searchInput: '', isLoading: false})
          }
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            updateState({
              isAddCustomerModal: true,
            })
          }
          style={{
            marginVertical: moderateScaleVertical(20),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image source={imagePath.icAdd1} />
          <Text
            style={{
              marginLeft: moderateScale(5),
              color: colors.seaGreen,
              fontSize: textScale(14),
            }}>
            Add New Customer
          </Text>
        </TouchableOpacity>

        <FlatList
          data={allContacts}
          showsVerticalScrollIndicator={false}
          renderItem={getAllTransc}
        />

        {/* <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: colors.grey2,
            borderRadius: moderateScale(5),
          }}>
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc()}
          {getAllTransc()}
        </ScrollView> */}
      </View>
      <Modal
        isVisible={isAddCustomerModal}
        onClose={() =>
          updateState({
            isAddCustomerModal: false,
          })
        }
        modalMainContent={modalMainContent}
        mainViewStyle={{
          minHeight: height / 3,
        }}
        modalStyle={{
          justifyContent: 'flex-end',
          margin: 0,
          marginHorizontal: 0,
          marginVertical: 0,
        }}
      />
    </WrapperContainer>
  );
}

const styles = StyleSheet.create({});
