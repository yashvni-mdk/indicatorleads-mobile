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
import moment from 'moment-timezone';
import * as RNLocalize from 'react-native-localize';
import {CommonPopup} from '../../../components/CommonPopup';
import {BotManualPopup} from '../../../components/BotManualPopup';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import {CoinSettingPopup} from '../../../components/CoinSettingPopup';
import SkeletonPlaceholderComponent from '../../../components/SkeletonPlaceholderComponent';
import arrowUp from '../../../images/arrowUp.png';
import down from '../../../images/down.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import SelectDropdown from 'react-native-select-dropdown';
import {
  onDeleteTickerConfigDataApi,
  onDeleteTickerDataApi,
  onGetAdminTickerConfigDataApi,
  onGetCryptoTickerDataApi,
  onGetSpotTickers,
  onPostPmsConfigApi,
  onPostTickerConfigDataApi,
} from '../../../services/Api';
import {useSelector} from 'react-redux';

const rangeArray = ['50-10000', '10001-30000', '30001-50000', '50001+'];

const FuturePmsConfig = ({navigation}) => {
  const getAdminPmsLastLead = useSelector(state => state.getAdminPmsLastLead);
  const binanceData = useSelector(state => state.binanceData);
  const tickerData = useSelector(state => state.tickerData);
  const {t} = useTranslation();
  const socketRef = useRef(null);
  const intervalRef = useRef(null);

  const scrollRef = useRef(null);
  const isFocused = useIsFocused();
  const [referal, setReferal] = useState('');
  const [filterLead, setFilterLead] = useState([]);
  const [coinDataList, setCoinDataList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState('');
  const [search1, setSearch1] = useState('');
  const [inviteVisible, setInviteVisible] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
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
  const [dataActiveSort, setDataActiveSort] = useState([]);
  const [coinLength, setCoinLength] = useState(0);
  const [isPressArray, setIsPressArray] = useState([]);
  const [isPressArray1, setIsPressArray1] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [spotBalanceList, setSpotBalanceList] = useState([]);
  const [defaultValueBuy, setDefaultValueBuy] = useState('');
  const [defaultRange, setDefaultRange] = useState('');
  const [defaultSellRange, setDefaultSellRange] = useState('');
  const [defaultValueSell, setDefaultValueSell] = useState('');
  const [buyAmount, setBuyAmount] = useState('500');
  const [buyLeverage, setBuyLeverage] = useState('5');
  const [sellLeverage, setSellLeverage] = useState('5');
  const [sellAmount, setSellAmount] = useState('500');
  const [buyTP, setBuyTP] = useState('10');
  const [sellTP, setSellTP] = useState('10');
  const [buySL, setBuySL] = useState('8');
  const [sellSL, setSellSL] = useState('8');

  useEffect(() => {
    onGetSpotBalanceData();
    const allDataGet = async () => {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
    };
    allDataGet();
  }, []);

  const onGetSpotBalanceData = async () => {
    try {
      setFilterLead(getAdminPmsLastLead?.results);
      setIsPressArray(Array(getAdminPmsLastLead?.results.length).fill(false));
      setIsPressArray1(Array(getAdminPmsLastLead?.results.length).fill(false));
      const response = await onGetSpotTickers();
      let array1 = [];
      setSpotBalanceList(response.data.data);
    } catch (err) {
      console.log('err', err);
    }
  };

  const onHandlePostBuyCoin = async () => {
    try {
      const requestBody = JSON.stringify({
        ticker: defaultValueBuy,
        balance_range: defaultRange,
        leverage: buyLeverage,
        amount: buyAmount,
        take_profit: buyTP,
        stoploss: buySL,
        signal: 'buy',
      });
      const response = await onPostPmsConfigApi(requestBody);
      if (response.data) {
        showMessage({
          message: 'Future PMS coin buy successfully!',
          type: 'success',
          duration: 3000,
        });
      }
    } catch (err) {
      showMessage({
        message: 'Something is wrong.',
        type: 'warning',
        duration: 3000,
        icon: 'warning',
      });
      console.log('Error::', err);
    }
  };

  const onHandlePostSellCoin = async () => {
    try {
      const requestBody = JSON.stringify({
        ticker: defaultValueSell,
        balance_range: defaultSellRange,
        leverage: sellLeverage,
        amount: sellAmount,
        sell_take_profit: sellTP,
        sell_stoploss: sellSL,
        signal: 'sell',
      });
      const response = await onPostPmsConfigApi(requestBody);
      if (response.data) {
        showMessage({
          message: 'Future PMS coin sell successfully!',
          type: 'success',
          duration: 3000,
        });
      }
    } catch (err) {
      showMessage({
        message: 'Something is wrong.',
        type: 'warning',
        duration: 3000,
        icon: 'warning',
      });
      console.log('Error::', err);
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
      console.log('onGetSelectedTicker::', err.response.data);
    }
  };

  const onCoinTickerConfigAdd = async allTicker => {
    try {
      setIsSkeletonVisible(true);
      const response = await onGetAdminTickerConfigDataApi();

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

  useEffect(() => {
    const getValueOfTickerData = async () => {
      try {
        if (binanceData) {
          let allTicker = [];
          tickerData.map(item => {
            binanceData.map(item1 => {
              if (item1.symbol == item) {
                allTicker.push(item1);
              }
            });
          });
          onGetSelectedTicker(allTicker);
        }
      } catch (err) {
        console.log('Error::', err);
      }
    };
    getValueOfTickerData();
  }, []);

  const handleSearch = text => {
    setSearch(text);
    if (text !== '') {
      const filtered = getAdminPmsLastLead.results.filter(item =>
        item?.ticker?.toLowerCase().includes(text.toLowerCase()),
      );
      setFilterLead(filtered);
    } else {
      setFilterLead(getAdminPmsLastLead.results);
    }
  };

  const handleSearch1 = text => {
    setSearch1(text);
    if (text !== '') {
      const filtered = dataActiveSort.filter(item =>
        item?.symbol?.toLowerCase().includes(text.toLowerCase()),
      );
      setCoinDataList(filtered);
      setRefresh(!refresh);
    } else {
      setCoinDataList(dataActiveSort);
      setRefresh(!refresh);
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
            title={'Future PMS Config'}
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
                  <Text style={styles.selectCoinText}>{'Coin Symbol'}</Text>
                  <SelectDropdown
                    data={spotBalanceList}
                    onSelect={(selectedItem, index) => {
                      setDefaultValueBuy(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={defaultValueBuy}
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
                <View style={{marginHorizontal: wp(4)}}>
                  <Text style={styles.selectCoinText}>{'Range'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setDefaultRange(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={defaultRange}
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
                <TouchableOpacity
                  style={[styles.buyButtonView, {marginTop: hp(3.5), marginHorizontal: wp(4)}]}
                  onPress={() => onHandlePostBuyCoin()}>
                  <Text style={styles.buyText}>{'Buy'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.balanceBuyMathView}>
              <View style={styles.rowView}>
                <View>
                  <Text style={styles.selectCoinText}>{'Coin Symbol'}</Text>
                  <SelectDropdown
                    data={spotBalanceList}
                    onSelect={(selectedItem, index) => {
                      setDefaultValueSell(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={defaultValueSell}
                    defaultButtonText={'Select Coin'}
                    renderCustomizedRowChild={(item, index, isSelected) => {
                      return (
                        <View style={styles.dropdownView}>
                          <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
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
                <View style={{marginHorizontal: wp(4)}}>
                  <Text style={styles.selectCoinText}>{'Range'}</Text>
                  <SelectDropdown
                    data={rangeArray}
                    onSelect={(selectedItem, index) => {
                      setDefaultSellRange(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValueByIndex={0}
                    defaultValue={defaultSellRange}
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
                <TouchableOpacity
                  style={[
                    styles.sellButtonView,
                    {marginTop: hp(3.5), marginHorizontal: wp(4)},
                  ]}
                  onPress={() => onHandlePostSellCoin()}>
                  <Text style={styles.buyText}>{'Sell'}</Text>
                </TouchableOpacity>
              </View>
            </View>

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
                        paddingVertical: 10,
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
                      key={item.created_at}
                      activeOpacity={1}
                      style={{width: '94%', alignSelf: 'center'}}
                      onPress={() => console.log('hello')}
                      underlayColor={COLORS.lightWhite}>
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
                            {moment(item?.created_at).tz(RNLocalize.getTimeZone()).format('HH:mm:ss YYYY-MM-DD')}
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
            <TextInput
              value={search1}
              onChangeText={text => handleSearch1(text)}
              placeholder={t('search_your_coin')}
              placeholderTextColor={COLORS.greyColor}
              style={styles.searchText1}
              autoCapitalize="none"
            />
            <View style={styles.activeView1}>
              <ScrollView
                horizontal
                nestedScrollEnabled={true}
                contentContainerStyle={{paddingBottom: hp(1)}}
                showsHorizontalScrollIndicator={false}>
                <View>
                  <View style={styles.titleActiveView1}>
                    <TouchableOpacity
                      onPress={() => firstSorting('coin')}
                      style={[
                        styles.optionTitleView,
                        {
                          width: wp(30),
                          justifyContent: 'flex-start',
                          marginLeft: wp(4),
                        },
                      ]}>
                      <Text style={styles.titleText4}>
                        {`${t('coin')} [${coinDataList.length}/${coinLength}]`}
                      </Text>
                      {coinSort === 0 || coinSort === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {coinSort === 0 || coinSort === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => firstSorting('chg')}
                      style={[styles.optionTitleView, {width: wp(24)}]}>
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
                      style={[styles.optionTitleView, {width: wp(24)}]}>
                      <Text style={styles.titleText4}>{t('price')}</Text>
                      {amountSort === 0 || amountSort === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {amountSort === 0 || amountSort === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.titleText3,
                        {width: wp(25), marginLeft: wp(7)},
                      ]}>
                      {t('bot_status')}
                    </Text>
                  </View>
                  <FlatList
                    data={coinDataList}
                    extraData={coinDataList}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                    initialNumToRender={500}
                    // contentContainerStyle={{paddingBottom: hp(2)}}
                    keyExtractor={item => item.symbol}
                    ListEmptyComponent={() => (
                      <View style={{marginVertical: hp(2)}}>
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
                              <Text
                                style={[
                                  styles.dataText3,
                                  {
                                    width: wp(30),
                                    textAlign: 'left',
                                    marginLeft: wp(4),
                                  },
                                ]}>
                                {item.symbol}
                              </Text>
                              <Text
                                style={[
                                  styles.dataText3,
                                  {
                                    width: wp(24),
                                    color:
                                      item.priceChangePercent > 0
                                        ? COLORS.darkGreen
                                        : COLORS.errorColor,
                                  },
                                ]}>
                                {item.priceChangePercent}
                              </Text>
                              <Text style={[styles.dataText3, {width: wp(24)}]}>
                                {formattedNumber}
                              </Text>
                              <View style={styles.statusView}>
                                <TouchableOpacity
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
        title={`${t('you_want_to_delete')} ${selectedValueDelete} ${t('coin')}?`}
        firstButtonTitle={t('cancel')}
        secondButtonTitle={t('delete')}
        firstButtonClick={() => setDeletePopup(false)}
        secondButtonClick={() => onDeleteTickerPopup()}
      />
    </View>
  );
};

export default FuturePmsConfig;
