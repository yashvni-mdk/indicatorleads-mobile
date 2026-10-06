import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Switch,
  ActivityIndicator,
  AppState,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import styles from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../../components/Pixel/index';
import Header from '../../../components/Header';
import {hasNotch} from 'react-native-device-info';
import {COLORS} from '../../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import close from '../../../images/close.png';
import calendar from '../../../images/calendar.png';
import CalendarPicker from 'react-native-calendar-picker';
import {useSelector} from 'react-redux';
import {
  onGetAdminFilterCommonApi,
  onGetExtraHistoryApi,
} from '../../../services/Api';
import {useIsFocused} from '@react-navigation/native';
import check from '../../../images/check.png';

const SpotPmsHistory = ({navigation}) => {
  const socketRef = useRef(null);
  const intervalRef = useRef(null);
  const isFocused = useIsFocused();
  const getAdminSpotSpmHistory = useSelector(
    state => state.getAdminSpotSpmHistory,
  );
  const [userRole, setUserRole] = useState('');
  const [search1, setSearch1] = useState('');
  const [notificationData, setHistoryData] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [calenderVisible, setCalenderVisible] = useState(false);
  const [filterHistory, setFilterHistory] = useState([]);
  const [nextUrl, setNextUrl] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [isFooterLoader, setIsFooterLoader] = useState(false);
  const [searchingVisible, setSearchingVisible] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [filterVisible, setFilterVisible] = useState(false);
  const [buyVisible, setBuyVisible] = useState(false);
  const [sellVisible, setSellVisible] = useState(false);

  useEffect(() => {
    onGetHistoryData();
    const allDataGet = async () => {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
    };
    allDataGet();
  }, []);

  const onGetHistoryData = async () => {
    try {
      const historyData = getAdminSpotSpmHistory;
      setHistoryData(historyData.results);
      setFilterHistory(historyData.results);
      setNextUrl(historyData.next);
      setRefresh(!refresh);
    } catch (err) {
      console.log('History Data>>', err);
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    const datePart = date?.toISOString().split("T")[0];
    return `${datePart}`;
  };

  const formatTime = dateString => {
    const date = new Date(dateString);
    const timePart = date?.toTimeString().split(" ")[0];
    return `${timePart}`;
  };

  const onDateChange = async (date, type) => {
    if (type === 'END_DATE') {
      setSelectedEndDate(date);
      setCalenderVisible(false);
      onDateFilterImplement(date);
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    }
  };

  const onCloseDate = async () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    onWithoutDateFilterImplement();
  };

  const onWithoutDateFilterImplement = async () => {
    try {
      let url = '';
      if (search1 != '') {
        if (buyVisible || sellVisible) {
          url = `super-admin/bot-trading/active-trading-bot/?email=${search1}&bot_type=spot-pms-bot&trade_status=square-off&webhook_signal_direction=${
            buyVisible ? 'BUY' : 'SELL'
          }`;
        } else {
          url = `super-admin/bot-trading/active-trading-bot/?email=${search1}&bot_type=spot-pms-bot&trade_status=square-off`;
        }
      } else {
        if (buyVisible || sellVisible) {
          url = `super-admin/bot-trading/active-trading-bot/?bot_type=spot-pms-bot&trade_status=square-off&webhook_signal_direction=${
            buyVisible ? 'BUY' : 'SELL'
          }`;
        } else {
          url = 'super-admin/bot-trading/active-trading-bot/?bot_type=spot-pms-bot&trade_status=square-off';
        }
      }
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setHistoryData(responseAPI.data.results);
        setFilterHistory(responseAPI.data.results);
        setNextUrl(responseAPI.data.next);
        setRefresh(!refresh);
      }
    } catch (Err) {
      console.log('get Error::', Err);
    }
  };

  const onDateFilterImplement = async date => {
    try {
      let url = '';
      if (search1 != '') {
        if (buyVisible || sellVisible) {
          url = `super-admin/bot-trading/active-trading-bot/?email=${search1}&bot_type=spot-pms-bot&trade_status=square-off&start_date=${moment(
            selectedStartDate,
          ).format('YYYY-MM-DD')}&end_date=${moment(date).format(
            'YYYY-MM-DD',
          )}&webhook_signal_direction=${buyVisible ? 'BUY' : 'SELL'}`;
        } else {
          url = `super-admin/bot-trading/active-trading-bot/?email=${search1}&bot_type=spot-pms-bot&trade_status=square-off&start_date=${moment(
            selectedStartDate,
          ).format('YYYY-MM-DD')}&end_date=${moment(date).format(
            'YYYY-MM-DD',
          )}`;
        }
      } else {
        if (buyVisible || sellVisible) {
          url = `super-admin/bot-trading/active-trading-bot/?bot_type=spot-pms-bot&trade_status=square-off&webhook_signal_direction=${
            buyVisible ? 'BUY' : 'SELL'
          }&start_date=${moment(selectedStartDate).format(
            'YYYY-MM-DD',
          )}&end_date=${moment(date).format('YYYY-MM-DD')}`;
        } else {
          url = `super-admin/bot-trading/active-trading-bot/?bot_type=spot-pms-bot&trade_status=square-off&start_date=${moment(
            selectedStartDate,
          ).format('YYYY-MM-DD')}&end_date=${moment(date).format(
            'YYYY-MM-DD',
          )}`;
        }
      }
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setHistoryData(responseAPI.data.results);
        setFilterHistory(responseAPI.data.results);
        setNextUrl(responseAPI.data.next);
        setRefresh(!refresh);
      }
    } catch (Err) {
      console.log('get Error::', Err);
    }
  };

  const onGetExtraHistoryData = async () => {
    console.log('enter Extra data');
    if (!nextUrl || isFooterLoader) return;
    try {
      console.log('enter Extra data');
      let array = filterHistory;
      setIsFooterLoader(true);
      const response = await onGetExtraHistoryApi(nextUrl);
      console.log('Response>>', response.data.results);
      if (response.data.results) {
        // response.data.results.map(item => {
        //   array.push(item);
        // });
        // setFilterHistory(array);
        // setNotificationData(array);
        setFilterHistory(prevArray => [...prevArray, ...response.data.results]);
        setHistoryData(prevArray => [...prevArray, ...response.data.results]);
        setNextUrl(response.data.next);
      }
      setIsFooterLoader(false);
    } catch (err) {
      setIsFooterLoader(false);
      // alert(err.response.data.detail);
    }
  };

  const renderFooter = () => {
    if (!isFooterLoader) return null;
    return <ActivityIndicator style={{color: COLORS.primary}} />;
  };

  const handleSearch = text => {
    setSearchingVisible(true);
    setSearch1(text);
    if (text !== '') {
      onSearchImplement(text);
      setRefresh(!refresh);
    } else {
      setSearchingVisible(false);
      onWithoutSearchImplement();
    }
  };

  const onWithoutSearchImplement = async () => {
    try {
      let url = '';
      if (selectedEndDate != null) {
        if (buyVisible || sellVisible) {
          url = `super-admin/bot-trading/active-trading-bot/?bot_type=spot-pms-bot&trade_status=square-off&start_date=${moment(
            selectedStartDate,
          ).format('YYYY-MM-DD')}&end_date=${moment(selectedEndDate).format(
            'YYYY-MM-DD',
          )}&webhook_signal_direction=${buyVisible ? 'BUY' : 'SELL'}`;
        } else {
          url = `super-admin/bot-trading/active-trading-bot/?bot_type=spot-pms-bot&trade_status=square-off&start_date=${moment(
            selectedStartDate,
          ).format('YYYY-MM-DD')}&end_date=${moment(selectedEndDate).format(
            'YYYY-MM-DD',
          )}`;
        }
      } else {
        if (buyVisible || sellVisible) {
          url = `super-admin/bot-trading/active-trading-bot/?bot_type=spot-pms-bot&trade_status=square-off&webhook_signal_direction=${
            buyVisible ? 'BUY' : 'SELL'
          }`;
        } else {
          url = 'super-admin/bot-trading/active-trading-bot/?bot_type=spot-pms-bot&trade_status=square-off';
        }
      }
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setHistoryData(responseAPI.data.results);
        setFilterHistory(responseAPI.data.results);
        setNextUrl(responseAPI.data.next);
        setRefresh(!refresh);
      }
    } catch (Err) {
      console.log('get Error::', Err);
    }
  };

  const onSearchImplement = async text => {
    try {
      let url = '';
      if (selectedEndDate != null) {
        if (buyVisible || sellVisible) {
          url = `super-admin/bot-trading/active-trading-bot/?email=${text}&bot_type=spot-pms-bot&trade_status=square-off&start_date=${moment(
            selectedStartDate,
          ).format('YYYY-MM-DD')}&end_date=${moment(selectedEndDate).format(
            'YYYY-MM-DD',
          )}&webhook_signal_direction=${buyVisible ? 'BUY' : 'SELL'}`;
        } else {
          url = `super-admin/bot-trading/active-trading-bot/?email=${text}&bot_type=spot-pms-bot&trade_status=square-off&start_date=${moment(
            selectedStartDate,
          ).format('YYYY-MM-DD')}&end_date=${moment(selectedEndDate).format(
            'YYYY-MM-DD',
          )}`;
        }
      } else {
        if (buyVisible || sellVisible) {
          url = `super-admin/bot-trading/active-trading-bot/?email=${text}&bot_type=spot-pms-bot&trade_status=square-off&webhook_signal_direction=${
            buyVisible ? 'BUY' : 'SELL'
          }`;
        } else {
          url = `super-admin/bot-trading/active-trading-bot/?email=${text}&bot_type=spot-pms-bot&trade_status=square-off`;
        }
      }
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setHistoryData(responseAPI.data.results);
        setFilterHistory(responseAPI.data.results);
        setNextUrl(responseAPI.data.next);
        setRefresh(!refresh);
      }
    } catch (Err) {
      console.log('get Error::', Err);
    }
  };

  // const fetchData = () => {
  //   if (socketRef.current) {
  //     socketRef.current.onclose = () => {
  //       console.log('WebSocket closed');
  //     };
  //   }
  //   socketRef.current = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');
  //   // const socket = new WebSocket(socketUrl + socketPath);
  //   // if (dataActive.length > 0) {
  //   socketRef.current.onmessage = event => {
  //     const binanceWebSocketData = JSON.parse(event.data);
  //     socketRef.current.close();
  //     // socketRef.current.close();
  //     // Update the tableData state based on WebSocket data
  //     setHistoryData(prevData => {
  //       return prevData.map(item => {
  //         const binanceSymbolData = binanceWebSocketData.find(
  //           data => data.s === `${item.symbol}`,
  //         );
  //         // const binanceSymbolData = binanceWebSocketData[item.symbol];
  //         const latestLastprice = binanceSymbolData
  //           ? parseFloat(binanceSymbolData.c)
  //           : null;
  //         if (binanceSymbolData) {
  //           return {
  //             ...item,
  //             markPrice: latestLastprice,
  //           };
  //         }
  //         return item;
  //       });
  //     });
  //   };

  //   socketRef.current.onclose = () => {
  //     console.log('WebSocket closed 2');
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //   };

  //   socketRef.current.onerror = error => {
  //     console.error('WebSocket Error:', error);
  //     socketRef.current.close();
  //   };
  //   // }
  // };

  // useEffect(() => {
  //   if (!isFocused) {
  //     setSearch1('');
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //     if (socketRef.current) {
  //       socketRef.current.onclose = () => {
  //         socketRef.current.close();
  //         console.log('WebSocket closed');
  //       };
  //     }
  //   }
  //   if (socketRef.current) {
  //     socketRef.current.onclose = () => {
  //       socketRef.current.onclose = () => {
  //         console.log('WebSocket closed 3');
  //         if (intervalRef.current) {
  //           clearInterval(intervalRef.current);
  //           intervalRef.current = null;
  //         }
  //       };
  //     };
  //   }
  //   console.log('get list data', isFocused, appState);
  //   if (notificationData.length > 0 && isFocused && appState === 'active' && !calenderVisible) {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //     if (socketRef.current) {
  //       socketRef.current.onclose = () => {
  //         console.log('WebSocket closed');
  //       };
  //     }
  //     intervalRef.current = setInterval(fetchData, 4500);
  //   } else {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //     if (socketRef.current) {
  //       socketRef.current.onclose = () => {
  //         socketRef.current.close();
  //         console.log('WebSocket closed');
  //       };
  //     }
  //   }
  //   const handleAppStateChange = nextAppState => {
  //     setAppState(nextAppState);
  //     console.log('get list data', nextAppState);
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //     if (socketRef.current) {
  //       socketRef.current.onclose = () => {
  //         socketRef.current.close();
  //         console.log('WebSocket closed');
  //       };
  //     }
  //   };

  //   const subscription = AppState.addEventListener('change', handleAppStateChange);
  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //     }
  //     if (socketRef.current) {
  //       socketRef.current.close();
  //     }
  //     subscription.remove();
  //   };
  // }, [isFocused, notificationData, appState]);

  const onFilterHandle = from => {
    if (from == 'buy') {
      if (buyVisible) {
        onWithoutFilterImplement();
        setBuyVisible(false);
      } else {
        onFilterImplement('BUY');
        setBuyVisible(true);
      }
      setSellVisible(false);
    } else if (from == 'sell') {
      setBuyVisible(false);
      if (sellVisible) {
        onWithoutFilterImplement();
        setSellVisible(false);
      } else {
        onFilterImplement('SELL');
        setSellVisible(true);
      }
    }
  };

  const onWithoutFilterImplement = async () => {
    try {
      let url = '';
      if (selectedEndDate != null) {
        if (search1 != '') {
          url = `super-admin/bot-trading/active-trading-bot/?email=${search1}&bot_type=spot-pms-bot&trade_status=square-off&start_date=${moment(
            selectedStartDate,
          ).format('YYYY-MM-DD')}&end_date=${moment(selectedEndDate).format(
            'YYYY-MM-DD',
          )}`;
        } else {
          url = `super-admin/bot-trading/active-trading-bot/?bot_type=spot-pms-bot&trade_status=square-off&start_date=${moment(
            selectedStartDate,
          ).format('YYYY-MM-DD')}&end_date=${moment(selectedEndDate).format(
            'YYYY-MM-DD',
          )}`;
        }
      } else {
        if (search1 != '') {
          url = `super-admin/bot-trading/active-trading-bot/?email=${search1}&bot_type=spot-pms-bot&trade_status=square-off`;
        } else {
          url = 'super-admin/bot-trading/active-trading-bot/?bot_type=spot-pms-bot&trade_status=square-off';
        }
      }
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setHistoryData(responseAPI.data.results);
        setFilterHistory(responseAPI.data.results);
        setNextUrl(responseAPI.data.next);
        setRefresh(!refresh);
      }
    } catch (Err) {
      console.log('get Error::', Err);
    }
  };

  const onFilterImplement = async from => {
    try {
      let url = '';
      if (selectedEndDate != null) {
        if (search1 != '') {
          url = `super-admin/bot-trading/active-trading-bot/?email=${search1}&bot_type=spot-pms-bot&trade_status=square-off&start_date=${moment(
            selectedStartDate,
          ).format('YYYY-MM-DD')}&end_date=${moment(selectedEndDate).format(
            'YYYY-MM-DD',
          )}&webhook_signal_direction=${from}`;
        } else {
          url = `super-admin/bot-trading/active-trading-bot/?bot_type=spot-pms-bot&trade_status=square-off&start_date=${moment(
            selectedStartDate,
          ).format('YYYY-MM-DD')}&end_date=${moment(selectedEndDate).format(
            'YYYY-MM-DD',
          )}&webhook_signal_direction=${from}`;
        }
      } else {
        if (search1 != '') {
          url = `super-admin/bot-trading/active-trading-bot/?email=${search1}&bot_type=spot-pms-bot&trade_status=square-off&webhook_signal_direction=${from}`;
        } else {
          url = `super-admin/bot-trading/active-trading-bot/?bot_type=spot-pms-bot&trade_status=square-off&webhook_signal_direction=${from}`;
        }
      }
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setHistoryData(responseAPI.data.results);
        setFilterHistory(responseAPI.data.results);
        setNextUrl(responseAPI.data.next);
        setRefresh(!refresh);
      }
    } catch (Err) {
      console.log('get Error::', Err);
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
        <View style={styles.headerView}>
          <Header
            title={'Spot PMS History'}
            userRole={userRole}
            onPress={() => navigation.openDrawer()}
            navigation={navigation}
            notify={true}
            filterVisible={filterVisible}
            setFilterVisible={setFilterVisible}
          />
        </View>
        <View style={styles.mainView}>
          <ScrollView
            style={{width: '100%'}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(4)}}>
            <View style={styles.fullDateView}>
              <TouchableOpacity
                style={styles.dateView}
                onPress={() => setCalenderVisible(true)}>
                <Text style={styles.startDateText}>
                  {selectedStartDate == null
                    ? 'Start date'
                    : moment(selectedStartDate).format('YYYY-MM-DD')}
                </Text>
                <Text style={styles.startDateText}>{'->'}</Text>
                <View style={styles.calenderImage}>
                  <Text style={styles.startDateText}>
                    {selectedStartDate == null
                      ? 'End date'
                      : moment(selectedEndDate).format('YYYY-MM-DD')}
                  </Text>
                  <Image source={calendar} style={styles.closeImage} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onCloseDate()}>
                <Image source={close} style={styles.closeImage} />
              </TouchableOpacity>
            </View>
            {calenderVisible && (
              <View style={styles.calenderView}>
                <CalendarPicker
                  startFromMonday={true}
                  allowRangeSelection={true}
                  minDate={new Date(2017, 6, 3)}
                  maxDate={new Date()}
                  todayBackgroundColor="#f2e6ff"
                  selectedDayColor="#7300e6"
                  selectedDayTextColor="#FFFFFF"
                  onDateChange={onDateChange}
                />
              </View>
            )}
            <View style={styles.filterView}>
              <TextInput
                value={search1}
                onChangeText={text => handleSearch(text)}
                placeholder={'Search...'}
                placeholderTextColor={COLORS.greyColor}
                style={styles.searchText1}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setFilterVisible(!filterVisible)}>
                <Text style={styles.filterText}>Filters</Text>
              </TouchableOpacity>
              {filterVisible && (
                <View style={styles.filterVisibleView}>
                  <Text style={styles.indicatorText}>Signal Type</Text>

                  <TouchableOpacity
                    style={[styles.optionView, {marginTop: hp(2)}]}
                    onPress={() => onFilterHandle('buy')}>
                    <View
                      style={[
                        styles.checkBoxView,
                        {
                          backgroundColor: buyVisible
                            ? COLORS.primary
                            : COLORS.white,
                        },
                      ]}>
                      <Image style={styles.rightImage} source={check} />
                    </View>
                    <Text style={styles.optionText}>BUY</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.optionView}
                    onPress={() => onFilterHandle('sell')}>
                    <View
                      style={[
                        styles.checkBoxView,
                        {
                          backgroundColor: sellVisible
                            ? COLORS.primary
                            : COLORS.white,
                        },
                      ]}>
                      <Image style={styles.rightImage} source={check} />
                    </View>
                    <Text style={styles.optionText}>SELL</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View
              style={[
                styles.activeView1,
                {
                  width:
                    notificationData.length > 1
                      ? '99%'
                      : notificationData.length == 0
                      ? '99%'
                      : wp(65),
                },
              ]}>
              <View style={styles.titleActiveView1}>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {width: wp(28)}]}>
                  <Text style={styles.titleText4}>{'Date'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {width: wp(28)}]}>
                  <Text style={styles.titleText4}>{'Time'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.mainViewDesign1, {width: wp(60)}]}>
                  <Text style={styles.titleText4}>{'Email'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {width: wp(30)}]}>
                  <Text style={styles.titleText4}>{'Coin'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {width: wp(30)}]}>
                  <Text style={styles.titleText4}>{'Amount'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {width: wp(35)}]}>
                  <Text style={styles.titleText4}>{'Entry Price'}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {width: wp(35)}]}>
                  <Text style={styles.titleText4}>{'Last Price'}</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {width: wp(32)}]}>
                  <Text style={styles.titleText4}>{'Quantity'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {width: wp(30)}]}>
                  <Text style={styles.titleText4}>{'Status'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {width: wp(28)}]}>
                  <Text style={styles.titleText4}>{'Type'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {width: wp(34)}]}>
                  <Text style={styles.titleText4}>{'Reverse'}</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={notificationData}
                extraData={notificationData}
                nestedScrollEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                // contentContainerStyle={{paddingRight: hp(2)}}
                initialNumToRender={1000}
                keyExtractor={item => item.id}
                ListEmptyComponent={() => (
                  <View key={0} style={styles.ListEmptyView}>
                    <View style={styles.subEmptyView}>
                      <Text style={styles.emptyText}>
                        {'No record available'}
                      </Text>
                    </View>
                  </View>
                )}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      key={item.symbol}
                      activeOpacity={1}
                      style={[
                        styles.dataActiveView,
                        {
                          backgroundColor:
                            index % 2 === 0
                              ? COLORS.lightPrimary
                              : COLORS.lightPrimary3,
                          borderTopRightRadius:
                            notificationData.length - 1 == index ? wp(3) : 0,
                          borderBottomRightRadius:
                            notificationData.length - 1 == index ? wp(3) : 0,
                        },
                      ]}>
                      <View style={styles.mainViewDesign}>
                        <Text style={[styles.dataHistoryText]}>
                          {item.trade_json?.jam_ratio_1?.binance__new_trade_data
                            ?.workingTime
                            ? formatDate(
                                item.trade_json?.jam_ratio_1
                                  ?.binance__new_trade_data?.workingTime,
                              )
                            : ''}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text style={[styles.dataHistoryText]}>
                          {item.trade_json?.jam_ratio_1?.binance__new_trade_data
                            ?.workingTime
                            ? formatTime(
                                item.trade_json?.jam_ratio_1
                                  ?.binance__new_trade_data?.workingTime,
                              )
                            : ''}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign1}>
                        <Text style={[styles.dataHistoryText]}>
                          {item.user.email}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text
                          style={[
                            styles.dataHistoryText,
                            {
                              color:
                                item.webhook_signal_direction === 'BUY'
                                  ? COLORS.greenColor
                                  : COLORS.errorColor,
                            },
                          ]}>
                          {item?.symbol}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text style={[styles.dataHistoryText]}>
                          {item?.trade_json?.jam_ratio_1
                            ?.binance__new_trade_data?.cummulativeQuoteQty !=
                          null
                            ? Number(
                                item?.trade_json?.jam_ratio_1
                                  ?.binance__new_trade_data
                                  ?.cummulativeQuoteQty,
                              ) > 1 ||
                              Number(
                                item?.trade_json?.jam_ratio_1
                                  ?.binance__new_trade_data
                                  ?.cummulativeQuoteQty,
                              ) === 0
                              ? Number(
                                  item?.trade_json?.jam_ratio_1
                                    ?.binance__new_trade_data
                                    ?.cummulativeQuoteQty,
                                ).toFixed(2)
                              : (() => {
                                  const priceStr =
                                    item?.trade_json?.jam_ratio_1?.binance__new_trade_data?.cummulativeQuoteQty.toString();
                                  const match = priceStr.match(
                                    /^-?\d*\.?\d*?(?=(00))/,
                                  );
                                  return match
                                    ? match[0]
                                    : priceStr.length > 8
                                    ? Number(priceStr).toFixed(8)
                                    : priceStr;
                                })()
                            : null}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text style={[styles.dataHistoryText]}>
                          {item?.trade_json?.jam_ratio_1
                            ?.binance__trade_entry_price != null
                            ? Number(
                                item?.trade_json?.jam_ratio_1
                                  ?.binance__trade_entry_price,
                              ) >= 1 ||
                              Number(
                                item?.trade_json?.jam_ratio_1
                                  ?.binance__trade_entry_price,
                              ) === 0
                              ? Number(
                                  item?.trade_json?.jam_ratio_1
                                    ?.binance__trade_entry_price,
                                ).toFixed(2)
                              : parseFloat(
                                  Number(
                                    item?.trade_json?.jam_ratio_1
                                      ?.binance__trade_entry_price,
                                  ).toFixed(8),
                                ).toString()
                            : null}
                        </Text>
                      </View>
                      {/* <View style={styles.mainViewDesign}>
                        <Text style={[styles.dataHistoryText]}>
                          {item?.markPrice}
                        </Text>
                      </View> */}
                      <View style={styles.mainViewDesign}>
                        <Text style={[styles.dataHistoryText]}>
                          {item?.trade_json?.jam_ratio_1
                            ?.binance__trade_quantity != null
                            ? Number(
                                item?.trade_json?.jam_ratio_1
                                  ?.binance__trade_quantity,
                              ) > 1 ||
                              Number(
                                item?.trade_json?.jam_ratio_1
                                  ?.binance__trade_quantity,
                              ) === 0
                              ? Number(
                                  item?.trade_json?.jam_ratio_1
                                    ?.binance__trade_quantity,
                                ).toFixed(2)
                              : (() => {
                                  const priceStr =
                                    item?.trade_json?.jam_ratio_1?.binance__trade_quantity.toString();
                                  const match = priceStr.match(
                                    /^-?\d*\.?\d*?(?=(00))/,
                                  );
                                  return match
                                    ? match[0]
                                    : priceStr.length > 8
                                    ? Number(priceStr).toFixed(8)
                                    : priceStr;
                                })()
                            : null}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text style={[styles.dataHistoryText]}>
                          {item?.order_fetch_json?.status}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text
                          style={[
                            styles.dataHistoryText,
                            {
                              color:
                                item.webhook_signal_direction === 'BUY'
                                  ? COLORS.greenColor
                                  : COLORS.errorColor,
                            },
                          ]}>
                          {item?.webhook_signal_direction}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        {item?.webhook_signal_direction === 'BUY' ? (
                          <TouchableOpacity style={styles.sellButton}>
                            <Text style={styles.sellText}>SELL</Text>
                          </TouchableOpacity>
                        ) : (
                          <Text
                            style={[styles.dataHistoryText, {width: wp(34)}]}>
                            {'Square Off'}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default SpotPmsHistory;
