import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  TouchableHighlight,
  Linking,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import Header from '../../components/Header';
import {hasNotch} from 'react-native-device-info';
import {COLORS} from '../../utils';
import coin13 from '../../images/coin13.png';
import bitcoin from '../../images/bitcoin.png';
import bitcoin1 from '../../images/bitcoin1.png';
import bitcoin2 from '../../images/bitcoin2.png';
import bitcoin3 from '../../images/bitcoin3.png';
import check from '../../images/check.png';
import {
  onGetActivePackageDataApi,
  onGetCustomerDetailsDataApi,
  onGetExtraPaymentDetailsDataApi,
  onGetPackageDataApi,
  onGetPaymentDetailsDataApi,
  onPostApplePayApi,
  onPostGenerateInvoiceApi,
  onPostGenerateWalletApi,
} from '../../services/Api';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import arrowUp from '../../images/arrowUp.png';
import down from '../../images/down.png';
import {BuyPopup} from '../../components/BuyPopup';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import * as RNIap from 'react-native-iap';
import {useDispatch} from 'react-redux';
import {
  fetchAIAutoManualData,
  fetchAutoManualData,
  fetchBotLeadData,
  fetchLastLeadData,
} from '../../redux/reducer';
import {SubscriptionPopup} from '../../components/SubscriptionPopup';
import RNRestart from 'react-native-restart';
import {useTheme} from '../../utils/ThemeProvider';
import {portraitStyles, landscapeStyles} from './styles';
import useOrientation from '../../components/OrientationComponent';

const PlanList = [coin13, bitcoin, bitcoin1, bitcoin2, bitcoin3];

const colorList = [
  'rgb(255,246,209)',
  'rgb(255,235,242)',
  'rgb(255,231,215)',
  'rgb(219,223,249)',
  'rgb(227,217,242)',
];

const colorTextList = ['#edcc45', '#f58c8c', '#e68240', '#596deb', '#8e51e8'];

let nextUrl = '';

// const skusItem = Platform.select({
//   ios: ['indicatorleads'],
//   android: ['android.indicatorleads'],
// });

const skusItem = Platform.select({
  ios: ['com.indicator'],
  android: ['android.indicatorleads'],
});

let planId = '';
let paymentName = '';

