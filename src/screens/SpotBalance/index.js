import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Modal,
  RefreshControl,
  TouchableHighlight,
  AppState,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {portraitStyles, landscapeStyles} from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import Header from '../../components/Header';
import {hasNotch} from 'react-native-device-info';
import {COLORS, Fonts} from '../../utils';
import star from '../../images/star.png';
import star1 from '../../images/star1.png';
import bell1 from '../../images/bell1.png';
import bell2 from '../../images/bell2.png';
import downArrow from '../../images/downArrow.png';
import upArrow from '../../images/upArrow.png';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import arrowUp from '../../images/arrowUp.png';
import down from '../../images/down.png';
import PredictionSkeleton from '../../components/PredictionSkeleton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FilterOptionPopup} from '../../components/FilterOptionPopup';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import debounce from 'lodash/debounce';
import {onGetSpotBalanceApi} from '../../services/Api';
import moment from 'moment';
import {useTheme} from '../../utils/ThemeProvider';
import useOrientation from '../../components/OrientationComponent';

const SpotBalance = ({navigation}) => {
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const textInputRef = useRef();
  const socketRef = useRef(null);
  const intervalRef = useRef(null);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const percentageStatusData = useSelector(state => state.percentageStatusData);
  const isFocused = useIsFocused();
  const scrollRef = useRef(null);
  const [search, setSearch] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [balanceData, setBalanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPressArray1, setIsPressArray1] = useState([]);
  const [coinSort, setCoinSort] = useState(0);
  const [amountSort, setAmountSort] = useState(0);
  const [dataActiveSort, setDataActiveSort] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    try {
      let count = await AsyncStorage.getItem('notificationCount');
      setNotificationCount(count);
      const response = await onGetSpotBalanceApi();
      let balances = [];
      if (response.data) {
        console.log('Get Response', response.data.last_trade_history);
        response.data.last_trade_history.map(item => {
          if (parseFloat(item.free) >= 1) {
            balances.push(item);
          }
        });
        setBalanceData(balances);
        setDataActiveSort(balances);
        setIsPressArray1(Array(balances.length).fill(false));
        setLoading(!loading);
      }
    } catch (err) {
      console.log('err::', err);
    }
  };

  const handleSearch = async text => {
    setSearch(text);
    if (text !== '') {
      let allData = dataActiveSort;
      const filtered = allData.filter(item =>
        item.asset.toLowerCase().includes(text.toLowerCase()),
      );
      setBalanceData(filtered);
      setRefresh(!refresh);
    } else {
      setBalanceData(dataActiveSort);
      setRefresh(!refresh);
    }
  };

  const handleFocus = debounce(() => {
    textInputRef.current.focus();
  }, 300);

  const hasPrefix = (str, prefix) => {
    return str.startsWith(prefix);
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

  const customSort = (a, b) => {
    // const aValue = removePrefix(a?.asset, 'LD');
    // const bValue = removePrefix(b?.asset, 'LD');
    // Convert strings to lowercase for case-insensitive comparison
    const stringA = a.asset.toLowerCase();
    const stringB = b.asset.toLowerCase();

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

  const firstSorting = from => {
    if (from === 'coin') {
      if (coinSort === 2) {
        setCoinSort(0);
        setAmountSort(0);
      } else {
        setCoinSort(coinSort + 1);
        setAmountSort(0);
      }
      if (coinSort + 1 === 1) {
        const sortedDates = balanceData.sort(customSort).reverse();
        setBalanceData(sortedDates);
      } else if (coinSort + 1 === 2) {
        const sortedDates = balanceData.sort(customSort);
        setBalanceData(sortedDates);
      } else {
        setBalanceData(dataActiveSort);
      }
    } else if (from === 'amount') {
      if (amountSort === 2) {
        setCoinSort(0);
        setAmountSort(0);
      } else {
        setAmountSort(amountSort + 1);
        setCoinSort(0);
      }
      if (amountSort + 1 === 1) {
        const sortedDates = balanceData
          .sort((a, b) => a.free - b.free)
          .reverse();
        setBalanceData(sortedDates);
      } else if (amountSort + 1 === 2) {
        const sortedDates = balanceData.sort((a, b) => a.free - b.free);
        setBalanceData(sortedDates);
      } else {
        setBalanceData(dataActiveSort);
      }
    }
  };

  const fetchData = () => {
    if (socketRef.current) {
      socketRef.current.onclose = () => {
        console.log('WebSocket closed');
      };
    }
    socketRef.current = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');
    // const socket = new WebSocket(socketUrl + socketPath);

    socketRef.current.onmessage = event => {
      console.log('coming Socket...');
      const binanceWebSocketData = JSON.parse(event.data);
      socketRef.current.close();
      // socketRef.current.close();
      // Update the tableData state based on WebSocket data
      setBalanceData(prevData => {
        return prevData.map(item => {
          const coinData = item.asset + 'USDT';
          const binanceSymbolData = binanceWebSocketData.find(
            data => data.s === `${coinData}`,
          );
          const latestLastprice = binanceSymbolData
            ? parseFloat(binanceSymbolData.c)
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
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket closed 2');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
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
      };
    }
    console.log('get list data', isFocused, appState);
    if (balanceData.length > 0 && isFocused && appState === 'active') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.onclose = () => {
          console.log('WebSocket closed');
        };
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

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
      subscription.remove();
    };
  }, [isFocused, balanceData, appState]);

  return (
    <View style={styles.safeAreaStyle}>
      <View
        style={{
          width: '100%',
          height: hasNotch() ? hp(5) : 0,
          backgroundColor: COLORS.white,
        }}
      />
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        <View style={styles.headerView}>
          <Header
            title={t('spot_balance')}
            notificationPress={() =>
              navigation.navigate('NotificationScreen', {
                count: notificationCount,
              })
            }
            navigation={navigation}
            onPress={() => navigation.goBack()}
            notificationCount={notificationCount}
            backVisible={true}
          />
        </View>
        <View style={[styles.mainView, {backgroundColor: theme.background}]}>
          <KeyboardAwareScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(12)}}>
            <TextInput
              ref={textInputRef}
              value={search}
              onChangeText={text => handleSearch(text)}
              onFocus={handleFocus}
              placeholder={t('search_coin')}
              placeholderTextColor={COLORS.greyColor}
              style={styles.searchText}
            />
            <ScrollView>
              {balanceData.length > 0 ? (
                <View style={styles.headingView}>
                  <TouchableOpacity
                    onPress={() => firstSorting('coin')}
                    style={styles.heading}>
                    <Text style={styles.headingText}>{t('coins')}</Text>
                    <View>
                      {coinSort === 0 || coinSort === 1 ? (
                        <Image style={styles.arrowImage} source={arrowUp} />
                      ) : null}
                      {coinSort === 0 || coinSort === 2 ? (
                        <Image style={styles.arrowImage} source={down} />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => firstSorting('amount')}
                    style={styles.heading}>
                    <Text style={styles.headingText}>{t('amount')}</Text>
                    <View>
                      {amountSort === 0 || amountSort === 1 ? (
                        <Image style={styles.arrowImage} source={arrowUp} />
                      ) : null}
                      {amountSort === 0 || amountSort === 2 ? (
                        <Image style={styles.arrowImage} source={down} />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
              {balanceData.length > 0 ? (
                balanceData.map((item, index) => {
                  if (
                    parseFloat(item.free) >= 1 &&
                    !hasPrefix(item.asset, 'LD')
                  ) {
                    return (
                      <TouchableHighlight
                        // onHideUnderlay={() => handleHideUnderlay1(index)}
                        onShowUnderlay={() => handleShowUnderlay1(index)}
                        activeOpacity={1}
                        onPress={() => console.log('hello')}
                        underlayColor={COLORS.lightGreen1}>
                        <View
                          style={[
                            styles.headingView1,
                            {
                              backgroundColor: COLORS.white,
                            },
                          ]}>
                          <View style={styles.subDataView}>
                            <Text style={styles.coinText}>{item.asset}</Text>
                            <Text style={styles.amountText}>
                              {parseFloat(item.free).toFixed(2)}
                            </Text>
                          </View>
                          <View style={styles.subDataView}>
                            <Text style={styles.coinText1}>
                              {item.markPrice != null ? item.markPrice : '(-)'}
                            </Text>
                            <Text style={styles.amountText1}>
                              {item?.last_details != null
                                ? parseFloat(
                                    item?.last_details?.trade_json?.jam_ratio_1
                                      ?.binance__trade_entry_price,
                                  ).toFixed(2)
                                : '(-)'}
                            </Text>
                          </View>
                        </View>
                      </TouchableHighlight>
                    );
                  }
                })
              ) : (
                <View style={{marginVertical: hp(5)}}>
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
                      {'No Records Available'}
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </View>
  );
};

export default SpotBalance;
