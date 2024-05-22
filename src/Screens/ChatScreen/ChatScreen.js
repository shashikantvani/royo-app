import React, { useState, useCallback, useEffect, useRef } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image, Platform, SafeAreaView, ImageBackground } from 'react-native'
import { GiftedChat, Send, InputToolbar } from 'react-native-gifted-chat';
import socketServices from '../../utils/scoketService';
import { useSelector } from 'react-redux';
// import { useDarkMode } from 'react-native-dark-mode';
import imagePath from '../../constants/imagePath';
import Header from '../../Components/Header';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import colors from '../../styles/colors';
import { MyDarkTheme } from '../../styles/theme';
import WrapperContainer from '../../Components/WrapperContainer';
import actions from '../../redux/actions';
import { getImageUrl } from '../../utils/helperFunctions';
import { height, moderateScale, moderateScaleVertical, textScale, width } from '../../styles/responsiveSize';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import _ from 'lodash';
import CircularImages from '../../Components/CircularImages';
import Modal from 'react-native-modal'
import { ScrollView } from 'react-native-gesture-handler';
import { cameraHandler, getSubDomain } from '../../utils/commonFunction';
import LottieView from 'lottie-react-native';
import { voiceListen } from '../../Components/Loaders/AnimatedLoaderFiles';
import Voice from '@react-native-voice/voice';
import { androidCameraPermission } from '../../utils/permissions';


