import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
  AppState,
} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import Header from '../../components/Header';
import {hasNotch} from 'react-native-device-info';
import {COLORS} from '../../utils';
import {
  onGetActiveAIStatusApi,
  onGetExtraHistoryAIStatusApi,
  onGetHistoryDetailAIStatusApi,
  onGetLastPriceDataApi,
} from '../../services/Api';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import Config from 'react-native-config';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StatusSkeleton from '../../components/StatusSkeleton';
import {useTranslation} from 'react-i18next';
import {fetchAIActiveList, fetchAIStatusHistoryList} from '../../redux/reducer';
import {LoginPopup} from '../../components/LoginPopup';
import {useTheme} from '../../utils/ThemeProvider';
import {portraitStyles, landscapeStyles} from './styles';
import useOrientation from '../../components/OrientationComponent';

const activeDataArray = [
  {
    id: 1,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 2,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 3,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 4,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 5,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 6,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 7,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 8,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 9,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 10,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
  {
    id: 11,
    date: '01/10/2018',
    coin: 2000,
    entryPrice: '105',
    lastPrice: '120',
    type: 'BSV',
  },
];

const AIStatusScreen = ({navigation}) => {
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const {theme} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const intervalRef = useRef(null);
  const balanceData = useSelector(state => state.balanceData);
  const getAIActiveList = useSelector(state => state.getAIActiveList);
  const getAIStatusHistoryList = useSelector(
    state => state.getAIStatusHistoryList,
  );
  // const notificationCount = useSelector(state => state.notificationCount);
  const socketUrl = Config.NEXT_PUBLIC_SERVER_URL_SOCKET;
  const socketPath = '/ws/live-ohlcv-consumer/';

  const isFocused = useIsFocused();
  // const [balanceData, setBalanceData] = useState(null);
  const [dataHistory, setDataHistory] = useState([]);
  const [filterHistory, setFilterHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [nextUrl, setNextUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');
  const [dataActive, setDataActive] = useState([]);
  const [activeNextUrl, setActiveNextUrl] = useState('');
  const [isFooterLoader, setIsFooterLoader] = useState(false);
  const [isPressArray1, setIsPressArray1] = useState([]);
  const [isPressArray, setIsPressArray] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [skeletonVisible, setSkeletonVisible] = useState(false);
  const [skeletonHistoryVisible, setSkeletonHistoryVisible] = useState(false);
  const [searchingVisible, setSearchingVisible] = useState(false);
  const [HistoryCount, setHistoryCount] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);
  const [activeCount, setActiveCount] = useState(0);
  const [authToken, setAuthToken] = useState('');
  const [loginPopupVisible, setLoginPopupVisible] = useState(false);

  useEffect(() => {
    onGetBalance();
    onGetHistoryData();
    onGetActiveBotData();
  }, []);

  const onGetBalance = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token !== null) {
        setAuthToken(token);
      } else {
        setLoginPopupVisible(true);
      }
    } catch (err) {
      console.log('Error:', err.response.data);
      // alert(err.response.data.detail);
    }
  };

  const onGetActiveBotData = async () => {
    try {
      setSkeletonVisible(true);
      const response1 = await onGetLastPriceDataApi();
      let response = getAIActiveList;
      if (getAIActiveList.length > 0) {
        response = getAIActiveList;
      } else {
        const response3 = await onGetActiveAIStatusApi();
        if (response3.data.active_trade_list) {
          response = response3.data.active_trade_list;
          dispatch(fetchAIActiveList(response3.data.active_trade_list));
        } else {
          setSkeletonVisible(false);
          console.log('History Error:', response3.data);
        }
      }
      if (response) {
        response = response.map(item => {
          const symbolData = response1.data.find(
            data => data.symbol === `${item.symbol}`,
          );
          // const binanceSymbolData = binanceWebSocketData[item.symbol];
          console.log('Get Active Bot Data:::', symbolData.markPrice);
          const decimalDigitsInPrice = countDecimalDigits(item.price);
          const latestLastprice = symbolData
            ? parseFloat(symbolData.markPrice).toFixed(decimalDigitsInPrice._j)
            : null;
          if (symbolData) {
            return {
              ...item,
              markPrice: latestLastprice,
            };
          }

          return item;
        });
        setDataActive(response);
        setActiveCount(response.length);
        setIsPressArray1(Array(response.length).fill(false));
        setSkeletonVisible(false);
      } else {
        setSkeletonVisible(false);
        console.log('History Error:', response);
      }
    } catch (err) {
      setSkeletonVisible(false);
      console.log('History Error:', err);
      // alert(err.response.data.detail);
    }
  };

  const onGetHistoryData = async () => {
    try {
      setSkeletonHistoryVisible(true);
      let count = await AsyncStorage.getItem('notificationCount');
      setNotificationCount(count);
      // const response = await onGetHistoryDetailAIStatusApi();
      console.log('get data response', getAIStatusHistoryList);
      if (getAIStatusHistoryList.results) {
        setDataHistory(getAIStatusHistoryList.results);
        setIsPressArray(
          Array(getAIStatusHistoryList.results.length).fill(false),
        );
        setNextUrl(getAIStatusHistoryList.next);
        setFilterHistory(getAIStatusHistoryList.results);
        setHistoryCount(getAIStatusHistoryList.count);
        setSkeletonHistoryVisible(false);
      } else {
        const DetailAIStatus = await onGetHistoryDetailAIStatusApi();
        if (DetailAIStatus.data.history_trade_list) {
          dispatch(
            fetchAIStatusHistoryList(DetailAIStatus.data.history_trade_list),
          );
          setDataHistory(DetailAIStatus.data.history_trade_list.results);
          setIsPressArray(
            Array(DetailAIStatus.data.history_trade_list.results.length).fill(
              false,
            ),
          );
          setHistoryCount(DetailAIStatus.data.history_trade_list.count);
          setNextUrl(DetailAIStatus.data.history_trade_list.next);
          setFilterHistory(DetailAIStatus.data.history_trade_list.results);
          setSkeletonHistoryVisible(false);
        } else {
          setSkeletonHistoryVisible(false);
        }
        console.log('History Error:', getAIStatusHistoryList);
      }
    } catch (err) {
      setSkeletonHistoryVisible(false);
      console.log('History Error:', err);
      // alert(err.response.data.detail);
    }
  };

  const countDecimalDigits = async number => {
    const numberString = number.toString();

    if (numberString.includes('.')) {
      // Split the string at the decimal point
      const data =
        numberString.indexOf('.') >= 0
          ? numberString.replace(/\.?0+$/, '')
          : numberString;
      const decimalPart = data.split('.')[1];
      // Return the length of the decimal part
      return decimalPart.length;
    } else {
      // If there is no decimal point, return 0
      return 0;
    }
  };

  const fetchData = () => {
    if (socketRef.current) {
      socketRef.current.onclose = () => {
        console.log('WebSocket closed');
      };
    }
    socketRef.current = new WebSocket(
      'wss://fstream.binance.com/ws/!ticker@arr',
    );
    // const socket = new WebSocket(socketUrl + socketPath);

    socketRef.current.onmessage = event => {
      console.log('coming Socket...');
      const binanceWebSocketData = JSON.parse(event.data);
      socketRef.current.close();
      // if (dataActive.length > 0) {
      // Update the tableData state based on WebSocket data
      setDataActive(prevData => {
        return prevData.map(item => {
          const binanceSymbolData = binanceWebSocketData.find(
            data => data.s === `${item.symbol}`,
          );
          // const binanceSymbolData = binanceWebSocketData[item.symbol];

          const decimalDigitsInPrice = countDecimalDigits(item.price);
          const latestLastprice = binanceSymbolData
            ? parseFloat(binanceSymbolData.c).toFixed(decimalDigitsInPrice._j)
            : null;
          if (binanceSymbolData) {
            return {
              ...item,
              markPrice: latestLastprice,
            };
          }

          return item;
        });
      });
      // }
    };
    socketRef.current.onclose = () => {
      console.log('WebSocket closed 2');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setTimeout(() => {
        fetchData();
      }, 3000);
    };
    socketRef.current.onerror = error => {
      console.error('WebSocket Error:', error);
      socketRef.current.close();
    };
  };

  useEffect(() => {
    if (!isFocused) {
      handleSearch('');
    }
    if (socketRef.current) {
      socketRef.current.onclose = () => {
        console.log('WebSocket closed 3');
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setTimeout(() => {
          fetchData();
        }, 3000);
      };
    }
    console.log('get list data', isFocused, appState);
    if (dataActive.length > 0 && isFocused && appState === 'active') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      intervalRef.current = setInterval(fetchData, 3500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.onclose = () => {
          console.log('WebSocket closed');
        };
      }
    }
    const handleAppStateChange = nextAppState => {
      setAppState(nextAppState);
      console.log('get list data', nextAppState);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.onclose = () => {
          socketRef.current.close();
          console.log('WebSocket closed');
        };
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
      subscription.remove();
    };
  }, [dataActive, isFocused, appState]);

  // const startFetchingData = () => {
  //   const handleAppStateChange = nextAppState => {
  //     setAppState(nextAppState);
  //     console.log('get list data', nextAppState);
  //   };

  //   const subscription = AppState.addEventListener(
  //     'change',
  //     handleAppStateChange,
  //   );
  //   setTimeout(() => {
  //     fetchData(); // Fetch data immediately
  //   }, 3000);
  //   return subscription;
  // };

  // const stopFetchingData = () => {
  //   if (socketRef.current) {
  //     socketRef.current.onclose = () => {
  //       console.log('WebSocket closed');
  //     };
  //     socketRef.current.close();
  //   }
  // };

  const onGetExtraHistoryData = async () => {
    try {
      if (nextUrl && !isFooterLoader) {
        let array = filterHistory;
        setIsFooterLoader(true);
        const response = await onGetExtraHistoryAIStatusApi(nextUrl);
        console.log('Response>>', response.data.history_trade_list);
        if (response.data.history_trade_list) {
          // setDataHistory(response.data.history_trade_list.results);
          setIsFooterLoader(false);
          // dataHistory.push(response.data.history_trade_list.results);
          // filterHistory.push(response.data.history_trade_list.results);
          response.data.history_trade_list.results.map(item => {
            array.push(item);
          });
          setFilterHistory(array);
          setDataHistory(array);
          setIsPressArray(Array(filterHistory.length).fill(false));
          setNextUrl(response.data.history_trade_list.next);
          if (response.data.history_trade_list.previous != null) {
            setPrevUrl(response.data.history_trade_list.previous);
          }
        } else {
          setIsFooterLoader(false);
        }
      }
    } catch (err) {
      setIsFooterLoader(false);
      // alert(err.response.data.detail);
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
        if (index1 == index) {
          newState[index1] = true;
        } else {
          newState[index1] = false;
        }
      });
      return newState;
    });
  };

  const handleHideUnderlay1 = index => {
    setIsPressArray1(prevState => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };

  const handleShowUnderlay1 = index => {
    setIsPressArray1(prevState => {
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
    setSearchingVisible(true);
    setSearch(text);
    if (text !== '') {
      const filtered = filterHistory.filter(item =>
        item.symbol.toLowerCase().includes(text.toLowerCase()),
      );
      setDataHistory(filtered);
      setRefresh(!refresh);
    } else {
      setSearchingVisible(false);
      setDataHistory(filterHistory);
      setRefresh(!refresh);
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
          <Header
            title={t('ai_status')}
            notificationPress={() =>
              navigation.navigate('NotificationScreen', {
                count: notificationCount,
              })
            }
            navigation={navigation}
            notificationCount={notificationCount}
          />
        </View>
        <View style={styles.mainView}>
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(14)}}>
            <View style={isPortrait ? styles.firstView : styles.firstView1}>
              <View>
                <Text style={styles.updateProfileText}>
                  {balanceData !== null &&
                  !balanceData?.detail &&
                  balanceData?.crossWalletBalance !== null
                    ? `$ ${parseFloat(balanceData?.crossWalletBalance).toFixed(
                        2,
                      )}`
                    : '$0'}
                </Text>
                <Text style={styles.updateProfileText1}>
                  {t('margin_balance')}
                </Text>
              </View>
              <View style={{marginVertical: hp(3)}}>
                <Text style={styles.updateProfileText}>
                  {balanceData !== null &&
                  !balanceData?.detail &&
                  balanceData?.availableBalance !== null
                    ? `$ ${parseFloat(balanceData?.availableBalance).toFixed(
                        2,
                      )}`
                    : '$0'}
                </Text>
                <Text style={styles.updateProfileText1}>{t('balance')}</Text>
              </View>
              <View>
                <Text style={styles.updateProfileText}>
                  {balanceData !== null &&
                  !balanceData?.detail &&
                  balanceData?.crossUnPnl !== null
                    ? `$ ${parseFloat(balanceData?.crossUnPnl).toFixed(2)}`
                    : '$0'}
                </Text>
                <Text style={styles.updateProfileText1}>{t('pl')}</Text>
              </View>
            </View>
            <View style={styles.viewManage}>
              <View style={styles.viewManage1}>
                <View style={styles.activeTitleView}>
                  <Text style={styles.activeText}>
                    {t('open_order')}
                    <Text style={styles.historyCountText}>
                      {activeCount != 0 ? ` [${activeCount}]` : null}
                    </Text>
                  </Text>
                </View>
                <View style={styles.activeView}>
                  <ScrollView
                    bounces={false}
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    <View>
                      <View style={styles.titleActiveView}>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(24) : wp(7)},
                          ]}>
                          {t('date')}
                        </Text>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(24) : wp(7)},
                          ]}>
                          {t('coin')}
                        </Text>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(33) : wp(12)},
                          ]}>
                          {t('entry_price')}
                        </Text>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(33) : wp(12)},
                          ]}>
                          {t('last_price')}
                        </Text>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(16) : wp(5)},
                          ]}>
                          {t('type')}
                        </Text>
                      </View>
                      {skeletonVisible ? (
                        <StatusSkeleton />
                      ) : (
                        <FlatList
                          data={dataActive}
                          extraData={dataActive}
                          initialNumToRender={5000000}
                          showsVerticalScrollIndicator={false}
                          nestedScrollEnabled
                          // contentContainerStyle={{paddingBottom: hp(2)}}
                          keyExtractor={item => item.created_at}
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
                                // onHideUnderlay={() => handleHideUnderlay1(index)}
                                onShowUnderlay={() =>
                                  handleShowUnderlay1(index)
                                }
                                activeOpacity={1}
                                onPress={() => console.log('hello')}
                                underlayColor={COLORS.lightGreen1}>
                                <View
                                  style={[
                                    styles.dataActiveView,
                                    {
                                      backgroundColor: isPressArray1[index]
                                        ? COLORS.lightGreen1
                                        : COLORS.white,
                                    },
                                  ]}
                                  key={item.created_at}>
                                  <Text
                                    style={[
                                      styles.dataText,
                                      {width: isPortrait ? wp(24) : wp(7)},
                                    ]}>
                                    {moment(item?.time).format('YYYY-MM-DD')}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataText,
                                      {width: isPortrait ? wp(24) : wp(7)},
                                    ]}>
                                    {item.symbol}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataText,
                                      {width: isPortrait ? wp(33) : wp(12)},
                                    ]}>
                                    {item.price}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataText,
                                      {width: isPortrait ? wp(33) : wp(12)},
                                    ]}>
                                    {item.markPrice}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataHistoryText,
                                      {
                                        width: isPortrait ? wp(16) : wp(5),
                                        color:
                                          item?.side === 'BUY'
                                            ? COLORS.greenColor
                                            : COLORS.errorColor,
                                      },
                                    ]}>
                                    {item.side}
                                  </Text>
                                </View>
                              </TouchableHighlight>
                            );
                          }}
                        />
                      )}
                    </View>
                  </ScrollView>
                </View>
              </View>
              <View style={styles.viewManage1}>
                <View style={styles.historyTitleView}>
                  <Text style={styles.activeText}>
                    {t('closed_trade')}
                    {/* <Text
                  style={styles.historyCountText}>{` [${HistoryCount}]`}</Text> */}
                  </Text>
                  <TextInput
                    value={search}
                    onChangeText={text => handleSearch(text)}
                    placeholder={t('search_coin')}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.searchText}
                  />
                </View>
                <View style={styles.historyView}>
                  <ScrollView
                    bounces={false}
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    <View>
                      <View style={styles.titleHistoryView}>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(24) : wp(7)},
                          ]}>
                          {t('date')}
                        </Text>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(24) : wp(7)},
                          ]}>
                          {t('coin')}
                        </Text>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(16) : wp(4)},
                          ]}>
                          {t('AI')}
                        </Text>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(33) : wp(12)},
                          ]}>
                          {t('entry_price')}
                        </Text>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(33) : wp(12)},
                          ]}>
                          {t('avg_price')}
                        </Text>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(16) : wp(5)},
                          ]}>
                          {t('tp_sl')}
                        </Text>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(16) : wp(5)},
                          ]}>
                          {t('type')}
                        </Text>
                      </View>
                      {skeletonHistoryVisible ? (
                        <StatusSkeleton />
                      ) : (
                        <FlatList
                          data={dataHistory}
                          extraData={dataHistory}
                          nestedScrollEnabled
                          initialNumToRender={5000000}
                          contentContainerStyle={{marginBottom: hp(2)}}
                          showsVerticalScrollIndicator={false}
                          keyExtractor={item => item.orderId}
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
                                    color: COLORS.primary,
                                    fontSize: 16,
                                  }}>
                                  {t('no_records_available')}
                                </Text>
                              </View>
                            </View>
                          )}
                          ListFooterComponent={
                            isFooterLoader && !searchingVisible
                              ? renderFooter
                              : null
                          }
                          onEndReachedThreshold={0.5}
                          onEndReached={() => onGetExtraHistoryData()}
                          renderItem={({item, index}) => {
                            const decimalDigitsInPrice = countDecimalDigits(
                              item?.entry_price,
                            );
                            return (
                              <TouchableHighlight
                                onShowUnderlay={() => handleShowUnderlay(index)}
                                activeOpacity={1}
                                onPress={() => console.log('hello')}
                                underlayColor={COLORS.lightPrimary2}>
                                <View
                                  style={[
                                    styles.dataHistoryView,
                                    {
                                      backgroundColor: isPressArray[index]
                                        ? COLORS.lightPrimary2
                                        : COLORS.white,
                                    },
                                  ]}
                                  key={item.orderId}>
                                  <Text
                                    style={[
                                      styles.dataHistoryText,
                                      {
                                        width: isPortrait ? wp(24) : wp(7),
                                        color: isPressArray[index]
                                          ? COLORS.white
                                          : COLORS.black,
                                      },
                                    ]}>
                                    {moment(item?.updated_at).format(
                                      'YYYY-MM-DD',
                                    )}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataHistoryText,
                                      {
                                        width: isPortrait ? wp(24) : wp(7),
                                        color: isPressArray[index]
                                          ? COLORS.white
                                          : COLORS.black,
                                      },
                                    ]}>
                                    {item?.symbol}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataHistoryText,
                                      {width: isPortrait ? wp(16) : wp(4)},
                                    ]}>
                                    {item.candal_type === '1h'
                                      ? 'B'
                                      : item.candal_type === '4h'
                                      ? 'A'
                                      : item.candal_type === '1d'
                                      ? 'I'
                                      : item.candal_type === 'custom' && 'E'}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataHistoryText,
                                      {
                                        width: isPortrait ? wp(33) : wp(12),
                                        color: isPressArray[index]
                                          ? COLORS.white
                                          : COLORS.black,
                                      },
                                    ]}>
                                    {parseFloat(item?.entry_price).toFixed(
                                      decimalDigitsInPrice._j,
                                    )}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataHistoryText,
                                      {
                                        width: isPortrait ? wp(33) : wp(12),
                                        color: isPressArray[index]
                                          ? COLORS.white
                                          : COLORS.black,
                                      },
                                    ]}>
                                    {/* {item?.avgPrice} */}
                                    {parseFloat(item?.avgPrice).toFixed(
                                      decimalDigitsInPrice._j,
                                    )}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataHistoryText,
                                      {
                                        width: isPortrait ? wp(16) : wp(5),
                                        color:
                                          item?.origFIlterType ===
                                          'TAKE_PROFIT_MARKET'
                                            ? COLORS.greenColor
                                            : item?.origFIlterType === 'MARKET'
                                            ? COLORS.black
                                            : COLORS.errorColor,
                                      },
                                    ]}>
                                    {item?.origFIlterType ===
                                    'TAKE_PROFIT_MARKET'
                                      ? 'TP'
                                      : item?.origFIlterType === 'MARKET'
                                      ? 'M'
                                      : 'SL'}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataHistoryText,
                                      {
                                        width: isPortrait ? wp(16) : wp(5),
                                        color:
                                          item?.side === 'BUY'
                                            ? COLORS.greenColor
                                            : COLORS.errorColor,
                                      },
                                    ]}>
                                    {item.side}
                                  </Text>
                                </View>
                              </TouchableHighlight>
                            );
                          }}
                        />
                      )}
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      <LoginPopup
        isPortrait={isPortrait}
        modelVisible={loginPopupVisible}
        setModelVisible={setLoginPopupVisible}
        firstButtonClick={() => {
          setLoginPopupVisible(false);
          navigation.navigate('RegistrationScreen');
        }}
        secondButtonClick={() => {
          setLoginPopupVisible(false);
          navigation.navigate('LoginScreen');
        }}
      />
    </View>
  );
};

export default AIStatusScreen;
