import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  FlatList,
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
import {COLORS, Fonts} from '../../utils';
import card5 from '../../images/card5.png';
import {Marquee} from '@animatereactnative/marquee';
import {useTranslation} from 'react-i18next';
import {
  onPostAutoManualDataApi,
  onPostTickerDataApi,
  onGetCryptoTickerDataApi,
  onDeleteTickerDataApi,
  onPostTickerConfigDataApi,
  onDeleteTickerConfigDataApi,
  onGetTickerConfigDataApi,
  onPostAIDataApi,
  onPostAIAutoManualDataApi,
  onGetAnalyticsDataApi,
  onGetPMSHistoryDetailApi,
  onGetActivePMSApi,
  onGetWelcomeDataApi,
  onPostTutorialDataApi,
  onGetAdminTradeDefaultApi,
} from '../../services/Api';
import moment from 'moment-timezone';
import {InvitePopup} from '../../components/InvitePopup';
import Clipboard from '@react-native-clipboard/clipboard';
import {BotSettingPopup} from '../../components/BotSettingPopup';
import {CommonPopup} from '../../components/CommonPopup';
import {BotManualPopup} from '../../components/BotManualPopup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as RNLocalize from 'react-native-localize';
import arrowUp from '../../images/arrowUp.png';
import down from '../../images/down.png';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import {CoinSettingPopup} from '../../components/CoinSettingPopup';
import SkeletonPlaceholderComponent from '../../components/SkeletonPlaceholderComponent';
import {useIsFocused} from '@react-navigation/native';
import Config from 'react-native-config';
import {Neomorph} from 'react-native-neomorph-shadows';
import {AIBotSettingPopup} from '../../components/AIBotSettingPopup';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchAIAutoManualData,
  fetchAnalyticsData,
  fetchAutoManualData,
  fetchPMSHistoryList,
  fetchPmsActiveList,
} from '../../redux/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {WelcomePopup} from '../../components/WelcomePopup';
import {ActivePlanPopup} from '../../components/ActivePlanPopup';
import {LoginPopup} from '../../components/LoginPopup';
import {useTheme} from '../../utils/ThemeProvider';
import {portraitStyles, landscapeStyles} from './styles';
import useOrientation from '../../components/OrientationComponent';

const dataArray = [
  {
    id: 1,
    date: '0.063',
    coin: 'POLYXUSDT',
    price: '0.1563245',
    type: 'Sell',
  },
];

