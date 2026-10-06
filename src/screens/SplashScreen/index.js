import {
  View,
  SafeAreaView,
  Platform,
  Animated,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import styles from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {useDispatch} from 'react-redux';
import {
  fetchAIActiveList,
  fetchAIAutoManualData,
  fetchAIStatusHistoryList,
  fetchAdminAIActiveList,
  fetchAdminAIHistoryList,
  fetchAdminAnalyticsCryptoList,
  fetchAdminAnalyticsIndiaList,
  fetchAdminAnalyticsUsaList,
  fetchAdminAnalyticsVindexList,
  fetchAdminDashboardList,
  fetchAdminFuturePmsActiveList,
  fetchAdminFuturePmsHistoryList,
  fetchAdminIndicatorAlertList,
  fetchAdminMyBotActiveList,
  fetchAdminMyBotHistoryList,
  fetchAdminNotificationList,
  fetchAdminSettingList,
  fetchAdminSpotSpmActiveList,
  fetchAdminSpotSpmHistoryList,
  fetchAdminWebNotificationCryptoList,
  fetchAdminWebNotificationIndiaList,
  fetchAdminWebNotificationUsaList,
  fetchAdminWebNotificationVindexList,
  fetchAnalyticsData,
  fetchAuth4hPriceData,
  fetchAuthFuturePriceData,
  fetchAutoManualData,
  fetchBalance,
  fetchBinanceApiError,
  fetchBinanceData,
  fetchBotActiveList,
  fetchBotLeadData,
  fetchFavoriteData,
  fetchFuturePriceData,
  fetchHistoryList,
  fetchLastLeadData,
  fetchMarqueeData,
  fetchMenuList,
  fetchNotificationCount,
  fetchNotificationData,
  fetchPMSHistoryList,
  fetchPercentageStatusData,
  fetchPmsActiveList,
  fetchPricePredicationData,
  fetchSpotBalanceList,
  fetchSpotCloseOrderList,
  fetchSpotOpenOrderList,
  fetchSpotYahooTicker,
  fetchSttingData,
  fetchTickerData,
  fetchUserDataSuccess,
} from '../../redux/reducer';
import {
  onGetAIAutoManualDataApi,
  onGetAIDataApi,
  onGetActiveAIStatusApi,
  onGetActiveBotStausApi,
  onGetActivePMSApi,
  onGetAdminAIActiveDataApi,
  onGetAdminAIHistoryDataApi,
  onGetAdminAnalyticsDataApi,
  onGetAdminDashboardApi,
  onGetAdminFuturePMSActiveDataApi,
  onGetAdminFuturePMSHistoryApi,
  onGetAdminIndicatorAlertDataApi,
  onGetAdminMyBotActiveDataApi,
  onGetAdminMyBotHistoryApi,
  onGetAdminNotificationApi,
  onGetAdminSettingApi,
  onGetAdminSpotPMSHistoryApi,
  onGetAnalyticsDataApi,
  onGetAuth4hPriceStatusApi,
  onGetAuthFuturePriceApi,
  onGetAutoManualDataApi,
  onGetBalanceApi,
  onGetBinanceDataApi,
  onGetBotLastLeadApi,
  onGetCustomerDataApi,
  onGetCustomerDetailsDataApi,
  onGetFavoriteStatusApi,
  onGetFuturePriceApi,
  onGetHistoryDetailAIStatusApi,
  onGetHistoryDetailApi,
  onGetLastLeadApi,
  onGetMarqueeApi,
  onGetMenuApi,
  onGetNotificationListApi,
  onGetNotificationStatusApi,
  onGetPMSHistoryDetailApi,
  onGetPercentStatusApi,
  onGetProfileApi,
  onGetSplashLogoApi,
  onGetSpotPMSActiveApi,
  onGetSpotPMSActiveDataApi,
  onGetSpotPMSHistoryApi,
  onGetSpotYahooTickerApi,
  onGetTickerDataApi,
  onGetTutorialDataApi,
  onGetWebNotificationDataApi,
} from '../../services/Api';
import '../../translation/index';
import {useTranslation} from 'react-i18next';
import RNRestart from 'react-native-restart';

const SplashScreen = ({navigation}) => {
  const {i18n} = useTranslation();
  const [logoImage, setLogoImage] = useState('');
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    requestUserPermission();
    onCheckAuth();
  }, []);

  const requestUserPermission = async () => {
    if (Platform.OS === 'ios') {
      //Request iOS permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    } else if (Platform.OS === 'android') {
      //Request Android permission (For API level 33+, for 32 or below is not required)
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  };

  const onCheckAuth = async () => {
    try {
      const language = await AsyncStorage.getItem('language');
      if (language != null) {
        i18n.changeLanguage(language);
      } else {
        AsyncStorage.setItem('language', 'en');
      }
      const token = await AsyncStorage.getItem('accessToken');
      const fcmToken = await messaging().getToken();
      console.log('Get FCM TOKEN:::', fcmToken);
      AsyncStorage.setItem('fcmToken', fcmToken);
      console.log('Get access TOKEN:::', token);
      if (token !== null) {
        try {
          const response1 = await onGetCustomerDataApi();
          if (response1.data) {
            // console.log('onGetAIDataApi Data>>>>', response1.data);
            dispatch(fetchSttingData(response1.data.setting));
            if (response1.data.setting.firewall_token == fcmToken) {
              onCheckData();
              // console.log('onGetAIDataApi Data>>>>', response1.data);
              // const notification = await onGetNotificationListApi();
              if (response1.data.user_notification) {
                let strNotify = response1.data.user_notification;
                let count = 0;
                strNotify.map((item, index) => {
                  if (item.recive == false && index < 300) {
                    count = count + 1;
                    console.log('GEt CountL:::', item.recive);
                  }
                });
                AsyncStorage.setItem('notificationCount', JSON.stringify(count));
                dispatch(fetchNotificationCount(count));
              }
            } else if (Platform.OS == 'ios') {
              onCheckData();
              // console.log('onGetAIDataApi Data>>>>', response1.data);
              // const notification = await onGetNotificationListApi();
              if (response1.data.user_notification) {
                let strNotify = response1.data.user_notification;
                let count = 0;
                strNotify.map((item, index) => {
                  if (item.recive == false && index < 300) {
                    count = count + 1;
                    console.log('GEt CountL:::', item.recive);
                  }
                });
                AsyncStorage.setItem('notificationCount', JSON.stringify(count));
                dispatch(fetchNotificationCount(count));
              }
            } else {
              AsyncStorage.setItem('accessToken', '');
              navigation.replace('LoginScreen');
            }
          }
        } catch (err) {
          onCheckData();
          const notification = await onGetNotificationListApi();
          if (notification.data) {
            let strNotify = notification.data.results;
            let count = 0;
            strNotify.map((item, index) => {
              if (item.recive == false && index < 300) {
                count = count + 1;
                console.log('GEt CountL:::', item.recive);
              }
            });

            AsyncStorage.setItem('notificationCount', JSON.stringify(count));
            dispatch(fetchNotificationCount(count));
          }
        }
      } else {
        onWithoutToken();
      }
    } catch (err) {
      const token = await AsyncStorage.getItem('accessToken');
      if (token !== null) {
        try {
          const response1 = await onGetCustomerDataApi();
          if (response1.data) {
            // console.log('onGetAIDataApi Data>>>>', response1.data);
            dispatch(fetchSttingData(response1.data.setting));
            onCheckData();
            if (response1.data.user_notification) {
              let strNotify = response1.data.user_notification;
              let count = 0;
              strNotify.map((item, index) => {
                if (item.recive == false && index < 300) {
                  count = count + 1;
                }
              });
              AsyncStorage.setItem('notificationCount', JSON.stringify(count));
              dispatch(fetchNotificationCount(count));
            }
          }
        } catch (err) {
          onCheckData();
          const notification = await onGetNotificationListApi();
          if (notification.data) {
            let strNotify = notification.data.results;
            let count = 0;
            strNotify.map((item, index) => {
              if (item.recive == false && index < 300) {
                count = count + 1;
              }
            });
            AsyncStorage.setItem('notificationCount', JSON.stringify(count));
            dispatch(fetchNotificationCount(count));
          }
        }
      } else {
        onWithoutToken();
        // navigation.replace('LoginScreen');
      }
      console.log('Error::', err.response.data);
    }
  };

  const onCheckData = async () => {
    try {
      const role = await AsyncStorage.getItem('userRole');
      if (role == 'admin') {
        onAdminDataGet();
      } else {
        onAllDataGet();
      }
    } catch (err) {
      console.log('Error::', err);
    }
  };

  const onWithoutToken = async () => {
    try {
      try {
        console.log('onGetMenuApi::');
        const responseMenu = await onGetMenuApi();
        if (responseMenu.data?.mobile_menu_injection) {
          dispatch(fetchMenuList(responseMenu.data?.mobile_menu_injection));
        }
      } catch (err) {
        console.log('onGetMarqueeApi::', err.response.data.code);
      }
      try {
        console.log('onGetBinanceDataApi::');
        const response6 = await onGetBinanceDataApi();
        if (response6.data) {
          dispatch(fetchBinanceData(response6.data));
        }
      } catch (err) {
        console.log('onGetMarqueeApi::', err);
      }
      try {
        const response6 = await onGetSpotYahooTickerApi();
        if (response6.data) {
          dispatch(fetchSpotYahooTicker(response6.data));
        }
      } catch (err) {
        console.log('spotResponse::', err);
      }
      try {
        const future4hResponse = await onGetAuth4hPriceStatusApi();
        if (future4hResponse.data) {
          dispatch(fetchAuth4hPriceData(future4hResponse.data));
        }
      } catch (err) {
        console.log('futureResponse::', err.response.data);
      }
      try {
        const futureResponse = await onGetAuthFuturePriceApi();
        if (futureResponse.data) {
          dispatch(fetchAuthFuturePriceData(futureResponse.data));
        }
      } catch (err) {
        console.log('futureResponse::', err);
      }
      navigation.replace('TabStack');
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  const onAdminDataGet = async () => {
    try {
      AsyncStorage.setItem('selectedScreen', '');
      try {
        const futureResponse = await onGetAuthFuturePriceApi();
        if (futureResponse.data) {
          dispatch(fetchFuturePriceData(futureResponse.data));
        }
      } catch (err) {
        console.log('futureResponse::', err);
      }
      try {
        const dashboardData = await onGetAdminDashboardApi();
        if (dashboardData.data) {
          dispatch(fetchAdminDashboardList(dashboardData.data));
        }
      } catch (err) {
        console.log('dashboardData::', err.response.data.detail);
        if (
          err.response.data.detail == 'Invalid token: Invalid token' ||
          err.response.data.detail == 'Given token not valid for any token type'
        ) {
          AsyncStorage.setItem('accessToken', '');
          RNRestart.restart();
        }
      }
      const AIActiveData = await onGetAdminAIActiveDataApi();
      if (AIActiveData.data) {
        dispatch(fetchAdminAIActiveList(AIActiveData.data));
      }
      const AIHistoryData = await onGetAdminAIHistoryDataApi();
      if (AIHistoryData.data) {
        dispatch(fetchAdminAIHistoryList(AIHistoryData.data));
      }
      const myBotActiveData = await onGetAdminMyBotActiveDataApi();
      if (myBotActiveData.data) {
        dispatch(fetchAdminMyBotActiveList(myBotActiveData.data));
      }
      const myBotHistoryData = await onGetAdminMyBotHistoryApi();
      if (myBotHistoryData.data) {
        dispatch(fetchAdminMyBotHistoryList(myBotHistoryData.data));
      }
      const spotPMSActiveData = await onGetSpotPMSActiveDataApi();
      if (spotPMSActiveData.data) {
        dispatch(fetchAdminSpotSpmActiveList(spotPMSActiveData.data));
      }
      const spotPMSHistoryData = await onGetAdminSpotPMSHistoryApi();
      if (spotPMSHistoryData.data) {
        dispatch(fetchAdminSpotSpmHistoryList(spotPMSHistoryData.data));
      }

      const futurePMSActiveData = await onGetAdminFuturePMSActiveDataApi();
      if (futurePMSActiveData.data) {
        dispatch(fetchAdminFuturePmsActiveList(futurePMSActiveData.data));
      }
      const futurePMSHistoryData = await onGetAdminFuturePMSHistoryApi();
      if (futurePMSHistoryData.data) {
        dispatch(fetchAdminFuturePmsHistoryList(futurePMSHistoryData.data));
      }
      navigation.replace('MyDrawer');
      const notificationResponse = await onGetAdminNotificationApi();
      if (notificationResponse.data) {
        console.log('notificationResponse Data>>>>', notificationResponse.data);
        dispatch(fetchAdminNotificationList(notificationResponse.data));
      }
      const analyticsCryptoResponse = await onGetAdminAnalyticsDataApi('crypto');
      if (analyticsCryptoResponse.data) {
        console.log('CryptoResponse Data>>>>', analyticsCryptoResponse.data);
        dispatch(fetchAdminAnalyticsCryptoList(analyticsCryptoResponse.data));
      }
      // const analyticsIndiaResponse = await onGetAdminAnalyticsDataApi('india');
      // if (analyticsIndiaResponse.data) {
      //   console.log('IndiaResponse Data>>>>', analyticsIndiaResponse.data);
      //   dispatch(fetchAdminAnalyticsIndiaList(analyticsIndiaResponse.data));
      // }
      // const analyticsUsaResponse = await onGetAdminAnalyticsDataApi('usa');
      // if (analyticsUsaResponse.data) {
      //   console.log('UsaResponse Data>>>>', analyticsUsaResponse.data);
      //   dispatch(fetchAdminAnalyticsUsaList(analyticsUsaResponse.data));
      // }
      // const analyticsVindexResponse = await onGetAdminAnalyticsDataApi('vindex');
      // if (analyticsVindexResponse.data) {
      //   console.log('VindexResponse Data>>>>', analyticsVindexResponse.data);
      //   dispatch(fetchAdminAnalyticsVindexList(analyticsVindexResponse.data));
      // }

      const webNotificationCrypto = await onGetWebNotificationDataApi('crypto');
      if (webNotificationCrypto.data) {
        console.log('CryptoResponse Data>>>>', webNotificationCrypto.data);
        dispatch(
          fetchAdminWebNotificationCryptoList(webNotificationCrypto.data),
        );
      }
      // const webNotificationIndia = await onGetWebNotificationDataApi('india');
      // if (webNotificationIndia.data) {
      //   console.log('IndiaResponse Data>>>>', webNotificationIndia.data);
      //   dispatch(fetchAdminWebNotificationIndiaList(webNotificationIndia.data));
      // }
      // const webNotificationUsa = await onGetWebNotificationDataApi('usa');
      // if (webNotificationUsa.data) {
      //   console.log('UsaResponse Data>>>>', webNotificationUsa.data);
      //   dispatch(fetchAdminWebNotificationUsaList(webNotificationUsa.data));
      // }
      // const webNotificationVindex = await onGetWebNotificationDataApi('vindex');
      // if (webNotificationVindex.data) {
      //   console.log('VindexResponse Data>>>>', webNotificationVindex.data);
      //   dispatch(fetchAdminWebNotificationVindexList(webNotificationVindex.data));
      // }
      const settingResponse = await onGetAdminSettingApi();
      if (settingResponse.data) {
        console.log('settingResponse Data>>>>', settingResponse.data);
        dispatch(fetchAdminSettingList(settingResponse.data));
      }
      const indicatorAlertResponse = await onGetAdminIndicatorAlertDataApi();
      if (indicatorAlertResponse.data) {
        dispatch(fetchAdminIndicatorAlertList(indicatorAlertResponse.data));
      }
    } catch (err) {
      console.log('Error::', err);
      // setTimeout(() => {
      //   navigation.replace('WiFiScreen');
      // }, 3000);
    }
  };

  const onAllDataGet = async () => {
    try {
      AsyncStorage.setItem('selectedScreen', '');
      try {
        const response = await onGetProfileApi();
        if (response.data) {
          console.log('onGetProfileApi Data>>>>', response.data);
          dispatch(fetchUserDataSuccess(response.data));
        }
      } catch (err) {
        console.log('onGetProfileApi Error::', err);
      }

      try {
        const balanceResponse = await onGetBalanceApi();
        if (balanceResponse.data) {
          console.log('onGetBalanceApi Data>>>>', balanceResponse.data);
          dispatch(fetchBinanceApiError(''));
          dispatch(fetchBalance(balanceResponse.data));
        }
      } catch (err) {
        console.log('onGetBalanceApi::', err.response.data.detail);
        if (
          err?.response?.data?.detail &&
          err?.response?.data?.detail !=
            'Given token not valid for any token type'
        ) {
          dispatch(fetchBinanceApiError(err?.response?.data?.detail));
        } else {
          dispatch(fetchBinanceApiError('error'));
        }
      }
      try {
        const welcomeVisible = await onGetTutorialDataApi();
        console.log(
          'welcomeVisible Data>>>>',
          welcomeVisible.data.welcome_popup_guide,
        );
        if (welcomeVisible.data.welcome_popup_guide) {
          AsyncStorage.setItem('welcome', 'true');
        } else {
          AsyncStorage.setItem('welcome', 'false');
        }
      } catch (err) {
        console.log('onGetMarqueeApi::', err.response.data.detail);
        if (
          err.response.data.detail == 'Invalid token: Invalid token' ||
          err.response.data.detail == 'Given token not valid for any token type'
        ) {
          AsyncStorage.setItem('accessToken', '');
          RNRestart.restart();
        }
      }

      // try {
      //   const response3 = await onGetLastLeadApi();
      //   if (response3.data?.results) {
      //     dispatch(fetchLastLeadData(response3.data?.results));
      //   }
      // } catch (err) {
      //   console.log('onGetLastLeadApi::', err.response.data);
      // }

      // try {
      //   const responseMenu = await onGetMenuApi();
      //   if (responseMenu.data?.mobile_menu_injection) {
      //     dispatch(fetchMenuList(responseMenu.data?.mobile_menu_injection));
      //   }
      // } catch (err) {
      //   console.log('responseMenu::', err.response.data);
      // }

      try {
        const response6 = await onGetSpotYahooTickerApi();
        if (response6.data) {
          dispatch(fetchSpotYahooTicker(response6.data));
        }
      } catch (err) {
        if (
          err.response.data.code == 'token_not_valid' ||
          err.response.data.detail == 'Given token not valid for any token type'
        ) {
          AsyncStorage.setItem('accessToken', '');
          RNRestart.restart();
        }
        console.log('spotResponse::', err);
      }
      try {
        const future4hResponse = await onGetAuth4hPriceStatusApi();
        if (future4hResponse.data) {
          dispatch(fetchAuth4hPriceData(future4hResponse.data));
        }
      } catch (err) {
        if (
          err.response.data.code == 'token_not_valid' ||
          err.response.data.detail == 'Given token not valid for any token type'
        ) {
          AsyncStorage.setItem('accessToken', '');
          RNRestart.restart();
        }
        console.log('futureResponse::', err.response.data);
      }
      try {
        const futureResponse = await onGetAuthFuturePriceApi();
        if (futureResponse.data) {
          dispatch(fetchAuthFuturePriceData(futureResponse.data));
        }
      } catch (err) {
        if (
          err.response.data.code == 'token_not_valid' ||
          err.response.data.detail == 'Given token not valid for any token type'
        ) {
          AsyncStorage.setItem('accessToken', '');
          RNRestart.restart();
        }
        console.log('futureResponse::', err);
      }
      try {
        const responseFavorite = await onGetFavoriteStatusApi();
        if (responseFavorite.data) {
          dispatch(
            fetchFavoriteData(responseFavorite.data.withlist.tickers_list),
          );
        }
      } catch (err) {
        console.log('responseFavorite::', err);
      }
      try {
        const responseNotification = await onGetNotificationStatusApi();
        if (responseNotification.data) {
          dispatch(fetchNotificationData(responseNotification.data));
        }
      } catch (err) {
        console.log('responseNotification::', err);
      }
      try {
        const percentageStatusResponse = await onGetPercentStatusApi();
        if (percentageStatusResponse.data) {
          dispatch(fetchPercentageStatusData(percentageStatusResponse.data));
        }
      } catch (err) {
        console.log('percentageStatusResponse::', err);
      }
      // try {
      //   const response4 = await onGetAutoManualDataApi();
      //   if (response4.data) {
      //     dispatch(fetchAutoManualData(response4.data));
      //   }
      // } catch (err) {
      //   console.log('onGetAutoManualDataApi::', err.response.data);
      // }

      // try {
      //   const aiAutoManualData = await onGetAIAutoManualDataApi();
      //   if (aiAutoManualData.data) {
      //     dispatch(fetchAIAutoManualData(aiAutoManualData.data));
      //   }
      // } catch (err) {
      //   console.log('aiAutoManualData::', err.response.data);
      // }
      try {
        console.log('onGetTickerDataApi::');
        const response5 = await onGetTickerDataApi();
        if (response5.data?.data) {
          dispatch(fetchTickerData(response5.data?.data));
        }
      } catch (err) {
        console.log('onGetTickerDataApi::', err);
      }
      try {
        console.log('onGetBinanceDataApi::');
        const response6 = await onGetBinanceDataApi();
        if (response6.data) {
          dispatch(fetchBinanceData(response6.data));
        }
      } catch (err) {
        console.log('onGetBinanceDataApi::', err);
      }
      // const responseFavorite = await onGetFavoriteStatusApi();
      // if (responseFavorite.data) {
      //   dispatch(
      //     fetchFavoriteData(responseFavorite.data.withlist.tickers_list),
      //   );
      // }
      // const responseNotification = await onGetNotificationStatusApi();
      // if (responseNotification.data) {
      //   dispatch(fetchNotificationData(responseNotification.data));
      // }
      // const futureResponse = await onGetFuturePriceApi();
      // if (futureResponse.data) {
      //   dispatch(fetchFuturePriceData(futureResponse.data));
      // }
      // const percentageStatusResponse = await onGetPercentStatusApi();
      // if (percentageStatusResponse.data) {
      //   dispatch(fetchPercentageStatusData(percentageStatusResponse.data));
      // }
      // getValueOfTickerData(
      //   response6.data,
      //   response5.data?.data,
      //   responseFavorite.data.withlist.tickers_list,
      //   responseNotification.data,
      //   futureResponse.data,
      //   percentageStatusResponse.data,
      // );
      // } catch (err) {
      //   console.log('percentageStatusResponse::', err);
      // }
      // try {
      //   const response1 = await onGetActiveAIStatusApi();
      //   if (response1.data.active_trade_list) {
      //     dispatch(fetchAIActiveList(response1.data.active_trade_list));
      //   } else {
      //     console.log('History Error:', response1.data);
      //   }
      // } catch (err) {
      //   console.log('onGetActiveAIStatusApi::', err);
      // }
      // try {
      //   const HistoryDeta = await onGetHistoryDetailApi();
      //   if (HistoryDeta.data.history_trade_list) {
      //     dispatch(fetchHistoryList(HistoryDeta.data.history_trade_list));
      //   }
      // } catch (err) {
      //   console.log('onGetHistoryDetailApi::', err);
      // }
      try {
        console.log('onGetMenuApi::');
        const responseMenu = await onGetMenuApi();
        if (responseMenu.data?.mobile_menu_injection) {
          dispatch(fetchMenuList(responseMenu.data?.mobile_menu_injection));
        }
      } catch (err) {
        console.log('onGetMarqueeApi::', err.response.data.code);
        // if (err.response.data.code == 'token_not_valid') {
        //   navigation.replace('LoginScreen');
        // }
      }
      navigation.replace('TabStack');
      console.log('onGetActiveAIStatusApi::');
      const response1 = await onGetActiveAIStatusApi();
      if (response1.data.active_trade_list) {
        dispatch(fetchAIActiveList(response1.data.active_trade_list));
      } else {
        console.log('History Error:', response1.data.code);
        // if (response1.data.code == 'token_not_valid') {
        //   navigation.replace('LoginScreen');
        // }
      }
      const DetailAIStatus = await onGetHistoryDetailAIStatusApi();
      if (DetailAIStatus.data.history_trade_list) {
        dispatch(
          fetchAIStatusHistoryList(DetailAIStatus.data.history_trade_list),
        );
      }
      console.log('onGetHistoryDetailApi::');
      const HistoryDeta = await onGetHistoryDetailApi();
      if (HistoryDeta.data.history_trade_list) {
        dispatch(fetchHistoryList(HistoryDeta.data.history_trade_list));
      }
      console.log('onGetActiveBotStausApi::');
      // try {
      const responseActive = await onGetActiveBotStausApi();
      if (responseActive.data.active_trade_list) {
        dispatch(fetchBotActiveList(responseActive.data.active_trade_list));
      } else {
        // console.log('History Error:', responseActive.data.code);
        // if (responseActive.data.code == 'token_not_valid') {
        //   navigation.replace('LoginScreen');
        // }
      }

      console.log('responseOpenOrder::');
      const responseOpenOrder = await onGetSpotPMSActiveApi();
      if (responseOpenOrder.data.active_trade_list) {
        dispatch(
          fetchSpotOpenOrderList(responseOpenOrder.data.active_trade_list),
        );
      } else {
        console.log('responseOpenOrder Error:', responseOpenOrder.data);
      }

      console.log('responseCloseOrder::');
      const responseCloseOrder = await onGetSpotPMSHistoryApi();
      if (responseCloseOrder.data.history_trade_list) {
        dispatch(
          fetchSpotCloseOrderList(responseCloseOrder.data.history_trade_list),
        );
      } else {
        console.log('responseCloseOrder Error:', responseCloseOrder.data);
      }
      // } catch (err) {
      //   console.log('History Error:', err.response.data);
      //   // alert(err.response.data.detail);
      // }

      // try {
      //   const response = await onGetActivePMSApi();
      //   if (response.data.active_trade_list) {
      //     dispatch(fetchPmsActiveList(response.data.active_trade_list));
      //   } else {
      //     console.log('History Error:', response.data);
      //   }
      // } catch (err) {
      //   console.log('History Error:', err.response.data);
      //   // alert(err.response.data.detail);
      // }

      // try {
      // } catch (err) {
      //   console.log('DetailAIStatus::', err);
      // }

      // try {
      //   const PMSHistory = await onGetPMSHistoryDetailApi();
      //   if (PMSHistory.data.history_trade_list) {
      //     dispatch(fetchPMSHistoryList(PMSHistory.data.history_trade_list));
      //   }
      // } catch (err) {
      //   console.log('PMSHistory::', err);
      // }
      // try {
      //   const AnalyticsResponse = await onGetAnalyticsDataApi();
      //   if (AnalyticsResponse.data) {
      //     dispatch(fetchAnalyticsData(AnalyticsResponse.data));
      //   }
      // } catch (err) {
      //   console.log('AnalyticsResponse::', err);
      // }

      // try {
      //   const botLeadResponse = await onGetBotLastLeadApi();
      //   if (botLeadResponse.data?.results) {
      //     dispatch(fetchBotLeadData(botLeadResponse.data?.results));
      //   }
      // } catch (err) {
      //   console.log('botLeadResponse::', err.response.data);
      // }
    } catch (err) {
      console.log('Error::', err.response.data.code);
      // if (err.response.data.code == 'token_not_valid') {
      //   navigation.replace('LoginScreen');
      // }
      // setTimeout(() => {
      //   navigation.replace('WiFiScreen');
      // }, 3000);
    }
  };

  const width = new Animated.Value(130);
  const height = new Animated.Value(80);

  // useEffect(() => {
  //   const animate = () => {
  //     Animated.timing(
  //       width, // The animated value to drive
  //       {
  //         toValue: 160, // Animate to opacity: 1 (opaque)
  //         duration: 1500, // Make it take a while
  //         useNativeDriver: false,
  //       },
  //     ).start(() => {
  //       // Reset value after animation completes
  //       // width.setValue(100);
  //       animate1(); // Repeat animation
  //     });
  //   };

  //   const animate1 = () => {
  //     Animated.timing(
  //       width, // The animated value to drive
  //       {
  //         toValue: 80, // Animate to opacity: 1 (opaque)
  //         duration: 1500, // Make it take a while
  //         useNativeDriver: false,
  //       },
  //     ).start(() => {
  //       // Reset value after animation completes
  //       width.setValue(80);
  //       animate(); // Repeat animation
  //     });
  //   };

  //   animate(); // Start animation
  // }, []);

  // useEffect(() => {
  //   const animate = () => {
  //     Animated.timing(
  //       height, // The animated value to drive
  //       {
  //         toValue: 90, // Animate to opacity: 1 (opaque)
  //         duration: 1500, // Make it take a while
  //         useNativeDriver: false,
  //       },
  //     ).start(() => {
  //       // Reset value after animation completes
  //       // height.setValue(60);
  //       animate1(); // Repeat animation
  //     }); // Starts the animation
  //   };

  //   const animate1 = () => {
  //     Animated.timing(
  //       height, // The animated value to drive
  //       {
  //         toValue: 40, // Animate to opacity: 1 (opaque)
  //         duration: 1500, // Make it take a while
  //         useNativeDriver: false,
  //       },
  //     ).start(() => {
  //       // Reset value after animation completes
  //       height.setValue(40);
  //       animate(); // Repeat animation
  //     });
  //   };
  //   animate();
  // }, []);

  useEffect(() => {
    const onGetLogoValue = async () => {
      try {
        const response = await onGetSplashLogoApi();
        if (response.data) {
          console.log('onGetProfileApi Data>>>>', response.data);
          response.data.forEach(item => {
            if (item.name === 'LOGO') {
              setLogoImage(item.images);
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    onGetLogoValue(); // Fetch logo image from API

    // Start animation after logo image is fetched
    const animate = () => {
      Animated.timing(
        width, // The animated value to drive
        {
          toValue: 220, // Animate to opacity: 1 (opaque)
          duration: 1500, // Make it take a while
          useNativeDriver: false,
        },
      ).start(() => {
        // Reset value after animation completes
        // width.setValue(100);
        animate1(); // Repeat animation
      });
    };

    const animate1 = () => {
      Animated.timing(
        width, // The animated value to drive
        {
          toValue: 130, // Animate to opacity: 1 (opaque)
          duration: 1500, // Make it take a while
          useNativeDriver: false,
        },
      ).start(() => {
        // Reset value after animation completes
        width.setValue(130);
        animate(); // Repeat animation
      });
    };

    const animate2 = () => {
      Animated.timing(
        height, // The animated value to drive
        {
          toValue: 120, // Animate to opacity: 1 (opaque)
          duration: 1500, // Make it take a while
          useNativeDriver: false,
        },
      ).start(() => {
        // Reset value after animation completes
        // height.setValue(60);
        animate3(); // Repeat animation
      }); // Starts the animation
    };

    const animate3 = () => {
      Animated.timing(
        height, // The animated value to drive
        {
          toValue: 80, // Animate to opacity: 1 (opaque)
          duration: 1500, // Make it take a while
          useNativeDriver: false,
        },
      ).start(() => {
        // Reset value after animation completes
        height.setValue(80);
        animate2(); // Repeat animation
      });
    };
    if (logoImage) {
      animate(); // Start animation only if logoImage is available
    }
    if (logoImage) {
      animate2();
    }
  }, [logoImage]);

  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      <View style={styles.container}>
        {/* <Image
          source={{
            uri: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWZramx3a2VrdXBleGR0d2Z2aThudzY3MGowMGoxbW80c2VzNGpxdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bBhwav1nxQHhXJakIq/giphy.gif',
          }}
          style={styles.imageView}
        /> */}
        {logoImage ? (
          <Animated.Image
            source={{uri: logoImage}}
            style={{
              width: width,
              height: height,
              position: 'absolute',
              resizeMode: 'contain',
            }}
          />
        ) : (
          <Animated.Image
            source={require('../../images/logo.png')}
            style={{
              width: width,
              height: height,
              position: 'absolute',
              resizeMode: 'contain',
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
