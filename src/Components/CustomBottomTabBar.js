import React, {Fragment} from 'react';
import {Text, TouchableOpacity, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
// import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../styles/theme';
import {getColorCodeWithOpactiyNumber} from '../utils/helperFunctions';

const CustomBottomTabBar = ({
  state,
  descriptors,
  navigation,
  bottomTabNotify,

  ...props
}) => {
  const insets = useSafeAreaInsets();
  const {themeColors, themeToggle, themeColor, appStyle} = useSelector(
    (state) => state.initBoot,
  );

  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const isDarkMode =  themeColor;
  
  return (
    <LinearGradient
      start={{x: 0, y: 1}}
      end={{x: 1, y: 1}}
      style={{
        height: Platform.OS === 'ios' ? 60 + insets.bottom : 70 + insets.bottom,
        flexDirection: 'row',
        paddingBottom: insets.bottom,
        // borderTopLeftRadius: 10,
        // borderTopRightRadius: 10,
        paddingTop: 10,
        // style={{marginBottom:Platform.OS === 'ios'?30:10}}
      }}
      colors={
        isDarkMode
          ? [MyDarkTheme.colors.lightDark, MyDarkTheme.colors.lightDark]
          : [themeColors.primary_color, themeColors.primary_color]
      }
      >
      {state.routes.map((route, index) => {
        // console.log(route, 'routesssssss');
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
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
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              // onLongPress={onLongPress}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 49,

                // marginBottom:20
              }}>
              {options.tabBarIcon({focused: isFocused})}
              <Text
                style={{
                  ...props.labelStyle,
                  color: isFocused
                    ? themeColors.secondary_color
                    : getColorCodeWithOpactiyNumber(
                        themeColors?.secondary_color,
                        70,
                      ),
                  opacity: isFocused ? 1 : 0.6,
                }}>
                {label}
              </Text>
            </TouchableOpacity>
          </Fragment>
        );
      })}
    </LinearGradient>
  );
};
export default React.memo(CustomBottomTabBar);
