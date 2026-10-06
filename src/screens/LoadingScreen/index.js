import {View, SafeAreaView, Platform, Image, Animated, PermissionsAndroid} from 'react-native';
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
  fetchSpotCloseOrderList,
  fetchSpotOpenOrderList,
  fetchSpotYahooTicker,
  fetchSttingData,
  fetchTickerData,
  fetchUserDataSuccess,
} from '../../redux/reducer';
import {
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

const LoadingScreen = ({navigation}) => {
  const [logoImage, setLogoImage] = useState('');
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const AuthCheck = async () => {
      const role = await AsyncStorage.getItem('userRole');
      if (role == 'admin') {
        onAdminDataGet();
      } else {
        onAllDataGet();
      }
    };
    AuthCheck();
  }, []);

  // const onCheckAuth = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('accessToken');
  //     if (Platform.OS == 'android') {
  //       const fcmToken = await messaging().getToken();
  //       console.log('Get FCM TOKEN:::', fcmToken);
  //       AsyncStorage.setItem('fcmToken', fcmToken);
  //     }
  //     if (token !== null) {
  //       onAllDataGet();
  //       const notification = await AsyncStorage.getItem('Notify');
  //       if (notification != null) {
  //         let strNotify = JSON.parse(notification);
  //         let count = 0;
  //         strNotify.map((item, index) => {
  //           if (item.readMessage == false) {
  //             count = count + 1;
  //           }
  //         });
  //         dispatch(fetchNotificationCount(count));
  //       }
  //     } else {
  //       navigation.replace('LoginScreen');
  //     }
  //   } catch (err) {
  //     console.log('Error::', err);
  //   }
  // };

  const onAdminDataGet = async () => {
    try {
      try {
        const notification = await onGetCustomerDataApi();
        if (notification.data) {
          let strNotify = notification.data.user_notification;
          let count = 0;
          strNotify.map((item, index) => {
            if (item.recive == false && index < 300) {
              count = count + 1;
            }
          });
          AsyncStorage.setItem('notificationCount', JSON.stringify(count));
          dispatch(fetchNotificationCount(count));
        }
      } catch (err) {
        console.log('onGetProfileApi::', err);
      }
      try {
        const futureResponse = await onGetFuturePriceApi();
        if (futureResponse.data) {
          dispatch(fetchFuturePriceData(futureResponse.data));
        }
      } catch (err) {
        console.log('futureResponse::', err);
      }
      AsyncStorage.setItem('selectedScreen', '');
      const dashboardData = await onGetAdminDashboardApi();
      if (dashboardData.data) {
        dispatch(fetchAdminDashboardList(dashboardData.data));
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
        dispatch(fetchAdminWebNotificationCryptoList(webNotificationCrypto.data));
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
        console.log('onGetProfileApi>>', err);
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
        if (err?.response?.data?.detail) {
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
        // const response2 = await onGetMarqueeApi();
        // if (response2.data) {
        //   console.log('onGetMarqueeApi Data>>>>', response2.data);
        //   dispatch(fetchMarqueeData(response2.data.reverse()));
        // }
      } catch (err) {
        console.log('welcomeVisible>>', err);
      }
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
      //   const response4 = await onGetCustomerDetailsDataApi();
      //   if (response4.data) {
      //     dispatch(
      //       fetchAutoManualData(response4.data.user_crypto_for_auto_bot_config),
      //     );
      //     dispatch(
      //       fetchAIAutoManualData(response4.data.user_crypto_for_ai_bot_config),
      //     );
      //     let allData = [];
      //     response4.data?.trading_view_alerts.map((item, index) => {
      //       if (index < 100) {
      //         allData.push(item);
      //       }
      //     });
      //     // console.log('onGetMarqueeApi Data>>>>', response4.data.trading_view_alerts);
      //     dispatch(fetchLastLeadData(allData));
      //     dispatch(fetchBotLeadData(response4.data?.custom_trading_view_alert));
      //     const endDate = new Date(response4.data.user_current_package.end_date);
      //     const now = new Date();
      //     const difference = endDate.getTime() - now.getTime();
      //     const remainingDays = Math.ceil(difference / (1000 * 60 * 60 * 24));
      //     AsyncStorage.setItem('timePeriod', `${remainingDays}`);
      //   }
      // } catch (err) {
      //   console.log('onGetCustomerDetailsDataApi::', err.response.data);
      // }
      try {
        const response5 = await onGetTickerDataApi();
        if (response5.data?.data) {
          dispatch(fetchTickerData(response5.data?.data));
        }
      } catch (err) {
        console.log('onGetTickerDataApi::', err.response.data);
      }
      try {
        const response6 = await onGetBinanceDataApi();
        if (response6.data) {
          dispatch(fetchBinanceData(response6.data));
        }
      } catch (err) {
        console.log('onGetBinanceDataApi::', err.response.data);
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
      try {
        const responseMenu = await onGetMenuApi();
        if (responseMenu.data?.mobile_menu_injection) {
          dispatch(fetchMenuList(responseMenu.data?.mobile_menu_injection));
        }
      } catch (err) {
        console.log('onGetMenuApi::', err.response.data);
      }
      navigation.replace('TabStack');
      // try {
      // try {
      const notification = await onGetCustomerDataApi();
      if (notification.data) {
        let strNotify = notification.data.user_notification;
        let count = 0;
        strNotify.map((item, index) => {
          if (item.recive == false && index < 300) {
            count = count + 1;
          }
        });
        AsyncStorage.setItem('notificationCount', JSON.stringify(count));
        dispatch(fetchNotificationCount(count));
      }
      // } catch (err) {
      //   console.log('onGetProfileApi::', err);
      // }

      const activeAIStatus = await onGetActiveAIStatusApi();
      if (activeAIStatus.data.active_trade_list) {
        dispatch(fetchAIActiveList(activeAIStatus.data.active_trade_list));
      } else {
        console.log('History Error:', activeAIStatus.data);
      }
      // } catch (err) {
      //   console.log('History Error:', err.response.data);
      //   // alert(err.response.data.detail);
      // }
      // try {
      const DetailAIStatus = await onGetHistoryDetailAIStatusApi();
      if (DetailAIStatus.data.history_trade_list) {
        dispatch(
          fetchAIStatusHistoryList(DetailAIStatus.data.history_trade_list),
        );
      }
      // } catch (err) {
      //   console.log('DetailAIStatus::', err);
      // }
      // try {
      // } catch (err) {
      //   console.log('History Error:', err.response.data);
      //   // alert(err.response.data.detail);
      // }
      // try {
      const HistoryDeta = await onGetHistoryDetailApi();
      if (HistoryDeta.data.history_trade_list) {
        dispatch(fetchHistoryList(HistoryDeta.data.history_trade_list));
      }
      const activeBotStatus = await onGetActiveBotStausApi();
      if (activeBotStatus.data.active_trade_list) {
        dispatch(fetchBotActiveList(activeBotStatus.data.active_trade_list));
      } else {
        console.log('History Error:', activeBotStatus.data);
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
      //   console.log('HistoryDeta::', err);
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
    } catch (err) {
      console.log('Error::', err);
      // setTimeout(() => {
      //   navigation.replace('WiFiScreen');
      // }, 3000);
    }
  };

  const width = new Animated.Value(130);
  const height = new Animated.Value(80);

  useEffect(() => {
    const onGetLogoValue = async () => {
      try {
        const response = await onGetSplashLogoApi();
        if (response.data) {
          console.log('onGetProfileApi Data>>>>', response.data);
          response.data.forEach(item => {
            if (item.name === 'LOADING_SCREEN') {
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

export default LoadingScreen;