const PlanScreen = ({navigation}) => {
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [dataActive, setDataActive] = useState([]);
  const [dataActiveSort, setDataActiveSort] = useState([]);
  const [planListData, setPlanListData] = useState([]);
  const [packagesActive, setPackagesActive] = useState(null);
  const [dateSort, setDateSort] = useState(0);
  const [coinSort, setCoinSort] = useState(0);
  const [amountSort, setAmountSort] = useState(0);
  const [txnIdSort, setTxnIdSort] = useState(0);
  const [statusSort, setStatusSort] = useState(0);
  const [modelVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [planId, setPlanId] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [isPressArray, setIsPressArray] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [keyStore, setKeyStore] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isFooterLoader, setIsFooterLoader] = useState(false);
  const [products, setProducts] = useState([]);
  const [PaymentVisible, setPaymentVisible] = useState(false);
  const [deleteOnPress, setDeleteOnPress] = useState(false);
  const [deleteData, setDeleteData] = useState('');
  const [cancelPopup, setCancelPopup] = useState(false);
  // const [paymentName, setPaymentName] = useState('');

  const scrollRef = useRef(null);

  useEffect(() => {
    const connectionData = async () => {
      try {
        console.log('Initializing IAP connection...');
        const result = await RNIap.initConnection();
        console.log('IAP connection result:', result, skusItem);
        if (Array.isArray(skusItem) && skusItem.length > 0) {
          // const productList = await RNIap.getProducts({skus: skusItem});
          const productList = await RNIap.getSubscriptions({skus: skusItem});
          console.log('IAP connection result:', productList);
          setProducts(productList);
        } else {
          throw new Error('The "skus" array is either empty or not an array.');
        }
      } catch (err) {
        console.log('Error during connection initialization: ', err);
        // alert('Failed to initialize in-app purchases. Please try again.');
      }
    };

    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      connectionData();
    }

    return () => {
      RNIap.endConnection();
    };
  }, []);

  useEffect(() => {
    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async purchase => {
        console.log('get Variable:::', purchase);
        // Handle the purchase update here
        if (purchase.transactionReceipt) {
          try {
            const isReceiptValid = await validateReceiptWithServer(
              purchase.transactionReceipt,
            );
            await RNIap.finishTransaction(purchase);
            // if (isReceiptValid) {
            //   // Finish the transaction (for Android or consumable products)
            //   await RNIap.finishTransaction(purchase);
            //   let raw = JSON.stringify({
            //     package_id: planId,
            //     pay_currency: 'APPLE_PAY',
            //   });
            //   const purchaseResponse = await onPostApplePayApi(raw);
            //   if (purchaseResponse.data) {
            //     onGetActivePackageData();
            //     setPaymentVisible(false);
            //   } else {
            //     setPaymentVisible(false);
            //   }
            //   // Notify the user or update your app state
            //   Alert.alert(
            //     'Purchase Successful',
            //     'Your subscription is now active!',
            //   );
            // } else {
            //   Alert.alert('Purchase Failed', 'Receipt validation failed.');
            // }
            setPaymentVisible(false);
          } catch (err) {
            setPaymentVisible(false);
            console.warn('Error handling purchase:', err);
          }
        }
      },
    );
    const purchaseErrorSubscription = RNIap.purchaseErrorListener(error => {
      console.warn('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    });
    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
    };
  }, []);

  const validateReceiptWithServer = async receipt => {

    return true; // Simulating success
  };

  const requestPurchase = async (sku, id) => {
    try {
      console.log('plan Data>>', planId);
      setPaymentVisible(true);
      // await RNIap.requestPurchase({sku: sku});
      // const subscriptions = await RNIap.getAvailablePurchases();
      // const activeSubscription = subscriptions.find(
      //   purchase => purchase.productId === sku,
      // );
      // console.log('get Subscription data::', subscriptions);
      // if (activeSubscription) {
      //   let raw = JSON.stringify({
      //     package_id: id,
      //     pay_currency: 'APPLE_PAY',
      //   });
      //   const purchaseResponse = await onPostApplePayApi(raw);
      //   if (purchaseResponse.data) {
      //     onGetActivePackageData();
      //   } else {
      //     setPaymentVisible(false);
      //   }
      //   Alert.alert(
      //     'Subscription Successful',
      //     'Your subscription is now active!',
      //   );
      // } else {
      const subscription = await RNIap.requestSubscription({sku: sku});
      // Alert.alert('', subscription);
      if (subscription.transactionReceipt) {
        // Finish the transaction (for Android or consumable products)
        // await RNIap.finishTransaction(subscription);
        let raw = JSON.stringify({
          package_id: planId,
          pay_currency: 'APPLE_PAY',
        });
        const purchaseResponse = await onPostApplePayApi(raw);
        if (purchaseResponse.data) {
          // onPlanActiveData();
          onGetActivePackageData();
        } else {
          setPaymentVisible(false);
        }
        // Notify the user or update your app state
        Alert.alert(
          'Subscription Successful',
          'Your subscription is now active!',
          [{text: 'OK', onPress: () => RNRestart.restart()}],
        );
      } else {
        setPaymentVisible(false);
        Alert.alert('Subscription Failed', 'Receipt validation failed.');
      }
      // }
    } catch (err) {
      // alert(err);
      setPaymentVisible(false);
      console.warn('Error requesting purchase: ', err);
    }
  };

  const getItems = async id => {
    try {
      // setPlanId(id);
      console.log('plan Data>>', planId, paymentName, id);
      // const products = await RNIap.getProducts(itemSkus);
      // console.log('Products[0]', products[0]);
      requestPurchase(skusItem[0], id);
    } catch (err) {
      console.log('getItems || purchase error => ', err);
    }
  };

  useEffect(() => {
    onGetPackageData();
    onGetActivePackageData();
    onGetPaymentDetailsData();
    if (isFocused) {
      const interval = setInterval(onGetPaymentDetailsData, 17000);
      // Cleanup function to clear the interval
      return () => clearInterval(interval);
    }
    if (isFocused) {
      const interval = setInterval(onGetActivePackageData, 20000);
      // Cleanup function to clear the interval
      return () => clearInterval(interval);
    }
  }, [isFocused]);

  const onPlanActiveData = async () => {
    try {
      const response4 = await onGetCustomerDetailsDataApi();
      console.log('onGetCustomerDetailsDataApi::');
      if (response4.data) {
        dispatch(
          fetchAutoManualData(response4.data.user_crypto_for_auto_bot_config),
        );
        dispatch(
          fetchAIAutoManualData(response4.data.user_crypto_for_ai_bot_config),
        );
        let allData = [];
        response4.data?.trading_view_alerts.map((item, index) => {
          if (index < 100) {
            allData.push(item);
          }
        });
        // console.log('onGetMarqueeApi Data>>>>', response4.data.trading_view_alerts);
        dispatch(fetchLastLeadData(allData));
        dispatch(fetchBotLeadData(response4.data?.custom_trading_view_alert));
        const endDate = new Date(response4.data.user_current_package.end_date);
        const now = new Date();
        const difference = endDate.getTime() - now.getTime();
        const remainingDays = Math.ceil(difference / (1000 * 60 * 60 * 24));
        console.log('get time period>>', remainingDays);
        AsyncStorage.setItem('timePeriod', `${remainingDays}`);
      }
    } catch (err) {
      console.log('onGetAutoManualDataApi::', err.response.data[0]);
      if (
        err.response.data[0] ==
        'No active Package Found Please recharge and try again...'
      ) {
        AsyncStorage.setItem('timePeriod', `${0}`);
      }
    }
  };

  const onGetPackageData = async () => {
    try {
      let deleteStore = await AsyncStorage.getItem('deleteVisible');
      if (deleteStore != null) {
        setDeleteData(deleteStore);
      }
      let count = await AsyncStorage.getItem('notificationCount');
      setNotificationCount(count);
      const response = await onGetPackageDataApi();
      if (response.data) {
        response.data.map((item, index) => {
          if (index == 1) {
            item.features.map((item1, index1) => {
              if (index1 > 0) {
                keyStore.push(item1.key);
              }
            });
          }
        });
        setPlanListData(response.data);
      }
    } catch (err) {
      console.log('Error:', err);
    }
  };

  const onGetActivePackageData = async () => {
    try {
      const response = await onGetActivePackageDataApi();
      if (response.data) {
        setPackagesActive(response.data);
        setIsLoading(!isLoading);
      }
      setPaymentVisible(false);
    } catch (err) {
      setPaymentVisible(false);
      console.log('Error:', err);
    }
  };

  const onGetPaymentDetailsData = async () => {
    try {
      const response = await onGetPaymentDetailsDataApi();
      if (response.data?.results) {
        // setNextUrl(response.data.next);

        setDataActive(response.data?.results);
        setIsPressArray(Array(response.data?.results.length).fill(false));
        setDataActiveSort(response.data?.results);
        // onGetExtraHistoryData(response.data.next);
        setRefresh(!refresh);
        nextUrl = response.data.next;
      }
    } catch (err) {
      console.log('Error:', err);
    }
  };

  const openSubscriptionManagementPage = async () => {
    // const url =
    //   Platform.OS === 'ios'
    //     ? 'https://apps.apple.com/account/subscriptions'
    //     : 'https://play.google.com/store/account/subscriptions';
    // Linking.openURL(url).catch(err => {
    //   Alert.alert(
    //     'Error',
    //     'Failed to open the subscription settings. Please try again later.',
    //   );
    //   console.error('Failed to open URL:', err);
    // });
    setDeleteOnPress(true);
    if (Platform.OS === 'ios') {
      await RNIap.clearTransactionIOS();
    }
    setTimeout(() => {
      AsyncStorage.setItem('deleteVisible', 'false');
      setDeleteOnPress(false);
      setDeleteData('false');
      setCancelPopup(false);
    }, 3000);
  };

  const customSort = (a, b) => {
    // Convert strings to lowercase for case-insensitive comparison
    const stringA = a.payment[0]?.pay_currency.toLowerCase();
    const stringB = b.payment[0]?.pay_currency.toLowerCase();

    let index = 0;
    while (index < stringA.length && index < stringB.length) {
      if (stringA[index] !== stringB[index]) {
        return stringA.charCodeAt(index) - stringB.charCodeAt(index);
      }
      index++;
    }
    // If the characters are the same up to the length of the shorter string,
    // the shorter string should come first
    return stringA.length - stringB.length;
  };

  const firstSorting = async from => {
    if (from === 'Date') {
      if (dateSort === 2) {
        setCoinSort(0);
        setDateSort(0);
        setAmountSort(0);
        setStatusSort(0);
        setTxnIdSort(0);
      } else {
        setDateSort(dateSort + 1);
        setCoinSort(0);
        setAmountSort(0);
        setStatusSort(0);
        setTxnIdSort(0);
      }
      if (dateSort + 1 === 1) {
        const sortedDates = dataActive
          .sort(
            (a, b) =>
              new Date(a.payment[0]?.created_at) -
              new Date(b.payment[0]?.created_at),
          )
          .reverse();
        setDataActive(sortedDates);
      } else if (dateSort + 1 === 2) {
        const sortedDates = dataActive.sort(
          (a, b) =>
            new Date(a.payment[0]?.created_at) -
            new Date(b.payment[0]?.created_at),
        );
        setDataActive(sortedDates);
      } else {
        setDataActive(dataActiveSort);
      }
    } else if (from === 'Coin') {
      if (coinSort === 2) {
        setCoinSort(0);
        setDateSort(0);
        setAmountSort(0);
        setStatusSort(0);
        setTxnIdSort(0);
      } else {
        setCoinSort(coinSort + 1);
        setDateSort(0);
        setAmountSort(0);
        setStatusSort(0);
        setTxnIdSort(0);
      }
      if (coinSort + 1 === 1) {
        const sortedDates = dataActive.sort(customSort).reverse();
        setDataActive(sortedDates);
      } else if (coinSort + 1 === 2) {
        const sortedDates = dataActive.sort(customSort);
        setDataActive(sortedDates);
      } else {
        setDataActive(dataActiveSort);
      }
    } else if (from === 'Amount') {
      if (amountSort === 2) {
        setCoinSort(0);
        setDateSort(0);
        setAmountSort(0);
        setStatusSort(0);
        setTxnIdSort(0);
      } else {
        setAmountSort(amountSort + 1);
        setCoinSort(0);
        setDateSort(0);
        setStatusSort(0);
        setTxnIdSort(0);
      }
      if (amountSort + 1 === 1) {
        const sortedDates = dataActive
          .sort(
            (a, b) => a.payment[0]?.price_amount - b.payment[0]?.price_amount,
          )
          .reverse();
        setDataActive(sortedDates);
      } else if (amountSort + 1 === 2) {
        const sortedDates = dataActive.sort(
          (a, b) => a.payment[0]?.price_amount - b.payment[0]?.price_amount,
        );
        setDataActive(sortedDates);
      } else {
        setDataActive(dataActiveSort);
      }
    } else if (from === 'TxnId') {
      if (txnIdSort === 2) {
        setCoinSort(0);
        setDateSort(0);
        setAmountSort(0);
        setStatusSort(0);
        setTxnIdSort(0);
      } else {
        setTxnIdSort(txnIdSort + 1);
        setCoinSort(0);
        setDateSort(0);
        setAmountSort(0);
        setStatusSort(0);
      }
      if (txnIdSort + 1 === 1) {
        const sortedDates = dataActive
          .sort((a, b) => a.payment[0]?.payment_id - b.payment[0]?.payment_id)
          .reverse();
        setDataActive(sortedDates);
      } else if (txnIdSort + 1 === 2) {
        const sortedDates = dataActive.sort(
          (a, b) => a.payment[0]?.payment_id - b.payment[0]?.payment_id,
        );
        setDataActive(sortedDates);
      } else {
        setDataActive(dataActiveSort);
      }
    } else if (from === 'Status') {
      if (statusSort === 2) {
        setStatusSort(0);
        setCoinSort(0);
        setDateSort(0);
        setAmountSort(0);
        setTxnIdSort(0);
      } else {
        setStatusSort(statusSort + 1);
        setCoinSort(0);
        setDateSort(0);
        setAmountSort(0);
        setTxnIdSort(0);
      }
      const customOrder = {pending: 1, failed: 2, confirm: 3};
      if (statusSort + 1 === 1) {
        const sortedDates = dataActive.sort(
          (a, b) =>
            customOrder[a.payment[0]?.display_status] -
            customOrder[b.payment[0]?.display_status],
        );
        setDataActive(sortedDates);
      } else if (statusSort + 1 === 2) {
        const sortedDates = dataActive
          .sort(
            (a, b) =>
              customOrder[a.payment[0]?.display_status] -
              customOrder[b.payment[0]?.display_status],
          )
          .reverse();
        setDataActive(sortedDates);
      } else {
        setDataActive(dataActiveSort);
      }
    }
  };

  const handleShowUnderlay = index => {
    setIsPressArray(prevState => {
      const newState = [...prevState];
      newState.map((item, index1) => {
        if (index1 == index) {
          newState[index1] = true;
        } else {
          newState[index1] = false;
        }
      });
      return newState;
    });
  };

  const handleSearch = text => {
    setSearch(text);
    if (text !== '') {
      const filtered = dataActiveSort.filter(item =>
        item.payment[0]?.pay_currency != null && item.payment[0]?.pay_currency.toLowerCase().includes(text.toLowerCase()),
      );
      setDataActive(filtered);
      setRefresh(!refresh);
    } else {
      setDataActive(dataActiveSort);
      setRefresh(!refresh);
    }
  };

  const renderFooter = () => {
    return (
      <View
        style={{
          height: hp(5),
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  const onGetExtraHistoryData = async nextUrl => {
    try {
      if (!isFooterLoader && nextUrl != '') {
        setIsFooterLoader(true);
        console.log('Get Value Url::::', nextUrl);
        const response = await onGetExtraPaymentDetailsDataApi(nextUrl);
        if (response.data.results) {
          // setDataHistory(response.data.history_trade_list.results);
          setDataActive(prevDataActive => [...prevDataActive, ...response.data.results]);
          setDataActiveSort(prevDataActive => [...prevDataActive, ...response.data.results]);
          // response.data?.results.map(item => {
          //   dataActive.push(item);
          //   dataActiveSort.push(item);
          // });
          nextUrl = response.data.next;
          setIsFooterLoader(false);
          // setNextUrl(response.data.next);
        } else {
          setIsFooterLoader(false);
        }
      }
    } catch (err) {
      setIsFooterLoader(false);
      // alert(err.response.data.detail);
    }
  };

  const onBuyClick = async () => {
    console.log('Response Balance>>', selectedItem);
    try {
      if (selectedItem == 'WALLET') {
        setIsLoading(true);
        let getCurrency = selectedItem.split(' ( ');
        console.log('Response Balance>>', getCurrency[0]);
        let raw = JSON.stringify({
          package_id: planId,
          pay_currency: 'SITE_WALLET',
        });
        const response = await onPostGenerateWalletApi(raw);
        console.log('Response Balance>>', response.data);
        if (response.data) {
          setModalVisible(false);
          onGetActivePackageData();
          // Linking.openURL(response.data.payment_url);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(true);
        let getCurrency = selectedItem.split(' ( ');
        console.log('Response Balance>>', getCurrency[0]);
        let raw = JSON.stringify({
          package_id: planId,
          pay_currency: getCurrency[0],
        });
        const response = await onPostGenerateInvoiceApi(raw);
        console.log('Response Balance>>', response.data);
        if (response.data) {
          setModalVisible(false);
          Linking.openURL(response.data.payment_url);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }
    } catch (err) {
      setIsLoading(false);
      console.log('Error:', err.response.data);
      // alert(err.response.data.detail);
    }
  };

  return (
    <View style={styles.safeAreaStyle}>
      <View
        style={{
          width: '100%',
          height: hasNotch() ? hp(5) : 0,
          backgroundColor: COLORS.white,
        }}
      />
      <View style={[styles.container, {backgroundColor: theme.appBackground}]}>
        <View style={styles.headerView}>
          {/* <SubHeader title={'Plans'} onPress={() => navigation.goBack()} /> */}
          <Header
            title={t('plans')}
            backVisible={true}
            notificationPress={() =>
              navigation.navigate('NotificationScreen', {
                count: notificationCount,
              })
            }
            notificationCount={notificationCount}
            onPress={() => navigation.goBack()}
            navigation={navigation}
          />
        </View>
        <View style={styles.mainView}>
          <KeyboardAwareScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(15)}}>
            <Image
              style={styles.bgImage}
              source={require('../../images/disc_img.png')}
            />

            <View style={styles.noteBox}>
              <Text style={styles.selectCoinText}>
                <Text>*</Text>
                {
                  'This plan is auto-renew purchase. if you want remove plan from subscription.'
                }
              </Text>
            </View>
            <View style={styles.planView}>
              {planListData.map((item, index) => {
                const endDate = new Date(packagesActive?.end_date);
                const now = new Date();
                const difference = endDate.getTime() - now.getTime();
                const remainingDays = Math.ceil(
                  difference / (1000 * 60 * 60 * 24),
                );
                if (index < 3) {
                  return (
                    <View
                      key={item.price}
                      style={[
                        styles.mainPlanView,
                        {backgroundColor: theme.appBackground},
                      ]}>
                      <View
                        style={[
                          styles.planFirstView,
                          {
                            backgroundColor:
                              colorList[index % colorList.length],
                          },
                        ]}>
                        <View style={[styles.titleView, {paddingLeft: wp(3)}]}>
                          <View
                            style={[
                              styles.horizonalView,
                              {width: isPortrait ? wp(56) : '55%'},
                            ]}>
                            <View style={{marginTop: hp(0.5)}}>
                              <Text
                                style={[
                                  styles.titleText,
                                  {
                                    color:
                                      colorTextList[
                                        index % colorTextList.length
                                      ],
                                  },
                                ]}>
                                {item.name}
                                {/* <Text
                                  style={[
                                    styles.desText,
                                    {
                                      color:
                                        colorTextList[index % colorTextList.length],
                                    },
                                  ]}>
                                  {`  (${item?.features[item?.features.length - 1]?.int_value} Bot)`}
                                </Text> */}
                              </Text>
                              {index == 1 ? (
                                <Text style={[styles.desText]}>
                                  $19.98 /
                                  {item.duration == 'month'
                                    ? '28 Days'
                                    : `${item.period} Days`}
                                </Text>
                              ) : (
                                <Text style={[styles.desText]}>
                                  ${item.price} /
                                  {item.duration == 'month'
                                    ? '28 Days'
                                    : `${item.period} Days`}
                                </Text>
                              )}
                              <View style={{marginTop: hp(1)}}>
                                {index == 0 && (
                                  <View style={styles.optionDataView}>
                                    <Text style={[styles.msgText1]}>
                                      {'7 Days Trial'}
                                    </Text>
                                  </View>
                                )}
                                {index == 2 && (
                                  <View style={styles.optionDataView}>
                                    <Image
                                      style={styles.checkImage}
                                      source={check}
                                    />
                                    <Text
                                      style={[
                                        styles.msgText,
                                        {
                                          color:
                                            colorTextList[
                                              index % colorTextList.length
                                            ],
                                        },
                                      ]}>
                                      {'All Features Of Silver Plan'}
                                    </Text>
                                  </View>
                                )}
                                {item.features.map((item1, index1) => {
                                  if (index1 > 0) {
                                    if (index == 2) {
                                      const isKeyPresent = keyStore.some(
                                        item2 => item2 === item1.key,
                                      );
                                      // If item1.key is not present in keyStore, show the item
                                      if (!isKeyPresent) {
                                        return (
                                          <View style={styles.optionDataView}>
                                            <Image
                                              style={styles.checkImage}
                                              source={check}
                                            />
                                            <Text
                                              style={[
                                                styles.msgText,
                                                {
                                                  color:
                                                    colorTextList[
                                                      index %
                                                        colorTextList.length
                                                    ],
                                                },
                                              ]}>
                                              {item1.char_value == ''
                                                ? item1.key
                                                : item1.char_value}
                                            </Text>
                                          </View>
                                        );
                                      }
                                    } else {
                                      return (
                                        <View style={styles.optionDataView}>
                                          <Image
                                            style={styles.checkImage}
                                            source={check}
                                          />
                                          <Text
                                            style={[
                                              styles.msgText,
                                              {
                                                color:
                                                  colorTextList[
                                                    index % colorTextList.length
                                                  ],
                                              },
                                            ]}>
                                            {item1.char_value == ''
                                              ? item1.key
                                              : item1.char_value}
                                          </Text>
                                        </View>
                                      );
                                    }
                                  }
                                })}
                              </View>
                            </View>
                            <View style={styles.buttonHorizontalView}>
                              <>
                                {item.name != packagesActive?.name &&
                                item.name == 'TRIAL' ? (
                                  <TouchableOpacity
                                    disabled={
                                      PaymentVisible ||
                                      item.name === packagesActive?.name
                                        ? true
                                        : false
                                    }
                                    onPress={() => {
                                      if (Platform.OS == 'android') {
                                        planId = item.id;
                                        paymentName = item.name;
                                        setModalVisible(true);
                                        setIsLoading(!isLoading);
                                      } else {
                                        planId = item.id;
                                        paymentName = item.name;
                                        setPaymentVisible(true);
                                        setIsLoading(!isLoading);
                                        getItems(item.id);
                                      }
                                    }}
                                    style={[
                                      styles.activeButton,
                                      {
                                        height: hp(4.5),
                                        backgroundColor: COLORS.orange,
                                      },
                                    ]}>
                                    {PaymentVisible &&
                                    paymentName == item.name ? (
                                      <ActivityIndicator
                                        size="small"
                                        color={COLORS.white}
                                      />
                                    ) : (
                                      <Text style={styles.activeText}>
                                        {t('expired')}
                                      </Text>
                                    )}
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    disabled={
                                      PaymentVisible ||
                                      item.name === packagesActive?.name
                                        ? true
                                        : false
                                    }
                                    onPress={() => {
                                      if (Platform.OS == 'android') {
                                        planId = item.id;
                                        paymentName = item.name;
                                        setModalVisible(true);
                                        setIsLoading(!isLoading);
                                      } else {
                                        paymentName = item.name;
                                        planId = item.id;
                                        setPaymentVisible(true);
                                        setIsLoading(!isLoading);
                                        getItems(item.id);
                                      }
                                    }}
                                    style={[
                                      styles.activeButton,
                                      {
                                        height:
                                          item.name === packagesActive?.name
                                            ? hp(4.5)
                                            : hp(4.5),
                                        backgroundColor:
                                          item.name === packagesActive?.name
                                            ? COLORS.greenColor
                                            : COLORS.primary,
                                      },
                                    ]}>
                                    {PaymentVisible &&
                                    paymentName == item.name ? (
                                      <ActivityIndicator
                                        size="small"
                                        color={COLORS.white}
                                      />
                                    ) : (
                                      <Text style={styles.activeText}>
                                        {item.name === packagesActive?.name
                                          ? t('active')
                                          : t('buy_now')}
                                      </Text>
                                    )}
                                  </TouchableOpacity>
                                )}
                                {/* {item.name == packagesActive?.name &&
                                  deleteData == '' &&
                                  item.name != 'TRIAL' && (
                                    <TouchableOpacity
                                      onPress={() => setCancelPopup(true)}
                                      style={[
                                        styles.cancelButton,
                                        {
                                          height: hp(4.5),
                                          backgroundColor: COLORS.errorColor,
                                        },
                                      ]}>
                                      {deleteOnPress ? (
                                        <ActivityIndicator
                                          size="small"
                                          color={COLORS.white}
                                        />
                                      ) : (
                                        <Text style={styles.activeText}>
                                          {'Cancel Subscription'}
                                        </Text>
                                      )}
                                    </TouchableOpacity>
                                  )} */}
                              </>
                            </View>
                          </View>
                          <View
                            style={[
                              styles.horizonalView,
                              {width: isPortrait ? wp(33) : '33%'},
                            ]}>
                            <View
                              style={{
                                marginTop: hp(1),
                                justifyContent: 'center',
                                height: hp(8),
                              }}>
                              <Text style={[styles.desText]}>
                                {
                                  item?.features[item?.features.length - 1]
                                    ?.int_value
                                }
                                {' Bot'}
                              </Text>
                              {item.name === packagesActive?.name && (
                                <Text
                                  style={[
                                    styles.desText,
                                    {color: COLORS.apiError},
                                  ]}>
                                  {`${remainingDays} Days Left`}
                                </Text>
                              )}
                            </View>
                            <Image
                              style={[
                                styles.coinImage,
                                {alignSelf: 'flex-end'},
                              ]}
                              source={PlanList[index % PlanList.length]}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                }
              })}
            </View>
            <View
              style={[styles.extraView, {backgroundColor: theme.appBackground}]}
            />
            <View style={styles.privacyView}>
              <Text
                style={styles.privacyText}
                onPress={() => {
                  Linking.openURL('https://indicatorleads.com/privacy-policy');
                }}>
                {'\u2022'} Privacy Policy
              </Text>
              <Text
                style={[styles.privacyText, {marginLeft: wp(3)}]}
                onPress={() => {
                  Linking.openURL('https://indicatorleads.com/terms-of-use');
                }}>
                {'\u2022'} Terms of Use
              </Text>
            </View>
            <TextInput
              value={search}
              onChangeText={text => handleSearch(text)}
              placeholder={t('search_coin')}
              placeholderTextColor={COLORS.greyColor}
              style={styles.searchText}
            />

            <View style={styles.activeView}>
              <ScrollView
                bounces={false}
                horizontal
                showsHorizontalScrollIndicator={false}>
                <View>
                  <View style={styles.titleActiveView}>
                    <TouchableOpacity
                      onPress={() => firstSorting('Date')}
                      style={[
                        styles.optionTitleView,
                        {width: isPortrait ? wp(25) : wp(15)},
                      ]}>
                      <Text style={styles.titleText1}>{t('small_date')}</Text>
                      {dateSort === 0 || dateSort === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {dateSort === 0 || dateSort === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => firstSorting('Coin')}
                      style={[
                        styles.optionTitleView,
                        {width: isPortrait ? wp(27) : wp(18)},
                      ]}>
                      <Text style={styles.titleText1}>{t('coin1')}</Text>
                      {coinSort === 0 || coinSort === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {coinSort === 0 || coinSort === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => firstSorting('Amount')}
                      style={[
                        styles.optionTitleView,
                        {width: isPortrait ? wp(27) : wp(14)},
                      ]}>
                      <Text style={styles.titleText1}>{t('amount')}</Text>
                      {amountSort === 0 || amountSort === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {amountSort === 0 || amountSort === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => firstSorting('TxnId')}
                      style={[
                        styles.optionTitleView,
                        {width: isPortrait ? wp(30) : wp(12)},
                      ]}>
                      <Text style={styles.titleText1}>{t('txn_id')}</Text>
                      {txnIdSort === 0 || txnIdSort === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {txnIdSort === 0 || txnIdSort === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => firstSorting('Status')}
                      style={[
                        styles.optionTitleView,
                        {width: isPortrait ? wp(25) : wp(13)},
                      ]}>
                      <Text style={styles.titleText1}>{t('status')}</Text>
                      {statusSort === 0 || statusSort === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {statusSort === 0 || statusSort === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={dataActive}
                    extraData={dataActive}
                    initialNumToRender={5000000}
                    onEndReachedThreshold={0.0001}
                    bounces={false}
                    // onEndReached={() => onGetExtraHistoryData(nextUrl)}
                    ListFooterComponent={isFooterLoader ? renderFooter : null}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                    // contentContainerStyle={{paddingBottom: hp(1)}}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={() => (
                      <View style={{marginVertical: hp(10)}}>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              paddingTop: 15,
                              color: COLORS.darkGreen,
                              fontSize: 16,
                            }}>
                            {t('no_records_available')}
                          </Text>
                        </View>
                      </View>
                    )}
                    renderItem={({item, index}) => {
                      // if (item.payment[0]?.pay_currency != null) {
                      return (
                        <TouchableHighlight
                          onShowUnderlay={() => handleShowUnderlay(index)}
                          activeOpacity={1}
                          onPress={() => console.log('hello')}
                          underlayColor={COLORS.lightPrimary2}>
                          <View
                            style={[
                              styles.dataActiveView,
                              {
                                backgroundColor: isPressArray[index]
                                  ? COLORS.lightPrimary2
                                  : COLORS.white,
                              },
                            ]}
                            key={item.id}>
                            <Text
                              style={[
                                styles.dataText1,
                                {width: isPortrait ? wp(25) : wp(15)},
                              ]}>
                              {moment(item.payment[0]?.created_at).format(
                                'YYYY-MM-DD',
                              )}
                            </Text>
                            <Text
                              style={[
                                styles.dataText1,
                                {width: isPortrait ? wp(27) : wp(18)},
                              ]}>
                              {item.payment[0]?.pay_currency != null
                                ? item.payment[0]?.pay_currency.toUpperCase()
                                : null}
                            </Text>
                            <Text
                              style={[
                                styles.dataText1,
                                {width: isPortrait ? wp(27) : wp(14)},
                              ]}>
                              {item.payment[0]?.price_amount}
                            </Text>
                            <Text
                              style={[
                                styles.dataText1,
                                {width: isPortrait ? wp(30) : wp(12)},
                              ]}>
                              {item.payment[0]?.payment_id}
                            </Text>
                            <Text
                              style={[
                                styles.dataText1,
                                {
                                  width: isPortrait ? wp(25) : wp(13),
                                  color:
                                    item.payment[0]?.display_status == 'failed'
                                      ? COLORS.errorColor
                                      : item.payment[0]?.display_status ==
                                        'pending'
                                      ? COLORS.black
                                      : COLORS.darkGreen,
                                },
                              ]}>
                              {item.payment[0]?.display_status == 'failed'
                                ? 'Failed'
                                : item.payment[0]?.display_status == 'pending'
                                ? 'Pending'
                                : 'Confirm'}
                            </Text>
                          </View>
                        </TouchableHighlight>
                      );
                      // }
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
      <SubscriptionPopup
        modelVisible={cancelPopup}
        setModelVisible={setCancelPopup}
        onPress={() => openSubscriptionManagementPage()}
        deleteOnPress={deleteOnPress}
      />
      <BuyPopup
        modelVisible={modelVisible}
        setModelVisible={setModalVisible}
        onPress={() => onBuyClick()}
        isLoading={isLoading}
        setSelectedItem={value => setSelectedItem(value)}
      />
    </View>
  );
};

export default PlanScreen;