export default function ChatScreen({ route, navigation }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const paramData = route.params.data;
  const { appData, themeColors, currencies, languages, appStyle } = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const userData = useSelector((state) => state?.auth?.userData);
  const isChatRefresh = useSelector((state) => state?.chatRefresh.isChatRefresh);
  const styles = stylesFun({ fontFamily, isDarkMode });



  const [messages, setMessages] = useState([])
  const [state, setState] = useState({
    showParticipant: false,
    isLoading: false,
    roomUsers: [],
    isVoiceRecord: false,
  })
  const { isLoading, roomUsers, isVoiceRecord, showParticipant } = state

  const updateState = (data) => setState((state) => ({ ...state, ...data }))

  const isFocused = useIsFocused();

  console.log("userDatauserData",userData)

  useFocusEffect(
    useCallback(() => {
      socketServices.on("new-message", (data) => {
 
        if (paramData?.room_id == data?.message?.roomData?.room_id) {
          isFocused ? setMessages(previousMessages => GiftedChat.append(previousMessages, data.message.chatData)) : null
          isFocused ? fetchAllRoomUser() : null
        }
      });
      return () => {
        socketServices.removeListener("new-message");
        socketServices.removeListener('save-message');
      };
    }, [navigation])
  );

  useFocusEffect(
    useCallback(() => {
      Voice.onSpeechStart = onSpeechStartHandler;
      Voice.onSpeechEnd = onSpeechEndHandler;
      Voice.onSpeechResults = onSpeechResultsHandler;
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, []),
  );


  useEffect(() => {
    if (isFocused) {
      updateState({ isLoading: true })
      fetchAllRoomUser()
      fetchAllMessages()
    }
  }, [])

  const fetchAllMessages = useCallback(async () => {
    try {
      const apiData = `/${paramData?._id}`
      const res = await actions.getAllMessages(apiData, {})
      console.log('fetchAllMessages res', res)
      updateState({ isLoading: false })
      if (!!res && isFocused) {
        let filterArry = res.map((val, i) => {
          return { ...val, user: {} }
        })
        setMessages(filterArry.reverse())
      }
    } catch (error) {
      console.log('error raised in fetchAllMessages api', error)
      updateState({ isLoading: false })
    }
  }, [])




  const fetchAllRoomUser = useCallback(async () => {
    try {
      const apiData = `/${paramData?._id}`
      const res = await actions.getAllRoomUser(apiData, {}, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      console.log('fetchAllRoomUser res', res)
      if (!!res?.userData && isFocused) {
        updateState({ roomUsers: res?.userData })
      }
    } catch (error) {
      console.log('error raised in fetchAllRoomUser api', error)
    }
  }, [])

  console.log("paramDataparamDataparamData",paramData)

  const onSend = useCallback(async (messages = []) => {
    if (String(messages[0].text).trim().length < 1) {
      return;
    }
    let phoneNumber = !!userData.phone_number ? `+${userData?.dial_code} ${userData.phone_number}`: null
    try {
      const apiData = {
        room_id: paramData?._id,
        message: messages[0].text,
        user_type: !!userData?.is_superadmin ? 'admin':  'user',
        to_message: !!userData?.is_superadmin ? 'to_user_vendor': 'to_vendor',
        from_message: !!userData?.is_superadmin? 'from_admin': 'from_user',
        user_id: userData?.id,
        email: userData.email,
        username: userData?.name,
        phone_num: phoneNumber,
        display_image: getImageUrl(
          userData?.source?.proxy_url,
          userData?.source?.image_path,
          '200/200',
        ),
        sub_domain: '192.168.101.88', //this is static value 
        //'room_name' =>$data->name,
        chat_type: 'vendor_to_user',
      }
      console.log("apiDataapiData",apiData)
      const res = await actions.sendMessage(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      console.log('on send message res', res)
      socketServices.emit('save-message', res);
      // const message = {
      //   _id: userData.id,
      //   auth_user_id: userData.id,
      //   message: messages[0].text,
      //   createdAt: new Date(),
      //   username: userData?.name,
      //   display_image: getImageUrl(
      //     userData?.source?.proxy_url,
      //     userData?.source?.image_path,
      //     '200/200',
      //   )
      // };
      await sendToUserNotification(paramData?._id, messages[0].text)
      // setMessages(previousMessages => GiftedChat.append(previousMessages, message))
    } catch (error) {
      console.log('error raised in fetchAllMessages api', error)
    }
  }, [])

  const sendToUserNotification = async (id, text) => {
    let apiData = {
      user_ids: roomUsers,
      roomId: id, 
      roomIdText: paramData?.room_id,
      text_message: text,
      chat_type: 'vendor_to_user',
   
    }
    console.log("sending api data",apiData)
    try {
      const res = await actions.sendNotification(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      console.log("res sendNotification", res)
    } catch (error) {
      console.log('error raised in sendToUserNotification api', error)
    }
  }
  const showRoomUser = useCallback((props) => {
    if (_.isEmpty(roomUsers)) {
      return null
    }
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => updateState({ showParticipant: true })}
      >
        <CircularImages size={28} isDarkMode={isDarkMode} fontFamily={fontFamily} data={roomUsers} />
      </TouchableOpacity>
    )
  }, [roomUsers])

  const renderMessage = useCallback((props) => {
    const { currentMessage } = props
    let isRight = currentMessage?.auth_user_id == userData?.id

    if (isRight) {
      return (
        <View key={String(currentMessage._id)} style={{
          ...styles.chatStyle,
          alignSelf: 'flex-end',
          backgroundColor: isDarkMode ? '#005246' : '#e2ffd3',
          borderBottomRightRadius: 0,
        }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ marginHorizontal: 8, flexShrink: 1 }}>
              {/* <Text style={{
                fontSize: textScale(12),
                fontFamily: fontFamily.regular,
                textTransform: 'capitalize',
                color: colors.black,

              }}>{currentMessage?.username}</Text> */}

              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{
                  ...styles.descText,
                  color: isDarkMode ? colors.white : colors.black,
                  marginTop: 0
                }}>{currentMessage?.message}</Text>
                <Text style={{ ...styles.timeText, color: isDarkMode ? '#84acaa' : colors.blackOpacity40 }}>{moment(currentMessage?.created_date).format('LT')}</Text>
              </View>
            </View>
          </View>
        </View>
      )
    }
    return (
      <View style={{ flexDirection: "row" }}>
        <FastImage
          source={{
            uri: currentMessage?.display_image,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable
          }}
          style={styles.cahtUserImage}
        />
        <View key={String(currentMessage._id)} style={{
          ...styles.chatStyle,
          alignSelf: 'flex-start',
          backgroundColor: isDarkMode ? '#363638' : '#ffffff',
          borderBottomLeftRadius: moderateScale(0),
          maxWidth: width / 1.2
        }}>

          <View style={{ marginHorizontal: 8, flexShrink: 1 }}>
            {currentMessage?.username || currentMessage?.phone_num ? <Text style={{
              fontSize: textScale(12),
              fontFamily: fontFamily.medium,
              textTransform: 'capitalize',
              color: isDarkMode ? colors.white : colors.black,
            }}>{currentMessage?.username || currentMessage?.phone_num}</Text> : null}

            <Text style={{
              ...styles.descText,
              color: isDarkMode ? colors.white : colors.black,
            }}>{currentMessage?.message}</Text>
            <Text style={{ ...styles.timeText, color: isDarkMode ? '#a4a3aa' : colors.blackOpacity43 }}>{moment(currentMessage?.created_date).format('LT')}</Text>

          </View>
        </View>
      </View>
    )
  }, [])

  const SendButton = useCallback(() => {
    return (
      <View
        style={{
          marginHorizontal: 10,
          alignSelf: 'center',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image source={imagePath.send} />
      </View>
    )
  }, [])



  const onSpeechStartHandler = (e) => { };
  const onSpeechEndHandler = (e) => {
    updateState({
      isVoiceRecord: false,
    });
  };

  const onSpeechResultsHandler = (e) => {
    let text = e.value[0];
    console.log("this is the text")
    onSend([{ text: text }])
    _onVoiceStop();
  };

  const _onVoiceListen = async () => {
    const langType = languages?.primary_language?.sort_code;
    updateState({ isVoiceRecord: true });
    try {
      await Voice.start(langType);
    } catch (error) { }
  };

  const _onVoiceStop = async () => {
    updateState({
      isVoiceRecord: false,
    });
    try {
      await Voice.stop();
    } catch (error) {
      console.log('error raised', error);
    }
  };


  // this funtion use for camera handle
  const cameraHandle = async (index = 0) => {
    const permissionStatus = await androidCameraPermission();

    console.log("permision status")
    if (permissionStatus) {
      if (index == 1) {
        cameraHandler(index, {
          width: 300,
          height: 400,
          cropping: true,
          cropperCircleOverlay: true,
          mediaType: 'photo',
        })
          .then((res) => {
            if (res?.data) {
              updateState({ isLoading: true });
            }
            let data = {
              type: 'jpg',
              avatar: res?.data,
            };
            actions.uploadProfileImage(data, {
              code: appData?.profile?.code,
            })
              .then((res) => {
                const source = {
                  uri: getImageUrl(
                    res.data.proxy_url,
                    res.data.image_path,
                    '200/200',
                  ),
                };
                const image = {
                  source,
                };

                updateState({ isLoading: false });

              })
              .catch((err) => { });
          })
          .catch((err) => { });
      }
    }
  };

  const renderSend = (props) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>

        {/* <TouchableOpacity 
        style={{ marginLeft: 8 }}
        activeOpacity={0.7}
        onPress={cameraHandle}
        >
          <Image
            source={imagePath.ic_cameraColored}
            resizeMode="contain"
            style={{
              height: moderateScale(20),
              width: moderateScale(20),
              tintColor: colors.black,
            }}
          />
        </TouchableOpacity>

        {isVoiceRecord ? (
          <TouchableOpacity
            onPress={_onVoiceStop}
          >
            <LottieView
              style={{
                height: moderateScale(43),
                width: moderateScale(30),
                marginLeft: moderateScale(-2),
              }}
              source={voiceListen}
              autoPlay
              loop
              colorFilters={[
                { keypath: 'layers', color: themeColors.primary_color },
                { keypath: 'transparent2', color: themeColors.primary_color },
                { keypath: 'transparent1', color: themeColors.primary_color },
                { keypath: '01', color: themeColors.primary_color },
                { keypath: '02', color: themeColors.primary_color },
                { keypath: '03', color: themeColors.primary_color },
                { keypath: '04', color: themeColors.primary_color },
              ]}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ marginLeft: moderateScale(8) }}
            onPress={_onVoiceListen}
          >
            <Image
              source={imagePath.icVoice}
              style={{
                height: moderateScale(20),
                width: moderateScale(20),
                borderRadius: moderateScale(10),
                tintColor: themeColors.primary_color,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )} */}

        <Send
          alwaysShowSend
          containerStyle={{ backgroundColor: 'red' }}
          children={<SendButton />}
          {...props}
        />
      </View>
    )
  }

  return (
    <WrapperContainer
      statusBarColor={isDarkMode ? "#171717" : "#f6f6f6"}
    >

      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icBackb
              : imagePath.back
        }
        centerTitle={`# ${paramData?.room_id || ''}`}
        customRight={showRoomUser}
        headerStyle={{ backgroundColor: isDarkMode ? "#171717" : '#f6f6f6' }}
      // onPressLeft={onBack}

      />


      <ImageBackground
        source={isDarkMode ? imagePath.icBgDark : imagePath.icBgLight}
        style={{ flex: 1 }}
      >

        <GiftedChat
          // messagesContainerStyle={{ backgroundColor: isDarkMode?"#171717": "#f6f6f6"}}
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{ _id: userData?.id }}
          renderMessage={renderMessage}
          isKeyboardInternallyHandled={true}
          extraData={messages}
          // isTyping={true}
          // renderActions={props => {
          //   return (
          //     <TouchableOpacity

          //       style={{
          //         marginHorizontal: 10,
          //         // alignSelf: 'center',
          //         // height: '100%',
          //         alignItems: 'center',
          //         justifyContent: 'center',
          //         marginBottom: 10
          //       }}>
          //       <Text>Bye</Text>
          //     </TouchableOpacity>
          //   );
          // }}
          renderInputToolbar={props => {
            return (
              <InputToolbar
                containerStyle={{ backgroundColor: isDarkMode ? '#171717' : '#f6f6f6', paddingTop: 0 }}
                {...props}
              />
            )
          }}
          
          textInputStyle={{
            backgroundColor: isDarkMode ? '#2c2c2e' : '#ffffff',
            paddingTop: Platform.OS == 'ios' ? 10 : undefined,
            borderRadius: 20,
            paddingHorizontal: 20,
            // marginVertical: 30,
            textAlignVertical: 'center',
            fontFamily: fontFamily.regular,
            alignSelf: 'center',
            color: isDarkMode ? colors.white : colors.black,
            marginTop: moderateScaleVertical(6)

          }}
          renderSend={renderSend}
        />
      </ImageBackground>


      <Modal
        isVisible={showParticipant}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}
        onBackdropPress={() => updateState({ showParticipant: false })}
      >
        <View style={{
          ...styles.modalStyle,
          backgroundColor: isDarkMode ? MyDarkTheme.colors.lightDark : colors.white,

        }}>

          <View style={styles.flexView}>
            <Text style={{
              fontFamily: fontFamily?.bold,
              fontSize: textScale(16),
              color: isDarkMode ? colors.white : colors.black
            }}>{roomUsers.length} Participants</Text>

            <TouchableOpacity activeOpacity={0.7} onPress={() => updateState({ showParticipant: false })}>
              <Image style={{ tintColor: isDarkMode ? colors.white : colors.black }} source={imagePath.closeButton} />
            </TouchableOpacity>
          </View>

          <ScrollView >
            {roomUsers.map((val, i) => {
              return (
                <View key={String(i)} style={{
                  marginVertical: moderateScaleVertical(8),
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <FastImage
                    source={{
                      uri: val?.display_image,
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable
                    }}
                    style={{
                      ...styles.imgStyle,
                      backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.blackOpacity30,
                    }}
                  />
                  <View style={{ marginLeft: moderateScale(8) }}>
                    <Text style={{
                      fontSize: textScale(12),
                      fontFamily: fontFamily.medium,
                      textTransform: 'capitalize',
                      color: isDarkMode ? colors.white : colors.black,
                    }}>{val?.auth_user_id == userData?.id ? 'You' : val?.username}</Text>
                    {!!val?.phone_num ? <Text style={{
                      fontSize: textScale(12),
                      fontFamily: fontFamily.medium,
                      textTransform: 'capitalize',
                      color: isDarkMode ? colors.white : colors.black,
                    }}>{val?.phone_num}</Text> : null}
                  </View>
                </View>
              )
            })}
          </ScrollView>
        </View>
      </Modal>
    </WrapperContainer>
  )
}



