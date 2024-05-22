import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Text, View, FlatList, TouchableOpacity } from 'react-native'
import socketServices from '../../utils/scoketService';
import { useSelector } from 'react-redux';
//import { useDarkMode } from 'react-native-dark-mode';
import imagePath from '../../constants/imagePath';
import Header from '../../Components/Header';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import colors from '../../styles/colors';
import { MyDarkTheme } from '../../styles/theme';
import WrapperContainer from '../../Components/WrapperContainer';
import actions from '../../redux/actions';
import { moderateScale, textScale } from '../../styles/responsiveSize';
import _ from 'lodash';
import { showError } from '../../utils/helperFunctions';
import navigationStrings from '../../navigation/navigationStrings';
import stylesFun from './styles';
import moment from 'moment';
import CircularImages from '../../Components/CircularImages';
import useInterval from '../../utils/useInterval';
import { API_BASE_URL } from '../../config/urls';
import { getSubDomain } from '../../utils/commonFunction';


export default function ChatRoom({ navigation, route }) {
    const theme = useSelector((state) => state?.initBoot?.themeColor);
    const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
    const { appData, themeColors, currencies, languages, appStyle } = useSelector((state) => state.initBoot);
    const fontFamily = appStyle?.fontSizeData;
    const userData = useSelector((state) => state?.auth?.userData);

    // const darkthemeusingDevice = useDarkMode();
    // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
    const isDarkMode =  theme;
    const paramData = route?.params;
    console.log(userData, 'userDatauserDatauserData');
    const isChatRefresh = useSelector((state) => state?.chatRefresh.isChatRefresh);


    const styles = stylesFun({ fontFamily, isDarkMode });

    const [state, setState] = useState({
        roomData: [],
        isLoading: true,
        num: 1,
        subDomain: getSubDomain(),
    })
    const { roomData, isLoading, num, subDomain } = state

    const updateState = (data) => setState((state) => ({ ...state, ...data }))


    const isRefresh = useRef(false)
    const roomDataRef = useRef([])


    const isFocused = useIsFocused();

    useFocusEffect(
        useCallback(() => {
            fetchData()
        }, [navigation])
    );

    useFocusEffect(
        useCallback(() => {
            socketServices.on("new-app-message", (data) => {
                console.log("listen in roomChat screen")
                fetchData()
            });
            return () => {
                socketServices.removeListener("new-app-message");
            };
        }, [navigation])
    );

    console.log("paramDataparamData", appData)

    let fetchData = async () => {
        if (_.isEmpty(roomData)) {
            // updateState({ isLoading: true })
        }
        try {
            let headerData = {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
            }
            let apiData = {
                sub_domain: '192.168.101.88', //this is static value 
                type: paramData?.type == 'agent_chat' ? 'agent_to_user' : 'vendor_to_user',
                db_name: appData?.profile?.database_name,
                client_id:String(appData?.profile.id)
            }
            if (paramData?.allVendors) {
                apiData['vendor_id'] = paramData?.allVendors.map(val => val.id)
            } else {
                apiData['order_user_id'] = String(userData?.id)
            }
            console.log('api data+++', apiData)
            const res = paramData?.type == 'user_chat' ? await actions.fetchUserChat(apiData, headerData) : paramData?.type == 'vendor_chat' ? await actions.fetchVendorChat(apiData, headerData) : await actions.fetchAgentChat(apiData, headerData)
            updateState({ isLoading: false })
            if (!!res?.roomData && !_.isEmpty(res?.roomData) && isFocused) {
                roomDataRef.current = res.roomData
                updateState({ roomData: res.roomData })

            }
            console.log("room res++++", res)
        } catch (error) {
            console.log('error raised in start chat api', error)
            showError(error?.message)
            updateState({ isLoading: false })
        }
    }


    const goToChatRoom = useCallback((item) => {
        navigation.navigate(navigationStrings.CHAT_SCREEN, { data: { ...item, id: item?.order_vendor_id } })
    }, [])

    const renderItem = useCallback(({ item, index }) => {
        let isAnyMessage = _.isEmpty(item?.chat_Data)
        return (
            <TouchableOpacity
                onPress={() => goToChatRoom(item)}
                style={{
                    backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.white,
                    borderRadius: 4,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                    margin: 2,
                    padding: moderateScale(8)
                }}
            >
                <View style={styles.flexView}>
                    <Text style={styles.textStyle}><Text>Order</Text> # {item?.room_id}</Text>
                    {!isAnyMessage ?
                        <Text style={styles.timeStyle}>{moment(item?.chat_Data[0]?.created_date).format('LLL')}</Text> : null
                    }
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {_.isEmpty(item?.user_Data) ? null : <CircularImages fontFamily={fontFamily} isDarkMode={isDarkMode} data={item?.user_Data} />}
                    {!isAnyMessage ? <Text numberOfLines={2} style={styles.textDesc} >{item?.chat_Data[0]?.message}</Text> : null}
                </View>
            </TouchableOpacity>
        )
    }, [])

    const listEmptyComponent = useCallback(() => {

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{
                    fontSize: textScale(16),
                    fontFamily: fontFamily.bold,
                    color: isDarkMode ? colors.white : colors.black
                }}>Chat Room Empty</Text>
            </View>
        )
    }, [])

    const awesomeChildListKeyExtractor = useCallback((item) => `awesome-child-key-${item?._id}`, [roomData]);

    const itemSeparatorComponent = useCallback(() => { return (<View style={styles.borderStyle} />) }, [])



    return (
        <WrapperContainer
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
            statusBarColor={colors.white}
            isLoading={isLoading}
        >
            <Header
                leftIcon={
                    appStyle?.homePageLayout === 2
                        ? imagePath.backArrow
                        : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                            ? imagePath.icBackb
                            : imagePath.back
                }
                centerTitle={'Chat Room'}

            // customRight={() => <Text>{num}</Text>}

            />
            <View style={styles.container}>

                <FlatList
                    data={roomData}
                    renderItem={renderItem}
                    ListEmptyComponent={!isLoading && listEmptyComponent}
                    keyExtractor={awesomeChildListKeyExtractor}
                    ItemSeparatorComponent={itemSeparatorComponent}
                    contentContainerStyle={{ flexGrow: 1 }}
                />
            </View>

        </WrapperContainer>
    );
};
