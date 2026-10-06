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
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import styles from './styles';
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
  onGetExtraPaymentDetailsDataApi,
  onGetPackageDataApi,
  onGetPaymentDetailsDataApi,
  onPostGenerateInvoiceApi,
  onPostGenerateWalletApi,
} from '../../services/Api';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import arrowUp from '../../images/arrowUp.png';
import down from '../../images/down.png';
import {BuyPopup} from '../../components/BuyPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import RNIap, {
  Product,
  ProductPurchase,
  acknowledgePurchaseAndroid,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import {useIsFocused} from '@react-navigation/native';

const PlanList = [coin13, bitcoin, bitcoin1, bitcoin2, bitcoin3];

const colorList = [
  'rgb(255,246,209)',
  'rgb(255,235,242)',
  'rgb(255,231,215)',
  'rgb(219,223,249)',
  'rgb(227,217,242)',
];

const colorTextList = ['#edcc45', '#f58c8c', '#e68240', '#596deb', '#8e51e8'];

const itemSkus = Platform.select({
  ios: ['indicatorleads'],
  android: ['android.indicatorleads'],
});

const PlanScreen = ({navigation}) => {
  const {t} = useTranslation();
  const isFocused = useIsFocused();
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
  const [planId, setPlanId] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [isPressArray, setIsPressArray] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [keyStore, setKeyStore] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isFooterLoader, setIsFooterLoader] = useState(false);
  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const connectionData = async () => {
      try {
        console.log('Initializing IAP connection...');
        const result = await RNIap.initConnection();
        console.log('IAP connection result:', result);

        const productList = await RNIap.getProducts(itemSkus);
        setProducts(productList);
      } catch (err) {
        console.log('Error during connection initialization: ', err);
        alert('Failed to initialize in-app purchases. Please try again.');
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
    const purchaseUpdateSubscription = purchaseUpdatedListener(
      async purchase => {
        if (purchase.transactionReceipt) {
          try {
            if (Platform.OS === 'ios') {
              await RNIap.finishTransactionIOS(purchase.transactionId);
            } else if (Platform.OS === 'android') {
              await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
            }
            await RNIap.finishTransaction(purchase);
          } catch (err) {
            console.warn('Error handling purchase:', err);
          }
        }
      },
    );

    const purchaseErrorSubscription = purchaseErrorListener(error => {
      console.warn('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    });

    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
    };
  }, []);

  const requestPurchase = async sku => {
    try {
      await RNIap.requestPurchase(sku);
    } catch (err) {
      console.warn('Error requesting purchase: ', err);
      alert('Purchase request failed. Please try again.');
    }
  };

  const getItems = async () => {
    try {
      console.log('itemSkus[0]', itemSkus[0]);
      requestPurchase(itemSkus[0]);
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
      return () => clearInterval(interval);
    }
    if (isFocused) {
      const interval = setInterval(onGetActivePackageData, 20000);
      return () => clearInterval(interval);
    }
  }, [isFocused]);

  const onGetPackageData = async () => {
    try {
      let count = await AsyncStorage.getItem('notificationCount');
      setNotificationCount(count);
      const response = await onGetPackageDataApi();
      if (response.data) {
        response.data.map((item, index) => {
          if (index === 1) {
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
      }
    } catch (err) {
      console.log('Error:', err);
    }
  };

  const onGetPaymentDetailsData = async () => {
    try {
      const response = await onGetPaymentDetailsDataApi();
      if (response.data?.results) {
        setDataActive(response.data.results);
        setIsPressArray(Array(response.data.results.length).fill(false));
        setDataActiveSort(response.data.results);
        onGetExtraHistoryData(response.data.next);
        setRefresh(!refresh);
        nextUrl = response.data.next;
      }
    } catch (err) {
      console.log('Error:', err);
    }
  };

  const customSort = (a, b) => {
    const stringA = a.payment[0]?.pay_currency.toLowerCase();
    const stringB = b.payment[0]?.pay_currency.toLowerCase();

    let index = 0;
    while (index < stringA.length && index < stringB.length) {
      if (stringA[index] !== stringB[index]) {
        return stringA.charCodeAt(index) - stringB.charCodeAt(index);
      }
      index++;
    }
    return stringA.length - stringB.length;
  };

  const firstSorting = from => {
    if (from === 'Date') {
      if (dateSort === 2) {
        setDateSort(0);
        setCoinSort(0);
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
        setAmountSort(0);
        setCoinSort(0);
        setDateSort(0);
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
        setTxnIdSort(0);
        setCoinSort(0);
        setDateSort(0);
        setAmountSort(0);
        setStatusSort(0);
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

  const onBuyClick = async () => {
    try {
      if (selectedItem === 'WALLET') {
        setIsLoading(true);
        let raw = JSON.stringify({
          package_id: planId,
          pay_currency: 'SITE_WALLET',
        });
        const response = await onPostGenerateWalletApi(raw);
        if (response.data) {
          setModalVisible(false);
          getItems();
          onGetActivePackageData();
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(true);
        let getCurrency = selectedItem.split(' ( ');
        let raw = JSON.stringify({
          package_id: planId,
          pay_currency: getCurrency[0],
        });
        const response = await onPostGenerateInvoiceApi(raw);
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
    }
  };

  const handleHideUnderlay = index => {
    setIsPressArray(prevState => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };

  const handleShowUnderlay = index => {
    setIsPressArray(prevState => {
      const newState = [...prevState];
      newState.map((item, index1) => {
        if (index1 === index) {
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
      const filtered = dataActiveSort.filter(
        item =>
          item.payment[0]?.pay_currency != null &&
          item.payment[0]?.pay_currency
            .toLowerCase()
            .includes(text.toLowerCase()),
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
      if (!isFooterLoader && nextUrl !== '') {
        setIsFooterLoader(true);
        const response = await onGetExtraPaymentDetailsDataApi(nextUrl);
        if (response.data.results) {
          setDataActive(prevDataActive => [
            ...prevDataActive,
            ...response.data.results,
          ]);
          setDataActiveSort(prevDataActive => [
            ...prevDataActive,
            ...response.data.results,
          ]);
          nextUrl = response.data.next;
          setIsFooterLoader(false);
        } else {
          setIsFooterLoader(false);
        }
      }
    } catch (err) {
      setIsFooterLoader(false);
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
      <View style={styles.container}>
        <View className={styles.headerView}>
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
            {planListData.map((item, index) => {
              const endDate = new Date(packagesActive?.end_date);
              const now = new Date();
              const difference = endDate.getTime() - now.getTime();
              const remainingDays = Math.ceil(
                difference / (1000 * 60 * 60 * 24),
              );
              if (index < 3) {
                return (
                  <View key={item.price} style={styles.mainPlanView}>
                    <View
                      style={[
                        styles.planFirstView,
                        {backgroundColor: colorList[index % colorList.length]},
                      ]}>
                      <View
                        style={[styles.titleView, {paddingHorizontal: wp(3)}]}>
                        <View style={[styles.horizonalView, {width: wp(56)}]}>
                          <View style={{marginTop: hp(0.5)}}>
                            <Text
                              style={[
                                styles.titleText,
                                {
                                  color:
                                    colorTextList[index % colorTextList.length],
                                },
                              ]}>
                              {item.name}
                              <Text
                                style={[
                                  styles.desText,
                                  {
                                    color:
                                      colorTextList[
                                        index % colorTextList.length
                                      ],
                                  },
                                ]}>
                                {`  (${item?.features[0]?.int_value} Bot)`}
                              </Text>
                            </Text>
                            {item.name === packagesActive?.name ? (
                              <Text
                                style={[
                                  styles.desText,
                                  {color: COLORS.apiError},
                                ]}>
                                {`${remainingDays} Days Left`}
                              </Text>
                            ) : (
                              <Text style={[styles.desText]}>
                                ${item.price} /
                                {item.duration === 'month'
                                  ? '28 Days'
                                  : item.duration}
                              </Text>
                            )}
                            <View style={{marginTop: hp(1)}}>
                              {index === 0 && (
                                <View style={styles.optionDataView}>
                                  <Text style={[styles.msgText1]}>
                                    {'7 Days Trial'}
                                  </Text>
                                </View>
                              )}
                              {index === 2 && (
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
                                  if (index === 2) {
                                    const isKeyPresent = keyStore.some(
                                      item2 => item2 === item1.key,
                                    );
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
                                                    index % colorTextList.length
                                                  ],
                                              },
                                            ]}>
                                            {item1.char_value}
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
                                          {item1.char_value}
                                        </Text>
                                      </View>
                                    );
                                  }
                                }
                              })}
                            </View>
                          </View>
                          {item.name !== packagesActive?.name &&
                          item.name === 'TRIAL' ? (
                            <TouchableOpacity
                              disabled={item.name === packagesActive?.name}
                              onPress={() => {
                                getItems();
                                setPlanId(item.id);
                              }}
                              style={[
                                styles.activeButton,
                                {
                                  height: hp(5),
                                  backgroundColor: COLORS.orange,
                                },
                              ]}>
                              <Text style={styles.activeText}>
                                {t('expired')}
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              disabled={item.name === packagesActive?.name}
                              onPress={() => {
                                getItems();
                                setPlanId(item.id);
                              }}
                              style={[
                                styles.activeButton,
                                {
                                  height:
                                    item.name === packagesActive?.name
                                      ? hp(5)
                                      : hp(5),
                                  backgroundColor:
                                    item.name === packagesActive?.name
                                      ? COLORS.greenColor
                                      : COLORS.primary,
                                },
                              ]}>
                              <Text style={styles.activeText}>
                                {item.name === packagesActive?.name
                                  ? t('active')
                                  : t('buy_now')}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <View style={[styles.horizonalView, {width: wp(44)}]}>
                          <View
                            style={{
                              marginTop: hp(1),
                              justifyContent: 'center',
                              height: hp(8),
                            }}></View>
                          <Image
                            style={styles.coinImage}
                            source={PlanList[index % PlanList.length]}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }
            })}
            <View style={styles.extraView} />
            <TextInput
              value={search}
              onChangeText={text => handleSearch(text)}
              placeholder={t('search_coin')}
              placeholderTextColor={COLORS.greyColor}
              style={styles.searchText}
            />

            <View style={styles.activeView}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                  <View style={styles.titleActiveView}>
                    <TouchableOpacity
                      onPress={() => firstSorting('Date')}
                      style={[styles.optionTitleView, {width: wp(25)}]}>
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
                      style={[styles.optionTitleView, {width: wp(27)}]}>
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
                      style={[styles.optionTitleView, {width: wp(27)}]}>
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
                      style={[styles.optionTitleView, {width: wp(30)}]}>
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
                      style={[styles.optionTitleView, {width: wp(25)}]}>
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
                    onEndReached={() => onGetExtraHistoryData(nextUrl)}
                    ListFooterComponent={isFooterLoader ? renderFooter : null}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
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
                            <Text style={[styles.dataText1, {width: wp(25)}]}>
                              {moment(item.payment[0]?.created_at).format(
                                'YYYY-MM-DD',
                              )}
                            </Text>
                            <Text style={[styles.dataText1, {width: wp(27)}]}>
                              {item.payment[0]?.pay_currency != null
                                ? item.payment[0]?.pay_currency.toUpperCase()
                                : null}
                            </Text>
                            <Text style={[styles.dataText1, {width: wp(27)}]}>
                              {item.payment[0]?.price_amount}
                            </Text>
                            <Text style={[styles.dataText1, {width: wp(30)}]}>
                              {item.payment[0]?.payment_id}
                            </Text>
                            <Text
                              style={[
                                styles.dataText1,
                                {
                                  width: wp(25),
                                  color:
                                    item.payment[0]?.display_status === 'failed'
                                      ? COLORS.errorColor
                                      : item.payment[0]?.display_status ===
                                        'pending'
                                      ? COLORS.black
                                      : COLORS.darkGreen,
                                },
                              ]}>
                              {item.payment[0]?.display_status === 'failed'
                                ? 'Failed'
                                : item.payment[0]?.display_status === 'pending'
                                ? 'Pending'
                                : 'Confirm'}
                            </Text>
                          </View>
                        </TouchableHighlight>
                      );
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
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
