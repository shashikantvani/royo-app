import React, { Fragment } from "react";
import { Text, TouchableOpacity, Platform } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import colors from "../styles/colors";
// import { useDarkMode } from "react-native-dark-mode";
import { MyDarkTheme } from "../styles/theme";
import { getColorCodeWithOpactiyNumber } from "../utils/helperFunctions";
import { moderateScale } from "../styles/responsiveSize";
import { View } from "react-native-animatable";

const CustomBottomTabBar = ({
  state,
  descriptors,
  navigation,
  bottomTabNotify,

  ...props
}) => {
  const insets = useSafeAreaInsets();
  const { themeColors, themeToggle, themeColor, appStyle } = useSelector(
    (state) => state.initBoot
  );

  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const isDarkMode =  themeColor;
  
  return (
    <View style={{backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white}} >
      <LinearGradient
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
      style={{
        flexDirection: "row",
        paddingVertical: 20,
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
      }}
      colors={
        isDarkMode
          ? [MyDarkTheme.colors.lightDark, MyDarkTheme.colors.lightDark]
          : [themeColors.primary_color, themeColors.primary_color]
      }
    >
      {state.routes.map((route, index) => {
        // console.log(route, 'routesssssss');
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Fragment key={route.name}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityStates={isFocused ? ["selected"] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              // onLongPress={onLongPress}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "space-between",
                height: 49,
                // backgroundColor: isDarkMode
                // ? MyDarkTheme.colors.lightDark
                // : colors.white,

                // marginBottom:20
              }}
            >
              {options.tabBarIcon({ focused: isFocused })}
              <Text
                style={{
                  ...props.labelStyle,
                  color: isFocused ? "#B5CD21" : colors.white,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          </Fragment>
        );
      })}
    </LinearGradient>
    </View>
  );
};
export default React.memo(CustomBottomTabBar);
