import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";
import { MyDarkTheme } from "../styles/theme";
import { useSelector } from "react-redux";
// import { useDarkMode } from "react-native-dark-mode";
import colors from "../styles/colors";
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../styles/responsiveSize";
import { text } from "react-native-communications";
import fontFamily from "../styles/fontFamily";
import moment from "moment";
import { currencyNumberFormatter } from "../utils/commonFunction";
import strings from "../constants/lang";
import { getImageUrl } from "../utils/helperFunctions";

const LongTermDetail = ({ data, paramData }) => {
  const { appData, currencies } = useSelector((state) => state?.initBoot);
  // console.log(data, "data>>>");
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  return (
    <View
      style={{
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
        flex: 1,
        paddingHorizontal: moderateScaleVertical(14),
        // marginVertical: moderateScale(10),
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.itemView,
            {
              ...styles.cartItemMainContainer,
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : "#F4F7FE",
            },
          ]}
        >
          <View
            style={{
              flex: 0.3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{
                uri: getImageUrl(
                  data?.vendors[0]?.products[0]?.image.proxy_url,
                  data?.vendors[0]?.products[0]?.image.image_path,
                  "400/400"
                ),
              }}
              style={styles.serviceImage}
            />
          </View>
          <View style={styles.dateStatusView}>
            <Text
              style={[
                styles.defultText,
                {
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                },
              ]}
            >
              {data?.vendors[0].products[0]?.product_name}
            </Text>
            <Text
              style={[
                styles.defultText,
                {
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  paddingTop: moderateScaleVertical(5),
                },
              ]}
            >
              {data?.vendors[0].products[0]?.longTermSchedule?.product?.sku}
            </Text>
            <Text
              style={[
                styles.defultText,
                {
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  paddingTop: moderateScaleVertical(5),
                },
              ]}
            >
              {`${
                currencies?.primary_currency?.symbol
              }${currencyNumberFormatter(
                Number(data?.vendors[0]?.payable_amount),
                appData?.profile?.preferences?.digit_after_decimal
              )}`}
            </Text>
          </View>
          <View
            style={[
              styles.dateStatusView,
              {
                flex: 0.3,
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "flex-end",
              },
            ]}
          >
            <Text
              style={{
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
            >
              {moment(data?.vendors[0]?.created_at).format("d.m.y")}
            </Text>

            <View style={styles.buttonView}>
              <Text
                style={{
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.white,
                  marginVertical: moderateScaleVertical(5),
                }}
              >
                {data?.vendors[0]?.order_status?.current_status?.title}
              </Text>
            </View>
          </View>
        </View>
        <Text
          style={[
            styles.defultText,
            {
              paddingVertical: moderateScaleVertical(10),
              fontFamily: fontFamily?.bold,
              color: isDarkMode ? colors.white : colors.black,
            },
          ]}
        >
          {strings.ORDERSUMMARY}
        </Text>
        <View
          style={{
            borderColor: colors.lightGray,
            borderWidth: 1,
            borderRadius: moderateScale(10),
            paddingHorizontal: moderateScale(10),
            marginBottom: height/7.5,
            paddingBottom:moderateScaleVertical(10)
            
          }}
        >
          <View
            style={{ flexDirection: "row", padding: moderateScaleVertical(10) }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flex: 0.5,
              }}
            >
              <Text
                style={[
                  styles.defultText,
                  {
                    color: isDarkMode
                      ? colors.whiteOpacity4
                      : colors.grayOpacity51,
                  },
                ]}
              >
                {strings.VENDOR_NAME}
              </Text>
              <Text
                style={[
                  styles.defultText,
                  { color: isDarkMode ? colors.white : colors.black },
                ]}
              >
                {data?.vendors[0]?.vendor?.name}
              </Text>
            </View>
            <View
              style={{
                justifyContent: "space-between",
                flex: 0.5,
              }}
            >
              <Text
                style={[
                  styles.defultText,
                  {
                    color: isDarkMode
                      ? colors.whiteOpacity4
                      : colors.grayOpacity51,
                  },
                ]}
              >
                {strings.ORDER_NUMBER}
              </Text>
              <Text
                style={[
                  styles.defultText,
                  { color: isDarkMode ? colors.white : colors.black },
                ]}
              >{`${"#"}${data?.order_number}`}</Text>
            </View>
          </View>
          <View
            style={{ flexDirection: "row", padding: moderateScaleVertical(10) }}
          >
            <View
              style={{
                justifyContent: "space-between",
              }}
            >
              <Text
                style={[
                  styles.defultText,
                  {
                    color: isDarkMode
                      ? colors.whiteOpacity4
                      : colors.grayOpacity51,
                  },
                ]}
              >
                {strings.ADDRESS}
              </Text>
              <Text
                style={[
                  styles.defultText,
                  { color: isDarkMode ? colors.white : colors.black },
                ]}
              >
                {data?.vendors[0]?.vendor?.address}
              </Text>
            </View>
          </View>
          <View
            style={{ flexDirection: "row", padding: moderateScaleVertical(10) }}
          >
            <View
              style={{
                justifyContent: "space-between",
              }}
            >
              <Text
                style={[
                  styles.defultText,
                  {
                    color: isDarkMode
                      ? colors.whiteOpacity4
                      : colors.grayOpacity51,
                  },
                ]}
              >
                {strings.SERVICETIME}{" "}
              </Text>
              <Text
                style={[
                  styles.defultText,
                  {
                    textTransform: "capitalize",
                    color: isDarkMode ? colors.white : colors.black,
                  },
                ]}
              >
                {
                  data?.vendors[0]?.products[0]?.longTermSchedule
                    ?.service_period
                }
              </Text>
            </View>
          </View>
          <View
            style={{ flexDirection: "row", padding: moderateScaleVertical(10) }}
          >
            <View
              style={{
                justifyContent: "space-between",
                flex: 0.5,
              }}
            >
              <Text
                style={[
                  styles.defultText,
                  {
                    color: isDarkMode
                      ? colors.whiteOpacity4
                      : colors.grayOpacity51,
                  },
                ]}
              >
                {strings.PRODUCT_NAME}
              </Text>
              <Text
                style={[
                  styles.defultText,
                  { color: isDarkMode ? colors.white : colors.black },
                ]}
              >
                {
                  data?.vendors[0]?.products[0]?.longTermSchedule?.product
                    ?.primary?.title
                }
              </Text>
            </View>
            <View
              style={{
                justifyContent: "space-between",
                flex: 0.5,
              }}
            >
              <Text
                style={[
                  styles.defultText,
                  {
                    color: isDarkMode
                      ? colors.whiteOpacity4
                      : colors.grayOpacity51,
                  },
                ]}
              >
                {strings.NOOFBOOK}
              </Text>
              <Text
                style={[
                  styles.defultText,
                  { color: isDarkMode ? colors.white : colors.black },
                ]}
              >
                {
                  data?.vendors[0]?.products[0]?.longTermSchedule
                    ?.service_quentity
                }
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.borderLine,
              { borderColor: isDarkMode ? colors.white : colors.black },
            ]}
          />
          <Text
            style={[
              styles.defultText,
              {
                color: isDarkMode ? colors.whiteOpacity4 : colors.grayOpacity51,
                padding: moderateScaleVertical(10),
              },
            ]}
          >
            {`${strings.LONGTERMSERVICE}${" "}${strings.SCHEDULED}`}
          </Text>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",

              paddingHorizontal: moderateScaleVertical(10),
            }}
          >
            <Text
              style={[
                styles.defultText,
                {
                  color: isDarkMode
                    ? colors.whiteOpacity4
                    : colors.grayOpacity51,
                },
              ]}
            >
              {"#"}
            </Text>
            <Text
              style={[
                styles.defultText,
                { color: isDarkMode ? colors.white : colors.black },
              ]}
            >
              {strings.SCHEDULETIME}
            </Text>
            <Text
              style={[
                styles.defultText,
                { color: isDarkMode ? colors.white : colors.black },
              ]}
            >
              {strings.STATUS}
            </Text>
          </View>
          {data?.vendors[0]?.products[0]?.longTermSchedule?.schedule?.map(
            (i, index) => {
              return (
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",

                    paddingHorizontal: moderateScaleVertical(10),
                    paddingVertical: moderateScaleVertical(5),
                  }}
                >
                  <Text
                    style={[
                      styles.defultText,
                      {
                        color: isDarkMode
                          ? colors.whiteOpacity4
                          : colors.grayOpacity51,
                      },
                    ]}
                  >
                    {index + 1}
                  </Text>
                  <Text style={[styles.defultText, { color: "#3E79EF" }]}>
                    {moment(i.schedule_date).format("D MMM yy LT")}
                  </Text>
                  <Text style={[styles.defultText, { color: "#4FC6E1" }]}>
                    {i.status == 0 ? "Pending" : "completed"}
                  </Text>
                </View>
              );
            }
          )}
          <View
            style={[
              styles.borderLine,
              { borderColor: isDarkMode ? colors.white : colors.black },
            ]}
          />
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",

              paddingHorizontal: moderateScaleVertical(10),
            }}
          >
            <Text
              style={[
                styles.defultText,
                { color: isDarkMode ? colors.white : colors.black },
              ]}
            >
              {strings.SUBTOTAL}
            </Text>

            <Text
              style={[
                styles.defultText,
                { color: isDarkMode ? colors.white : colors.black },
              ]}
            >{`${currencies?.primary_currency?.symbol}${currencyNumberFormatter(
              Number(data?.vendors[0]?.subtotal_amount),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",

              paddingHorizontal: moderateScaleVertical(10),
              paddingVertical: moderateScaleVertical(10),
            }}
          >
            <Text
              style={[
                styles.defultText,
                { color: isDarkMode ? colors.white : colors.black },
              ]}
            >
              {strings.DELIVERY_FEE}
            </Text>

            <Text
              style={[
                styles.defultText,
                { color: isDarkMode ? colors.white : colors.black },
              ]}
            >{`${currencies?.primary_currency?.symbol}${currencyNumberFormatter(
              Number(data?.vendors[0]?.delivery_fee),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",

              paddingHorizontal: moderateScaleVertical(10),
            }}
          >
            <Text
              style={[
                styles.defultText,
                { color: isDarkMode ? colors.white : colors.black },
              ]}
            >
              {strings.TOTAL_PAYABLE}
            </Text>

            <Text
              style={[
                styles.defultText,
                { color: isDarkMode ? colors.white : colors.black },
              ]}
            >
              {" "}
              {`${
                currencies?.primary_currency?.symbol
              }${currencyNumberFormatter(
                Number(data?.vendors[0]?.payable_amount),
                appData?.profile?.preferences?.digit_after_decimal
              )}`}
            </Text>
          </View>
        </View>
      </ScrollView>
      {/* show ETA Time */}
    </View>
  );
};
export default React.memo(LongTermDetail);

const styles = StyleSheet.create({
  serviceImage: {
    height: height / 10,
    width: height / 10,
    borderRadius: moderateScale(10),
  },
  itemView: {
    height: height / 6,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: moderateScaleVertical(10),
    borderRadius: moderateScale(10),
  },
  defultText: {
    fontSize: textScale(14),
    fontFamily: fontFamily.medium,
  },
  dateStatusView: {
    flex: 0.4,
    justifyContent: "center",
    height: height / 10,
    paddingRight: moderateScale(10),
  },
  buttonView: {
    backgroundColor: "#24C53E",
    paddingHorizontal: moderateScale(25),

    borderRadius: moderateScale(15),
  },
  borderLine: {
    borderWidth: 0.5,
    borderStyle: "dashed",
    marginHorizontal: moderateScale(10),
    marginVertical: moderateScale(10),
  },
});