const stylesFun = ({ fontFamily, isDarkMode }) => {
  const styles = StyleSheet.create({
    imgStyle: {
      width: moderateScale(35),
      height: moderateScale(35),
      borderRadius: moderateScale(35 / 2),
    },
    modalStyle: {
      padding: moderateScale(10),
      borderTopLeftRadius: moderateScale(8),
      borderTopRightRadius: moderateScale(8),
      maxHeight: height / 2
    },
    userNameStyle: {
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      textTransform: 'capitalize',
    },
    cahtUserImage: {
      width: moderateScale(20),
      height: moderateScale(20),
      borderRadius: moderateScale(10),
      backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.blackOpacity30,
      marginLeft: 8
    },
    descText: {
      fontSize: textScale(11),
      fontFamily: fontFamily.regular,
      // textTransform: 'capitalize',
      lineHeight: moderateScale(18),
      marginTop: moderateScaleVertical(4),
    },
    timeText: {
      fontSize: textScale(10),
      fontFamily: fontFamily.regular,
      textTransform: 'uppercase',
      color: colors.blackOpacity43,
      marginLeft: moderateScale(12),
      marginTop: moderateScaleVertical(6),
      alignSelf: 'flex-end'
    },
    flexView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    chatStyle: {
      paddingVertical: moderateScaleVertical(6),
      borderRadius: moderateScale(8),
      marginBottom: moderateScale(10),
      paddingHorizontal: moderateScale(2),
      maxWidth: width - 16,
      marginHorizontal: moderateScale(8),
    }
  });
  return styles
}

