import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";
import commonStylesFun from "../styles/commonStyles";

const GradientButton = ({
  containerStyle,
  btnStyle = {},
  colorsArray = [themeColors?.primary_color, themeColors?.primary_color],
  // colorsArray = ['#000', '#fff'],
  borderRadius = 13,
  onPress,
  btnText,
  marginTop = 0,
  marginBottom = 0,
  textStyle = {},
  indicator = false,
  endcolor = {},
  startcolor = {},
  // colorsArray = null,
  indicatorColor = "#0000ff",
  disabled = false,
  end = { x: 0.5, y: 1.0 },
  start = { x: 0.0, y: -1.5 },
}) => {
  const { appStyle, themeColors } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  const commonStyles = commonStylesFun({ fontFamily, themeColors });
  // console.log(themeColors, "themeColorsthemeColors");

  return (
    <TouchableOpacity
      disabled={disabled}
      style={{
        ...commonStyles.buttonRect,
        borderWidth: 0,
        marginTop,
        marginBottom,
        ...containerStyle,
      }}
      onPress={onPress}
    >
      <LinearGradient
        start={start}
        end={end}
        // end={endcolor}
        style={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          borderRadius,
          ...btnStyle,
        }}
        colors={
          colorsArray
            ? colorsArray
            : [themeColors?.primary_color, themeColors?.primary_color]
        }
      >
        {!!indicator ? (
          <ActivityIndicator size="small" color={indicatorColor} />
        ) : (
          <Text style={{ ...commonStyles.buttonTextWhite, ...textStyle }}>
            {btnText}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default React.memo(GradientButton);
