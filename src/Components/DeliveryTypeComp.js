import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { moderateScale, textScale } from "../styles/responsiveSize";
import { useSelector } from "react-redux";
import strings from "../constants/lang";
import actions from "../redux/actions";
import deviceInfoModule from "react-native-device-info";
import { showError, showSuccess } from "../utils/helperFunctions";
import { MyDarkTheme } from "../styles/theme";
import colors from "../styles/colors";
import imagePath from "../constants/imagePath";
// import { useDarkMode } from "react-native-dark-mode";

function DeliveryTypeComp({ selectedToggle = () => {} }) {
  const { cartItemCount } = useSelector((state) => state?.cart);
  const {
    appData,
    themeColors,
    appStyle,
    currencies,
    languages,
    themeToggle,
    themeColor,
  } = useSelector((state) => state?.initBoot);
  const { dineInType } = useSelector((state) => state?.home);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const isDarkMode =  themeColor;
  
  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesFunc({ fontFamily, themeColors, isDarkMode });

  const [state, setState] = useState({
    tabs: [],
  });

  const { tabs } = state;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    addAllTabs();
  }, []);

  const addAllTabs = () => {
    if (!!appData?.profile && appData?.profile?.preferences?.vendorMode) {
      updateState({ tabs: appData?.profile?.preferences?.vendorMode });
    }
    return;
  };

  const _onTableItm = (value, indx) => {
    const newTabs = [...tabs];
    newTabs.forEach((item, index) => {
      if (index === indx) {
        selectedToggle(item?.type);
        newTabs[index].isActive = true;
        updateState({
          tabs: [...newTabs],
        });
      } else {
        newTabs[index].isActive = false;
        updateState({
          tabs: [...newTabs],
        });
      }
    });
  };

  const dineInFunction = (item, indx) => {
    Alert.alert("", strings.REMOVE_CART_MSG, [
      {
        text: strings.CANCEL,
        onPress: () => console.log("Cancel Pressed"),
      },
      { text: strings.CLEAR_CART2, onPress: () => clearCart(item, indx) },
    ]);
  };

  const clearCart = (item, indx) => {
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: deviceInfoModule.getUniqueId(),
        }
      )
      .then((res) => {
        showSuccess(res?.message);
        actions.cartItemQty(res);
        _onTableItm(item, indx);
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    showError(error?.message || error?.error);
  };

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          disabled={item?.isActive}
          onPress={() =>
            !(
              cartItemCount?.message == null &&
              cartItemCount?.data?.item_count > 0
            )
              ? _onTableItm(item, index)
              : dineInFunction(item, index)
          }
          key={index}
          style={{
            ...styles.tabItemView,
            marginRight: 8,
            borderBottomColor:
              dineInType == item?.type && isDarkMode
                ? MyDarkTheme.colors.white
                : dineInType == item?.type && !isDarkMode
                ? themeColors.primary_color
                : isDarkMode
                ? colors.blackOpacity0
                : colors.greyColor1,
          }}
        >
          {/* <Image
          source={item.icon}
          style={{
            ...styles.tabItemImg,
            tintColor:
              item.isActive && isDarkMode
                ? MyDarkTheme.colors.white
                : item.isActive && !isDarkMode
                  ? themeColors.primary_color
                  : colors.greyLight,
          }}
          resizeMode="contain"
        /> */}
          <Text
            style={{
              ...styles.tabItemTxt,
              color:
                item.isActive && isDarkMode
                  ? MyDarkTheme.colors.white
                  : item.isActive && !isDarkMode
                  ? themeColors.primary_color
                  : colors.greyLight,
            }}
          >
            {item?.name}
          </Text>
        </TouchableOpacity>
      );
    },
    [tabs, appData]
  );

  const awesomeChildListKeyExtractor = useCallback(
    (item) => `awesome-child-key-${item?.type}`,
    [tabs]
  );

  return (
    <>
      {tabs.length > 1 ? (
        <View
          style={{
            ...styles.tabMainStyle,
            borderBottomColor: isDarkMode
              ? colors.whiteOpacity22
              : colors.borderColorD,
          }}
        >
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={tabs}
            renderItem={renderItem}
            keyExtractor={awesomeChildListKeyExtractor}
            ListFooterComponent={() => (
              <View style={{ marginLeft: moderateScale(16) }} />
            )}
            ListHeaderComponent={() => (
              <View style={{ marginRight: moderateScale(16) }} />
            )}
          />
        </View>
      ) : null}
    </>
  );
}

export function stylesFunc({ fontFamily, themeColors, isDarkMode }) {
  const styles = StyleSheet.create({
    tabMainStyle: {
      borderRadius: moderateScale(10),
      flexDirection: "row",
      marginTop: moderateScale(10),
      borderBottomWidth: 0.8,
    },
    tabItemView: {
      borderBottomWidth: 2,
      height: moderateScale(40),
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    tabItemImg: {
      height: moderateScale(16),
      width: moderateScale(16),
      marginRight: moderateScale(3),
    },
    tabItemTxt: {
      marginLeft: moderateScale(3),
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,

      textTransform: "capitalize",
    },
  });
  return styles;
}

export default React.memo(DeliveryTypeComp);