const HomeScreen = ({navigation}) => {
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const {t} = useTranslation();
  const {theme} = useTheme();
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const intervalRef = useRef(null);
  const user_data = useSelector(state => state.user_data);
  const balanceData = useSelector(state => state.balanceData);
  const settingData = useSelector(state => state.settingData);
  const marqueeData = useSelector(state => state.marqueeData);
  const lastLeadData = useSelector(state => state.lastLeadData);
  const autoManualData = useSelector(state => state.autoManualData);
  const aiAutoManualData = useSelector(state => state.aiAutoManualData);
  const tickerData = useSelector(state => state.tickerData);
  const binanceData = useSelector(state => state.binanceData);
  const getBinanceApiError = useSelector(state => state.getBinanceApiError);
  // const notificationCount = useSelector(state => state.notificationCount);
  const socketUrl = Config.NEXT_PUBLIC_SERVER_URL_SOCKET;
  const socketPath = '/ws/live-ohlcv-consumer/';
  const isFocused = useIsFocused();
  const scrollRef = useRef(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [referal, setReferal] = useState('');
  const [filterLead, setFilterLead] = useState([]);
  const [coinDataList, setCoinDataList] = useState([]);
  const [dataActiveSort, setDataActiveSort] = useState([]);
  const [marqueeDataList, setMarqueeDataList] = useState([]);
  const [search, setSearch] = useState('');
  const [search1, setSearch1] = useState('');
  const [autoSelect, setAutoSelect] = useState(false);
  const [leverage, setLeverage] = useState('0');
  const [amount, setAmount] = useState('0');
  const [profit, setProfit] = useState('0');
  const [loss, setLoss] = useState('0');
  const [sellProfit, setSellProfit] = useState('0');
  const [sellLoss, setSellLoss] = useState('0');
  const [dailyProfit, setDailyProfit] = useState('0');
  const [dailyLoss, setDailyLoss] = useState('0');
  const [botConfig, setBotConfig] = useState(false);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [botModalVisible, setBotModalVisible] = useState(false);
  const [botManualVisible, setBotManualVisible] = useState(false);
  const [AIleverage, setAILeverage] = useState('0');
  const [AIamount, setAIAmount] = useState('0');
  const [AIprofit, setAIProfit] = useState('0');
  const [AIloss, setAILoss] = useState('0');
  const [AIsellProfit, setAISellProfit] = useState('0');
  const [AIsellLoss, setAISellLoss] = useState('0');
  const [AIdailyProfit, setAIDailyProfit] = useState('0');
  const [AIdailyLoss, setAIDailyLoss] = useState('0');
  const [AIbotConfig, setAIBotConfig] = useState(false);
  const [AIcurrentPage, setAICurrentPage] = useState(0);
  const [AISettingObject, setAISettingObject] = useState(null);
  const [AIbotModalVisible, setAIBotModalVisible] = useState(false);
  const [AIautoConfigObject, setAIAutoConfigObject] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [deletePopup, setDeletePopup] = useState(false);
  const [allTickerData, setAllTickerData] = useState([]);
  const [filterTickerData, setFilterTickerData] = useState([]);
  const [tickerValueVisible, setTickerValueVisible] = useState(false);
  const [selectedValueDelete, setSelectedValueDelete] = useState('');
  const [coinModalVisible, setCoinModalVisible] = useState(false);
  const [leverage1, setLeverage1] = useState('5');
  const [amount1, setAmount1] = useState('100');
  const [profit1, setProfit1] = useState('5');
  const [loss1, setLoss1] = useState('10');
  const [sellProfit1, setSellProfit1] = useState('5');
  const [sellLoss1, setSellLoss1] = useState('10');
  const [buyOnly, setBuyOnly] = useState(true);
  const [sellOnly, setSellOnly] = useState(false);
  const [buySellMode, setBuySellMode] = useState(false);
  const [reverseMode, setReverseMode] = useState(false);
  const [botConfig1, setBotConfig1] = useState(false);
  const [currentPage1, setCurrentPage1] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSkeletonVisible, setIsSkeletonVisible] = useState(true);
  const [coinSort, setCoinSort] = useState(0);
  const [CHG, setCHGSort] = useState(0);
  const [amountSort, setAmountSort] = useState(0);
  const [autoConfigObject, setAutoConfigObject] = useState(null);
  const [coinLength, setCoinLength] = useState(0);
  const [isPressArray, setIsPressArray] = useState([]);
  const [isPressArray1, setIsPressArray1] = useState([]);
  const [onFinishStatus, setOnFinishStatus] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [finishOnPress, setFinishOnPress] = useState(false);
  const [activePackage, setActivePackage] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);
  const [userRole, setUserRole] = useState('');
  const [apiErrorVisible, setApiErrorVisible] = useState(false);
  const [welcomeModelVisible, setWelcomeModelVisible] = useState(false);
  const [welcomeData, setWelcomeData] = useState(null);
  const [activatePopup, setActivatePopup] = useState(false);
  const [keyPopup, setKeyPopup] = useState(false);
  const [loginPopupVisible, setLoginPopupVisible] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [hours, setHours] = useState([]);
  const [activeSignal, setActiveSignal] = useState(null);
  const [errorAIBot, setErrorAIBot] = useState(false);

  useEffect(() => {
    try {
      if (user_data) {
        if (user_data?.first_name) {
          setFirstName(user_data?.first_name);
        }
        if (user_data?.last_name) {
          setLastName(user_data?.last_name);
        }
        if (user_data?.referal_code) {
          setReferal(user_data?.referal_code);
        }
      }
      if (settingData) {
        setAISettingObject(settingData);
        setAIBotConfig(settingData?.active_ai_bot_trading);
      }
      if (lastLeadData) {
        setFilterLead(lastLeadData);
        setIsPressArray(Array(lastLeadData.length).fill(false));
        setIsPressArray1(Array(lastLeadData.length).fill(false));
      }
      if (autoManualData) {
        if (autoManualData?.leverage > 0) {
          setCurrentPage(4);
        }
        setAutoConfigObject(autoManualData);
        setLeverage(JSON.stringify(autoManualData?.leverage));
        setAmount(JSON.stringify(autoManualData?.amount));
        setProfit(JSON.stringify(autoManualData?.take_profit));
        setLoss(JSON.stringify(autoManualData?.stoploss));
        setSellProfit(JSON.stringify(autoManualData?.sell_take_profit));
        setSellLoss(JSON.stringify(autoManualData?.sell_stoploss));
        setDailyProfit(
          JSON.stringify(autoManualData?.take_profit_daily_percentage),
        );
        setDailyLoss(
          JSON.stringify(autoManualData?.take_loss_daily_percentage),
        );
        setBotConfig(autoManualData?.auto_bot_config);
      }
      if (aiAutoManualData) {
        if (aiAutoManualData?.leverage > 0) {
          setCurrentPage(4);
        }
        setAIAutoConfigObject(aiAutoManualData);
        setAILeverage(JSON.stringify(aiAutoManualData?.leverage));
        setAIAmount(JSON.stringify(aiAutoManualData?.amount));
        setAIProfit(JSON.stringify(aiAutoManualData?.take_profit));
        setAILoss(JSON.stringify(aiAutoManualData?.stoploss));
        setAISellProfit(JSON.stringify(aiAutoManualData?.sell_take_profit));
        setAISellLoss(JSON.stringify(aiAutoManualData?.sell_stoploss));
        setAIDailyProfit(
          JSON.stringify(aiAutoManualData?.ai_take_profit_daily_percentage),
        );
        setAIDailyLoss(
          JSON.stringify(aiAutoManualData?.ai_take_loss_daily_percentage),
        );
        setAIBotConfig(aiAutoManualData?.active_ai_bot_trading);
      }
      if (getBinanceApiError != '') {
        setApiErrorVisible(true);
      }
    } catch (err) {
      console.log('error', err);
    }
  }, []);

  useEffect(() => {
    onActivePackage();
  }, [isFocused]);

  useEffect(() => {
    const allDataGet = async () => {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
      const token = await AsyncStorage.getItem('accessToken');
      if (token !== null) {
        setAuthToken(token);
        const welcome = await AsyncStorage.getItem('welcome');
        try {
          if (welcome == 'false') {
            const response = await onGetWelcomeDataApi();
            if (response.data) {
              setWelcomeData(response.data);
              setWelcomeModelVisible(true);
            }
          }
        } catch (err) {
          console.log('responseFavorite::', err);
        }
        try {
          const AnalyticsResponse = await onGetAnalyticsDataApi();
          if (AnalyticsResponse.data) {
            dispatch(fetchAnalyticsData(AnalyticsResponse.data));
          }
        } catch (err) {
          if (err.response.data.code == 'token_not_valid') {
            AsyncStorage.setItem('accessToken', '');
          }
          console.log('AnalyticsResponse::', err.response.data.code);
        }
        try {
          const PMSHistory = await onGetPMSHistoryDetailApi();
          if (PMSHistory.data.history_trade_list) {
            dispatch(fetchPMSHistoryList(PMSHistory.data.history_trade_list));
          }
        } catch (err) {
          console.log('PMSHistory::', err);
        }
        try {
          const response = await onGetActivePMSApi();
          if (response.data.active_trade_list) {
            dispatch(fetchPmsActiveList(response.data.active_trade_list));
          } else {
            console.log('History Error:', response.data);
          }
        } catch (err) {
          console.log('History Error:', err.response.data);
          // alert(err.response.data.detail);
        }
      } else {
        setLoginPopupVisible(true);
      }
    };
    allDataGet();
  }, []);

  const onActivePackage = async () => {
    const data = await AsyncStorage.getItem('timePeriod');
    setActivePackage(parseFloat(data));

    const res = await onGetAdminTradeDefaultApi();
    setActiveSignal({
      One: res.data.one_button,
      Four: res.data.four_button,
      oneDay: res.data.ai_config_button,
      Custom: res.data.on_off_button,
    });
    // if (parseFloat(data) <= 0) {
    //   setActivatePopup(true);
    // } else {
    //   if (
    //     user_data?.binance_api == null ||
    //     user_data?.binance_secret_key == null
    //   ) {
    //     setKeyPopup(true);
    //   }
    // }
  };

  const onPostSettingData = async () => {
    try {
      let raw = JSON.stringify({
        active_ai_bot_trading: AIbotConfig,
      });
      const response = await onPostAIDataApi(raw);
      if (response.data) {
        setOnFinishStatus(true);
        setCurrentPage(5);
        setAISettingObject(response.data);
      }
    } catch (err) {
      console.log('Error:', err.response.data);
    }
  };

  const onGetSelectedTicker = async ticker => {
    try {
      const response = await onGetCryptoTickerDataApi();
      if (response.data) {
        let allTicker = [];
        response.data.tickers_list.map(item => {
          allTicker.push({symbol: item});
        });
        allTicker.map((item1, index) => {
          ticker.map(item => {
            if (item.symbol === item1.symbol) {
              allTicker[index] = item;
            }
          });
        });
        setCoinLength(response.data.total_tracker);
        onCoinTickerConfigAdd(allTicker.reverse());
      }
    } catch (err) {
      console.log('Error::', err);
    }
  };

  useEffect(() => {
    const getValueOfTickerData = async () => {
      try {
        let count = await AsyncStorage.getItem('notificationCount');
        setNotificationCount(count);
        if (binanceData) {
          let allTicker = [];
          tickerData.map(item => {
            binanceData.map(item1 => {
              if (item1.symbol == item) {
                allTicker.push(item1);
              }
            });
          });
          setAllTickerData(allTicker);
          setFilterTickerData(allTicker);
          onGetSelectedTicker(allTicker);
        }
      } catch (err) {
        console.log('Error::', err);
      }
    };
    getValueOfTickerData();
  }, []);

  const onCoinTickerConfigAdd = async allTicker => {
    try {
      setIsSkeletonVisible(true);
      const response = await onGetTickerConfigDataApi();

      if (response.data) {
        let allTicker1 = allTicker;
        response.data.map(item1 => {
          allTicker1.map((item, index) => {
            if (item.symbol === item1.ticker_name) {
              allTicker1[index] = {...item, ...item1};
            }
          });
        });
        setIsSkeletonVisible(false);
        setCoinDataList(allTicker1);
        setDataActiveSort(allTicker1);
        setIsLoading(!isLoading);
      }
    } catch (err) {
      console.log('err::', err.response.data);
    }
  };

  const fetchData = () => {
    if (socketRef.current) {
      socketRef.current.onclose = () => {
        console.log('WebSocket closed 1');
      };
    }
    socketRef.current = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');
    // const socket = new WebSocket(socketUrl + socketPath);
    socketRef.current.onmessage = event => {
      console.log('coming Socket...');
      const binanceWebSocketData = JSON.parse(event.data);
      socketRef.current.close();
      setCoinDataList(prevData => {
        return prevData.map(item => {
          const binanceSymbolData = binanceWebSocketData.find(
            data => data.s === `${item.symbol}`,
          );
          // const binanceSymbolData = binanceWebSocketData[item.symbol];
          if (binanceSymbolData) {
            return {
              ...item,
              priceChangePercent: binanceSymbolData.P,
              lastPrice: binanceSymbolData.c,
            };
          }
          return item;
        });
      });
      setDataActiveSort(coinDataList);
      setFilterTickerData(prevData => {
        return prevData.map(item => {
          const binanceSymbolData = binanceWebSocketData.find(
            data => data.s === `${item.symbol}`,
          );
          // const binanceSymbolData = binanceWebSocketData[item.symbol];
          if (binanceSymbolData) {
            return {
              ...item,
              priceChangePercent: binanceSymbolData.P,
              lastPrice: binanceSymbolData.c,
            };
          }
          return item;
        });
      });
      socketRef.current.close();
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
      handleSearch1('');
      if (socketRef.current) {
        socketRef.current.onclose = () => {
          console.log('WebSocket closed 6');
        };
      }
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
    if (coinDataList.length > 0 && isFocused && appState === 'active') {
      console.log('get list data', isFocused, appState);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      intervalRef.current = setInterval(fetchData, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.onclose = () => {
          console.log('WebSocket closed 4');
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
          console.log('WebSocket closed 5');
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
  }, [coinDataList, isFocused, appState]);

  // useEffect(() => {
  //   let socket = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');
  //   const fetchData = () => {
  //     // const socket = new WebSocket(socketUrl + socketPath);
  //     if (coinDataList.length > 0) {
  //       socket.onmessage = event => {
  //         const binanceWebSocketData = JSON.parse(event.data);
  //         setCoinDataList(prevData => {
  //           return prevData.map(item => {
  //             const binanceSymbolData = binanceWebSocketData.find(
  //               data => data.s === `${item.symbol}`,
  //             );
  //             // const binanceSymbolData = binanceWebSocketData[item.symbol];
  //             if (binanceSymbolData) {
  //               return {
  //                 ...item,
  //                 priceChangePercent: binanceSymbolData.P,
  //                 lastPrice: binanceSymbolData.c,
  //               };
  //             }
  //             return item;
  //           });
  //         });
  //         setDataActiveSort(coinDataList);
  //         setFilterTickerData(prevData => {
  //           return prevData.map(item => {
  //             const binanceSymbolData = binanceWebSocketData.find(
  //               data => data.s === `${item.symbol}`,
  //             );
  //             // const binanceSymbolData = binanceWebSocketData[item.symbol];
  //             if (binanceSymbolData) {
  //               return {
  //                 ...item,
  //                 priceChangePercent: binanceSymbolData.P,
  //                 lastPrice: binanceSymbolData.c,
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
  //     handleSearch1('');
  //   }
  // }, [isFocused, coinDataList]);

  const onPostAutoManualData = async () => {
    try {
      setFinishOnPress(true);
      let raw = JSON.stringify({
        currency: 'USDT',
        leverage: parseFloat(leverage),
        amount: parseFloat(amount),
        take_profit: parseFloat(profit),
        sell_take_profit: parseFloat(sellProfit),
        stoploss: parseFloat(loss),
        sell_stoploss: parseFloat(sellLoss),
        take_profit_daily_percentage: parseFloat(dailyProfit),
        take_loss_daily_percentage: parseFloat(dailyLoss),
        auto_bot_config: botConfig,
      });
      const response = await onPostAutoManualDataApi(raw);
      console.log('Response>>', response.data);
      if (response.data) {
        setFinishOnPress(false);
        setBotManualVisible(false);
        setOnFinishStatus(true);
        setCurrentPage(5);
        dispatch(fetchAutoManualData(response.data));
        setAutoConfigObject(response.data);
        setLeverage(JSON.stringify(response.data?.leverage));
        setAmount(JSON.stringify(response.data?.amount));
        setProfit(JSON.stringify(response.data?.take_profit));
        setLoss(JSON.stringify(response.data?.stoploss));
        setSellProfit(JSON.stringify(response.data?.sell_take_profit));
        setSellLoss(JSON.stringify(response.data?.sell_stoploss));
        setDailyProfit(
          JSON.stringify(response.data?.take_profit_daily_percentage),
        );
        setDailyLoss(JSON.stringify(response.data?.take_loss_daily_percentage));

        setBotConfig(response.data?.auto_bot_config);
      }
    } catch (err) {
      setFinishOnPress(false);
      console.log('Error:', err.response.data);
    }
  };

  const onPostAIStatusData = async () => {
    try {
      setFinishOnPress(true);
      let raw = JSON.stringify({
        currency: 'USDT',
        leverage: parseFloat(AIleverage),
        amount: parseFloat(AIamount),
        take_profit: parseFloat(AIprofit),
        sell_take_profit: parseFloat(AIsellProfit),
        stoploss: parseFloat(AIloss),
        sell_stoploss: parseFloat(AIsellLoss),
        ai_take_profit_daily_percentage: parseFloat(AIdailyProfit),
        ai_take_loss_daily_percentage: parseFloat(AIdailyLoss),
        active_ai_bot_trading: AIbotConfig,
        candal_type: hours,
      });
      const response = await onPostAIAutoManualDataApi(raw);
      console.log('Response>>', response.data);
      if (response.data) {
        setFinishOnPress(false);
        setOnFinishStatus(true);
        setAICurrentPage(5);
        dispatch(fetchAIAutoManualData(response.data));
        setAIAutoConfigObject(response.data);
        setAILeverage(JSON.stringify(response.data?.leverage));
        setAIAmount(JSON.stringify(response.data?.amount));
        setAIProfit(JSON.stringify(response.data?.take_profit));
        setAILoss(JSON.stringify(response.data?.stoploss));
        setAISellProfit(JSON.stringify(response.data?.sell_take_profit));
        setAISellLoss(JSON.stringify(response.data?.sell_stoploss));
        setAIDailyProfit(
          JSON.stringify(response.data?.ai_take_profit_daily_percentage),
        );
        setAIDailyLoss(
          JSON.stringify(response.data?.ai_take_loss_daily_percentage),
        );

        setAIBotConfig(response.data?.active_ai_bot_trading);
      }
    } catch (err) {
      setFinishOnPress(false);
      console.log('Error:', err.response.data);
    }
  };

  const onPostTickerAddData = async () => {
    try {
      let raw = JSON.stringify({
        ticker_name: selectedValueDelete,
        currency: 'USDT',
        leverage: parseFloat(leverage1),
        amount: parseFloat(amount1),
        take_profit: parseFloat(profit1),
        sell_take_profit: parseFloat(sellProfit1),
        stoploss: parseFloat(loss1),
        sell_stoploss: parseFloat(sellLoss1),
        stretegy: buyOnly
          ? 'buy-on-signal'
          : sellOnly
          ? 'sell-on-signal'
          : buySellMode
          ? 'buy-or-sell-on-signal'
          : 'reverse-trade',
        is_active: botConfig1,
      });
      const response = await onPostTickerConfigDataApi(raw);
      console.log('Response>>', response.data?.leverage);
      if (response.data) {
        console.log('Response>>', response.data?.leverage);
        let allTicker1 = coinDataList;
        allTicker1.map((item, index) => {
          if (item.symbol === response.data?.ticker_name) {
            allTicker1[index].leverage = response.data?.leverage;
            allTicker1[index].amount = response.data?.amount;
            allTicker1[index].stretegy = response.data?.stretegy;
            allTicker1[index].is_active = response.data?.is_active;
            allTicker1[index].take_profit = response.data?.take_profit;
            allTicker1[index].stoploss = response.data?.stoploss;
            allTicker1[index].sell_take_profit = response.data?.sell_take_profit;
            allTicker1[index].sell_stoploss = response.data?.sell_stoploss;
            allTicker1[index].created_at = response.data?.created_at;
            allTicker1[index].updated_at = response.data?.updated_at;
          }
        });
        setCoinDataList(allTicker1);
        setDataActiveSort(allTicker1);
        setCoinModalVisible(false);
      }
    } catch (err) {
      console.log('Error:', err.response.data);
    }
  };

  const handleSearch = text => {
    setSearch(text);
    if (text !== '') {
      const filtered = lastLeadData.filter(item =>
        item?.ticker?.toLowerCase().includes(text.toLowerCase()),
      );
      setFilterLead(filtered);
    } else {
      setFilterLead(lastLeadData);
    }
  };

  const onLinkCopy = () => {
    setInviteVisible(false);
    Clipboard.setString(
      `https://indicatorleads.com/login?referralId=${referal}`,
    );
    showMessage({
      message: 'Successfully Copied!',
      type: 'success',
      duration: 3000,
    });
  };

  const handleSearch1 = text => {
    setSearch1(text);
    if (text !== '') {
      setTickerValueVisible(true);
      const filtered = allTickerData.filter(item =>
        item?.symbol?.toLowerCase().includes(text.toLowerCase()),
      );
      setFilterTickerData(filtered);
      setRefresh(!refresh);
    } else {
      setTickerValueVisible(false);
      setFilterTickerData(allTickerData);
      setRefresh(!refresh);
    }
  };

  const onPostTickerData = async symbol => {
    try {
      let raw = JSON.stringify({
        tickers_list: symbol,
      });
      const response = await onPostTickerDataApi(raw);
      if (response.data) {
        let allTicker = [];
        allTickerData.map(item1 => {
          response.data.tickers_list.map(item => {
            if (item1.symbol === item) {
              allTicker.push(item1);
            }
          });
        });
        onCoinTickerConfigAdd(allTicker);
        showMessage({
          message: `${symbol} Coin Added Successfully`,
          type: 'success',
          duration: 3000,
        });
      }
    } catch (err) {
      showMessage({
        message: err.response.data.detail,
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      console.log('Error:', err.response.data);
    }
  };

  const renderItem = ({item, index}) => {
    const originalNumber = parseFloat(item?.lastPrice);
    const formattedNumber = originalNumber.toFixed(10).replace(/\.?0*$/, '');
    if (search1 === '') {
      if (index <= 3) {
        return (
          <TouchableOpacity
            key={item.symbol}
            style={styles.rawValueView}
            onPress={() => {
              if (authToken != '') {
                if (activePackage > 0) {
                  if (
                    user_data?.binance_api == null ||
                    user_data?.binance_secret_key == null
                  ) {
                    setKeyPopup(true);
                  } else if (apiErrorVisible && getBinanceApiError != 'error') {
                    setKeyPopup(true);
                  } else {
                    onPostTickerData(item.symbol);
                  }
                } else {
                  setActivatePopup(true);
                }
              } else {
                setLoginPopupVisible(true);
              }
            }}>
            <Text style={[styles.tickerText, {width: '40%'}]}>
              {item.symbol}
            </Text>
            <Text
              style={[
                styles.tickerText,
                {
                  width: '30%',
                  color:
                    item.priceChangePercent > 0
                      ? COLORS.darkGreen
                      : COLORS.errorColor,
                },
              ]}>
              {item.priceChangePercent}
            </Text>
            <Text style={[styles.tickerText, {width: '30%'}]}>
              {formattedNumber}
            </Text>
          </TouchableOpacity>
        );
      }
    } else {
      return (
        <TouchableOpacity
          style={styles.rawValueView}
          onPress={() => {
            if (authToken != '') {
              if (activePackage > 0) {
                if (
                  user_data?.binance_api == null ||
                  user_data?.binance_secret_key == null
                ) {
                  setKeyPopup(true);
                } else if (apiErrorVisible && getBinanceApiError != 'error') {
                  setKeyPopup(true);
                } else {
                  onPostTickerData(item.symbol);
                }
              } else {
                setActivatePopup(true);
              }
            } else {
              setLoginPopupVisible(true);
            }
          }}>
          <Text style={[styles.tickerText, {width: '40%'}]}>{item.symbol}</Text>
          <Text
            style={[
              styles.tickerText,
              {
                width: '30%',
                color:
                  item.priceChangePercent > 0
                    ? COLORS.darkGreen
                    : COLORS.errorColor,
              },
            ]}>
            {item.priceChangePercent}
          </Text>
          <Text style={[styles.tickerText, {width: '30%'}]}>
            {formattedNumber}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  const onDeleteTickerPopup = async () => {
    try {
      let raw = JSON.stringify({
        ticker: selectedValueDelete,
      });
      const response = await onDeleteTickerDataApi(raw);
      if (response) {
        let raw1 = JSON.stringify({
          ticker: selectedValueDelete,
          currency: 'USDT',
        });
        const response1 = await onDeleteTickerConfigDataApi(raw1);
        setDeletePopup(false);
        let allTicker = [];
        coinDataList.map(item1 => {
          response.tickers_list.map(item => {
            if (item1.symbol === item) {
              allTicker.push(item1);
            }
          });
        });
        setCoinDataList(allTicker);
        setDataActiveSort(allTicker);
        showMessage({
          message: `${selectedValueDelete} Coin Delete Successfully`,
          type: 'success',
          duration: 3000,
        });
      } else {
        setDeletePopup(false);
      }
    } catch (err) {
      setDeletePopup(false);
      showMessage({
        message: err.response.data.detail,
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      console.log('Error:', err.response.data);
    }
  };

  const customSort = (a, b) => {
    // Convert strings to lowercase for case-insensitive comparison
    const stringA = a?.symbol.toLowerCase();
    const stringB = b?.symbol.toLowerCase();

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
        setCHGSort(0);
      } else {
        setCoinSort(coinSort + 1);
        setAmountSort(0);
        setCHGSort(0);
      }
      if (coinSort + 1 === 1) {
        const sortedDates = coinDataList.sort(customSort).reverse();
        setCoinDataList(sortedDates);
      } else if (coinSort + 1 === 2) {
        const sortedDates = coinDataList.sort(customSort);
        setCoinDataList(sortedDates);
      } else {
        setCoinDataList(dataActiveSort);
      }
    } else if (from === 'chg') {
      if (CHG === 2) {
        setCoinSort(0);
        setAmountSort(0);
        setCHGSort(0);
      } else {
        setAmountSort(0);
        setCoinSort(0);
        setCHGSort(CHG + 1);
      }
      if (CHG + 1 === 1) {
        const sortedDates = coinDataList
          .sort((a, b) => a?.priceChangePercent - b?.priceChangePercent)
          .reverse();
        setCoinDataList(sortedDates);
      } else if (CHG + 1 === 2) {
        const sortedDates = coinDataList.sort(
          (a, b) => a?.priceChangePercent - b?.priceChangePercent,
        );
        setCoinDataList(sortedDates);
      } else {
        setCoinDataList(dataActiveSort);
      }
    } else if (from === 'price') {
      if (amountSort === 2) {
        setCoinSort(0);
        setAmountSort(0);
        setCHGSort(0);
      } else {
        setAmountSort(amountSort + 1);
        setCoinSort(0);
        setCHGSort(0);
      }
      if (amountSort + 1 === 1) {
        const sortedDates = coinDataList
          .sort((a, b) => a.lastPrice - b.lastPrice)
          .reverse();
        setCoinDataList(sortedDates);
      } else if (amountSort + 1 === 2) {
        const sortedDates = coinDataList.sort(
          (a, b) => a.lastPrice - b.lastPrice,
        );
        setCoinDataList(sortedDates);
      } else {
        setCoinDataList(dataActiveSort);
      }
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
      newState[index] = true;
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

  const handleCloseButton = async () => {
    try {
      let raw = JSON.stringify({
        welcome_popup_guide: true,
      });
      const response = await onPostTutorialDataApi(raw);
      console.log('get Response>>', response);
      if (welcomeData.button_url == '' || welcomeData.button_url == 'Cancel') {
        setWelcomeModelVisible(false);
      } else {
        setWelcomeModelVisible(false);
        navigation.navigate(welcomeData.button_url);
      }
    } catch (err) {
      console.log('Error::', err);
    }
  };

  const onAIBotHandleSwitch = text => {
    if (text) {
      if (hours.length > 0) {
        setAIBotConfig(text);
        setErrorAIBot(false);
      } else {
        setErrorAIBot(true);
        setAIBotConfig(false);
      }
    } else {
      setErrorAIBot(false);
      setAIBotConfig(false);
    }
  };

  const onAIBotSignal = array => {
    if (array.length > 0) {
      setHours(array);
      setAIBotConfig(true);
      setErrorAIBot(false);
    } else {
      setHours(array);
      setAIBotConfig(false);
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
            title={t('crypto')}
            notificationPress={() =>
              navigation.navigate('NotificationScreen', {
                count: notificationCount,
              })
            }
            onPress={() => navigation.openDrawer()}
            userRole={userRole}
            navigation={navigation}
            notificationCount={notificationCount}
          />
        </View>
        <View style={styles.mainView}>
          <KeyboardAwareScrollView
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(15)}}>
            <Marquee spacing={0} speed={1}>
              <View style={styles.marqueeView}>
                {marqueeData.map((item, index) => {
                  return (
                    <Text key={index} style={styles.marqueeTagText}>
                      {item.tag}
                    </Text>
                  );
                })}
              </View>
            </Marquee>
            <TouchableOpacity
              style={[styles.inviteButton]}
              onPress={() => setInviteVisible(true)}>
              <Text style={styles.inviteText}>{t('invite_your_friend')}</Text>
            </TouchableOpacity>
            {apiErrorVisible && getBinanceApiError != 'error' && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{getBinanceApiError}</Text>
              </View>
            )}
            <View style={styles.landscapeDesignChange}>
              <ImageBackground
                style={[styles.backImage]}
                borderRadius={15}
                tintColor={COLORS.primary}
                source={card5}>
                <Text style={styles.userText}>
                  {t('hi')}, {firstName}
                </Text>

                <Text style={styles.coinText}>
                  {balanceData !== null &&
                  !balanceData?.detail &&
                  balanceData?.availableBalance !== null
                    ? `$ ${parseFloat(balanceData?.availableBalance).toFixed(
                        2,
                      )}`
                    : '$0'}
                </Text>
                <Text style={styles.coinTitleText}>
                  {t('balance_on_exchange')}
                </Text>

                <Text style={styles.coinText}>
                  {balanceData !== null &&
                  !balanceData?.detail &&
                  balanceData?.TodayRealizedPnl !== null
                    ? `$ ${parseFloat(balanceData?.TodayRealizedPnl).toFixed(
                        2,
                      )}`
                    : '$0'}
                </Text>
                <Text style={styles.coinTitleText}>{t('today_PL')}</Text>

                <Text style={styles.coinText}>
                  {balanceData !== null &&
                  !balanceData?.detail &&
                  balanceData?.crossUnPnl !== null
                    ? `$ ${parseFloat(balanceData?.crossUnPnl).toFixed(2)}`
                    : '$0'}
                </Text>
                <Text style={styles.coinTitleText}>{t('profit_loss')}</Text>
              </ImageBackground>

              <View style={styles.activeView}>
                <View style={styles.titleActiveView}>
                  <Text style={styles.titleText1}>{t('last_leads')}</Text>
                  <TextInput
                    value={search}
                    onChangeText={text => handleSearch(text)}
                    placeholder={t('search_coin')}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.searchText}
                  />
                </View>
                <FlatList
                  data={filterLead}
                  extraData={filterLead}
                  nestedScrollEnabled
                  initialNumToRender={5000000}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: hp(2.5),
                    marginTop: hp(1.5),
                    marginBottom: hp(2),
                  }}
                  keyExtractor={item => item.id}
                  ListEmptyComponent={() => (
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
                  )}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableHighlight
                        onShowUnderlay={() => handleShowUnderlay1(index)}
                        activeOpacity={1}
                        style={{width: '94%', alignSelf: 'center'}}
                        onPress={() => console.log('hello')}
                        underlayColor={COLORS.lightWhite}
                        key={item.id}>
                        <View
                          style={[
                            styles.dataActiveView,
                            {
                              backgroundColor: isPressArray1[index]
                                ? COLORS.lightWhite
                                : COLORS.white,
                            },
                          ]}>
                          <View>
                            <Text style={styles.dataText2}>{item.ticker}</Text>
                            <Text style={styles.dataText1}>
                              {/* {moment(item.created_at).format(
                              'hh:mm:ss YYYY-MM-DD',
                            )} */}
                              {moment(item?.created_at)
                                .tz(RNLocalize.getTimeZone())
                                .format('HH:mm:ss YYYY-MM-DD')}
                            </Text>
                          </View>
                          {item.signal !== 'sell' ? (
                            <TouchableHighlight
                              onHideUnderlay={() => handleHideUnderlay(index)}
                              onShowUnderlay={() => handleShowUnderlay(index)}
                              activeOpacity={1}
                              onPress={() => console.log('hello')}
                              underlayColor={'green'}
                              style={[
                                styles.typeButton,
                                {
                                  borderColor: COLORS.greenColor,
                                },
                              ]}>
                              <Text
                                style={[
                                  styles.dataText,
                                  {
                                    color: isPressArray[index]
                                      ? COLORS.white
                                      : COLORS.greenColor,
                                  },
                                ]}>
                                {t('buy')}
                              </Text>
                            </TouchableHighlight>
                          ) : (
                            <TouchableHighlight
                              onHideUnderlay={() => handleHideUnderlay(index)}
                              onShowUnderlay={() => handleShowUnderlay(index)}
                              onPress={() => console.log('hello')}
                              activeOpacity={1}
                              underlayColor={'red'}
                              style={[
                                styles.typeButton,
                                {
                                  borderColor: COLORS.errorColor,
                                },
                              ]}>
                              <Text
                                style={[
                                  styles.dataText,
                                  {
                                    color: isPressArray[index]
                                      ? COLORS.white
                                      : COLORS.errorColor,
                                  },
                                ]}>
                                {t('sell')}
                              </Text>
                            </TouchableHighlight>
                          )}
                        </View>
                      </TouchableHighlight>
                    );
                  }}
                />
              </View>
            </View>
            <View style={styles.autoAIView}>
              <View style={styles.autoView}>
                <TouchableOpacity
                  style={[
                    styles.autoButton,
                    {
                      backgroundColor: botConfig
                        ? COLORS.greenColor
                        : COLORS.lightGreyColor,
                    },
                  ]}
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
                          setBotModalVisible(true);
                          if (autoConfigObject?.leverage) {
                            setCurrentPage(4);
                            setOnFinishStatus(false);
                            setLeverage(
                              JSON.stringify(autoConfigObject?.leverage),
                            );
                            setAmount(JSON.stringify(autoConfigObject?.amount));
                            setProfit(
                              JSON.stringify(autoConfigObject?.take_profit),
                            );
                            setLoss(JSON.stringify(autoConfigObject?.stoploss));
                            setSellProfit(
                              JSON.stringify(
                                autoConfigObject?.sell_take_profit,
                              ),
                            );
                            setSellLoss(
                              JSON.stringify(autoConfigObject?.sell_stoploss),
                            );
                            setDailyProfit(
                              JSON.stringify(
                                autoConfigObject?.take_profit_daily_percentage,
                              ),
                            );
                            setDailyLoss(
                              JSON.stringify(
                                autoConfigObject?.take_loss_daily_percentage,
                              ),
                            );
                            setBotConfig(autoConfigObject?.auto_bot_config);
                          }
                        }
                      } else {
                        setActivatePopup(true);
                      }
                    } else {
                      setLoginPopupVisible(true);
                    }
                  }}>
                  <Text
                    style={[
                      styles.autoText,
                      {
                        color: botConfig ? COLORS.white : COLORS.textColor,
                      },
                    ]}>
                    {t('auto')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.autoButton1,
                    {
                      backgroundColor: botConfig
                        ? COLORS.lightGreyColor
                        : COLORS.greenColor,
                    },
                  ]}
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
                          setBotManualVisible(true);
                        }
                      } else {
                        setActivatePopup(true);
                      }
                    } else {
                      setLoginPopupVisible(true);
                    }
                  }}>
                  <Text
                    style={[
                      styles.autoText,
                      {
                        color: botConfig ? COLORS.textColor : COLORS.white,
                      },
                    ]}>
                    {t('manual')}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  styles.AIButton,
                  {
                    backgroundColor: AIbotConfig
                      ? COLORS.greenColor
                      : COLORS.lightGreyColor,
                  },
                ]}
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
                        setAIBotModalVisible(true);
                        if (AIautoConfigObject?.leverage) {
                          setOnFinishStatus(false);
                          setAICurrentPage(4);
                          setAILeverage(
                            JSON.stringify(AIautoConfigObject?.leverage),
                          );
                          setAIAmount(
                            JSON.stringify(AIautoConfigObject?.amount),
                          );
                          setAIProfit(
                            JSON.stringify(AIautoConfigObject?.take_profit),
                          );
                          setAILoss(
                            JSON.stringify(AIautoConfigObject?.stoploss),
                          );
                          setAISellProfit(
                            JSON.stringify(
                              AIautoConfigObject?.sell_take_profit,
                            ),
                          );
                          setAISellLoss(
                            JSON.stringify(AIautoConfigObject?.sell_stoploss),
                          );
                          setAIDailyProfit(
                            JSON.stringify(
                              AIautoConfigObject?.ai_take_profit_daily_percentage,
                            ),
                          );
                          setHours(AIautoConfigObject?.candal_type);
                          setAIDailyLoss(
                            JSON.stringify(
                              AIautoConfigObject?.ai_take_loss_daily_percentage,
                            ),
                          );
                          console.log(
                            'get AI value::::',
                            AIautoConfigObject?.candal_type,
                          );
                          setAIBotConfig(
                            AIautoConfigObject?.active_ai_bot_trading,
                          );
                        }
                      }
                    } else {
                      setActivatePopup(true);
                    }
                  } else {
                    setLoginPopupVisible(true);
                  }
                }}>
                <Text
                  style={[
                    styles.autoText,
                    {
                      color: AIbotConfig ? COLORS.white : COLORS.textColor,
                    },
                  ]}>
                  {t('AI')}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              value={search1}
              onChangeText={text => handleSearch1(text)}
              placeholder={t('search_your_coin')}
              placeholderTextColor={COLORS.greyColor}
              style={styles.searchText1}
              onFocus={() => setTickerValueVisible(true)}
              onBlur={() => setTickerValueVisible(false)}
              autoCapitalize="none"
            />
            {tickerValueVisible || search1 != '' ? (
              <View style={styles.tickerSearchView}>
                {filterTickerData.length > 0 ? (
                  <FlatList
                    data={filterTickerData}
                    nestedScrollEnabled
                    renderItem={renderItem}
                    keyboardShouldPersistTaps={'always'}
                    keyExtractor={item => item.symbol}
                  />
                ) : (
                  <View style={{marginVertical: hp(1)}}>
                    <View style={styles.dataFoundView}>
                      <Text
                        style={{
                          color: COLORS.darkGreen,
                          fontSize: 16,
                          fontFamily: Fonts.FONTS.PoppinsMedium,
                        }}>
                        {t('no_records_available')}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ) : null}
            <View style={styles.activeView1}>
              <ScrollView
                horizontal
                bounces={false}
                nestedScrollEnabled={true}
                contentContainerStyle={{paddingBottom: hp(1)}}
                showsHorizontalScrollIndicator={false}>
                <View>
                  <View style={styles.titleActiveView1}>
                    <TouchableOpacity
                      onPress={() => firstSorting('coin')}
                      style={[styles.optionTitleView]}>
                      <Text style={styles.titleText4}>{`${t('coin')} [${
                        coinDataList.length
                      }/${coinLength}]`}</Text>
                      {coinSort === 0 || coinSort === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {coinSort === 0 || coinSort === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => firstSorting('chg')}
                      style={[styles.optionTitleView1]}>
                      <Text style={styles.titleText4}>{t('CHG')}</Text>
                      {CHG === 0 || CHG === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {CHG === 0 || CHG === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => firstSorting('price')}
                      style={[styles.optionTitleView1]}>
                      <Text style={styles.titleText4}>{t('price')}</Text>
                      {amountSort === 0 || amountSort === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {amountSort === 0 || amountSort === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                    <Text style={styles.titleText3}>{t('bot_status')}</Text>
                  </View>
                  <FlatList
                    data={coinDataList}
                    extraData={coinDataList}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    // contentContainerStyle={{paddingBottom: hp(2)}}
                    initialNumToRender={1000}
                    keyExtractor={item => item.symbol}
                    ListEmptyComponent={() => (
                      <>
                        {activePackage > 0 ? (
                          <View style={{marginVertical: hp(2)}}>
                            <View style={styles.dataFoundView}>
                              <Text style={styles.dataFoundText}>
                                {t('no_records_available')}
                              </Text>
                            </View>
                          </View>
                        ) : (
                          <View style={{marginVertical: hp(2)}}>
                            <View style={styles.dataFoundView}>
                              <Text style={styles.dataFoundText}>
                                {t('no_active_package_found')}
                              </Text>
                            </View>
                          </View>
                        )}
                      </>
                    )}
                    renderItem={({item, index}) => {
                      const originalNumber = parseFloat(item?.lastPrice);
                      const formattedNumber = originalNumber
                        .toFixed(10)
                        .replace(/\.?0*$/, '');
                      return (
                        <>
                          {isSkeletonVisible ? (
                            <SkeletonPlaceholderComponent />
                          ) : (
                            <TouchableOpacity
                              key={item.symbol}
                              disabled={apiErrorVisible}
                              onPress={() => {
                                if (!item?.is_active) {
                                  setSelectedValueDelete(item.symbol);
                                  setDeletePopup(true);
                                } else {
                                  showMessage({
                                    message: t('cannot_delete_coin'),
                                    type: 'warning',
                                    duration: 3000,
                                    icon: 'warning',
                                  });
                                }
                              }}
                              style={[
                                styles.dataActiveView1,
                                {
                                  backgroundColor:
                                    index % 2 !== 0
                                      ? COLORS.white
                                      : COLORS.lightPrimary3,
                                  borderBottomWidth:
                                    coinDataList.length == index + 1 ? 0 : 1,
                                  height:
                                    coinDataList.length == index + 1
                                      ? hp(5)
                                      : hp(5.5),
                                },
                              ]}>
                              <Text style={[styles.dataText3]}>
                                {item.symbol}
                              </Text>
                              <Text
                                style={[
                                  styles.dataText4,
                                  {
                                    color:
                                      item.priceChangePercent > 0
                                        ? COLORS.darkGreen
                                        : COLORS.errorColor,
                                  },
                                ]}>
                                {item.priceChangePercent}
                              </Text>
                              <Text style={[styles.dataText4]}>
                                {formattedNumber != 'NaN'
                                  ? formattedNumber
                                  : ''}
                              </Text>
                              <View style={styles.statusView}>
                                <TouchableOpacity
                                  disabled={apiErrorVisible}
                                  style={[
                                    styles.statusButton,
                                    {
                                      backgroundColor: item?.is_active
                                        ? COLORS.greenColor
                                        : COLORS.errorColor,
                                    },
                                  ]}
                                  onPress={() => {
                                    if (item?.leverage) {
                                      setLeverage1(
                                        JSON.stringify(item?.leverage),
                                      );
                                      setAmount1(JSON.stringify(item?.amount));
                                      setProfit1(
                                        JSON.stringify(item?.take_profit),
                                      );
                                      setLoss1(JSON.stringify(item?.stoploss));
                                      setSellProfit1(
                                        JSON.stringify(item?.sell_take_profit),
                                      );
                                      setSellLoss1(
                                        JSON.stringify(item?.sell_stoploss),
                                      );
                                      setBotConfig1(item?.is_active);
                                      setCurrentPage1(4);
                                      if (item?.stretegy == 'buy-on-signal') {
                                        setBuyOnly(true);
                                        setSellOnly(false);
                                        setBuySellMode(false);
                                        setReverseMode(false);
                                      } else if (
                                        item?.stretegy == 'sell-on-signal'
                                      ) {
                                        setSellOnly(true);
                                        setBuyOnly(false);
                                        setBuySellMode(false);
                                        setReverseMode(false);
                                      } else if (
                                        item?.stretegy ===
                                        'buy-or-sell-on-signal'
                                      ) {
                                        setBuySellMode(true);
                                        setBuyOnly(false);
                                        setSellOnly(false);
                                        setReverseMode(false);
                                      } else if (
                                        item?.stretegy == 'reverse-trade'
                                      ) {
                                        setReverseMode(true);
                                        setBuySellMode(false);
                                        setBuyOnly(false);
                                        setSellOnly(false);
                                      }
                                    }
                                    setSelectedValueDelete(item.symbol);
                                    setCoinModalVisible(true);
                                  }}>
                                  <Text
                                    style={[
                                      styles.searchText2,
                                      {color: COLORS.white},
                                    ]}>
                                    {item?.is_active ? t('no') : t('off')}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </TouchableOpacity>
                          )}
                        </>
                      );
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
      <InvitePopup
        modelVisible={inviteVisible}
        setModelVisible={setInviteVisible}
        link={`https://indicatorleads.com/login?referralId=${referal}`}
        onPress={() => onLinkCopy()}
      />
      <BotSettingPopup
        modalVisible={botModalVisible}
        setModalVisible={setBotModalVisible}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        leverage={leverage}
        setLeverage={text => setLeverage(text)}
        amount={amount}
        setAmount={text => setAmount(text)}
        profit={profit}
        setProfit={text => setProfit(text)}
        loss={loss}
        setLoss={text => setLoss(text)}
        sellProfit={sellProfit}
        setSellProfit={text => setSellProfit(text)}
        sellLoss={sellLoss}
        setSellLoss={text => setSellLoss(text)}
        dailyLoss={dailyLoss}
        setDailyLoss={text => setDailyLoss(text)}
        dailyProfit={dailyProfit}
        setDailyProfit={text => setDailyProfit(text)}
        botConfig={botConfig}
        setBotConfig={text => setBotConfig(text)}
        onPress={() => onPostAutoManualData()}
        onFinishStatus={onFinishStatus}
        FinishOnPress={finishOnPress}
      />
      <AIBotSettingPopup
        modalVisible={AIbotModalVisible}
        setModalVisible={setAIBotModalVisible}
        currentPage={AIcurrentPage}
        setCurrentPage={setAICurrentPage}
        leverage={AIleverage}
        setLeverage={text => setAILeverage(text)}
        amount={AIamount}
        setAmount={text => setAIAmount(text)}
        profit={AIprofit}
        setProfit={text => setAIProfit(text)}
        loss={AIloss}
        setLoss={text => setAILoss(text)}
        sellProfit={AIsellProfit}
        setSellProfit={text => setAISellProfit(text)}
        sellLoss={AIsellLoss}
        setSellLoss={text => setAISellLoss(text)}
        dailyLoss={AIdailyLoss}
        setDailyLoss={text => setAIDailyLoss(text)}
        dailyProfit={AIdailyProfit}
        setDailyProfit={text => setAIDailyProfit(text)}
        botConfig={AIbotConfig}
        setBotConfig={text => onAIBotHandleSwitch(text)}
        onPress={() => onPostAIStatusData()}
        onFinishStatus={onFinishStatus}
        FinishOnPress={finishOnPress}
        setHours={array => onAIBotSignal(array)}
        hours={hours}
        activeSignal={activeSignal}
        errorAIBot={errorAIBot}
      />
      <CoinSettingPopup
        modalVisible={coinModalVisible}
        selectedValueDelete={selectedValueDelete}
        setModalVisible={setCoinModalVisible}
        currentPage={currentPage1}
        setCurrentPage={setCurrentPage1}
        leverage={leverage1}
        setLeverage={text => setLeverage1(text)}
        amount={amount1}
        setAmount={text => setAmount1(text)}
        profit={profit1}
        setProfit={text => setProfit1(text)}
        loss={loss1}
        setLoss={text => setLoss1(text)}
        sellProfit={sellProfit1}
        setSellProfit={text => setSellProfit1(text)}
        sellLoss={sellLoss1}
        setSellLoss={text => setSellLoss1(text)}
        buyOnly={buyOnly}
        setBuyOnly={setBuyOnly}
        sellOnly={sellOnly}
        setSellOnly={setSellOnly}
        buySellMode={buySellMode}
        setBuySellMode={setBuySellMode}
        reverseMode={reverseMode}
        setReverseMode={setReverseMode}
        botConfig={botConfig1}
        setBotConfig={text => setBotConfig1(text)}
        onPress={() => onPostTickerAddData()}
      />
      <CommonPopup
        modelVisible={deletePopup}
        setModelVisible={setDeletePopup}
        title={`${t('you_want_to_delete')} ${selectedValueDelete} ${t(
          'coin',
        )}?`}
        firstButtonTitle={t('cancel')}
        secondButtonTitle={t('delete')}
        firstButtonClick={() => setDeletePopup(false)}
        secondButtonClick={() => onDeleteTickerPopup()}
      />
      <BotManualPopup
        modalVisible={botManualVisible}
        setModalVisible={setBotManualVisible}
        dailyLoss={dailyLoss}
        setDailyLoss={text => setDailyLoss(text)}
        dailyProfit={dailyProfit}
        setDailyProfit={text => setDailyProfit(text)}
        botConfig={botConfig}
        setBotConfig={text => setBotConfig(text)}
        onPress={() => onPostAutoManualData()}
        FinishOnPress={finishOnPress}
      />
      <WelcomePopup
        modelVisible={welcomeModelVisible}
        setModelVisible={setWelcomeModelVisible}
        welcomeData={welcomeData}
        onPress={() => handleCloseButton()}
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
        isPortrait={isPortrait}
      />
    </View>
  );
};

export default HomeScreen;
