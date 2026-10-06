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
import downArrow from '../../../images/downArrow.png';
import upArrow from '../../../images/upArrow.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import SelectDropdown from 'react-native-select-dropdown';
import {
  onDeleteFavoriteAdminApi,
  onDeleteFavoriteAnalyticsApi,
  onGetCryptoDefaultApi,
  onGetFavoriteAdminApi,
  onGetFavoriteAnalyticsApi,
  onGetHighLowDetailsCryptoApi,
  onGetSpotTickers,
  onGetVolumeCryptoApi,
  onPostCryptoDefaultApi,
  onPostFavoriteAdminApi,
  onPostFavoriteAnalyticsApi,
} from '../../../services/Api';
import arrowUp from '../../../images/arrowUp.png';
import down from '../../../images/down.png';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import moment from 'moment';
import AutoBotSkeleton from '../../../components/AutoBotSkeleton';

const rangeArray = ['Disable', 'Enable'];
const strategyArray = [
  {name: 'Strategy 1', value: 's1'},
  {name: 'Strategy 2', value: 's2'},
  {name: 'Strategy 3', value: 's3'},
  {name: 'Strategy 4', value: 's4'},
  {name: 'Strategy 5', value: 's5'},
  {name: 'Strategy 6', value: 's6'},
];

const options = [
  {value: 'extremely-bullish', label: 'Extremely Bullish'},
  {value: 'very-bullish', label: 'Very Bullish'},
  {value: 'bullish', label: 'Bullish '},
  {value: 'resistance-broken', label: 'Resistance Broken'},
  {value: 'neutral', label: 'Neutral'},
  {value: 'extremely-bearish', label: 'Extremely Bearish'},
  {value: 'very-bearish', label: 'Very Bearish'},
  {value: 'bearish', label: 'Bearish'},
  {value: 'support-broken', label: 'Support Broken'},
  {value: '', label: 'None'},
];

