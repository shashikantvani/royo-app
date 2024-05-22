import React, { FC, ReactElement, useRef, useState, memo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
  Image,
} from "react-native";
// import { useDarkMode } from "react-native-dark-mode";
import { Icon } from "react-native-elements";

// import { color } from "react-native-reanimated";
import { useSelector } from "react-redux";
import imagePath from "../constants/imagePath";
import colors from "../styles/colors";
import fontFamily from "../styles/fontFamily";
import { height, moderateScale, textScale } from "../styles/responsiveSize";

const Dropdown = ({
  label,
  data,
  onSelect,
  containerStyle,
  dropWidth,
  numColumns,
  labelTextStyle,
  icon,
  iconStyle,
  value,
}) => {
  const DropdownButton = useRef();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(undefined);
  const [dropdownTop, setDropdownTop] = useState(0);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  // console.log(data, "datadata");

  const toggleDropdown = () => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = () => {
    DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h);
    });
    setVisible(true);
  };

  const onItemPress = (item) => {
    // console.log(item, "item>>>");

    onSelect(item);
    setVisible(false);
  };

  const renderItem = ({ item }) => (
    <>
      {/* {console.log(item, "itemitem")} */}
      <TouchableOpacity
        style={[styles.item, {}]}
        onPress={() => onItemPress(item)}
      >
        <Text
          style={{ fontFamily: fontFamily.medium, fontSize: textScale(13) ,color:isDarkMode?colors.white:colors.black}}
        >
          {item.label || item}
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderDropdown = () => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity
          style={[styles.overlay]}
          onPress={() => setVisible(false)}
        >
          <View
            style={[
              styles.dropdown,
              {
                top: dropdownTop,
                left: dropWidth ? "5%" : "37%",
                backgroundColor:isDarkMode?MyDarkTheme.colors.lightDark:colors.white
                // left: moderateScale(40),
              },
            ]}
          >
            <FlatList
              numColumns={numColumns}
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      ref={DropdownButton}
      style={[styles.button, containerStyle,{backgroundColor:isDarkMode?MyDarkTheme.colors.border:"#f1f1f1"}]}
      onPress={toggleDropdown}
      activeOpacity={1}
    >
      {renderDropdown()}
      <Text style={[styles.buttonText, labelTextStyle,{color : isDarkMode ? colors.white:colors.black}]}>
        {value ? value : label}
      </Text>
      <Image source={icon} style={[iconStyle,{tintColor:isDarkMode? colors.white:colors.black}]}  />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    height: height/21,
    width:height/7.5,
    zIndex: 1,
    justifyContent: "space-between",
   paddingHorizontal:moderateScale(5),
   borderRadius: moderateScale(5),
  },

  icon: {
    marginRight: 10,
  },
  dropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    width: "25%",
    height: "15%",
    borderColor: colors.grayOpacity51,
    borderWidth: 1,
  },
  overlay: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  buttonText: {
    fontFamily: fontFamily.regular,
    fontSize: textScale(13),
  },
});

export default memo(Dropdown);
