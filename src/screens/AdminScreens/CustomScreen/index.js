import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  FlatList,
  Image,
  TouchableHighlight,
  AppState,
  Switch,
} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import styles from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../../components/Pixel/index';
import {useIsFocused} from '@react-navigation/native';
import Header from '../../../components/Header';
import {hasNotch} from 'react-native-device-info';
import {COLORS, Fonts} from '../../../utils';
import card5 from '../../../images/card5.png';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import star from '../../../images/star.png';
import star1 from '../../../images/star1.png';
import bell1 from '../../../images/bell1.png';
import bell2 from '../../../images/bell2.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import SelectDropdown from 'react-native-select-dropdown';
import {
  onGetAdminCustomDefaultApi,
  onGetAdminFourDefaultApi,
  onGetAdminIndicatorDataApi,
  onGetAdminTradeDefaultApi,
  onGetAICryptoDefaultApi,
  onGetSpotTickers,
  onPostAdminCustomDefaultApi,
  onPostAdminFourDefaultApi,
  onPostAdminTradeDefaultApi,
} from '../../../services/Api';
import arrowUp from '../../../images/arrowUp.png';
import down from '../../../images/down.png';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import downArrow from '../../../images/downArrow.png';
import upArrow from '../../../images/upArrow.png';
import check from '../../../images/check.png';
import AIConfigSkeleton from '../../../components/AIConfigSkeleton';

const rangeArray = ['Disable', 'Enable'];
const strategyArray = [
  {name: 'Strategy 1', value: 's1'},
  {name: 'Strategy 2', value: 's2'},
  {name: 'Strategy 3', value: 's3'},
  {name: 'Strategy 4', value: 's4'},
  {name: 'Strategy 5', value: 's5'},
  {name: 'Strategy 6', value: 's6'},
];