const BotConfigScreen = ({navigation}) => {
  const socketRef = useRef(null);
  const intervalRef = useRef(null);
  const isFocused = useIsFocused();
  const {t} = useTranslation();
  const futurePriceData = useSelector(state => state.getAdminSpotPriceStatus);
  const tickerData = useSelector(state => state.getAdminFutureYahooTicker);
  const scrollRef = useRef(null);
  const [search1, setSearch1] = useState('');
  const [userRole, setUserRole] = useState('');
  const [dataActive, setDataActive] = useState([]);

  const [buyStrategy, setBuyStrategy] = useState('Strategy 1');
  const [buyStrategyValue, setBuyStrategyValue] = useState('s1');
  const [buyTrendingDay, setBuyTrendingDay] = useState('Disable');
  const [buyClosingPrice, setBuyClosingPrice] = useState('Disable');
  const [buyYesterdayPer, setBuyYesterdayPer] = useState('5');
  const [buyAITarget, setBuyAITarget] = useState('Disable');
  const [buyTrendDirection, setBuyTrendDirection] = useState('');
  const [buyTrendDirectionLabel, setBuyTrendDirectionLabel] = useState('None');
  const [buyCurrentPer, setBuyCurrentPer] = useState('2');
  const [buyYesterdayHigh, setBuyYesterdayHigh] = useState('Disable');
  const [buyTodayHigh, setBuyTodayHigh] = useState('Disable');
  const [buyVolumePer, setBuyVolumePer] = useState('1');
  const [buyLPAI, setBuyLPAI] = useState('Disable');
  const [buyLPAIPer, setBuyLPAIPer] = useState('1');
  const [buyAutoReverse, setBuyAutoReverse] = useState('Enable');
  const [buyReverse, setBuyReverse] = useState('Disable');
  const [buyRepeat, setBuyRepeat] = useState('2');
  const [buyLeverage, setBuyLeverage] = useState('5');
  const [buyAmount, setBuyAmount] = useState('100');
  const [buyTP, setBuyTP] = useState('20');
  const [buySL, setBuySL] = useState('15');
  const [buyTRP, setBuyTRP] = useState('20');
  const [buyYesterdayLow, setBuyYesterdayLow] = useState('Disable');
  const [buyTodayLow, setBuyTodayLow] = useState('Disable');

  const [sellStrategy, setSellStrategy] = useState('Strategy 1');
  const [sellStrategyValue, setSellStrategyValue] = useState('s1');
  const [sellTrendingDay, setSellTrendingDay] = useState('Disable');
  const [sellClosingPrice, setSellClosingPrice] = useState('Disable');
  const [sellYesterdayPer, setSellYesterdayPer] = useState('5');
  const [sellAITarget, setSellAITarget] = useState('Disable');
  const [sellTrendDirection, setSellTrendDirection] = useState('');
  const [sellTrendDirectionLabel, setSellTrendDirectionLabel] = useState('None');
  const [sellCurrentPer, setSellCurrentPer] = useState('2');
  const [sellYesterdayHigh, setSellYesterdayHigh] = useState('Disable');
  const [sellTodayHigh, setSellTodayHigh] = useState('Disable');
  const [sellVolumePer, setSellVolumePer] = useState('1');
  const [sellLPAI, setSellLPAI] = useState('Disable');
  const [sellLPAIPer, setSellLPAIPer] = useState('1');
  const [sellAutoReverse, setSellAutoReverse] = useState('Enable');
  const [sellReverse, setSellReverse] = useState('Disable');
  const [sellRepeat, setSellRepeat] = useState('2');
  const [sellLeverage, setSellLeverage] = useState('5');
  const [sellAmount, setSellAmount] = useState('100');
  const [sellTP, setSellTP] = useState('20');
  const [sellSL, setSellSL] = useState('15');
  const [sellTRP, setSellTRP] = useState('20');
  const [sellYesterdayLow, setSellYesterdayLow] = useState('Disable');
  const [sellTodayLow, setSellTodayLow] = useState('Disable');
  const [filteredTrendValues, setFilteredTrendValues] = useState([]);
  const [notificationData, setNotificationData] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [notification, setNotification] = useState(false);
  const [coinSort, setCoinSort] = useState(0);
  const [allCoinData, setAllCoinData] = useState([]);
  const [appState, setAppState] = useState(AppState.currentState);
  const [strategyList, setStrategyList] = useState([]);
  const [buyStrategyModal, setBuyStrategyModal] = useState(false);
  const [sellStrategyModal, setSellStrategyModal] = useState(false);
  const [buyONOFF, setBuyONOFF] = useState(false);
  const [sellONOFF, setSellONOFF] = useState(false);
  const [skeletonVisible, setSkeletonVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const allDataGet = async () => {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
    };
    allDataGet();
  }, []);

  useEffect(() => {
    onGetDefaultValue();
    getValueOfTickerData();
  }, []);

  const onGetDefaultValue = async () => {
    try {
      const defaultResponse = await onGetCryptoDefaultApi();
      if (defaultResponse.data) {
        const dataArray = Object.keys(defaultResponse.data).map(key => defaultResponse.data[key]);
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

  const formatDate = date => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get today's date in UK time
  let today = new Date();
  today.setUTCHours(today.getUTCHours() + 1); // Adjust for UK time zone (GMT+1)

  // Get yesterday's date in UK time
  let yesterday = new Date(today);
  yesterday.setDate(today.getUTCDate() - 1);
  yesterday.setUTCHours(yesterday.getUTCHours() + 1); // Adjust for UK time zone (GMT+1)

  // Get the day before yesterday's date in UK time
  let dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(today.getUTCDate() - 2);
  dayBeforeYesterday.setUTCHours(dayBeforeYesterday.getUTCHours() + 1); // Adjust for UK time zone (GMT+1)

  // Get the date of two days earlier in UK time
  let twoDaysEarlier = new Date(today);
  twoDaysEarlier.setDate(today.getUTCDate() - 3);
  twoDaysEarlier.setUTCHours(twoDaysEarlier.getUTCHours() + 1);
  // Adjust for UK time zone (GMT+1)

  let threeDaysEarlier = new Date();
  threeDaysEarlier.setDate(today.getUTCDate() - 4);
  threeDaysEarlier.setUTCHours(threeDaysEarlier.getUTCHours() + 1);

  let fourDaysEarlier = new Date();
  fourDaysEarlier.setDate(today.getUTCDate() - 5);
  fourDaysEarlier.setUTCHours(fourDaysEarlier.getUTCHours() + 1);

  const customSort = (a, b) => {
    // Convert strings to lowercase for case-insensitive comparison
    const stringA = a?.ticker.toLowerCase();
    const stringB = b?.ticker.toLowerCase();

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

  const getValueOfTickerData = async () => {
    try {
      setSkeletonVisible(true);
      let allTicker = [];
      if (futurePriceData) {
        let favoriteResponse = await onGetFavoriteAdminApi();
        let volumeResponse = await onGetVolumeCryptoApi();
        let highLowResponse = await onGetHighLowDetailsCryptoApi();
        let lowHighvaluesData = highLowResponse.data;
        const volumeValuesData = volumeResponse.data;
        let favoriteArray = favoriteResponse.data?.withlist?.tickers_list;
        const valuesArray = Object.values(tickerData.data_dict);
        let AllData = [];
        allTicker = valuesArray;
        allTicker = allTicker.map(item => {
          const tickerHighData = lowHighvaluesData[item];
          const todayHigh = '';
          const todayLow = '';
          const currentPer = '';
          let high = [];
          let low = [];
          let volume = [];
          let yesterdayPer = [];
          let yesterdayHigh;
          let yesterdayLow;
          let chngPerOne;
          let chngPerTwo;
          let chngPerThree;
          let chngPerFour;
          let chngPerFive;
          let closingPrice = [];
          let maxHighValue;
          let minLowValue;
          let indexOfMaxHighValue;
          let indexOfMinLowValue;
          let pricePercent;
          const randomPercentageValue = futurePriceData.find(
            data => data.ticker === `${item}`,
          )?.ticker;
          if (randomPercentageValue) {
            let isTickerInList = favoriteArray.includes(randomPercentageValue);
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

            const avgVolumeData = volumeValuesData?.find(
              entry => entry.ticker === item,
            );
            let avgVolume = '-';
            let currentVolume = '-';
            if (avgVolumeData) {
              avgVolume = parseFloat(
                avgVolumeData.last_month_avg_vol || '0.0',
              ).toFixed(3);
              if (avgVolume === '0.000') {
                avgVolume = '-';
              }
              currentVolume = parseFloat(
                avgVolumeData.today_volume || '0',
              ).toFixed(3);
              if (currentVolume === '0.000') {
                currentVolume = '-';
              }
            }

            const avgVolumeNumber = parseFloat(avgVolume).toFixed(3);
            const currentVolumeNumber = parseFloat(currentVolume).toFixed(3);

            let volPercentage = '';

            if (currentVolume === '-' || avgVolume === '-') {
              volPercentage = '';
            } else {
              volPercentage =
                ((currentVolumeNumber - avgVolumeNumber) / avgVolumeNumber) * 100;
              volPercentage = volPercentage.toFixed(2);
            }

            let highCount = 1;
            let lowCount = 1;
            let finalConsistency;
            let consistency;
            let closePriceValue;
            let lowLast;
            let lowLastSecond;
            let percentageDifference;
            let percentageLowDifference;
            if (tickerHighData) {
              // Extract high values for different dates
              const highValues = tickerHighData.map(data => data.high);
              maxHighValue = Math.max(...highValues);
              const indexOfMaxHighValueFromEnd = highValues.indexOf(maxHighValue);

              // Calculate the index from the end of the original array
              indexOfMaxHighValue = highValues.length - indexOfMaxHighValueFromEnd;
              const volValues = tickerHighData.map(data => data.volume);
              const yesterdayData = tickerHighData.find(
                data => data.date === formatDate(yesterday),
              );

              closePriceValue = yesterdayData ? yesterdayData.close : null;
              const yesterdayPerValues = tickerHighData.map(
                data => data.percentage_change,
              );
              yesterdayHigh =
                tickerHighData && tickerHighData.length > 0
                  ? tickerHighData.find(
                      data => data.date === formatDate(yesterday),
                    )
                    ? tickerHighData.find(
                        data => data.date === formatDate(yesterday),
                      ).high
                    : '-'
                  : '-';
              yesterdayLow =
                tickerHighData && tickerHighData.length > 0
                  ? tickerHighData.find(
                      data => data.date === formatDate(yesterday),
                    )
                    ? tickerHighData.find(
                        data => data.date === formatDate(yesterday),
                      ).low
                    : '-'
                  : '-';
              chngPerOne =
                tickerHighData && tickerHighData.length > 0
                  ? tickerHighData.find(
                      data => data.date === formatDate(yesterday),
                    )
                    ? tickerHighData
                        .find(data => data.date === formatDate(yesterday))
                        .percentage_change.toFixed(2)
                    : '-'
                  : '-';
              chngPerTwo =
                tickerHighData && tickerHighData.length > 0
                  ? tickerHighData.find(
                      data => data.date === formatDate(dayBeforeYesterday),
                    )
                    ? tickerHighData
                        .find(
                          data => data.date === formatDate(dayBeforeYesterday),
                        )
                        .percentage_change.toFixed(2)
                    : '-'
                  : '-';
              chngPerThree =
                tickerHighData && tickerHighData.length > 0
                  ? tickerHighData.find(
                      data => data.date === formatDate(twoDaysEarlier),
                    )
                    ? tickerHighData
                        .find(data => data.date === formatDate(twoDaysEarlier))
                        .percentage_change.toFixed(2)
                    : '-'
                  : '-';
              chngPerFour =
                tickerHighData && tickerHighData.length > 0
                  ? tickerHighData.find(
                      data => data.date === formatDate(threeDaysEarlier),
                    )
                    ? tickerHighData
                        .find(data => data.date === formatDate(threeDaysEarlier))
                        .percentage_change.toFixed(2)
                    : '-'
                  : '-';
              chngPerFive =
                tickerHighData && tickerHighData.length > 0
                  ? tickerHighData.find(
                      data => data.date === formatDate(fourDaysEarlier),
                    )
                    ? tickerHighData
                        .find(data => data.date === formatDate(fourDaysEarlier))
                        .percentage_change.toFixed(2)
                    : '-'
                  : '-';

              const lowValues = tickerHighData.map(data => data.low);
              minLowValue = Math.min(...lowValues);
              const indexOfMinLowValueFromEnd = lowValues.indexOf(minLowValue);

              // Calculate the index from the end of the original array
              indexOfMinLowValue = lowValues.length - indexOfMinLowValueFromEnd;

              const lowValuesarray = tickerHighData.map(data => {
                const roundedLow = data.low.toFixed(8);
                const parts = roundedLow.split('.');
                const decimals = parts[1] || '';
                return parseFloat(`${parts[0]}.${decimals.padEnd(8, '0')}`);
              });

              for (let i = 0; i < 30; i++) {
                high[i] = highValues[i]?.toFixed(8);
                low[i] = lowValues[i]?.toFixed(8);
                volume[i] = volValues[i]?.toFixed(8);
                yesterdayPer[i] = yesterdayPerValues[i]?.toFixed(8);
              }
              lowLast = lowValuesarray[6]; // Convert to number
              lowLastSecond = lowValuesarray[5];
              if (high[29] > high[28]) {
                for (let i = 29; i >= 0; i--) {
                  if (highValues[i] > highValues[i - 1]) {
                    highCount++;
                  } else {
                    break;
                  }
                }
              }
              if (low[29] < low[28]) {
                for (let i = 29; i >= 0; i--) {
                  if (lowValues[i] < lowValues[i - 1]) {
                    lowCount++;
                  } else {
                    break;
                  }
                }
              }
              if (lowCount > 1 || highCount > 1) {
                finalConsistency = Math.max(lowCount, highCount);
                if (finalConsistency === highCount) {
                  consistency = 'high';
                } else {
                  consistency = 'low';
                }
              } else {
                finalConsistency = 'Neutral';
              }
              // Add more console.log statements for additional dates if needed
            } else {
              console.log(`${item} not found in lowHighvaluesData`);
            }

            const predictionAnalysis = futurePriceData.find(
              entry => entry.ticker === item,
            )?.tomorrow_prediction_analysis;
            let newLastPrice = 0;
            let formatedYesNo;
            if (max_percentage_change === resistance_percentage_change) {
              if (newLastPrice > tomorrow_prediction) {
                formatedYesNo = 'Yes';
              } else {
                formatedYesNo = 'No';
              }
            } else if (max_percentage_change === support_percentage_change) {
              if (newLastPrice < day_after_tomorrow_prediction) {
                formatedYesNo = 'Yes';
              } else {
                formatedYesNo = 'No';
              }
            } else {
            }

            let formattedPredictionAnalysis;

            if (
              predictionAnalysis !== null &&
              !isNaN(parseFloat(predictionAnalysis))
            ) {
              formattedPredictionAnalysis =
                parseFloat(predictionAnalysis).toFixed(2);
            } else if (typeof predictionAnalysis === 'string') {
              formattedPredictionAnalysis = predictionAnalysis;
            } else {
              formattedPredictionAnalysis = '-';
            }
            AllData.push({
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
              predictionAnalysis,
              formatedYesNo,
              isTickerInList,
              volPercentage,
              high,
              low,
              closePriceValue,
              todayHigh,
              todayLow,
              currentPer,
              maxHighValue,
              minLowValue,
              yesterdayHigh,
              yesterdayLow,
              chngPerOne,
              chngPerTwo,
              chngPerThree,
              chngPerFour,
              chngPerFive,
              yesterdayPer,
              volume,
              highCount,
              lowCount,
              finalConsistency,
              consistency,
              avgVolume,
              currentVolume,
              indexOfMaxHighValue,
              indexOfMinLowValue,
            });
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
              predictionAnalysis,
              formatedYesNo,
              isTickerInList,
              volPercentage,
              high,
              low,
              closePriceValue,
              todayHigh,
              todayLow,
              currentPer,
              maxHighValue,
              minLowValue,
              yesterdayHigh,
              yesterdayLow,
              chngPerOne,
              chngPerTwo,
              chngPerThree,
              chngPerFour,
              chngPerFive,
              yesterdayPer,
              volume,
              highCount,
              lowCount,
              finalConsistency,
              consistency,
              avgVolume,
              currentVolume,
              indexOfMaxHighValue,
              indexOfMinLowValue,
            };
          }
        });
        // console.log('Get Remove Value::::', allTicker);
        const btcusdtItem = AllData.find(item => item.ticker === 'BTCUSDT');
        // Filter out BTCUSDT item from the rest of the data
        const otherItems = AllData.filter(item => item.ticker !== 'BTCUSDT');
        // Sort the other items as needed (e.g., by updated_at)
        const sortedDates = otherItems.sort(customSort);
        setAllCoinData(btcusdtItem ? [btcusdtItem, ...sortedDates] : sortedDates);
        setDataActive(btcusdtItem ? [btcusdtItem, ...sortedDates] : sortedDates);
        // setAllCoinData(allTicker);
        setSkeletonVisible(false);
        // setDataActive(allTicker);
      }
    } catch (err) {
      console.log('Error::', err);
    }
  };

  function countDigitsAfterDecimal(number) {
    const match = /\.(\d+)$/.exec(String(number));
    return match ? match[1].length : 0;
  }

  // const fetchData = () => {
  //   // socketRef.current = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');
  //   const socketUrl = Config.NEXT_PUBLIC_SERVER_URL_SOCKET;
  //   const socketPath = '/ws/live-ohlcv-consumer/';
  //   socketRef.current = new WebSocket(socketUrl + socketPath);
  //   // if (dataActive.length > 0) {
  //   socketRef.current.onmessage = event => {
  //     const binanceWebSocketData = JSON.parse(event.data);
  //     console.log('Socket>>>');
  //     // socketRef.current.close();
  //     // Update the tableData state based on WebSocket data
  //     setAllCoinData(prevData => {
  //       return prevData.map(item => {
  //         // const binanceSymbolData = binanceWebSocketData.find(
  //         //   data => data.s === `${item.ticker}`,
  //         // );
  //         const binanceSymbolData = binanceWebSocketData[item.ticker];
  //         // const binanceSymbolData = binanceWebSocketData[item.symbol];
  //         let newPercentageDifference;
  //         let newPercentageLowDifference;
  //         const latestLastprice = binanceSymbolData
  //           ? parseFloat(binanceSymbolData.c)
  //           : null;
  //         const newPricePercent = binanceSymbolData
  //           ? parseFloat(binanceSymbolData.P)
  //           : null;
  //         const newTodayHigh = binanceSymbolData
  //           ? parseFloat(binanceSymbolData.h)
  //           : null;
  //         const newTodayLow = binanceSymbolData
  //           ? parseFloat(binanceSymbolData.l)
  //           : null;
  //         const newCurrentPer = binanceSymbolData
  //           ? parseFloat(binanceSymbolData.cp).toFixed(2)
  //           : null;
  //         const maxHighValue = item.maxHighValue;
  //         const maxLowValue = item.minLowValue;
  //         const percentageDiff =
  //           ((latestLastprice - maxHighValue) / latestLastprice) * 100;
  //         newPercentageDifference = percentageDiff.toFixed(2);

  //         const percentageLowDiff =
  //           ((latestLastprice - maxLowValue) / latestLastprice) * 100;
  //         newPercentageLowDifference = percentageLowDiff.toFixed(2);
  //         const digitsAfterDecimal = countDigitsAfterDecimal(latestLastprice);
  //         const ai_target =
  //           item.ai_target === '-'
  //             ? '-'
  //             : parseFloat(item.ai_target).toFixed(digitsAfterDecimal);
  //         let formatedYesNo;
  //         if (item.percentage_change == item.r_change) {
  //           if (latestLastprice > item.ai_resistance) {
  //             formatedYesNo = 'Yes';
  //           } else {
  //             formatedYesNo = 'No';
  //           }
  //         } else if (item.percentage_change == item.s_change) {
  //           if (latestLastprice < item.ai_support) {
  //             formatedYesNo = 'Yes';
  //           } else {
  //             formatedYesNo = 'No';
  //           }
  //         } else {
  //         }
  //         let newLpAiDiff;
  //         const netLpAiDiff =
  //           ((latestLastprice - item.ai_target) / latestLastprice) * 100;
  //         newLpAiDiff = netLpAiDiff.toFixed(2);
  //         if (binanceSymbolData) {
  //           return {
  //             ...item,
  //             markPrice: latestLastprice,
  //             currentPer: newCurrentPer,
  //             ai_target,
  //             newLpAiDiff,
  //             todayHigh: newTodayHigh,
  //             todayLow: newTodayLow,
  //             pricePercent: newPricePercent,
  //             percentageDifference: newPercentageDifference,
  //             percentageLowDifference: newPercentageLowDifference,
  //           };
  //         }
  //         return item;
  //       });
  //     });
  //     socketRef.current.close();
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
          return prevData
            .map(item => {
              // const binanceSymbolData = binanceWebSocketData.find(
              //   data => data.s === `${item.ticker}`,
              // );
              const binanceSymbolData = binanceWebSocketData[item.ticker];
              // const binanceSymbolData = binanceWebSocketData[item.symbol];
              let newPercentageDifference;
              let newPercentageLowDifference;
              const latestLastprice = binanceSymbolData
                ? parseFloat(binanceSymbolData.c)
                : null;

              if (latestLastprice === null) {
                // If latestLastprice is null, we skip this item by returning null
                return null;
              }

              const newPricePercent = binanceSymbolData
                ? parseFloat(binanceSymbolData.P)
                : null;
              const newTodayHigh = binanceSymbolData
                ? parseFloat(binanceSymbolData.h)
                : null;
              const newTodayLow = binanceSymbolData
                ? parseFloat(binanceSymbolData.l)
                : null;
              const newCurrentPer = binanceSymbolData
                ? parseFloat(binanceSymbolData.cp).toFixed(2)
                : null;
              const maxHighValue = item.maxHighValue;
              const maxLowValue = item.minLowValue;
              const percentageDiff =
                ((latestLastprice - maxHighValue) / latestLastprice) * 100;
              newPercentageDifference = percentageDiff.toFixed(2);

              const percentageLowDiff =
                ((latestLastprice - maxLowValue) / latestLastprice) * 100;
              newPercentageLowDifference = percentageLowDiff.toFixed(2);
              const digitsAfterDecimal = countDigitsAfterDecimal(latestLastprice);
              const ai_target_data = futurePriceData.find(
                data => data.ticker === `${item.ticker}`,
              )?.ai_target;
              const ai_target = ai_target_data
                ? parseFloat(ai_target_data).toFixed(digitsAfterDecimal)
                : '-';

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
              let newLpAiDiff;
              const netLpAiDiff =
                ((latestLastprice - ai_target) / latestLastprice) * 100;
              newLpAiDiff = netLpAiDiff.toFixed(2);
              if (binanceSymbolData) {
                return {
                  ...item,
                  markPrice: latestLastprice,
                  currentPer: newCurrentPer,
                  ai_target,
                  newLpAiDiff,
                  todayHigh: newTodayHigh,
                  todayLow: newTodayLow,
                  pricePercent: newPricePercent,
                  percentageDifference: newPercentageDifference,
                  percentageLowDifference: newPercentageLowDifference,
                };
              }
              return item;
            })
            .filter(item => item !== null); // Filter out null items
        });
        socket.close();
      };
    };
    if (allCoinData.length > 0 && isFocused) {
      intervalRef.current = setInterval(fetchData, 7000);
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

  // useEffect(() => {
  //   if (!isFocused) {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //     if (socketRef.current) {
  //       socketRef.current.onclose = () => {
  //         console.log('WebSocket closed 2');
  //         if (intervalRef.current) {
  //           clearInterval(intervalRef.current);
  //           intervalRef.current = null;
  //         }
  //       };
  //     }
  //   }

  //   if (socketRef.current) {
  //     socketRef.current.onclose = () => {
  //       console.log('WebSocket closed 6');
  //       if (intervalRef.current) {
  //         clearInterval(intervalRef.current);
  //         intervalRef.current = null;
  //       }
  //     };
  //   }

  //   console.log('get list data', isFocused, appState);
  //   if (allCoinData.length > 0 && isFocused && appState == 'active') {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //     if (socketRef.current) {
  //       socketRef.current.onclose = () => {
  //         console.log('WebSocket closed 7');
  //       };
  //     }
  //     intervalRef.current = setInterval(fetchData, 8000);
  //   } else {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //     if (socketRef.current) {
  //       console.log('Coming Else::::', intervalRef.current, socketRef.current);
  //       socketRef.current.onclose = () => {
  //         console.log('WebSocket closed 6');
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
  //         console.log('WebSocket closed 4');
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
  // }, [isFocused, allCoinData, appState]);

  const onTickerFavorite = async (ticker, index1) => {
    try {
      let raw = JSON.stringify({
        tickers_list: ticker,
      });
      const response = await onPostFavoriteAdminApi(raw);
      if (response.data) {
        console.log('get Response Value::', response.data);
        let valueStore = allCoinData;
        response.data.tickers_list.map(item => {
          valueStore.map((item1, index) => {
            if (item1.ticker == item) {
              valueStore[index1].isTickerInList = true;
            }
          });
        });
        setAllCoinData(valueStore);
        setRefresh(!refresh);
        setDataActive(valueStore);
      } else {
        console.log('Error response::', response.data);
      }
    } catch (err) {
      console.log('Error::', err);
    }
  };

  const onDeleteFavoriteData = async (ticker, index1) => {
    try {
      let raw = JSON.stringify({
        ticker: ticker,
      });
      const response = await onDeleteFavoriteAdminApi(raw);
      if (response) {
        let valueStore = allCoinData;
        // valueStore.map((item, index) => {
        //   if (item.favoriteStatus != undefined) {
        //     valueStore[index].favoriteStatus = false;
        //   } else {
        //     valueStore[index].favoriteStatus = false;
        //   }
        // });
        // if (response.tickers_list.length > 0) {
        //   valueStore.map((item1, index) => {
        //     response.tickers_list.map(item => {
        //       if (item1.symbol === item) {
        valueStore[index1].isTickerInList = false;
        //     }
        //   });
        // });
        // }

        setAllCoinData(valueStore);
        setRefresh(!refresh);
        setDataActive(valueStore);
      } else {
        console.log('Err::', response);
      }
    } catch (err) {
      console.log('Error::', err);
    }
  };

  const onHandlePostBuyData = async from => {
    try {
      if (from == 'buy') {
        let raw = JSON.stringify({
          strategy_info: buyStrategyValue,
          buy_amount: buyAmount,
          buy_leverage: buyLeverage,
          buy_yesterday_percentage: buyYesterdayPer,
          buy_today_percentage: buyCurrentPer,
          buy_tp: buyTP,
          buy_sl: buySL,
          buy_trp: buyTRP,
          buy_trading_days: buyTrendingDay == 'Enable' ? true : false,
          buy_closing_price: buyClosingPrice == 'Enable' ? true : false,
          buy_ai_target: buyAITarget == 'Enable' ? true : false,
          buy_yestarday_high: buyYesterdayHigh == 'Enable' ? true : false,
          buy_yestarday_low: buyYesterdayLow,
          buy_today_low: buyTodayLow,
          buy_today_high: buyTodayHigh == 'Enable' ? true : false,
          buy_volume: buyVolumePer,
          buy_ap_vs_ai: buyLPAI == 'Enable' ? true : false,
          buy_reverse_trading: buyReverse == 'Enable' ? true : false,
          stretegy_on_off_button: buyONOFF,
          buy_trend_directiion: buyTrendDirection,
          buy_trade_limitation: buyRepeat,
        });
        const buyResponse = await onPostCryptoDefaultApi(raw);
        if (buyResponse.data) {
          console.log('Buy buyResponse::', buyResponse.data);
        }
      } else {
        let raw = JSON.stringify({
          strategy_info: sellStrategyValue,
          sell_amount: sellAmount,
          sell_leverage: sellLeverage,
          sell_yesterday_percentage: sellYesterdayPer,
          sell_today_percentage: sellCurrentPer,
          sell_tp: sellTP,
          sell_sl: sellSL,
          sell_trp: sellTRP,
          sell_trading_days: sellTrendingDay == 'Enable' ? true : false,
          sell_closing_price: sellClosingPrice == 'Enable' ? true : false,
          sell_ai_target: sellAITarget == 'Enable' ? true : false,
          sell_yestarday_high: sellYesterdayHigh == 'Enable' ? true : false,
          sell_yestarday_low: sellYesterdayLow,
          sell_today_low: sellTodayLow,
          sell_today_high: sellTodayHigh == 'Enable' ? true : false,
          sell_volume: sellVolumePer,
          sell_ap_vs_ai: sellLPAI == 'Enable' ? true : false,
          sell_reverse_trading: sellReverse == 'Enable' ? true : false,
          sell_stretegy_on_off_button: sellONOFF,
          sell_trend_directiion: sellTrendDirection,
          sell_trade_limitation: sellRepeat,
        });
        const buyResponse = await onPostCryptoDefaultApi(raw);
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
          setBuyTrendingDay(item.buy_trading_days ? 'Enable' : 'Disable');
          setBuyClosingPrice(item.buy_closing_price ? 'Enable' : 'Disable');
          setBuyYesterdayPer(`${item.buy_yesterday_percentage}`);
          setBuyAITarget(item.buy_ai_target ? 'Enable' : 'Disable');
          if (item.buy_trend_directiion) {
            setBuyTrendDirection(item.buy_trend_directiion);
          }
          setBuyCurrentPer(`${item.buy_today_percentage}`);
          setBuyYesterdayHigh(item.buy_yestarday_high ? 'Enable' : 'Disable');
          setBuyYesterdayLow(item.buy_yestarday_low ? 'Enable' : 'Disable');
          setBuyTodayHigh(item.buy_today_high ? 'Enable' : 'Disable');
          setBuyTodayLow(item.buy_today_low ? 'Enable' : 'Disable');
          setBuyVolumePer(`${item.buy_volume}`);
          setBuyLPAI(item.buy_ap_vs_ai ? 'Enable' : 'Disable');
          setBuyLPAIPer(`${item.buy_ap_vs_ai_percentage}`);
          setBuyAutoReverse(
            item.buy_auto_percentage_trading ? 'Enable' : 'Disable',
          );
          setBuyReverse(item.buy_reverse_trading ? 'Enable' : 'Disable');
          setBuyRepeat(`${item.buy_trade_limitation}`);
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
          setSellTrendingDay(item.sell_trading_days ? 'Enable' : 'Disable');
          setSellClosingPrice(item.sell_closing_price ? 'Enable' : 'Disable');
          setSellYesterdayPer(`${item.sell_yesterday_percentage}`);
          setSellAITarget(item.sell_ai_target ? 'Enable' : 'Disable');
          setSellCurrentPer(`${item.sell_today_percentage}`);
          if (item.sell_trend_directiion) {
            setSellTrendDirection(item.sell_trend_directiion);
          }
          setSellYesterdayLow(item.sell_yestarday_low ? 'Enable' : 'Disable');
          setSellTodayLow(item.sell_today_low ? 'Enable' : 'Disable');
          setSellYesterdayHigh(item.sell_yestarday_high ? 'Enable' : 'Disable');
          setSellTodayHigh(item.sell_today_high ? 'Enable' : 'Disable');
          setSellVolumePer(`${item.sell_volume}`);
          setSellLPAI(item.sell_ap_vs_ai ? 'Enable' : 'Disable');
          setSellLPAIPer(`${item.sell_ap_vs_ai_percentage}`);
          setSellAutoReverse(
            item.sell_auto_percentage_trading ? 'Enable' : 'Disable',
          );
          setSellReverse(item.sell_reverse_trading ? 'Enable' : 'Disable');
          setSellRepeat(`${item.sell_trade_limitation}`);
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

  const handleSearch = text => {
    setSearch1(text);
    if (text !== '') {
      const filtered = dataActive.filter(item =>
        item?.ticker?.toLowerCase().includes(text.toLowerCase()),
      );
      setAllCoinData(filtered);
      setRefresh(!refresh);
    } else {
      setAllCoinData(dataActive);
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
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Header
            title={'Auto Bot Config'}
            userRole={userRole}
            onPress={() => navigation.openDrawer()}
            navigation={navigation}
            notify={true}
          />
        </View>
        <View style={styles.mainView}>
          <KeyboardAwareScrollView
            ref={scrollRef}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(15)}}>
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
                          <Text style={[styles.dropdownItemTxtStyle, {marginLeft: 0}]}>
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
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View style={{marginHorizontal: wp(3)}}>
                  <Text style={styles.selectCoinText1}>{'Trending Days'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setBuyTrendingDay(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={buyTrendingDay}
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
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View>
                  <Text style={styles.selectCoinText1}>{'Closing Price'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setBuyClosingPrice(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={1}
                    defaultValue={buyClosingPrice}
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
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
              </View>

              <View style={[styles.rowView, {marginTop: hp(2)}]}>
                <View>
                  <Text
                    style={[
                      styles.selectCoinText1,
                      {fontSize: hp(1.7)},
                    ]}>{`Yesterday's %`}</Text>
                  <TextInput
                    value={buyYesterdayPer}
                    onChangeText={text => setBuyYesterdayPer(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <View style={{marginHorizontal: wp(3)}}>
                  <Text style={styles.selectCoinText}>{'AI Target'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setBuyAITarget(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={buyAITarget}
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
                    buttonStyle={[styles.dropdown2BtnStyle1, {width: wp(20)}]}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View>
                  <Text style={styles.selectCoinText}>{'Trend Direction'}</Text>
                  <SelectDropdown
                    data={options}
                    onSelect={(selectedItem, index) => {
                      setBuyTrendDirection(selectedItem.name);
                      setBuyTrendDirectionLabel(selectedItem.label);
                      console.log('gert Value:::', selectedItem);
                    }}
                    buttonTextAfterSelection={(item, index) => {
                      return (
                        <View style={styles.dropdownView}>
                          <Text style={[styles.dropdownItemTxtStyle, {marginLeft: 0}]}>
                            {item.label}
                          </Text>
                        </View>
                      );
                    }}
                    defaultValueByIndex={0}
                    defaultValue={buyTrendDirectionLabel}
                    defaultButtonText={'Select Coin'}
                    renderCustomizedRowChild={(item, index, isSelected) => {
                      return (
                        <View style={styles.dropdownView}>
                          <Text style={styles.dropdownItemTxtStyle}>
                            {item.label}
                          </Text>
                        </View>
                      );
                    }}
                    rowStyle={styles.dropdownView}
                    buttonStyle={styles.dropdown2BtnStyle2}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
              </View>

              <View style={[styles.rowView, {marginTop: hp(2)}]}>
                <View>
                  <Text style={[styles.selectCoinText]}>{'Current%'}</Text>
                  <TextInput
                    value={buyCurrentPer}
                    onChangeText={text => setBuyCurrentPer(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <View style={{marginHorizontal: wp(4)}}>
                  <Text
                    style={[styles.selectCoinText1, {fontSize: hp(1.7)}]}>{`Yesterday's High`}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setBuyYesterdayHigh(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={buyYesterdayHigh}
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
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View>
                  <Text style={[styles.selectCoinText1]}>{`Today's High`}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setBuyTodayHigh(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={buyTodayHigh}
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
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
              </View>

              <View style={[styles.rowView, {marginTop: hp(2)}]}>
                <View>
                  <Text style={[styles.selectCoinText]}>{'Volume %'}</Text>
                  <TextInput
                    value={buyVolumePer}
                    onChangeText={text => setBuyVolumePer(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <View style={{marginHorizontal: wp(4)}}>
                  <Text style={[styles.selectCoinText]}>{'LP v/s AI'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setBuyLPAI(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={buyLPAI}
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
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View>
                  <Text style={[styles.selectCoinText]}>{`LP V/s Al's %`}</Text>
                  <TextInput
                    value={buyLPAIPer}
                    onChangeText={text => setBuyLPAIPer(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
              </View>

              <View style={[styles.rowView, {marginTop: hp(2)}]}>
                <View>
                  <Text style={[styles.selectCoinText]}>{'Auto Reverse'}</Text>
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
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View style={{marginHorizontal: wp(4)}}>
                  <Text style={[styles.selectCoinText]}>{'Reversed'}</Text>
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
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View>
                  <Text style={[styles.selectCoinText]}>{'Repeat'}</Text>
                  <TextInput
                    value={buyRepeat}
                    onChangeText={text => setBuyRepeat(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
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
                    defaultValueByIndex={0}
                    defaultValue={sellStrategy}
                    defaultButtonText={'Select Coin'}
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
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View style={{marginHorizontal: wp(3)}}>
                  <Text style={styles.selectCoinText1}>{'Trending Days'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setSellTrendingDay(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={sellTrendingDay}
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
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View>
                  <Text style={styles.selectCoinText1}>{'Closing Price'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setSellClosingPrice(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={1}
                    defaultValue={sellClosingPrice}
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
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
              </View>

              <View style={[styles.rowView, {marginTop: hp(2)}]}>
                <View>
                  <Text
                    style={[
                      styles.selectCoinText1,
                      {fontSize: hp(1.7)},
                    ]}>{`Yesterday's %`}</Text>
                  <TextInput
                    value={sellYesterdayPer}
                    onChangeText={text => setSellYesterdayPer(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <View style={{marginHorizontal: wp(3)}}>
                  <Text style={styles.selectCoinText}>{'AI Target'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setSellAITarget(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={sellAITarget}
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
                    buttonStyle={[styles.dropdown2BtnStyle1, {width: wp(20)}]}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View>
                  <Text style={styles.selectCoinText1}>
                    {'Trend Direction'}
                  </Text>
                  <SelectDropdown
                    data={options}
                    onSelect={(selectedItem, index) => {
                      setSellTrendDirection(selectedItem.value);
                      setSellTrendDirectionLabel(selectedItem.label);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={sellTrendDirectionLabel}
                    defaultButtonText={'Select Coin'}
                    buttonTextAfterSelection={(item, index) => {
                      return (
                        <View style={styles.dropdownView}>
                          <Text
                            style={[
                              styles.dropdownItemTxtStyle,
                              {marginLeft: 0},
                            ]}>
                            {item.label}
                          </Text>
                        </View>
                      );
                    }}
                    renderCustomizedRowChild={(item, index, isSelected) => {
                      return (
                        <View style={styles.dropdownView}>
                          <Text style={styles.dropdownItemTxtStyle}>
                            {item.label}
                          </Text>
                        </View>
                      );
                    }}
                    rowStyle={styles.dropdownView}
                    buttonStyle={styles.dropdown2BtnStyle2}
                    buttonTextStyle={styles.dropdown2BtnTxtStyle}
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
              </View>

              <View style={[styles.rowView, {marginTop: hp(2)}]}>
                <View>
                  <Text style={[styles.selectCoinText]}>{'Current%'}</Text>
                  <TextInput
                    value={sellCurrentPer}
                    onChangeText={text => setSellCurrentPer(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <View style={{marginHorizontal: wp(4)}}>
                  <Text
                    style={[
                      styles.selectCoinText1,
                      {fontSize: hp(1.7)},
                    ]}>{`Yesterday's High`}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setSellYesterdayHigh(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={sellYesterdayHigh}
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
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View>
                  <Text style={[styles.selectCoinText1]}>{`Today's High`}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setSellTodayHigh(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={sellTodayHigh}
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
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
              </View>

              <View style={[styles.rowView, {marginTop: hp(2)}]}>
                <View>
                  <Text style={[styles.selectCoinText]}>{'Volume %'}</Text>
                  <TextInput
                    value={sellVolumePer}
                    onChangeText={text => setSellVolumePer(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <View style={{marginHorizontal: wp(4)}}>
                  <Text style={[styles.selectCoinText]}>{'LP v/s AI'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setSellLPAI(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={sellLPAI}
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
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View>
                  <Text style={[styles.selectCoinText]}>{`LP V/s Al's %`}</Text>
                  <TextInput
                    value={sellLPAIPer}
                    onChangeText={text => setSellLPAIPer(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
              </View>

              <View style={[styles.rowView, {marginTop: hp(2)}]}>
                <View>
                  <Text style={[styles.selectCoinText]}>{'Auto Reverse'}</Text>
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
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View style={{marginHorizontal: wp(4)}}>
                  <Text style={[styles.selectCoinText]}>{'Reversed'}</Text>
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
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>
                <View>
                  <Text style={[styles.selectCoinText]}>{'Repeat'}</Text>
                  <TextInput
                    value={sellRepeat}
                    onChangeText={text => setSellRepeat(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
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
                      REVERSED
                    </Text>
                    <Text style={[styles.headingText, {width: wp(20)}]}>
                      REPEAT
                    </Text>
                    <Text style={[styles.headingText, {width: wp(24)}]}>
                      {'CLOSING\nPRICE'}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(26)}]}>
                      {'YESTERDAY\n%'}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(24)}]}>
                      {'CURRENT\n%'}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(24)}]}>
                      {'LP v/s AI'}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(28)}]}>
                      {`YESTERDAY'S\nHIGH`}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(28)}]}>
                      {`YESTERDAY'S\nLOW`}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(24)}]}>
                      {`TODAY'S\nHIGH`}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(24)}]}>
                      {`TODAY'S\nLOW`}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(24)}]}>
                      {`VOLUME\n%`}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(24)}]}>
                      {`TRENDING\nDAYS`}
                    </Text>
                    <Text style={[styles.headingText, {width: wp(24)}]}>
                      {`AI\nTARGET`}
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
                              ? item.buy_reverse_trading
                                ? 'Enable'
                                : 'Disable'
                              : item.sell_reverse_trading
                              ? 'Enable'
                              : 'Disable'}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(20)}]}>
                            {buyStrategyModal
                              ? item.buy_trade_limitation
                              : item.sell_trade_limitation}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(24)}]}>
                            {buyStrategyModal
                              ? item.buy_closing_price
                                ? 'Enable'
                                : 'Disable'
                              : item.sell_closing_price
                              ? 'Enable'
                              : 'Disable'}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(26)}]}>
                            {buyStrategyModal
                              ? item.buy_yesterday_percentage
                              : item.sell_yesterday_percentage}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(24)}]}>
                            {buyStrategyModal
                              ? item.buy_today_percentage
                              : item.sell_today_percentage}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(24)}]}>
                            {buyStrategyModal
                              ? item.buy_ap_vs_ai
                                ? 'Enable'
                                : 'Disable'
                              : item.sell_ap_vs_ai
                              ? 'Enable'
                              : 'Disable'}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(28)}]}>
                            {buyStrategyModal
                              ? item.buy_yestarday_high
                                ? 'Enable'
                                : 'Disable'
                              : item.sell_yestarday_high
                              ? 'Enable'
                              : 'Disable'}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(28)}]}>
                            {buyStrategyModal
                              ? item.buy_yestarday_low
                                ? 'Enable'
                                : 'Disable'
                              : item.sell_yestarday_low
                              ? 'Enable'
                              : 'Disable'}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(24)}]}>
                            {buyStrategyModal
                              ? item.buy_today_high
                                ? 'Enable'
                                : 'Disable'
                              : item.sell_today_high
                              ? 'Enable'
                              : 'Disable'}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(24)}]}>
                            {buyStrategyModal
                              ? item.buy_today_low
                                ? 'Enable'
                                : 'Disable'
                              : item.sell_today_low
                              ? 'Enable'
                              : 'Disable'}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(24)}]}>
                            {buyStrategyModal
                              ? item.buy_volume
                              : item.sell_volume}
                          </Text>
                          <Text style={[styles.contentText, {width: wp(24)}]}>
                            {buyStrategyModal
                              ? item.buy_trading_days
                                ? 'Enable'
                                : 'Disable'
                              : item.sell_trading_days
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
            <TextInput
              value={search1}
              onChangeText={text => handleSearch(text)}
              placeholder={t('search_your_coin')}
              placeholderTextColor={COLORS.greyColor}
              style={styles.searchText1}
              autoCapitalize="none"
            />

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
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Trending\nDays'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Coins'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Last Price'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Current %'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Closing Price'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'AI Target'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>
                    {`${moment().subtract(1, 'days').format('MM-DD')} %`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>
                    {`${moment().subtract(2, 'days').format('MM-DD')} %`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Direction'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'LP v/s AI %'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView1]}>
                  <Text style={styles.titleText4}>{`Today's\nPositive %`}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView1]}>
                  <Text style={styles.titleText4}>{`Today's\nNegative %`}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Volume %'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{`Today's High`}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{`Today's Low`}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView1]}>
                  <Text style={styles.titleText4}>{'Yesterday\nHigh'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView1]}>
                  <Text style={styles.titleText4}>{'Yesterday\nLow'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Max High'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Min Low'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>
                    {`${moment().subtract(3, 'days').format('MM-DD')} %`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>
                    {`${moment().subtract(4, 'days').format('MM-DD')} %`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>
                    {`${moment().subtract(5, 'days').format('MM-DD')} %`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Max Days'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView]}>
                  <Text style={styles.titleText4}>{'Min Days'}</Text>
                </TouchableOpacity>
              </View>
              {skeletonVisible ? (
                <AutoBotSkeleton />
              ) : (
                <FlatList
                  data={allCoinData}
                  extraData={allCoinData}
                  nestedScrollEnabled
                  horizontal
                  showsHorizontalScrollIndicator={false}
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
                          onPress={() => {
                            item.isTickerInList
                              ? onDeleteFavoriteData(item.ticker, index)
                              : onTickerFavorite(item.ticker, index);
                          }}>
                          <Image
                            style={[
                              styles.starIcon,
                              {
                                tintColor: item.isTickerInList
                                  ? COLORS.goldenColor
                                  : COLORS.black,
                              },
                            ]}
                            source={item.isTickerInList ? star1 : star}
                          />
                        </TouchableOpacity>
                        <View style={styles.optionTitleView}>
                          <Text style={[styles.dataHistoryText]}>
                            {item.finalConsistency}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          <Text style={[styles.dataHistoryText]}>
                            {item.ticker}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          <Text style={[styles.dataHistoryText]}>
                            {item.markPrice}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          <Text style={[styles.dataHistoryText]}>
                            {item.currentPer}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.closePriceValue}
                          </Text>
                        </View>
                        <View style={[styles.optionTitleView]}>
                          <Text
                            style={[
                              styles.dataHistoryText,
                              {
                                color:
                                  item?.ai_target > item?.ai_resistance
                                    ? COLORS.greenColor
                                    : item?.ai_target < item?.ai_support
                                    ? COLORS.errorColor
                                    : COLORS.black,
                              },
                            ]}>
                            {item?.ai_target}
                          </Text>
                        </View>
                        <View style={[styles.optionTitleView]}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.chngPerOne}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.chngPerTwo}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          {/* <Text style={[styles.dataHistoryText]}>
                            {item?.percentage_change}
                          </Text> */}
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
                        <View style={styles.optionTitleView}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.newLpAiDiff}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView1}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.percentageDifference}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView1}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.percentageLowDifference}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.volPercentage}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.todayHigh}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.todayLow}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView1}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.yesterdayHigh}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView1}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.yesterdayLow}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.maxHighValue}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.minLowValue}
                          </Text>
                        </View>
                        <View style={[styles.optionTitleView]}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.chngPerThree}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.chngPerFour}
                          </Text>
                        </View>
                        <View style={[styles.optionTitleView]}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.chngPerFive}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.indexOfMaxHighValue}
                          </Text>
                        </View>
                        <View style={styles.optionTitleView}>
                          <Text style={[styles.dataHistoryText]}>
                            {item?.indexOfMinLowValue}
                          </Text>
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

export default BotConfigScreen;
