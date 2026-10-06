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
  Switch,
  Platform,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import Header from '../../components/Header';
import {hasNotch} from 'react-native-device-info';
import {COLORS, Fonts} from '../../utils';
import {
  onGetAIDataApi,
  onGetActivePMSApi,
  onGetBalanceApi,
  onGetExtraHistoryApi,
  onGetHistoryDetailApi,
  onGetLastPriceDataApi,
  onGetPMSHistoryDetailApi,
  onGetSpotBalanceApi,
  onGetSpotPMSActiveApi,
  onGetSpotPMSHistoryApi,
  onGetSpotTickers,
  onPostAIDataApi,
  onPostSpotPMSApi,
} from '../../services/Api';
import Config from 'react-native-config';
import {useSelector, useDispatch} from 'react-redux';
import {fetchSttingData} from '../../redux/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StatusSkeleton from '../../components/StatusSkeleton';
import {useTranslation} from 'react-i18next';
import SelectDropdown from 'react-native-select-dropdown';
import {showMessage} from 'react-native-flash-message';
import {PmsPopup} from '../../components/PmsPopup';
import {ActivePlanPopup} from '../../components/ActivePlanPopup';
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

const SpotPMS = ({navigation}) => {
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const {t} = useTranslation();
  const selectedSellRef = useRef(null);
  const selectedBuyRef = useRef(null);
  const dispatch = useDispatch();
  const settingData = useSelector(state => state.settingData);
  const getSpotCloseOrderList = useSelector(
    state => state.getSpotCloseOrderList,
  );
  const getSpotOpenOrderList = useSelector(state => state.getSpotOpenOrderList);
  const user_data = useSelector(state => state.user_data);
  const getBinanceApiError = useSelector(state => state.getBinanceApiError);
  const socketUrl = Config.NEXT_PUBLIC_SERVER_URL_SOCKET;
  const socketPath = '/ws/live-ohlcv-consumer/';
  const languageList = [t('english'), t('vietnamese')];
  const isFocused = useIsFocused();
  // const [balanceData, setBalanceData] = useState(null);
  const [dataHistory, setDataHistory] = useState([]);
  const [filterHistory, setFilterHistory] = useState([]);
  const [skeletonVisible1, setSkeletonVisible1] = useState(false);
  const [search, setSearch] = useState('');
  const [search1, setSearch1] = useState('');
  const [dataActive, setDataActive] = useState([]);
  const [dataFilterActive, setDataFilterActive] = useState([]);
  const [isFooterLoader, setIsFooterLoader] = useState(false);
  const [isPressArray1, setIsPressArray1] = useState([]);
  const [isPressArray, setIsPressArray] = useState([]);
  const [activeVisible, setActiveVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [skeletonVisible, setSkeletonVisible] = useState(false);
  const [activePopupVisible, setActivePopupVisible] = useState(false);
  const [buySelection, setBuySelection] = useState('');
  const [buyEntryPrice, setBuyEntryPrice] = useState('1');
  const [buyQuantity, setBuyQuantity] = useState('30');
  const [buyAmount, setBuyAmount] = useState('30');
  const [sellSelection, setSellSelection] = useState('');
  const [sellEntryPrice, setSellEntryPrice] = useState('1');
  const [sellQuantity, setSellQuantity] = useState('5');
  const [sellAmount, setSellAmount] = useState('5');
  const [spotBalanceList, setSpotBalanceList] = useState([]);
  const [sellSpotBalanceList, setSellSpotBalanceList] = useState([]);
  const [defaultValueBuy, setDefaultValueBuy] = useState('');
  const [defaultValueSell, setDefaultValueSell] = useState('');
  const [loading, setLoading] = useState(false);
  const [buyError, setBuyError] = useState(false);
  const [buyMessage, setBuyMessage] = useState('');
  const [sellError, setSellError] = useState(false);
  const [sellMessage, setSellMessage] = useState('');
  const [usdtValue, setUsdtValue] = useState(0);
  const [balanceValue, setBalanceValue] = useState('');
  const [HistoryCount, setHistoryCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [activatePopup, setActivatePopup] = useState(false);
  const [keyPopup, setKeyPopup] = useState(false);
  const [activePackage, setActivePackage] = useState(1);
  const [apiErrorVisible, setApiErrorVisible] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [loginPopupVisible, setLoginPopupVisible] = useState(false);

  useEffect(() => {
    onGetSpotBalanceData();
    getAllData();
  }, []);

  useEffect(() => {
    onActivePackage();
  }, []);

  const onActivePackage = async () => {
    if (getBinanceApiError != '') {
      setApiErrorVisible(true);
    }
    const token = await AsyncStorage.getItem('accessToken');
    if (token !== null) {
      setAuthToken(token);
    } else {
      setLoginPopupVisible(true);
    }
    const data = await AsyncStorage.getItem('timePeriod');
    setActivePackage(parseFloat(data));
  };

  useEffect(() => {
    if (settingData) {
      setActiveVisible(settingData?.active_admin_spot_bot_trading);
    }
  }, [settingData]);

  const onGetSpotBalanceData = async () => {
    try {
      const response = await onGetSpotTickers();
      console.log('get BalanceList::', response.data.data);
      let array1 = [];
      response.data.data.map(item => {
        array1.push(removePrefix(item, 'USDT'));
      });
      setSpotBalanceList(array1);
    } catch (err) {
      console.log('err', err);
    }
  };

  useEffect(() => {
    onGetSpotPMSHistoryData();
    onGetSpotPMSActiveData();
  }, []);

  const onGetSpotPMSHistoryData = async () => {
    try {
      let array = [];
      setSkeletonVisible1(true);
      if (getSpotCloseOrderList.results) {
        // getSpotCloseOrderList.results.map(item => {
        //   console.log('get Value:::', item.trade_json.jam_ratio_1.binance__new_trade_data.status);
        //   if (
        //     item.trade_json.jam_ratio_1.binance__new_trade_data.status ==
        //     'FILLED'
        //   ) {
        //     console.log('get Value:::', item);
        //     array.push(item);
        //   }
        // });
        setDataHistory(getSpotCloseOrderList.results);
        setFilterHistory(getSpotCloseOrderList.results);
        setHistoryCount(getSpotCloseOrderList.count);
        setIsPressArray1(
          Array(getSpotCloseOrderList.results.length).fill(false),
        );
        setSkeletonVisible1(false);
      } else {
        const response = await onGetSpotPMSHistoryApi();

        if (response.data.history_trade_list.results.length > 0) {
          setSkeletonVisible1(false);
          setIsPressArray1(
            Array(response.data.history_trade_list.results.length).fill(false),
          );
          setHistoryCount(response.data.history_trade_list.count);
          setDataHistory(response.data.history_trade_list.results);
          setFilterHistory(response.data.history_trade_list.results);
        } else {
          setSkeletonVisible1(false);
        }
      }
    } catch (err) {
      setSkeletonVisible1(false);
      console.log('err', err);
    }
  };

  const onGetSpotPMSActiveData = async () => {
    try {
      setSkeletonVisible(true);
      if (getSpotOpenOrderList.length > 0) {
        setDataActive(getSpotOpenOrderList);
        setDataFilterActive(getSpotOpenOrderList);
        setActiveCount(getSpotOpenOrderList.length);
        setIsPressArray(Array(getSpotOpenOrderList.length).fill(false));
        setSkeletonVisible(false);
      } else {
        const response = await onGetSpotPMSActiveApi();
        if (response.data.active_trade_list.length > 0) {
          setDataActive(response.data.active_trade_list);
          setDataFilterActive(response.data.active_trade_list);
          setActiveCount(response.data.active_trade_list.length);
          setIsPressArray(
            Array(response.data.active_trade_list.length).fill(false),
          );
          setSkeletonVisible(false);
        } else {
          setSkeletonVisible(false);
        }
      }
    } catch (err) {
      setSkeletonVisible(false);
      console.log('err', err);
    }
  };

  const hasPrefix = (str, prefix) => {
    return str.startsWith(prefix);
  };

  const getAllData = async () => {
    try {
      let count = await AsyncStorage.getItem('notificationCount');
      setNotificationCount(count);
      const response = await onGetSpotBalanceApi();
      let balances = [];
      if (response.data) {
        console.log('Get Response', response.data.balances);
        response.data.balances.map(item => {
          if (parseFloat(item.free) >= 1 && !hasPrefix(item.asset, 'LD')) {
            balances.push(item);
          }
          if (item.asset == 'USDT') {
            setUsdtValue(parseFloat(item.free).toFixed(2));
          }
        });
        setSellSpotBalanceList(balances);
        setLoading(!loading);
      }
    } catch (err) {
      console.log('err::', err.response.data);
    }
  };

  // useEffect(() => {
  //   const fetchData = () => {
  //     var socket = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');
  //     // const socket = new WebSocket(socketUrl + socketPath);
  //     if (dataActive.length > 0) {
  //       socket.onmessage = event => {
  //         const binanceWebSocketData = JSON.parse(event.data);

  //         // Update the tableData state based on WebSocket data
  //         setDataActive(prevData => {
  //           return prevData.map(item => {
  //             const binanceSymbolData = binanceWebSocketData.find(
  //               data => data.s === `${item.symbol}`,
  //             );
  //             // const binanceSymbolData = binanceWebSocketData[item.symbol];
  //             const decimalDigitsInPrice = countDecimalDigits(item.price);
  //             const latestLastprice = binanceSymbolData
  //               ? parseFloat(binanceSymbolData.c).toFixed(
  //                   decimalDigitsInPrice._j,
  //                 )
  //               : null;
  //             if (binanceSymbolData) {
  //               return {
  //                 ...item,
  //                 markPrice: latestLastprice,
  //               };
  //             }
  //             return item;
  //           });
  //         });
  //         socket.close();
  //       };
  //     }
  //   };
  //   if (isFocused) {
  //     const interval = setInterval(fetchData, 2000);

  //     return () => clearInterval(interval);
  //   }
  //   if (!isFocused) {
  //     handleSearch('');
  //   }
  // }, [dataActive, isFocused]);

  const handleShowUnderlay = index => {
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

  const handleShowUnderlay1 = index => {
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
      const filtered = filterHistory.filter(item =>
        item.symbol.toLowerCase().includes(text.toLowerCase()),
      );
      setDataHistory(filtered);
      setRefresh(!refresh);
    } else {
      setDataHistory(filterHistory);
      setRefresh(!refresh);
    }
  };

  const handleSearch1 = text => {
    setSearch1(text);
    if (text !== '') {
      const filtered = dataFilterActive.filter(item =>
        item.symbol.toLowerCase().includes(text.toLowerCase()),
      );
      setDataActive(filtered);
      setRefresh(!refresh);
    } else {
      setDataActive(dataFilterActive);
      setRefresh(!refresh);
    }
  };

  const formatNumber = num => {
    let numStr = num.toFixed(4);
    numStr = numStr.replace(/(\.\d*?[1-9])0+$|(\.0*?$)/, '$1');
    return numStr;
  };

  const handleBuyTextInput = async (from, text) => {
    if (from == 'entryPrice') {
      if (buyAmount != '' && text != '') {
        setBuyQuantity(`${parseInt(parseFloat(buyAmount) / parseFloat(text))}`);
        setRefresh(!refresh);
      } else {
        setBuyQuantity('0');
        setRefresh(!refresh);
      }
      setBuyEntryPrice(`${text}`);
    } else if (from == 'quantity') {
      setBuyQuantity(text);
    } else if (from == 'amount') {
      if (text < 30 && buyError) {
        setBuyError(true);
        setBuyMessage('Amount must be at least 30.');
      } else {
        setBuyError(false);
      }
      if (buyEntryPrice != '' && text != '') {
        setBuyQuantity(
          `${parseInt(parseFloat(text) / parseFloat(buyEntryPrice))}`,
        );
        setRefresh(!refresh);
      } else {
        setBuyQuantity('0');
        setRefresh(!refresh);
      }
      setBuyAmount(`${parseFloat(text)}`);
    }
  };

  const handleSellTextInput = async (from, text) => {
    if (from == 'entryPrice') {
      setSellEntryPrice(`${text}`);
      if (sellQuantity != '' && text != '') {
        setSellAmount(
          formatNumber(
            parseFloat(`${parseFloat(text) * parseFloat(sellQuantity)}`),
          ),
        );
        setRefresh(!refresh);
      } else {
        setSellAmount('0');
        setRefresh(!refresh);
      }
    } else if (from == 'quantity') {
      setSellQuantity(`${text}`);
      if (sellEntryPrice != '' && text != '') {
        setSellAmount(
          formatNumber(
            parseFloat(`${parseFloat(sellEntryPrice) * parseFloat(text)}`),
          ),
        );
        setRefresh(!refresh);
      } else {
        setSellAmount('0');
        setRefresh(!refresh);
      }
    } else if (from == 'amount') {
      setSellAmount(`${parseFloat(text)}`);
    }
  };

  const removePrefix = (str, prefix) => {
    const lastIndex = str.lastIndexOf(prefix);
    if (lastIndex !== -1) {
      return str.slice(0, lastIndex) + str.slice(lastIndex + prefix.length);
    }
    return str;
  };

  const onBuyDataPost = async () => {
    try {
      if (defaultValueBuy == '' || buyEntryPrice == '' || buyAmount == '') {
        setBuyError(true);
        setBuyMessage('Coin, Entry Price and Amount cannot be left blank');
      } else if (buyAmount < 30) {
        setBuyError(true);
        setBuyMessage('Amount must be at least 30.');
      } else {
        const raw = JSON.stringify({
          ticker: defaultValueBuy,
          signal: 'buy',
          amount: parseFloat(buyAmount),
          exit_price: parseFloat(buyEntryPrice),
          quantity: parseFloat(buyQuantity),
        });
        const response = await onPostSpotPMSApi(raw);
        console.log('get Response:', response.data);
        setBuyError(false);
        if (response.data) {
          showMessage({
            message: 'Values For BUY Signals Have Been Saved Successfully!',
            type: 'success',
            duration: 3000,
          });
        }
      }
    } catch (err) {
      console.log('err', err.response.data);
      setBuyError(true);
      if (err.response.data.detail != undefined) {
        setBuyMessage(err.response.data.detail);
      } else if (err.response.data.quantity != undefined) {
        setBuyMessage(err.response.data.quantity[0]);
      } else if (err.response.data.exit_price != undefined) {
        setBuyMessage(err.response.data.exit_price[0]);
      } else if (err.response.data.amount != undefined) {
        setBuyMessage(err.response.data.amount[0]);
      }
    }
  };

  const onSellDataPost = async () => {
    try {
      if (
        defaultValueSell == '' ||
        sellEntryPrice == '' ||
        sellQuantity == ''
      ) {
        setSellError(true);
        setSellMessage('Coin, Entry Price and Quantity cannot be left blank');
      } else {
        const raw = JSON.stringify({
          ticker: defaultValueSell,
          signal: 'sell',
          amount: parseFloat(sellAmount),
          exit_price: parseFloat(sellEntryPrice),
          quantity: parseFloat(sellQuantity),
        });
        const response = await onPostSpotPMSApi(raw);
        console.log('get Response:', response.data);
        setSellError(false);
        if (response.data) {
          showMessage({
            message: 'Values For SELL Signals Have Been Saved Successfully!',
            type: 'success',
            duration: 3000,
          });
        }
      }
    } catch (err) {
      console.log('err', err.response.data);
      setSellError(true);
      if (err.response.data.detail != undefined) {
        setSellMessage(err.response.data.detail);
      } else if (err.response.data.quantity != undefined) {
        setSellMessage(err.response.data.quantity[0]);
      } else if (err.response.data.exit_price != undefined) {
        setSellMessage(err.response.data.exit_price[0]);
      } else if (err.response.data.amount != undefined) {
        setSellMessage(err.response.data.amount[0]);
      }
    }
  };

  const onSelectedValueSet = async item => {
    try {
      let price = 1;
      if (selectedBuyRef.current) {
        selectedBuyRef.current.close();
      }
      selectedBuyRef.current = new WebSocket(
        'wss://fstream.binance.com/ws/!ticker@arr',
      );

      selectedBuyRef.current.onmessage = event => {
        try {
          const binanceWebSocketData = JSON.parse(event.data);
          const binanceSymbolData = binanceWebSocketData.find(
            data => data.s === `${item}USDT`,
          );
          console.log('value get>', binanceSymbolData);
          if (binanceSymbolData) {
            handleBuyTextInput('entryPrice', binanceSymbolData.c);
            selectedBuyRef.current.close();
          } else {
            handleBuyTextInput('entryPrice', price);
          }
        } catch (err) {
          console.error('Error processing WebSocket message:', err);
        }
      };

      selectedBuyRef.current.onerror = error => {
        console.log('WebSocket Error:', error);
        selectedBuyRef.current.close();
      };

      // Handle WebSocket close event
      selectedBuyRef.current.onclose = () => {
        console.log('WebSocket closed');
      };
    } catch (err) {
      console.log('err', err);
    }
  };

  const handleSellEntryPrice = async (item, data) => {
    setSellEntryPrice(`${item}`);
    console.log('value get>', item);
    if (data.free != '' && item != '') {
      setSellAmount(formatNumber(parseFloat(item * parseInt(data.free))));
      setRefresh(!refresh);
    } else {
      setSellAmount('0');
      setRefresh(!refresh);
    }
  };

  const onSelectedSellValueSet = async item => {
    try {
      let price = 1;
      if (selectedBuyRef.current) {
        selectedBuyRef.current.close();
      }
      selectedSellRef.current = new WebSocket(
        'wss://fstream.binance.com/ws/!ticker@arr',
      );
      selectedSellRef.current.onmessage = event => {
        try {
          const binanceWebSocketData = JSON.parse(event.data);
          const binanceSymbolData = binanceWebSocketData.find(
            data => data.s === `${item.asset}USDT`,
          );
          selectedSellRef.current.close();
          console.log('value get>', binanceSymbolData);
          if (binanceSymbolData) {
            handleSellEntryPrice(binanceSymbolData.c, item);
            selectedSellRef.current.close();
          } else {
            handleSellEntryPrice(price, item);
          }
        } catch (err) {
          console.error('Error processing WebSocket message:', err);
        }
      };
      selectedBuyRef.current.onerror = error => {
        console.log('WebSocket Error:', error);
        selectedBuyRef.current.close();
      };

      // Handle WebSocket close event
      selectedBuyRef.current.onclose = () => {
        console.log('WebSocket closed');
      };
    } catch (err) {
      console.log('err', err);
    }
  };

  useEffect(() => {
    if (!isFocused) {
      handleSearch('');
      handleSearch1('');
    }
  }, [isFocused]);

  const formattedDate = timestamp => {
    if (!timestamp) return '';
    // Convert the timestamp to a Date object
    const date = new Date(timestamp);

    // Get the year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    // Format as YYYY-MM-DD
    return `${year}-${month}-${day}`;
  };

  const onPostSettingData = async value => {
    try {
      setTimeout(() => {
        setActiveVisible(value);
      }, 150);
      let raw = JSON.stringify({
        active_admin_spot_bot_trading: value,
      });
      const response = await onPostAIDataApi(raw);
      console.log('Response Balance>>', response.data);
      if (response.data) {
        setActivePopupVisible(true);
        dispatch(fetchSttingData(response.data));
      }
    } catch (err) {
      console.log('Error:', err.response.data);
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
          {/* <SubHeader title={'PMS'} onPress={() => navigation.goBack()} /> */}
          <Header
            title={t('spot_pms')}
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(15)}}>
            <View style={styles.portraitRowView}>
              <View
                style={[styles.balanceBuyMathView, {marginVertical: hp(3)}]}>
                <View style={styles.rowView}>
                  <Text style={styles.selectCoinText}>
                    {t('select_coin')}
                    <Text>*</Text>
                  </Text>
                  <SelectDropdown
                    data={spotBalanceList}
                    onSelect={(selectedItem, index) => {
                      onSelectedValueSet(selectedItem);
                      setDefaultValueBuy(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={defaultValueBuy}
                    renderCustomizedRowChild={(item, index, isSelected) => {
                      return (
                        <View style={styles.dropdownView}>
                          <Text style={styles.dropdownItemTxtStyle}>
                            {item}
                          </Text>
                        </View>
                      );
                    }}
                    rowStyle={styles.dropdownView}
                    buttonStyle={styles.dropdown2BtnStyle}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                  {/* <TextInput
                  value={defaultValueBuy}
                  onChangeText={text => setDefaultValueBuy(text)}
                  placeholder={'Select coin'}
                  placeholderTextColor={COLORS.greyColor}
                  style={styles.coinPostText}
                  onFocus={() => setRefresh(true)}
                  onBlur={() => setRefresh(false)}
                />
                {refresh && (
                  <View style={styles.positionView}>
                    <View style={{flex: 1}}>
                      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: 5}}>
                        {spotBalanceList.map(item => (
                          <View style={styles.dropdownView}>
                            <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                          </View>
                        ))}
                      </ScrollView>
                      <FlatList
                        data={spotBalanceList}
                        keyExtractor={index => index.toString()}
                        renderItem={({item, index}) => {
                          return (
                            <View style={styles.dropdownView}>
                              <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                            </View>
                          );
                        }}
                      />
                    </View>
                  </View>
                )} */}
                  <Text style={[styles.selectCoinText, {marginTop: hp(2)}]}>
                    {t('quantity_small')}
                  </Text>
                  <TextInput
                    value={buyQuantity}
                    onChangeText={text => handleBuyTextInput('quantity', text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <View style={styles.rowView}>
                  <Text style={styles.selectCoinText}>
                    {t('entry_price_small')}
                    <Text>*</Text>
                  </Text>
                  <TextInput
                    value={buyEntryPrice}
                    onChangeText={text =>
                      handleBuyTextInput('entryPrice', text)
                    }
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                  <Text style={[styles.selectCoinText, {marginTop: hp(2)}]}>
                    {t('amount')}
                    <Text>*</Text>
                  </Text>
                  <TextInput
                    value={buyAmount}
                    onChangeText={text => handleBuyTextInput('amount', text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <View style={styles.rowView}>
                  <TouchableOpacity
                    style={styles.buyButtonView}
                    onPress={() => {
                      if (authToken != '') {
                        if (activePackage > 0) {
                          if (
                            user_data?.binance_api == null ||
                            user_data?.binance_secret_key == null
                          ) {
                            setKeyPopup(true);
                          } else if (
                            apiErrorVisible &&
                            getBinanceApiError != 'error'
                          ) {
                            setKeyPopup(true);
                          } else {
                            onBuyDataPost();
                          }
                        } else {
                          setActivatePopup(true);
                        }
                      } else {
                        setLoginPopupVisible(true);
                      }
                    }}>
                    <Text style={styles.buyText}>{t('buy')}</Text>
                  </TouchableOpacity>
                </View>
                {buyError ? (
                  <Text style={styles.errorText}>{buyMessage}</Text>
                ) : null}
                <Text style={styles.usdtText}>{'USDT: ' + usdtValue}</Text>
              </View>

              <View
                style={[
                  styles.balanceMathView,
                  {zIndex: -1, marginBottom: isPortrait ? hp(3) : 0},
                ]}>
                <View style={styles.rowView}>
                  <Text style={styles.selectCoinText}>
                    {t('select_coin')}
                    <Text>*</Text>
                  </Text>
                  <SelectDropdown
                    data={sellSpotBalanceList}
                    onSelect={(selectedItem, index) => {
                      setDefaultValueSell(selectedItem.asset);
                      console.log('get Value:::', selectedItem);
                      setSellQuantity(
                        `${parseInt(parseFloat(selectedItem.free).toFixed(2))}`,
                      );
                      setBalanceValue(
                        `${parseFloat(selectedItem.free).toFixed(2)}`,
                      );
                      onSelectedSellValueSet(selectedItem);
                      // handleSellTextInput('entryPrice', selectedItem.free);
                    }}
                    // defaultButtonText={defaultValueSell}
                    rowTextForSelection={(item, index) => {
                      return item.asset;
                    }}
                    renderCustomizedRowChild={(item, index, isSelected) => {
                      return (
                        <View style={styles.dropdownView}>
                          <Text style={styles.dropdownItemTxtStyle}>
                            {item.asset}
                          </Text>
                        </View>
                      );
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem.asset;
                    }}
                    rowStyle={styles.dropdownView}
                    buttonStyle={styles.dropdown2BtnStyle}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                    // rowTextStyle={styles.dropdown2RowTxtStyle}
                  />
                  <Text style={[styles.selectCoinText, {marginTop: hp(2)}]}>
                    {t('quantity_small')}
                    <Text>*</Text>
                  </Text>
                  <TextInput
                    value={sellQuantity}
                    onChangeText={text => handleSellTextInput('quantity', text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <View style={styles.rowView}>
                  <Text style={styles.selectCoinText}>
                    {t('entry_price_small')}
                    <Text>*</Text>
                  </Text>
                  <TextInput
                    value={sellEntryPrice}
                    onChangeText={text =>
                      handleSellTextInput('entryPrice', text)
                    }
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                  <Text style={[styles.selectCoinText, {marginTop: hp(2)}]}>
                    {t('amount')}
                  </Text>
                  <TextInput
                    value={sellAmount}
                    onChangeText={text => handleSellTextInput('amount', text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <View style={styles.rowView}>
                  <TouchableOpacity
                    style={styles.sellButtonView}
                    onPress={() => {
                      if (authToken != '') {
                        if (activePackage > 0) {
                          if (
                            user_data?.binance_api == null ||
                            user_data?.binance_secret_key == null
                          ) {
                            setKeyPopup(true);
                          } else if (
                            apiErrorVisible &&
                            getBinanceApiError != 'error'
                          ) {
                            setKeyPopup(true);
                          } else {
                            onSellDataPost();
                          }
                        } else {
                          setActivatePopup(true);
                        }
                      } else {
                        setLoginPopupVisible(true);
                      }
                    }}>
                    <Text style={styles.buyText}>{t('sell')}</Text>
                  </TouchableOpacity>
                </View>
                {sellError ? (
                  <Text style={styles.errorText}>{sellMessage}</Text>
                ) : null}
                <Text style={styles.usdtText}>
                  {t('balance') + ' : ' + balanceValue}
                </Text>
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
                  <View style={styles.switchTextInput}>
                    <Switch
                      trackColor={{
                        false: activeVisible
                          ? COLORS.lightPrimary
                          : COLORS.errorColor,
                        true: activeVisible
                          ? COLORS.lightPrimary
                          : COLORS.errorColor,
                      }}
                      thumbColor={activeVisible ? '#f4f3f4' : '#f4f3f4'}
                      ios_backgroundColor={COLORS.errorColor}
                      onValueChange={() => {
                        if (authToken != '') {
                          if (activePackage > 0) {
                            if (
                              user_data?.binance_api == null ||
                              user_data?.binance_secret_key == null
                            ) {
                              setKeyPopup(true);
                            } else if (
                              apiErrorVisible &&
                              getBinanceApiError != 'error'
                            ) {
                              setKeyPopup(true);
                            } else {
                              onPostSettingData(!activeVisible);
                            }
                          } else {
                            setActivatePopup(true);
                          }
                        } else {
                          setLoginPopupVisible(true);
                        }
                      }}
                      value={activeVisible}
                    />
                    <TextInput
                      value={search1}
                      onChangeText={text => handleSearch1(text)}
                      placeholder={t('search_coin')}
                      placeholderTextColor={COLORS.greyColor}
                      style={styles.searchText}
                    />
                  </View>
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
                            {width: isPortrait ? wp(25) : wp(7)},
                          ]}>
                          {t('coin')}
                        </Text>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(26) : wp(9)},
                          ]}>
                          {t('quantity')}
                        </Text>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(31) : wp(11)},
                          ]}>
                          {`${t('last_price_small')} ($)`}
                        </Text>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(31) : wp(11)},
                          ]}>
                          {`${t('amount_capital')} ($)`}
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
                            let formattedEntryPrice;
                            if (isNaN(item.price)) {
                              formattedEntryPrice = '0.00';
                            } else if (item.price >= 1) {
                              formattedEntryPrice = parseFloat(
                                item.price,
                              ).toFixed(2);
                            } else {
                              const numberString = item.price.toString();
                              const matchResult =
                                numberString.indexOf('.') >= 0
                                  ? numberString.replace(/\.?0+$/, '')
                                  : numberString;
                              formattedEntryPrice =
                                matchResult != '0' ? matchResult : '0.00';
                            }
                            let formattedQuantity;
                            if (isNaN(item.origQty)) {
                              formattedQuantity = '0.00';
                            } else if (item.origQty >= 1) {
                              formattedQuantity = parseFloat(
                                item.origQty,
                              ).toFixed(2);
                            } else {
                              const numberString = item.origQty.toString();
                              const matchResult =
                                numberString.indexOf('.') >= 0
                                  ? numberString.replace(/\.?0+$/, '')
                                  : numberString;
                              formattedQuantity =
                                matchResult != '0' ? matchResult : '0.00';
                            }
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
                                  key={item.created_at}
                                  style={[
                                    styles.dataActiveView,
                                    {
                                      backgroundColor: isPressArray[index]
                                        ? COLORS.lightGreen1
                                        : COLORS.white,
                                    },
                                  ]}>
                                  <Text
                                    style={[
                                      styles.dataText,
                                      {width: isPortrait ? wp(24) : wp(7)},
                                    ]}>
                                    {formattedDate(item.time)}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataText,
                                      {width: isPortrait ? wp(25) : wp(7)},
                                    ]}>
                                    {item.symbol}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataText,
                                      {width: isPortrait ? wp(26) : wp(9)},
                                    ]}>
                                    {formattedQuantity}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataText,
                                      {width: isPortrait ? wp(31) : wp(11)},
                                    ]}>
                                    {formattedEntryPrice}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataText,
                                      {
                                        width: isPortrait ? wp(31) : wp(11),
                                      },
                                    ]}>
                                    {parseFloat(
                                      formattedEntryPrice * formattedQuantity,
                                    ).toFixed(2)}
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
                            {width: isPortrait ? wp(24) : wp(7)},
                          ]}>
                          {t('quantity')}
                        </Text>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(26) : wp(11)},
                          ]}>
                          {`${t('last_price_small')} ($)`}
                        </Text>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(26) : wp(11)},
                          ]}>
                          {`${t('amount_capital')} ($)`}
                        </Text>
                        <Text
                          style={[
                            styles.titleText,
                            {width: isPortrait ? wp(16) : wp(5)},
                          ]}>
                          {t('type')}
                        </Text>
                      </View>
                      {skeletonVisible1 ? (
                        <StatusSkeleton />
                      ) : (
                        <FlatList
                          data={dataHistory}
                          extraData={dataHistory}
                          initialNumToRender={5000000}
                          nestedScrollEnabled
                          // contentContainerStyle={{paddingBottom: hp(2)}}
                          showsVerticalScrollIndicator={false}
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
                                    color: COLORS.primary,
                                    fontSize: 16,
                                  }}>
                                  {t('no_records_available')}
                                </Text>
                              </View>
                            </View>
                          )}
                          // onEndReachedThreshold={0.001}
                          // onEndReached={() => onGetExtraHistoryData()}
                          renderItem={({item, index}) => {
                            let formattedEntryPrice;
                            if (
                              isNaN(
                                item.trade_json?.jam_ratio_1
                                  ?.binance__trade_entry_price,
                              )
                            ) {
                              formattedEntryPrice = '0.00';
                            } else if (
                              item.trade_json?.jam_ratio_1
                                ?.binance__trade_entry_price >= 1
                            ) {
                              formattedEntryPrice = parseFloat(
                                item.trade_json?.jam_ratio_1
                                  ?.binance__trade_entry_price,
                              ).toFixed(2);
                            } else {
                              const numberString =
                                item.trade_json?.jam_ratio_1?.binance__trade_entry_price.toString();
                              const matchResult =
                                numberString.indexOf('.') >= 0
                                  ? numberString.replace(/\.?0+$/, '')
                                  : numberString;
                              formattedEntryPrice =
                                matchResult != '0' ? matchResult : '0.00';
                            }
                            let formattedQuantity;
                            if (isNaN(item?.order_fetch_json?.executedQty)) {
                              formattedQuantity = '0.00';
                            } else if (
                              item?.order_fetch_json?.executedQty >= 1
                            ) {
                              formattedQuantity = parseFloat(
                                item?.order_fetch_json?.executedQty,
                              ).toFixed(2);
                            } else {
                              const numberString =
                                item?.order_fetch_json?.executedQty.toString();
                              const matchResult =
                                numberString.indexOf('.') >= 0
                                  ? numberString.replace(/\.?0+$/, '')
                                  : numberString;
                              formattedQuantity =
                                matchResult != '0' ? matchResult : '0.00';
                            }
                            return (
                              <TouchableHighlight
                                // onHideUnderlay={() => handleHideUnderlay(index)}
                                onShowUnderlay={() => handleShowUnderlay(index)}
                                activeOpacity={1}
                                onPress={() => console.log('hello')}
                                underlayColor={COLORS.lightPrimary2}>
                                <View
                                  key={item.created_at}
                                  style={[
                                    styles.dataHistoryView,
                                    {
                                      backgroundColor: isPressArray1[index]
                                        ? COLORS.lightPrimary2
                                        : COLORS.white,
                                    },
                                  ]}>
                                  <Text
                                    style={[
                                      styles.dataHistoryText,
                                      {
                                        width: isPortrait ? wp(24) : wp(7),
                                        color: isPressArray1[index]
                                          ? COLORS.white
                                          : COLORS.black,
                                      },
                                    ]}>
                                    {formattedDate(
                                      item.order_fetch_json.workingTime,
                                    )}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataHistoryText,
                                      {
                                        width: isPortrait ? wp(24) : wp(7),
                                        color: isPressArray1[index]
                                          ? COLORS.white
                                          : COLORS.black,
                                      },
                                    ]}>
                                    {item?.symbol}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataHistoryText,
                                      {
                                        width: isPortrait ? wp(24) : wp(7),
                                        color: isPressArray1[index]
                                          ? COLORS.white
                                          : COLORS.black,
                                      },
                                    ]}>
                                    {formattedQuantity}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataHistoryText,
                                      {
                                        width: isPortrait ? wp(26) : wp(11),
                                        color: isPressArray1[index]
                                          ? COLORS.white
                                          : COLORS.black,
                                      },
                                    ]}>
                                    {formattedEntryPrice}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataHistoryText,
                                      {
                                        width: isPortrait ? wp(26) : wp(11),
                                        color: isPressArray1[index]
                                          ? COLORS.white
                                          : COLORS.black,
                                      },
                                    ]}>
                                    {parseFloat(
                                      item?.trade_json?.jam_ratio_1
                                        ?.binance__new_trade_data
                                        ?.cummulativeQuoteQty,
                                    ).toFixed(2)}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.dataHistoryText,
                                      {
                                        width: isPortrait ? wp(16) : wp(5),
                                        color:
                                          item?.trade_json?.jam_ratio_1
                                            ?.binance__new_trade_data?.side ===
                                          'BUY'
                                            ? COLORS.greenColor
                                            : COLORS.errorColor,
                                      },
                                    ]}>
                                    {
                                      item.trade_json?.jam_ratio_1
                                        ?.binance__new_trade_data?.side
                                    }
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
      <PmsPopup
        pageTitle={t('spot_pms_is')}
        modelVisible={activePopupVisible}
        setModelVisible={setActivePopupVisible}
        activeStatus={activeVisible}
      />
      <ActivePlanPopup
        modelVisible={activatePopup}
        setModelVisible={setActivatePopup}
        title={' to Activate Plan.'}
        firstButtonTitle={t('explore_plan')}
        secondButtonTitle={t('cancel')}
        secondButtonClick={() => setActivatePopup(false)}
        firstButtonClick={() => {
          setActivatePopup(false);
          navigation.navigate('PlanScreen');
        }}
      />
      <ActivePlanPopup
        modelVisible={keyPopup}
        setModelVisible={setKeyPopup}
        title={' to Enter API Key.'}
        firstButtonTitle={t('proceed')}
        secondButtonTitle={t('cancel')}
        secondButtonClick={() => setKeyPopup(false)}
        firstButtonClick={() => {
          setKeyPopup(false);
          navigation.navigate('ProfileScreen');
        }}
      />
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
          setTimeout(() => {
            navigation.navigate('LoginScreen');
          }, 100);
        }}
      />
    </View>
  );
};

export default SpotPMS;