const CustomScreen = ({navigation}) => {
  const {t} = useTranslation();
  const intervalRef = useRef(null);
  const futurePriceData = useSelector(state => state.getAdminCustomPrice);
  const tickerData = useSelector(state => state.getAdminFutureYahooTicker);
  const scrollRef = useRef(null);
  const isFocused = useIsFocused();
  const [search1, setSearch1] = useState('');
  const [userRole, setUserRole] = useState('');
  const [dataActive, setDataActive] = useState([]);
  const [buyStrategy, setBuyStrategy] = useState('Strategy 1');
  const [buyStrategyValue, setBuyStrategyValue] = useState('s1');
  const [buyAiTarget, setBuyAiTarget] = useState('Disable');
  const [buyChng, setBuyChng] = useState('0.5');
  const [buyAiResistance, setBuyAiResistance] = useState('Enable');
  const [buyAutoReverse, setBuyAutoReverse] = useState('Disable');
  const [buyReverse, setBuyReverse] = useState('Disable');
  const [buyLeverage, setBuyLeverage] = useState('5');
  const [buyAmount, setBuyAmount] = useState('100');
  const [buyTP, setBuyTP] = useState('20');
  const [buySL, setBuySL] = useState('15');
  const [buyTRP, setBuyTRP] = useState('20');
  const [sellStrategy, setSellStrategy] = useState('Strategy 1');
  const [sellStrategyValue, setSellStrategyValue] = useState('s1');
  const [sellAiTarget, setSellAiTarget] = useState('Disable');
  const [sellChng, setSellChng] = useState('0.5');
  const [sellAiResistance, setSellAiResistance] = useState('Enable');
  const [sellAutoReverse, setSellAutoReverse] = useState('Disable');
  const [sellReverse, setSellReverse] = useState('Disable');
  const [sellLeverage, setSellLeverage] = useState('5');
  const [sellAmount, setSellAmount] = useState('100');
  const [sellTP, setSellTP] = useState('20');
  const [sellSL, setSellSL] = useState('15');
  const [sellTRP, setSellTRP] = useState('20');
  const [tradeVisible, setTradeVisible] = useState(false);
  const [filteredTrendValues, setFilteredTrendValues] = useState([]);
  const [notificationData, setNotificationData] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [notification, setNotification] = useState(false);
  const [coinSort, setCoinSort] = useState(0);
  const [allCoinData, setAllCoinData] = useState([]);
  const [buyStrategyModal, setBuyStrategyModal] = useState(false);
  const [sellStrategyModal, setSellStrategyModal] = useState(false);
  const [strategyList, setStrategyList] = useState([]);
  const [sellONOFF, setSellONOFF] = useState(false);
  const [buyONOFF, setBuyONOFF] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [yesVisible, setYesVisible] = useState(false);
  const [noVisible, setNoVisible] = useState(false);
  const [skeletonVisible, setSkeletonVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const titleArray = [
    {
      id: 1,
      name: t('neutral'),
      color: 'rgb(255 165 0)',
    },
    {
      id: 8,
      name: t('resistance_broken'),
      color: 'rgb(0 0 139)',
    },
    {
      id: 9,
      name: t('support_broken'),
      color: 'rgb(68 68 178)',
    },
    {
      id: 2,
      name: t('bullish'),
      color: 'rgb(35 106 79)',
    },
    {
      id: 3,
      name: t('bearish'),
      color: '#A81E08',
    },
    {
      id: 4,
      name: t('very_bullish'),
      color: 'rgb(52 155 115)',
    },
    {
      id: 5,
      name: t('very_bearish'),
      color: '#d83218',
    },
    {
      id: 6,
      name: t('extremely_bullish'),
      color: 'rgb(57,255,20)',
    },
    {
      id: 7,
      name: t('extremely_bearish'),
      color: 'rgb(255 51 20)',
    },
  ];

  let resistanceBrokenCount = 0;
  let bullishCount = 0;
  let veryBullishCount = 0;
  let extremelyBullishCount = 0;
  let neutralCount = 0;
  let supportBrokenCount = 0;
  let bearishCount = 0;
  let veryBearishCount = 0;
  let extremelyBearishCount = 0;

  dataActive.forEach(item => {
    if (item.currentTrend === 'resistance-broken') {
      resistanceBrokenCount++;
    }
    if (item.currentTrend === 'bullish') {
      bullishCount++;
    }
    if (item.currentTrend === 'very-bullish') {
      veryBullishCount++;
    }
    if (item.currentTrend === 'extremely-bullish') {
      extremelyBullishCount++;
    }
    if (item.currentTrend === 'neutral') {
      neutralCount++;
    }
    if (item.currentTrend === 'support-broken') {
      supportBrokenCount++;
    }
    if (item.currentTrend === 'bearish') {
      bearishCount++;
    }
    if (item.currentTrend === 'very-bearish') {
      veryBearishCount++;
    }
    if (item.currentTrend === 'extremely-bearish') {
      extremelyBearishCount++;
    }
  });
  let currentperPositive = 0;
  let currentperNegative = 0;

  allCoinData.forEach(item => {
    if (item.currentPer > 0) {
      currentperPositive++;
    }
    if (item.currentPer < 0) {
      currentperNegative++;
    }
  });

  useEffect(() => {
    const allDataGet = async () => {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
    };
    allDataGet();
    notificationSettingDataGet();
  }, []);

  const notificationSettingDataGet = async () => {
    try {
      const response = await onGetAdminTradeDefaultApi();
      if (response.data) {
        setTradeVisible(response.data.on_off_button);
      }
    } catch (err) {
      console.log('notification::', err);
    }
  };

  useEffect(() => {
    getValueOfTickerData();
    onGetDefaultValue();
  }, []);

  const onGetDefaultValue = async () => {
    try {
      const defaultResponse = await onGetAdminCustomDefaultApi();
      if (defaultResponse.data) {
        const dataArray = Object.keys(defaultResponse.data).map(
          key => defaultResponse.data[key],
        );
        setStrategyList(dataArray);
      }
    } catch (err) {
      console.log('Error Default Value:', err);
    }
  };

  function determineTrend(earlierTrend, currentTrend) {
    if (earlierTrend === null || currentTrend === null) {
      return 'none'; // Return nothing if either trend is null
    }

    const trendOrder = [
      'neutral',
      'support-broken',
      'bearish',
      'very-bearish',
      'extremely-bearish',
      'resistance-broken',
      'bullish',
      'very-bullish',
      'extremely-bullish',
    ];

    const earlierIndex = trendOrder.indexOf(earlierTrend);
    const currentIndex = trendOrder.indexOf(currentTrend);

    if (currentIndex > earlierIndex) {
      return 'high'; // Current trend is more bullish or bearish
    } else {
      return 'low'; // Current trend is less bullish or bearish
    }
  }

  function countDigitsAfterDecimal(number) {
    const match = /\.(\d+)$/.exec(String(number));
    return match ? match[1].length : 0;
  }

  useEffect(() => {
    const socketUrl = Config.NEXT_PUBLIC_SERVER_URL_SOCKET;
    // const socketPath = '/ws/live-ohlcv-consumer/';
    const socketPath = '/ws/ai-bot-new/live-ohlcv-consumer/';
    let socket = new WebSocket(socketUrl + socketPath);
    const fetchData = () => {
      // socketRef.current = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');
      // if (dataActive.length > 0) {
      socket.onmessage = event => {
        const binanceWebSocketData = JSON.parse(event.data);
        console.log('Socket>>>');
        // socketRef.current.close();
        // Update the tableData state based on WebSocket data
        setAllCoinData(prevData => {
          return prevData.map(item => {
            // const binanceSymbolData = binanceWebSocketData.find(
            //   data => data.s === `${item.ticker}`,
            // );
            const binanceSymbolData = binanceWebSocketData[item.ticker];
            // const binanceSymbolData = binanceWebSocketData[item.symbol];
            const latestLastprice = binanceSymbolData
              ? parseFloat(binanceSymbolData.c)
              : null;
            const digitsAfterDecimal = countDigitsAfterDecimal(latestLastprice);
            const ai_target_data = futurePriceData.find(
              data => data.ticker === `${item.ticker}`,
            )?.ai_target;
            const tomorrow_prediction = futurePriceData.find(
              data => data.ticker === `${item.ticker}`,
            )?.tomorrow_prediction;
            const day_after_tomorrow_prediction = futurePriceData.find(
              data => data.ticker === `${item.ticker}`,
            )?.day_after_tomorrow_prediction;
            const ai_resistance = tomorrow_prediction
              ? parseFloat(tomorrow_prediction).toFixed(digitsAfterDecimal)
              : '-';
            const ai_support = day_after_tomorrow_prediction
              ? parseFloat(day_after_tomorrow_prediction).toFixed(digitsAfterDecimal)
              : '-';
            const ai_target = ai_target_data
              ? parseFloat(ai_target_data).toFixed(digitsAfterDecimal)
              : '-';
            const newCurrentPer = binanceSymbolData
              ? parseFloat(binanceSymbolData.cp).toFixed(2)
              : null;
            let formatedYesNo;
            if (item.percentage_change == item.r_change) {
              if (latestLastprice > item.ai_resistance) {
                formatedYesNo = 'Yes';
              } else {
                formatedYesNo = 'No';
              }
            } else if (item.percentage_change == item.s_change) {
              if (latestLastprice < item.ai_support) {
                formatedYesNo = 'Yes';
              } else {
                formatedYesNo = 'No';
              }
            } else {
            }
            if (binanceSymbolData) {
              return {
                ...item,
                markPrice: latestLastprice,
                formatedYesNo,
                currentPer: newCurrentPer,
                ai_resistance,
                ai_support,
                ai_target,
              };
            }
            return item;
          });
        });
        setDataActive(prevData => {
          return prevData.map(item => {
            // const binanceSymbolData = binanceWebSocketData.find(
            //   data => data.s === `${item.ticker}`,
            // );
            const binanceSymbolData = binanceWebSocketData[item.ticker];
            // const binanceSymbolData = binanceWebSocketData[item.symbol];
            const latestLastprice = binanceSymbolData
              ? parseFloat(binanceSymbolData.c)
              : null;
            const digitsAfterDecimal = countDigitsAfterDecimal(latestLastprice);
            const ai_target_data = futurePriceData.find(
              data => data.ticker === `${item.ticker}`,
            )?.ai_target;
            const tomorrow_prediction = futurePriceData.find(
              data => data.ticker === `${item.ticker}`,
            )?.tomorrow_prediction;
            const day_after_tomorrow_prediction = futurePriceData.find(
              data => data.ticker === `${item.ticker}`,
            )?.day_after_tomorrow_prediction;
            const ai_resistance = tomorrow_prediction
              ? parseFloat(tomorrow_prediction).toFixed(digitsAfterDecimal)
              : '-';
            const ai_support = day_after_tomorrow_prediction
              ? parseFloat(day_after_tomorrow_prediction).toFixed(digitsAfterDecimal)
              : '-';
            const ai_target = ai_target_data
              ? parseFloat(ai_target_data).toFixed(digitsAfterDecimal)
              : '-';
            const newCurrentPer = binanceSymbolData
              ? parseFloat(binanceSymbolData.cp).toFixed(2)
              : null;
            let formatedYesNo;
            if (item.percentage_change == item.r_change) {
              if (latestLastprice > item.ai_resistance) {
                formatedYesNo = 'Yes';
              } else {
                formatedYesNo = 'No';
              }
            } else if (item.percentage_change == item.s_change) {
              if (latestLastprice < item.ai_support) {
                formatedYesNo = 'Yes';
              } else {
                formatedYesNo = 'No';
              }
            } else {
            }
            if (binanceSymbolData) {
              return {
                ...item,
                markPrice: latestLastprice,
                formatedYesNo,
                currentPer: newCurrentPer,
                ai_resistance,
                ai_support,
                ai_target,
              };
            }
            return item;
          });
        });
        socket.close();
      };
    };
    if (allCoinData.length > 0 && isFocused && !searchVisible) {
      console.log('Socket>>>');
      socket.close();
      intervalRef.current = setInterval(fetchData, 6000);
    }
    if (!isFocused) {
      socket.close();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      socket.close();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isFocused, allCoinData]);

  const getValueOfTickerData = async () => {
    try {
      setSkeletonVisible(true);
      let allTicker = [];
      if (futurePriceData) {
        const valuesArray = Object.values(tickerData.data_dict);
        const getIndicatorData = await onGetAdminIndicatorDataApi();
        let allData = getIndicatorData.data;
        allTicker = valuesArray;
        allTicker = allTicker.map(item => {
          const randomPercentageValue = futurePriceData.find(
            data => data.ticker === `${item}`,
          )?.ticker;
          const markPrice = allData.find(
            data => data.ticker === `${randomPercentageValue}`,
          )?.last_price;
          const currentPer = allData.find(
            data => data.ticker === `${randomPercentageValue}`,
          )?.current_percentage;
          const ai_target = futurePriceData.find(
            data => data.ticker === `${item}`,
          )?.ai_target;
          const support_percentage_change = futurePriceData.find(
            data => data.ticker === `${item}`,
          )?.support_percentage_change;
          const resistance_percentage_change = futurePriceData.find(
            data => data.ticker === `${item}`,
          )?.resistance_percentage_change;
          const max_percentage_change = futurePriceData.find(
            data => data.ticker === `${item}`,
          )?.max_percentage_change;
          const tomorrow_prediction = futurePriceData.find(
            data => data.ticker === `${item}`,
          )?.tomorrow_prediction;
          const day_after_tomorrow_prediction = futurePriceData.find(
            data => data.ticker === `${item}`,
          )?.day_after_tomorrow_prediction;
          const currentTrend =
            futurePriceData.find(entry => entry.ticker === item)
              ?.ai_current_trends || null;

          const earlierTrend =
            futurePriceData.find(entry => entry.ticker === item)
              ?.ai_previous_trends || null;
          const result = determineTrend(earlierTrend, currentTrend);
          let newLastPrice = 0;
          let formatedYesNo;
          if (max_percentage_change === resistance_percentage_change) {
            if (markPrice > tomorrow_prediction) {
              formatedYesNo = 'Yes';
            } else {
              formatedYesNo = 'No';
            }
          } else if (max_percentage_change === support_percentage_change) {
            if (markPrice < day_after_tomorrow_prediction) {
              formatedYesNo = 'Yes';
            } else {
              formatedYesNo = 'No';
            }
          } else {
          }
          return {
            ticker: randomPercentageValue,
            ai_target: parseFloat(ai_target).toFixed(3),
            s_change: parseFloat(support_percentage_change).toFixed(2),
            r_change: parseFloat(resistance_percentage_change).toFixed(2),
            percentage_change: parseFloat(max_percentage_change).toFixed(2),
            ai_resistance: parseFloat(tomorrow_prediction).toFixed(3),
            ai_support: parseFloat(day_after_tomorrow_prediction).toFixed(4),
            result,
            currentTrend,
            earlierTrend,
            formatedYesNo,
            markPrice,
            currentPer: parseFloat(currentPer).toFixed(2),
          };
        });
        allTicker.sort((a, b) => a.ticker && a.ticker.localeCompare(b.ticker));
        setSkeletonVisible(false);
        setAllCoinData(allTicker);
        setDataActive(allTicker);
      }
    } catch (err) {
      console.log('Error::', err);
    }
  };

  const handleTrendFilter = trend => {
    let prevObject = filteredTrendValues.includes(trend)
      ? filteredTrendValues.filter(value => value !== trend)
      : [...filteredTrendValues, trend];
    let dataArray = [];
    setFilteredTrendValues(prevValues => {
      const updatedValues = prevValues.includes(trend)
        ? prevValues.filter(value => value !== trend)
        : [...prevValues, trend];
      prevObject = updatedValues;
      return updatedValues;
    });
    if (prevObject.includes('Resistance Broken')) {
      dataArray.push('resistance-broken');
    }
    if (prevObject.includes('Neutral')) {
      dataArray.push('neutral');
    }
    if (prevObject.includes('Support Broken')) {
      dataArray.push('support-broken');
    }
    if (prevObject.includes('Bearish')) {
      dataArray.push('bearish');
    }
    if (prevObject.includes('Bullish')) {
      dataArray.push('bullish');
    }
    if (prevObject.includes('Very Bullish')) {
      dataArray.push('very-bullish');
    }
    if (prevObject.includes('Very Bearish')) {
      dataArray.push('very-bearish');
    }
    if (prevObject.includes('Extremely Bullish')) {
      dataArray.push('extremely-bullish');
    }
    if (prevObject.includes('Extremely Bearish')) {
      dataArray.push('extremely-bearish');
    }
    console.log('value???', dataArray);
  };

  const onFilterHandle = from => {
    if (from == 'yes') {
      if (yesVisible) {
        setAllCoinData(dataActive.slice(0, 50));
        setRefresh(!refresh);
      } else {
        onFilterData('Yes');
      }
      setYesVisible(!yesVisible);
      setNoVisible(false);
    } else if (from == 'no') {
      if (noVisible) {
        setAllCoinData(dataActive.slice(0, 50));
        setRefresh(!refresh);
      } else {
        onFilterData('No');
      }
      setYesVisible(false);
      setNoVisible(!noVisible);
    }
  };

  const onFilterData = async text => {
    try {
      let allData = dataActive;
      const filtered = allData.filter(item =>
        item.formatedYesNo.toLowerCase().includes(text.toLowerCase()),
      );
      setAllCoinData(filtered);
      setRefresh(!refresh);
    } catch (err) {
      console.log('Error::', err);
    }
  };

  const handleSearch = async text => {
    setSearchVisible(true);
    setSearch1(text);
    if (text !== '') {
      let allData = dataActive;
      const filtered = allData.filter(
        item =>
          item.ticker && item.ticker.toLowerCase().includes(text.toLowerCase()),
      );
      setAllCoinData(filtered);
      setSearchVisible(false);
      setRefresh(!refresh);
    } else {
      setAllCoinData(dataActive.slice(0, 50));
      setSearchVisible(false);
      setRefresh(!refresh);
    }
  };

  const onHandlePostBuyData = async from => {
    try {
      if (from == 'buy') {
        let raw = JSON.stringify({
          strategy_info: buyStrategyValue,
          buy_amount: buyAmount,
          buy_leverage: buyLeverage,
          buy_tp: buyTP,
          buy_sl: buySL,
          buy_trp: buyTRP,
          buy_ai_target: buyAiTarget == 'Enable' ? true : false,
          buy_percentage_change: buyChng,
          buy_ai_resistance: buyAiResistance == 'Enable' ? true : false,
          buy_auto_reverse_trading: buyAutoReverse == 'Enable' ? true : false,
          buy_reverse_trading: buyReverse == 'Enable' ? true : false,
          stretegy_on_off_button: buyONOFF,
        });
        const buyResponse = await onPostAdminCustomDefaultApi(raw);
        if (buyResponse.data) {
          console.log('Buy buyResponse::', buyResponse.data);
        }
      } else {
        let raw = JSON.stringify({
          strategy_info: sellStrategyValue,
          sell_amount: sellAmount,
          sell_leverage: sellLeverage,
          sell_tp: sellTP,
          sell_sl: sellSL,
          sell_trp: sellTRP,
          sell_ai_target: sellAiTarget == 'Enable' ? true : false,
          sell_percentage_change: sellChng,
          sell_ai_support: sellAiResistance == 'Enable' ? true : false,
          sell_auto_reverse_trading: buyAutoReverse == 'Enable' ? true : false,
          sell_reverse_trading: sellReverse == 'Enable' ? true : false,
          sell_stretegy_on_off_button: sellONOFF,
        });
        const buyResponse = await onPostAdminCustomDefaultApi(raw);
        if (buyResponse.data) {
          console.log('Buy buyResponse::', buyResponse.data);
        }
      }
    } catch (err) {
      console.log('Buy Error::', err);
    }
  };

  const onSelectStrategy = async (from, value) => {
    if (from == 'buy') {
      strategyList.map(item => {
        if (item.strategy_info == value) {
          setBuyAiTarget(item.buy_ai_target ? 'Enable' : 'Disable');
          setBuyChng(`${item.buy_percentage_change}`);
          setBuyAiResistance(item.buy_ai_resistance ? 'Enable' : 'Disable');
          setBuyAutoReverse(
            item.buy_auto_reverse_trading ? 'Enable' : 'Disable',
          );
          setBuyReverse(item.buy_reverse_trading ? 'Enable' : 'Disable');
          setBuyLeverage(`${item.buy_leverage}`);
          setBuyAmount(`${item.buy_amount}`);
          setBuyTP(`${item.buy_tp}`);
          setBuySL(`${item.buy_sl}`);
          setBuyTRP(`${item.buy_trp}`);
          setBuyONOFF(item.stretegy_on_off_button);
        }
      });
    } else {
      strategyList.map(item => {
        if (item.strategy_info == value) {
          setSellAiTarget(item.sell_ai_target ? 'Enable' : 'Disable');
          setSellChng(`${item.sell_percentage_change}`);
          setSellAiResistance(item.sell_ai_support ? 'Enable' : 'Disable');
          setSellAutoReverse(
            item.sell_auto_reverse_trading ? 'Enable' : 'Disable',
          );
          setSellReverse(item.sell_reverse_trading ? 'Enable' : 'Disable');
          setSellLeverage(`${item.sell_leverage}`);
          setSellAmount(`${item.sell_amount}`);
          setSellTP(`${item.sell_tp}`);
          setSellSL(`${item.sell_sl}`);
          setSellTRP(`${item.sell_trp}`);
          setSellONOFF(item.sell_stretegy_on_off_button);
        }
      });
    }
  };

  const onHandleSetting = async () => {
    try {
      let raw = JSON.stringify({
        on_off_button: !tradeVisible,
      });
      setTradeVisible(!tradeVisible);

      const settingDataIcon = await onPostAdminTradeDefaultApi(raw);
      if (settingDataIcon?.data) {
        console.log('settingData', settingDataIcon?.data);
      }
    } catch (err) {
      console.log('setting>', err);
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
            title={'Custom'}
            userRole={userRole}
            onPress={() => navigation.openDrawer()}
            navigation={navigation}
            notify={true}
            filterVisible={filterVisible}
            setFilterVisible={setFilterVisible}
          />
        </View>
        <View style={styles.mainView}>
          <KeyboardAwareScrollView
            ref={scrollRef}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(15)}}>
            <View style={styles.headingsView}>
              {titleArray.map((item, index) => {
                if (index == 0) {
                  return (
                    <View key={item.name} style={styles.heading1}>
                      <Text style={[styles.valueText, {color: item.color}]}>
                        {neutralCount}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleTrendFilter(item.name)}
                        style={[
                          styles.titleView,
                          {
                            backgroundColor: filteredTrendValues.includes(
                              item.name,
                            )
                              ? COLORS.white
                              : item.color,
                            borderColor: item.color,
                            borderWidth: 1,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.titleText,
                            {
                              color: filteredTrendValues.includes(item.name)
                                ? COLORS.black
                                : COLORS.white,
                            },
                          ]}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                } else {
                  return (
                    <View key={item.name} style={styles.heading}>
                      <Text style={[styles.valueText, {color: item.color}]}>
                        {item.name === t('resistance_broken')
                          ? resistanceBrokenCount
                          : item.name === t('bullish')
                          ? bullishCount
                          : item.name === t('very_bullish')
                          ? veryBullishCount
                          : item.name === t('extremely_bullish')
                          ? extremelyBullishCount
                          : item.name === t('support_broken')
                          ? supportBrokenCount
                          : item.name === t('bearish')
                          ? bearishCount
                          : item.name === t('very_bearish')
                          ? veryBearishCount
                          : item.name === t('extremely_bearish')
                          ? extremelyBearishCount
                          : neutralCount}
                      </Text>
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleTrendFilter(item.name)}
                        style={[
                          styles.titleView,
                          {
                            backgroundColor: filteredTrendValues.includes(
                              item.name,
                            )
                              ? COLORS.white
                              : item.color,
                            borderColor: item.color,
                            borderWidth: 1,
                          },
                        ]}>
                        <Text
                          style={[
                            styles.titleText,
                            {
                              color: filteredTrendValues.includes(item.name)
                                ? COLORS.black
                                : COLORS.white,
                            },
                          ]}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }
              })}
            </View>

            <View style={[styles.balanceSellMathView, {marginVertical: hp(2)}]}>
              <View style={styles.rowView}>
                <View>
                  <Text style={styles.selectCoinText}>{'Strategy'}</Text>
                  <SelectDropdown
                    data={strategyArray}
                    onSelect={(selectedItem, index) => {
                      setBuyStrategy(selectedItem.name);
                      setBuyStrategyValue(selectedItem.value);
                      onSelectStrategy('buy', selectedItem.value);
                      console.log('gert Value:::', selectedItem);
                    }}
                    buttonTextAfterSelection={(item, index) => {
                      return (
                        <View style={styles.dropdownView}>
                          <Text
                            style={[
                              styles.dropdownItemTxtStyle,
                              {marginLeft: 0},
                            ]}>
                            {item.name}
                          </Text>
                        </View>
                      );
                    }}
                    defaultValueByIndex={0}
                    defaultValue={buyStrategy}
                    defaultButtonText={'Select Coin'}
                    renderCustomizedRowChild={(item, index, isSelected) => {
                      return (
                        <View style={styles.dropdownView}>
                          <Text style={styles.dropdownItemTxtStyle}>
                            {item.name}
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
                </View>
                <View style={{marginHorizontal: wp(3)}}>
                  <Text style={styles.selectCoinText}>{'AI Target'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setBuyAiTarget(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={buyAiTarget}
                    defaultButtonText={'Select Coin'}
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
                    buttonStyle={styles.dropdown2BtnStyle1}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View>
                  <Text style={[styles.selectCoinText]}>{'% Chng'}</Text>
                  <TextInput
                    value={buyChng}
                    onChangeText={text => setBuyChng(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
              </View>
              <View style={[styles.rowView, {marginTop: hp(2)}]}>
                <View>
                  <Text style={styles.selectCoinText}>{'AI Resistance'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setBuyAiResistance(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={1}
                    defaultValue={buyAiResistance}
                    defaultButtonText={'Select Coin'}
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
                </View>
                <View style={{marginHorizontal: wp(3)}}>
                  <Text style={styles.selectCoinText}>{'Auto Reverse'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setBuyAutoReverse(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={buyAutoReverse}
                    defaultButtonText={'Select Coin'}
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
                    buttonStyle={styles.dropdown2BtnStyle1}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View>
                  <Text style={styles.selectCoinText}>{'Reversed'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setBuyReverse(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={buyReverse}
                    defaultButtonText={'Select Coin'}
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
                    buttonStyle={styles.dropdown2BtnStyle1}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
              </View>

              <View style={[styles.rowView, {marginTop: hp(2)}]}>
                <View>
                  <Text style={[styles.selectCoinText]}>{'Leverage'}</Text>
                  <TextInput
                    value={buyLeverage}
                    onChangeText={text => setBuyLeverage(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <View style={{marginHorizontal: wp(4)}}>
                  <Text style={[styles.selectCoinText]}>{'Amount'}</Text>
                  <TextInput
                    value={buyAmount}
                    onChangeText={text => setBuyAmount(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <View>
                  <Text style={[styles.selectCoinText]}>{'TP'}</Text>
                  <TextInput
                    value={buyTP}
                    onChangeText={text => setBuyTP(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
              </View>

              <View style={[styles.rowView, {marginTop: hp(2)}]}>
                <View>
                  <Text style={[styles.selectCoinText]}>{'SL'}</Text>
                  <TextInput
                    value={buySL}
                    onChangeText={text => setBuySL(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <View style={{marginHorizontal: wp(3)}}>
                  <Text style={[styles.selectCoinText]}>{'TRP'}</Text>
                  <TextInput
                    value={buyTRP}
                    onChangeText={text => setBuyTRP(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.buyButtonView, {marginTop: hp(3.5)}]}
                  onPress={() => onHandlePostBuyData('buy')}>
                  <Text style={styles.buyText}>{'Buy'}</Text>
                </TouchableOpacity>
                <View style={{marginTop: hp(3.5), marginLeft: wp(2)}}>
                  <Switch
                    trackColor={{
                      false: COLORS.errorColor,
                      true: COLORS.greenColor,
                    }}
                    thumbColor={buyONOFF ? '#f4f3f4' : '#f4f3f4'}
                    ios_backgroundColor={COLORS.errorColor}
                    onValueChange={() => setBuyONOFF(!buyONOFF)}
                    value={buyONOFF}
                  />
                </View>
              </View>
            </View>

            <View style={styles.balanceBuyMathView}>
              <View style={styles.rowView}>
                <View>
                  <Text style={styles.selectCoinText}>{'Strategy'}</Text>
                  <SelectDropdown
                    data={strategyArray}
                    onSelect={(selectedItem, index) => {
                      setSellStrategy(selectedItem.name);
                      setSellStrategyValue(selectedItem.value);
                      onSelectStrategy('sell', selectedItem.value);
                      console.log('gert Value:::', selectedItem);
                    }}
                    buttonTextAfterSelection={(item, index) => {
                      return (
                        <View style={styles.dropdownView}>
                          <Text
                            style={[
                              styles.dropdownItemTxtStyle,
                              {marginLeft: 0},
                            ]}>
                            {item.name}
                          </Text>
                        </View>
                      );
                    }}
                    defaultValueByIndex={0}
                    defaultValue={sellStrategy}
                    defaultButtonText={'Select Coin'}
                    renderCustomizedRowChild={(item, index, isSelected) => {
                      return (
                        <View style={styles.dropdownView}>
                          <Text style={styles.dropdownItemTxtStyle}>
                            {item.name}
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
                </View>
                <View style={{marginHorizontal: wp(3)}}>
                  <Text style={styles.selectCoinText}>{'AI Target'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setSellAiTarget(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={sellAiTarget}
                    defaultButtonText={'Select Coin'}
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
                    buttonStyle={styles.dropdown2BtnStyle1}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View>
                  <Text style={[styles.selectCoinText]}>{'% Chng'}</Text>
                  <TextInput
                    value={sellChng}
                    onChangeText={text => setSellChng(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
              </View>
              <View style={[styles.rowView, {marginTop: hp(2)}]}>
                <View>
                  <Text style={styles.selectCoinText}>{'AI Resistance'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setSellAiResistance(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={1}
                    defaultValue={sellAiResistance}
                    defaultButtonText={'Select Coin'}
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
                </View>
                <View style={{marginHorizontal: wp(3)}}>
                  <Text style={styles.selectCoinText}>{'Auto Reverse'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setSellAutoReverse(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={sellAutoReverse}
                    defaultButtonText={'Select Coin'}
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
                    buttonStyle={styles.dropdown2BtnStyle1}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View>
                  <Text style={styles.selectCoinText}>{'Reversed'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setSellReverse(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={sellReverse}
                    defaultButtonText={'Select Coin'}
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
                    buttonStyle={styles.dropdown2BtnStyle1}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
              </View>
              <View style={[styles.rowView, {marginTop: hp(2)}]}>
                <View>
                  <Text style={[styles.selectCoinText]}>{'Leverage'}</Text>
                  <TextInput
                    value={sellLeverage}
                    onChangeText={text => setSellLeverage(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <View style={{marginHorizontal: wp(4)}}>
                  <Text style={[styles.selectCoinText]}>{'Amount'}</Text>
                  <TextInput
                    value={sellAmount}
                    onChangeText={text => setSellAmount(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <View>
                  <Text style={[styles.selectCoinText]}>{'TP'}</Text>
                  <TextInput
                    value={sellTP}
                    onChangeText={text => setSellTP(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
              </View>

              <View style={[styles.rowView, {marginTop: hp(2)}]}>
                <View>
                  <Text style={[styles.selectCoinText]}>{'SL'}</Text>
                  <TextInput
                    value={sellSL}
                    onChangeText={text => setSellSL(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <View style={{marginHorizontal: wp(3)}}>
                  <Text style={[styles.selectCoinText]}>{'TRP'}</Text>
                  <TextInput
                    value={buyTRP}
                    onChangeText={text => setBuyTRP(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.sellButtonView, {marginTop: hp(3.5)}]}
                  onPress={() => onHandlePostBuyData('sell')}>
                  <Text style={styles.buyText}>{'Sell'}</Text>
                </TouchableOpacity>
                <View style={{marginTop: hp(3.5), marginLeft: wp(2)}}>
                  <Switch
                    trackColor={{
                      false: COLORS.errorColor,
                      true: COLORS.greenColor,
                    }}
                    thumbColor={sellONOFF ? '#f4f3f4' : '#f4f3f4'}
                    ios_backgroundColor={COLORS.errorColor}
                    onValueChange={() => setSellONOFF(!sellONOFF)}
                    value={sellONOFF}
                  />
                </View>
              </View>
            </View>
            <View style={styles.showStrategyView}>
              <Text
                style={styles.buyStrategyText}
                onPress={() => {
                  setSellStrategyModal(false);
                  setBuyStrategyModal(!buyStrategyModal);
                }}>
                {buyStrategyModal
                  ? 'Hide Buy Strategies'
                  : 'Show Buy Strategies'}
              </Text>
              <Text
                style={styles.sellStrategyText}
                onPress={() => {
                  setBuyStrategyModal(false);
                  setSellStrategyModal(!sellStrategyModal);
                }}>
                {sellStrategyModal
                  ? 'Hide Sell Strategies'
                  : 'Show Sell Strategies'}
              </Text>
            </View>
            {buyStrategyModal || sellStrategyModal ? (
              <ScrollView horizontal>
                <View
                  style={[
                    styles.strategyMailView,
                    {
                      backgroundColor: buyStrategyModal
                        ? COLORS.lightGreen1
                        : COLORS.lightPrimary2,
                    },
                  ]}>
                  <View
                    style={[
                      styles.strategyHeading,
                      {
                        backgroundColor: buyStrategyModal
                          ? COLORS.greenColor
                          : COLORS.primary,
                      },
                    ]}>
                    <Text style={[styles.headingText, {width: wp(24)}]}>
                      STRATEGY
                    </Text>
                    <Text style={[styles.headingText, {width: wp(20)}]}>
                      STATUS
                    </Text>
                    <Text style={[styles.headingText, {width: wp(24)}]}>
                      {`AUTO\nREVERSE`}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(24)}]}>
                      REVERSED
                    </Text>
                    <Text style={[styles.headingText, {width: wp(24)}]}>
                      {`AI\nTARGET`}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(24)}]}>
                      {`%\nCHNG`}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(24)}]}>
                      {buyStrategyModal ? `AI\nRESISTANCE` : `AI\nSUPPORT`}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(24)}]}>
                      {`LEVERAGE`}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(20)}]}>
                      {`AMOUNT`}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(14)}]}>
                      {`T/P`}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(14)}]}>
                      {`S/L`}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(14)}]}>
                      {`TRP`}
                    </Text>
                  </View>
                  <View style={styles.strategyContent}>
                    {strategyList?.map((item, index) => {
                      return (
                        <View style={styles.strategyContentView}>
                          <Text style={[styles.contentText, {width: wp(24)}]}>
                            {item.strategy_info}
                          </Text>
                          <Text
                            style={[
                              styles.contentText,
                              {
                                width: wp(20),
                                color: buyStrategyModal
                                  ? item.stretegy_on_off_button
                                    ? COLORS.greenColor
                                    : COLORS.errorColor
                                  : item.stretegy_on_off_button
                                  ? COLORS.greenColor
                                  : COLORS.errorColor,
                              },
                            ]}>
                            {buyStrategyModal
                              ? item.stretegy_on_off_button
                                ? 'ON'
                                : 'OFF'
                              : item.sell_stretegy_on_off_button
                              ? 'ON'
                              : 'OFF'}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(24)}]}>
                            {buyStrategyModal
                              ? item.buy_auto_reverse_trading
                                ? 'Enable'
                                : 'Disable'
                              : item.sell_auto_reverse_trading
                              ? 'Enable'
                              : 'Disable'}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(24)}]}>
                            {buyStrategyModal
                              ? item.buy_reverse_trading
                                ? 'Enable'
                                : 'Disable'
                              : item.sell_reverse_trading
                              ? 'Enable'
                              : 'Disable'}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(24)}]}>
                            {buyStrategyModal
                              ? item.buy_ai_target
                                ? 'Enable'
                                : 'Disable'
                              : item.sell_ai_target
                              ? 'Enable'
                              : 'Disable'}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(24)}]}>
                            {buyStrategyModal
                              ? item.buy_percentage_change
                              : item.sell_percentage_change}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(24)}]}>
                            {buyStrategyModal
                              ? item.buy_ai_resistance
                                ? 'Enable'
                                : 'Disable'
                              : item.sell_ai_support
                              ? 'Enable'
                              : 'Disable'}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(24)}]}>
                            {buyStrategyModal
                              ? item.buy_leverage
                              : item.sell_leverage}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(20)}]}>
                            {buyStrategyModal
                              ? item.buy_amount
                              : item.sell_amount}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(14)}]}>
                            {buyStrategyModal ? item.buy_tp : item.sell_tp}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(14)}]}>
                            {buyStrategyModal ? item.buy_sl : item.sell_sl}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(14)}]}>
                            {buyStrategyModal ? item.buy_trp : item.sell_trp}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>
            ) : null}
            <View style={styles.rowView1}>
              <Text style={styles.titleText6}>{'EXPERT'}</Text>
              <Switch
                trackColor={{
                  false: tradeVisible ? COLORS.greenColor : COLORS.errorColor,
                  true: tradeVisible ? COLORS.greenColor : COLORS.errorColor,
                }}
                thumbColor={tradeVisible ? '#f4f3f4' : '#f4f3f4'}
                ios_backgroundColor={COLORS.errorColor}
                onValueChange={() => onHandleSetting()}
                value={tradeVisible}
              />
            </View>
            <View style={styles.filterView}>
              <TextInput
                value={search1}
                onChangeText={text => handleSearch(text)}
                placeholder={t('search_your_coin')}
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
                  <Text style={styles.indicatorText}>YES/NO</Text>

                  <TouchableOpacity
                    style={[styles.optionView, {marginTop: hp(2)}]}
                    onPress={() => onFilterHandle('yes')}>
                    <View
                      style={[
                        styles.checkBoxView,
                        {
                          backgroundColor: yesVisible
                            ? COLORS.primary
                            : COLORS.white,
                        },
                      ]}>
                      <Image style={styles.rightImage} source={check} />
                    </View>
                    <Text style={styles.optionText}>YES</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.optionView}
                    onPress={() => onFilterHandle('no')}>
                    <View
                      style={[
                        styles.checkBoxView,
                        {
                          backgroundColor: noVisible
                            ? COLORS.primary
                            : COLORS.white,
                        },
                      ]}>
                      <Image style={styles.rightImage} source={check} />
                    </View>
                    <Text style={styles.optionText}>NO</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.dataCountShow}>
              <Text style={styles.dataCountText}>
                {'[ '}
                <Text
                  style={[styles.dataCountText1, {color: COLORS.greenColor}]}>
                  +
                </Text>
                {currentperPositive}
                <Text
                  style={[styles.dataCountText1, {color: COLORS.errorColor}]}>
                  {'  -'}
                </Text>
                {currentperNegative}
                {' ]'}
              </Text>
            </View>
            <View
              style={[
                styles.activeView1,
                {width: allCoinData.length > 1 ? '99%' : wp(65)},
              ]}>
              <View style={styles.titleActiveView1}>
                <TouchableOpacity
                  style={styles.imageView}
                  onPress={() => setFavorite(!favorite)}>
                  <Image
                    style={[
                      styles.starIcon,
                      {
                        tintColor: favorite ? COLORS.goldenColor : COLORS.white,
                      },
                    ]}
                    source={favorite ? star1 : star}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imageView}
                  onPress={() => setNotificationData(!notification)}>
                  <Image
                    style={[
                      styles.starIcon,
                      {
                        tintColor: notification
                          ? COLORS.goldenColor
                          : COLORS.white,
                      },
                    ]}
                    source={notification ? bell2 : bell1}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView1]}>
                  <Text style={styles.titleText4}>
                    {'Trending\nCoins '}
                    {coinSort === 0 || coinSort === 1 ? (
                      <Image style={styles.upDownImage} source={arrowUp} />
                    ) : null}
                    {coinSort === 0 || coinSort === 2 ? (
                      <Image style={styles.upDownImage} source={down} />
                    ) : null}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView1]}>
                  <Text style={styles.titleText4}>
                    {'Last\nPrice '}
                    {coinSort === 0 || coinSort === 1 ? (
                      <Image style={styles.upDownImage} source={arrowUp} />
                    ) : null}
                    {coinSort === 0 || coinSort === 2 ? (
                      <Image style={styles.upDownImage} source={down} />
                    ) : null}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView1]}>
                  <Text style={styles.titleText4}>
                    {'Current\n% '}
                    {coinSort === 0 || coinSort === 1 ? (
                      <Image style={styles.upDownImage} source={arrowUp} />
                    ) : null}
                    {coinSort === 0 || coinSort === 2 ? (
                      <Image style={styles.upDownImage} source={down} />
                    ) : null}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>
                    {'AI Target '}
                    {coinSort === 0 || coinSort === 1 ? (
                      <Image style={styles.upDownImage} source={arrowUp} />
                    ) : null}
                    {coinSort === 0 || coinSort === 2 ? (
                      <Image style={styles.upDownImage} source={down} />
                    ) : null}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {height: hp(6)}]}>
                  <Text style={styles.titleText4}>{'AI Resistance'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {height: hp(5)}]}>
                  <Text style={styles.titleText4}>{'AI Support'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>
                    {'R % Chng'}
                    {coinSort === 0 || coinSort === 1 ? (
                      <Image style={styles.upDownImage} source={arrowUp} />
                    ) : null}
                    {coinSort === 0 || coinSort === 2 ? (
                      <Image style={styles.upDownImage} source={down} />
                    ) : null}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>
                    {'S % Chng'}
                    {coinSort === 0 || coinSort === 1 ? (
                      <Image style={styles.upDownImage} source={arrowUp} />
                    ) : null}
                    {coinSort === 0 || coinSort === 2 ? (
                      <Image style={styles.upDownImage} source={down} />
                    ) : null}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'% Chng'}</Text>
                  {coinSort === 0 || coinSort === 1 ? (
                    <Image style={styles.upDownImage} source={arrowUp} />
                  ) : null}
                  {coinSort === 0 || coinSort === 2 ? (
                    <Image style={styles.upDownImage} source={down} />
                  ) : null}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {height: hp(5)}]}>
                  <Text style={styles.titleText4}>{'Y/N'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Previous\nTrend'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Last\nTrend'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Trend\nDirection'}</Text>
                </TouchableOpacity>
              </View>
              {skeletonVisible ? (
                <AIConfigSkeleton />
              ) : (
                <FlatList
                  data={allCoinData}
                  extraData={allCoinData}
                  nestedScrollEnabled
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  initialNumToRender={allCoinData.length}
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
                        key={item.ticker}
                        activeOpacity={1}
                        style={[
                          styles.dataHistoryView,
                          {
                            backgroundColor:
                              index % 2 === 0
                                ? COLORS.lightPrimary
                                : COLORS.lightPrimary3,
                            borderTopRightRadius:
                              allCoinData.length - 1 == index ? wp(3) : 0,
                            borderBottomRightRadius:
                              allCoinData.length - 1 == index ? wp(3) : 0,
                          },
                        ]}>
                        <TouchableOpacity
                          style={styles.imageView1}
                          onPress={() => {}}>
                          <Image
                            style={[
                              styles.starIcon,
                              {
                                tintColor: item.favoriteStatus
                                  ? COLORS.goldenColor
                                  : COLORS.black,
                              },
                            ]}
                            source={item.favoriteStatus ? star1 : star}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.imageView}
                          onPress={() => {}}>
                          <Image
                            style={[
                              styles.starIcon,
                              {
                                tintColor: item.notificationStatus
                                  ? COLORS.goldenColor
                                  : COLORS.black,
                              },
                            ]}
                            source={item.notificationStatus ? bell2 : bell1}
                          />
                        </TouchableOpacity>
                        <View style={styles.optionTitleView1}>
                          <Text style={[styles.dataHistoryText]}>
                            {item.ticker}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView1}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.markPrice}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView1}>
                          <Text style={[styles.dataHistoryText]}>
                            {item.currentPer}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.optionTitleView,
                            {marginTop: hp(0.4)},
                          ]}>
                          <Text
                            style={[
                              styles.dataHistoryText,
                              {
                                color:
                                  item.markPrice > item?.ai_target
                                    ? COLORS.errorColor
                                    : COLORS.greenColor,
                              },
                            ]}>
                            {item?.ai_target}
                          </Text>
                        </View>
                        <View style={[styles.optionTitleView, {height: hp(6)}]}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.ai_resistance}
                          </Text>
                        </View>
                        <View style={[styles.optionTitleView, {height: hp(5)}]}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.ai_support}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          <Text
                            style={[
                              styles.dataHistoryText,
                              {
                                color:
                                  item.r_change > 0
                                    ? COLORS.greenColor
                                    : COLORS.errorColor,
                              },
                            ]}>
                            {item?.r_change}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          <Text
                            style={[
                              styles.dataHistoryText,
                              {
                                color:
                                  item.s_change > 0
                                    ? COLORS.greenColor
                                    : COLORS.errorColor,
                              },
                            ]}>
                            {item?.s_change}
                          </Text>
                        </View>
                        <View
                          style={[styles.optionTitleView, {height: hp(6.8)}]}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.percentage_change}
                          </Text>
                        </View>
                        <View style={[styles.optionTitleView, {height: hp(5)}]}>
                          <Text
                            style={[
                              styles.dataHistoryText,
                              {
                                color:
                                  item.markPrice > item?.ai_target
                                    ? COLORS.errorColor
                                    : COLORS.greenColor,
                              },
                            ]}>
                            {item?.formatedYesNo}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          <Text
                            style={[
                              styles.dataHistoryText,
                              {
                                color:
                                  item.earlierTrend === 'resistance-broken'
                                    ? '#00008b'
                                    : item.earlierTrend === 'bullish'
                                    ? '#236a4f'
                                    : item.earlierTrend === 'very-bullish'
                                    ? '#349b73'
                                    : item.earlierTrend === 'extremely-bullish'
                                    ? '#39ff14'
                                    : item.earlierTrend === 'support-broken'
                                    ? '#4444b2'
                                    : item.earlierTrend === 'bearish'
                                    ? '#a81e08eb'
                                    : item.earlierTrend === 'very-bearish'
                                    ? '#d83218eb'
                                    : item.earlierTrend === 'extremely-bearish'
                                    ? '#ff3314'
                                    : '#ffa500',
                              },
                            ]}>
                            {item.earlierTrend === 'resistance-broken'
                              ? 'Resistance Broken'
                              : item.earlierTrend === 'bullish'
                              ? 'Bullish'
                              : item.earlierTrend === 'very-bullish'
                              ? 'Very Bullish'
                              : item.earlierTrend === 'extremely-bullish'
                              ? 'Extremely Bullish'
                              : item.earlierTrend === 'support-broken'
                              ? 'Support Broken'
                              : item.earlierTrend === 'bearish'
                              ? 'Bearish'
                              : item.earlierTrend === 'very-bearish'
                              ? 'Very Bearish'
                              : item.earlierTrend === 'extremely-bearish'
                              ? 'Extremely Bearish'
                              : 'Neutral'}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          <Text
                            style={[
                              styles.dataHistoryText,
                              {
                                color:
                                  item.currentTrend === 'resistance-broken'
                                    ? '#00008b'
                                    : item.currentTrend === 'bullish'
                                    ? '#236a4f'
                                    : item.currentTrend === 'very-bullish'
                                    ? '#349b73'
                                    : item.currentTrend === 'extremely-bullish'
                                    ? '#39ff14'
                                    : item.currentTrend === 'support-broken'
                                    ? '#4444b2'
                                    : item.currentTrend === 'bearish'
                                    ? '#a81e08eb'
                                    : item.currentTrend === 'very-bearish'
                                    ? '#d83218eb'
                                    : item.currentTrend === 'extremely-bearish'
                                    ? '#ff3314'
                                    : '#ffa500',
                              },
                            ]}>
                            {item.currentTrend === 'resistance-broken'
                              ? 'Resistance Broken'
                              : item.currentTrend === 'bullish'
                              ? 'Bullish'
                              : item.currentTrend === 'very-bullish'
                              ? 'Very Bullish'
                              : item.currentTrend === 'extremely-bullish'
                              ? 'Extremely Bullish'
                              : item.currentTrend === 'support-broken'
                              ? 'Support Broken'
                              : item.currentTrend === 'bearish'
                              ? 'Bearish'
                              : item.currentTrend === 'very-bearish'
                              ? 'Very Bearish'
                              : item.currentTrend === 'extremely-bearish'
                              ? 'Extremely Bearish'
                              : 'Neutral'}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          {item.currentTrend === 'neutral' ? (
                            <Text
                              style={[
                                styles.dataHistoryText,
                                {
                                  color:
                                    item.earlierTrend === 'resistance-broken'
                                      ? '#00008b'
                                      : item.earlierTrend === 'bullish'
                                      ? '#236a4f'
                                      : item.earlierTrend === 'very-bullish'
                                      ? '#349b73'
                                      : item.earlierTrend === 'extremely-bullish'
                                      ? '#39ff14'
                                      : item.earlierTrend === 'support-broken'
                                      ? '#4444b2'
                                      : item.earlierTrend === 'bearish'
                                      ? '#a81e08eb'
                                      : item.earlierTrend === 'very-bearish'
                                      ? '#d83218eb'
                                      : item.earlierTrend === 'extremely-bearish'
                                      ? '#ff3314'
                                      : '#ffa500',
                                  fontSize: hp(2.9),
                                },
                              ]}>
                              =
                            </Text>
                          ) : item?.result === 'high' && item.currentTrend !== 'neutral' ? (
                            <Image
                              style={[
                                styles.arrowImage,
                                {
                                  tintColor:
                                    item.earlierTrend === 'resistance-broken'
                                      ? '#00008b'
                                      : item.earlierTrend === 'bullish'
                                      ? '#236a4f'
                                      : item.earlierTrend === 'very-bullish'
                                      ? '#349b73'
                                      : item.earlierTrend === 'extremely-bullish'
                                      ? '#39ff14'
                                      : item.earlierTrend === 'support-broken'
                                      ? '#4444b2'
                                      : item.earlierTrend === 'bearish'
                                      ? '#a81e08eb'
                                      : item.earlierTrend === 'very-bearish'
                                      ? '#d83218eb'
                                      : item.earlierTrend === 'extremely-bearish'
                                      ? '#ff3314'
                                      : '#ffa500',
                                },
                              ]}
                              source={upArrow}
                            />
                          ) : item?.result === 'low' && item.currentTrend !== 'neutral' ? (
                            <Image
                              style={[
                                styles.arrowImage,
                                {
                                  tintColor:
                                    item.earlierTrend === 'resistance-broken'
                                      ? '#00008b'
                                      : item.earlierTrend === 'bullish'
                                      ? '#236a4f'
                                      : item.earlierTrend === 'very-bullish'
                                      ? '#349b73'
                                      : item.earlierTrend === 'extremely-bullish'
                                      ? '#39ff14'
                                      : item.earlierTrend === 'support-broken'
                                      ? '#4444b2'
                                      : item.earlierTrend === 'bearish'
                                      ? '#a81e08eb'
                                      : item.earlierTrend === 'very-bearish'
                                      ? '#d83218eb'
                                      : item.earlierTrend === 'extremely-bearish'
                                      ? '#ff3314'
                                      : '#ffa500',
                                },
                              ]}
                              source={downArrow}
                            />
                          ) : item?.result === 'none' && item.currentTrend !== 'neutral' ? (
                            ''
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </View>
  );
};

export default CustomScreen;
