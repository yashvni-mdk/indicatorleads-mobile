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
  TouchableHighlight,
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
import arrowUp from '../../../images/arrowUp.png';
import down from '../../../images/down.png';
import IndicatorSkeleton from '../../../components/IndicatorSkeleton';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import debounce from 'lodash/debounce';
import {useIsFocused} from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import {
  onGetAdminIndicatorDataApi,
  onGetSpotTickers,
  onPostAdminSettingApi,
  onPostAdminTickerSettingApi,
} from '../../../services/Api';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import AdminIndicatorSkeleton from '../../../components/AdminIndicatorSkeleton';

const direction = ['Smaller than', 'Greater than'];

const IndicatorScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const flatListRef = useRef(null);
  const socketRef = useRef(null);
  const intervalRef = useRef(null);
  const futurePriceData = useSelector(state => state.getAdminSpotPriceStatus);
  const settingData = useSelector(state => state.getAdminSettingList);
  const isFocused = useIsFocused();
  const [userRole, setUserRole] = useState('');
  const [search1, setSearch1] = useState('');
  const [coinSort, setCoinSort] = useState(0);
  const [CHG, setCHGSort] = useState(0);
  const [amountSort, setAmountSort] = useState(0);
  const [notificationData, setNotificationData] = useState([]);
  const [res1, setRes1] = useState('1');
  const [res2, setRes2] = useState('50');
  const [res3, setRes3] = useState('1');
  const [buyError, setBuyError] = useState(false);
  const [buyMessage, setBuyMessage] = useState('');
  const [activeVisible, setActiveVisible] = useState(false);
  const [davVisible, setDavVisible] = useState(false);
  const [zigVisible, setZigVisible] = useState(false);
  const [hpVisible, setHpVisible] = useState(false);
  const [bothVisible, setBothVisible] = useState(false);
  const [predictionVisible, setPredictionVisible] = useState(false);
  const [skeletonIndicatorVisible, setSkeletonIndicatorVisible] = useState(false);
  const [isPressArray, setIsPressArray] = useState([]);
  const [previousSignals, setPreviousSignals] = useState({});
  const [RsiNotification, setRsiNotification] = useState([]);
  const [spotBalanceList, setSpotBalanceList] = useState([]);
  const [defaultValueBuy, setDefaultValueBuy] = useState('');
  const [directionValue, setDirectionValue] = useState('');
  const [alertData, setAlertData] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [filterData, setFilterData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [allTickerData, setAllTickerData] = useState([]);
  const [scrollOffset, setScrollOffset] = useState(0);
  // const sortedSignal = RsiNotification.length > 0 && [...RsiNotification].sort((a, b) =>
  //   b.signal.localeCompare(a.signal),
  // );
  // const sortedData = sortedSignal.length > 0 && [...sortedSignal];

  useEffect(() => {
    const allDataGet = async () => {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
    };
    onGetSpotBalanceData();
    allDataGet();
  }, []);

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

  const onGetSpotBalanceData = async () => {
    try {
      setSkeletonIndicatorVisible(true);
      setBothVisible(settingData.both_button);
      setActiveVisible(settingData.rsi_button);
      setDavVisible(settingData.dav_button);
      setHpVisible(settingData.hp_button);
      setZigVisible(settingData.zig_button);
      const response = await onGetSpotTickers();
      let array1 = [];
      response.data.data.map(item => {
        array1.push(removePrefix(item, 'USDT'));
      });
      setAllTickerData(response.data.data);
      setSpotBalanceList(array1);
      let dataAll = [];
      const getIndicatorData = await onGetAdminIndicatorDataApi();
      let allData = getIndicatorData.data;
      // console.log('get Indicator Value>>>', allData);
      allData = allData.forEach(tickerData => {
        const coin = futurePriceData.find(
          coin => coin.ticker === tickerData.ticker,
        )?.ticker;
        let ai_resistance = futurePriceData.find(
          coin => coin.ticker === tickerData.ticker,
        )?.tomorrow_prediction;
        let ai_support = futurePriceData.find(
          coin => coin.ticker === tickerData.ticker,
        )?.day_after_tomorrow_prediction;
        let ai_target = futurePriceData.find(
          coin => coin.ticker === tickerData.ticker,
        )?.ai_target;

        dataAll.push({...tickerData, ai_target, ai_resistance, ai_support});
      });
      const btcusdtItem = dataAll.find(item => item.ticker === 'BTCUSDT');
      // Filter out BTCUSDT item from the rest of the data
      const otherItems = dataAll.filter(item => item.ticker !== 'BTCUSDT');
      // Sort the other items as needed (e.g., by updated_at)
      const sortedDates = otherItems.sort(customSort);
      setRsiNotification(btcusdtItem ? [btcusdtItem, ...sortedDates] : sortedDates);
      setFilterData(btcusdtItem ? [btcusdtItem, ...sortedDates] : sortedDates);
      setSkeletonIndicatorVisible(false);
    } catch (err) {
      setSkeletonIndicatorVisible(false);
      console.log('err', err);
    }
  };

  const removePrefix = (str, prefix) => {
    if (str) {
      const lastIndex = str.lastIndexOf(prefix);
      if (lastIndex !== -1) {
        return str.slice(0, lastIndex) + str.slice(lastIndex + prefix.length);
      }
    }
    return str;
  };

  const countDecimalDigits = async number => {
    const numberString = number.toString();

    if (numberString.includes('.')) {
      // Split the string at the decimal point
      const data = numberString.indexOf('.') >= 0 ? numberString.replace(/\.?0+$/, '') : numberString;
      const decimalPart = data.split('.')[1];
      // Return the length of the decimal part
      return decimalPart.length;
    } else {
      // If there is no decimal point, return 0
      return 0;
    }
  };

  const onHandleSetting = async from => {
    try {
      let raw = JSON.stringify({
        both_button: from == 'both' ? !bothVisible : bothVisible,
        rsi_button: from == 'rsi' ? !activeVisible : activeVisible,
        hp_button: from == 'hp' ? !hpVisible : hpVisible,
        dav_button: from == 'dav' ? !davVisible : davVisible,
        zig_button: from == 'zig' ? !zigVisible : zigVisible,
      });
      if (from == 'both') {
        setBothVisible(!bothVisible);
      } else if (from == 'rsi') {
        setActiveVisible(!activeVisible);
      } else if (from == 'dav') {
        setDavVisible(!davVisible);
      } else if (from == 'hp') {
        setHpVisible(!hpVisible);
      } else if (from == 'zig') {
        setZigVisible(!zigVisible);
      }

      const settingDataIcon = await onPostAdminSettingApi(raw);
      if (settingDataIcon?.data) {
        console.log('settingData', settingDataIcon?.data);
      }
    } catch (err) {
      console.log('setting>', err);
    }
  };

  const onHandleTickerAdd = async () => {
    try {
      if (defaultValueBuy == '') {
        setBuyError(true);
        setBuyMessage('Please select coin first.');
      } else if (directionValue == '') {
        setBuyError(true);
        setBuyMessage('Please select direction first.');
      } else {
        let raw = JSON.stringify({
          ticker: `${defaultValueBuy}USDT`,
          gratter_than_price: directionValue == 'Greater than' ? res2 : '0.00',
          seller_than_price: directionValue == 'Smaller than' ? res2 : '0.00',
        });

        const tickerAdd = await onPostAdminTickerSettingApi(raw);

        if (tickerAdd.data) {
          console.log('Add Ticker');
          showMessage({
            message: 'Successfully Added!',
            type: 'success',
            duration: 3000,
          });
        }
      }
    } catch (err) {
      console.log('ticker add', err);
    }
  };

  const handleSearch = async text => {
    setSearch1(text);
    if (text !== '') {
      let allData = filterData;
      const filtered = allData.filter(item =>
        item.ticker.toLowerCase().includes(text.toLowerCase()),
      );
      setRsiNotification(filtered);
      setRefresh(!refresh);
    } else {
      setRsiNotification(filterData.slice(0, 50));
      setRefresh(!refresh);
    }
  };

  useEffect(() => {
    if (!search1 && RsiNotification.length < filterData.length) {
      // Incrementally add more items back to the list
      setTimeout(() => {
        setRsiNotification(filterData.slice(0, filterData.length));
      }, 500);
    }
  }, [RsiNotification, search1, filterData]);

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

  const handleScroll = event => {
    setScrollOffset(event.nativeEvent.contentOffset.x);
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
            title={'Indicator'}
            userRole={userRole}
            onPress={() => navigation.openDrawer()}
            navigation={navigation}
            notify={true}
          />
        </View>
        <View style={styles.mainView}>
          <ScrollView
            style={{width: '100%'}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(4)}}>
            <View style={[styles.balanceBuyMathView, {marginVertical: hp(2)}]}>
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
                    defaultButtonText={'Search Coin'}
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
                  <Text style={styles.selectCoinText}>{'Direction'}</Text>
                  <SelectDropdown
                    data={direction}
                    onSelect={(selectedItem, index) => {
                      setDirectionValue(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={directionValue}
                    defaultButtonText={'Search Direction'}
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
              </View>
              <View style={[styles.rowView, {marginTop: hp(1)}]}>
                <View>
                  <Text style={[styles.selectCoinText]}>{'Price'}</Text>
                  <TextInput
                    value={res2}
                    onChangeText={text => setRes2(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.buyButtonView, {marginTop: hp(3), marginHorizontal: wp(4)}]}
                  onPress={() => onHandleTickerAdd()}>
                  <Text style={styles.buyText}>{'Submit'}</Text>
                </TouchableOpacity>
              </View>
              {buyError ? (
                <Text style={styles.errorText}>{buyMessage}</Text>
              ) : null}
            </View>
            <View style={[styles.rowView1, {marginBottom: hp(2.5)}]}>
              <View style={styles.rowView2}>
                <Text style={styles.titleText6}>{'Both'}</Text>
                <Switch
                  trackColor={{
                    false: bothVisible ? COLORS.greenColor : COLORS.errorColor,
                    true: bothVisible ? COLORS.greenColor : COLORS.errorColor,
                  }}
                  thumbColor={bothVisible ? '#f4f3f4' : '#f4f3f4'}
                  ios_backgroundColor={COLORS.errorColor}
                  onValueChange={() => onHandleSetting('both')}
                  value={bothVisible}
                />
              </View>
              <View style={styles.rowView2}>
                <Text style={styles.titleText6}>{'AI 2.0'}</Text>
                <Switch
                  trackColor={{
                    false: davVisible ? COLORS.greenColor : COLORS.errorColor,
                    true: davVisible ? COLORS.greenColor : COLORS.errorColor,
                  }}
                  thumbColor={davVisible ? '#f4f3f4' : '#f4f3f4'}
                  ios_backgroundColor={COLORS.errorColor}
                  onValueChange={() => onHandleSetting('dav')}
                  value={davVisible}
                />
              </View>
              <View style={styles.rowView2}>
                <Text style={styles.titleText6}>{'Levels'}</Text>
                <Switch
                  trackColor={{
                    false: zigVisible ? COLORS.greenColor : COLORS.errorColor,
                    true: zigVisible ? COLORS.greenColor : COLORS.errorColor,
                  }}
                  thumbColor={zigVisible ? '#f4f3f4' : '#f4f3f4'}
                  ios_backgroundColor={COLORS.errorColor}
                  onValueChange={() => onHandleSetting('zig')}
                  value={zigVisible}
                />
              </View>
              <View style={styles.rowView2}>
                <Text style={styles.titleText6}>{'Points'}</Text>
                <Switch
                  trackColor={{
                    false: activeVisible ? COLORS.greenColor : COLORS.errorColor,
                    true: activeVisible ? COLORS.greenColor : COLORS.errorColor,
                  }}
                  thumbColor={activeVisible ? '#f4f3f4' : '#f4f3f4'}
                  ios_backgroundColor={COLORS.errorColor}
                  onValueChange={() => onHandleSetting('rsi')}
                  value={activeVisible}
                />
              </View>
              <View style={styles.rowView2}>
                <Text style={styles.titleText6}>{'Prediction'}</Text>
                <Switch
                  trackColor={{
                    false: hpVisible ? COLORS.greenColor : COLORS.errorColor,
                    true: hpVisible ? COLORS.greenColor : COLORS.errorColor,
                  }}
                  thumbColor={hpVisible ? '#f4f3f4' : '#f4f3f4'}
                  ios_backgroundColor={COLORS.errorColor}
                  onValueChange={() => onHandleSetting('hp')}
                  value={hpVisible}
                />
              </View>
            </View>
            <TextInput
              value={search1}
              onChangeText={text => handleSearch(text)}
              placeholder={'Search Coin'}
              placeholderTextColor={COLORS.greyColor}
              style={styles.searchText1}
              autoCapitalize="none"
            />
            <View
              style={[
                styles.activeView1,
                {
                  width:
                    RsiNotification.length > 1
                      ? '99%'
                      : RsiNotification.length == 0
                      ? '99%'
                      : wp(72),
                },
              ]}>
              <View style={styles.titleActiveView1}>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {height: hp(4)}]}>
                  <Text style={styles.titleText4}>{'Date'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {height: hp(4)}]}>
                  <Text style={styles.titleText4}>{'Time'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {height: hp(4)}]}>
                  <Text style={styles.titleText4}>{'Coin'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {height: hp(4)}]}>
                  <Text style={styles.titleText4}>{'Last Price'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {height: hp(4)}]}>
                  <Text style={styles.titleText4}>{'Yesterday %'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {height: hp(4)}]}>
                  <Text style={styles.titleText4}>{'Current %'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {height: hp(4)}]}>
                  <Text style={styles.titleText4}>{'AI Target'}</Text>
                </TouchableOpacity>

                <View
                  style={[
                    styles.optionTitleView,
                    {
                      width: wp(72),
                      flexDirection: 'column',
                      height: hp(18),
                    },
                  ]}>
                  <Text style={styles.titleText7}>{'Points'}</Text>
                  <View style={[styles.optionTitleView1]}>
                    <TouchableOpacity
                      onPress={() => {}}
                      style={[styles.optionTitleView2, {width: wp(24)}]}>
                      <Text style={styles.titleText4}>{'Signal'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {}}
                      style={[styles.optionTitleView2, {width: wp(24)}]}>
                      <Text style={styles.titleText4}>{'Distance 1'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {}}
                      style={[styles.optionTitleView2, {width: wp(24)}]}>
                      <Text style={styles.titleText4}>{'Distance 2'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {marginTop: hp(0.5)}]}>
                  <Text style={styles.titleText4}>{'AI\nResistance'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {width: wp(32)}]}>
                  <Text style={styles.titleText4}>{'AI\nSupport'}</Text>
                </TouchableOpacity>

                <View
                  style={[
                    styles.optionTitleView,
                    {
                      width: wp(64),
                      flexDirection: 'column',
                      height: hp(22),
                    },
                  ]}>
                  <Text style={styles.titleText7}>{'AI 2.0'}</Text>
                  <View style={[styles.optionTitleView1]}>
                    <TouchableOpacity style={[styles.optionTitleView2]}>
                      <Text style={styles.titleText5}>{'Resistance'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionTitleView2]}>
                      <Text style={styles.titleText5}>{'Support'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionTitleView2]}>
                      <Text style={styles.titleText5}>{'Buy'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionTitleView2]}>
                      <Text style={styles.titleText5}>{'Sell'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View
                  style={[
                    styles.optionTitleView,
                    {
                      width: wp(68),
                      flexDirection: 'column',
                      height: hp(14),
                    },
                  ]}>
                  <Text style={styles.titleText7}>{'Levels'}</Text>
                  <View style={[styles.optionTitleView1]}>
                    <TouchableOpacity
                      style={[styles.optionTitleView2, {width: wp(19)}]}>
                      <Text style={styles.titleText5}>{'Level'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.optionTitleView2, {width: wp(22)}]}>
                      <Text style={styles.titleText5}>{'B/S'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.optionTitleView2, {width: wp(27)}]}>
                      <Text style={styles.titleText5}>{'Action'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View
                  style={[
                    styles.optionTitleView,
                    {
                      width: wp(169),
                      flexDirection: 'column',
                      height: hp(30),
                    },
                  ]}>
                  <Text style={styles.titleText7}>{'Prediction'}</Text>
                  <View style={[styles.optionTitleView1]}>
                    <TouchableOpacity style={[styles.optionTitleView2]}>
                      <Text style={styles.titleText5}>{'Pattern'}</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                      style={[styles.optionTitleView1, {width: wp(20)}]}>
                      <Text style={styles.titleText5}>{'Points'}</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={[styles.optionTitleView2]}>
                      <Text style={styles.titleText5}>{'Dire'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionTitleView2]}>
                      <Text style={styles.titleText5}>{'Entry Price'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionTitleView2]}>
                      <Text style={styles.titleText5}>{'Target1'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionTitleView2]}>
                      <Text style={styles.titleText5}>{'SL'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionTitleView2]}>
                      <Text style={styles.titleText5}>{'Chg Dire'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {skeletonIndicatorVisible ? (
                <AdminIndicatorSkeleton />
              ) : (
                <FlatList
                  ref={flatListRef}
                  data={RsiNotification}
                  extraData={RsiNotification}
                  bounces={false}
                  onScroll={handleScroll}
                  removeClippedSubviews={true}
                  nestedScrollEnabled
                  virtualized
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  // contentContainerStyle={{paddingBottom: hp(2)}}
                  initialNumToRender={RsiNotification.length}
                  keyExtractor={item => item.ticker}
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
                    const getFirstString = str => {
                      return str.split(' ')[0];
                    };
                    if (item?.last_price != null && allTickerData.includes(item.ticker)) {
                      const decimalDigitsInPrice = countDecimalDigits(
                        item?.last_price,
                      );
                      return (
                        <View
                          style={[
                            styles.dataHistoryView,
                            {
                              backgroundColor:
                                index % 2 === 1
                                  ? COLORS.lightPrimary
                                  : COLORS.lightPrimary3,
                              borderTopRightRadius:
                                RsiNotification.length - 1 == index ? wp(3) : 0,
                              borderBottomRightRadius:
                                RsiNotification.length - 1 == index ? wp(3) : 0,
                            },
                          ]}
                          key={item.updated_at}>
                          <View style={styles.mainViewDesign}>
                            <Text style={[styles.dataHistoryText]}>
                              {moment(item?.updated_at).format('YYYY-MM-DD')}
                            </Text>
                          </View>
                          <View style={styles.mainViewDesign}>
                            <Text style={styles.dataHistoryText}>
                              {moment(item?.updated_at).format('hh:mm:ss')}
                            </Text>
                          </View>
                          <View style={styles.mainViewDesign}>
                            <Text
                              style={[
                                styles.dataHistoryText,
                                {
                                  fontSize: hp(2),
                                  color: !item?.dav_buy
                                    ? COLORS.black
                                    : COLORS.greenColor,
                                },
                              ]}>
                              {item?.ticker}
                            </Text>
                          </View>
                          <View style={styles.mainViewDesign}>
                            <Text style={styles.dataHistoryText}>
                              {item?.last_price}
                            </Text>
                          </View>
                          <View style={styles.mainViewDesign}>
                            <Text style={styles.dataHistoryText}>
                              {parseFloat(item?.yesterday_percentage).toFixed(2)}
                            </Text>
                          </View>
                          <View style={[styles.mainViewDesign]}>
                            <Text style={styles.dataHistoryText}>
                              {parseFloat(item?.current_percentage).toFixed(2)}
                            </Text>
                          </View>
                          <View style={[styles.mainViewDesign]}>
                            <Text
                              style={[
                                styles.dataHistoryText,
                                {
                                  color:
                                    item.ai_target > item.ai_resistance
                                      ? COLORS.greenColor
                                      : item.ai_target < item.ai_support
                                      ? COLORS.errorColor
                                      : COLORS.black,
                                },
                              ]}>
                              {parseFloat(item?.ai_target).toFixed(
                                decimalDigitsInPrice._j,
                              )}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.optionTitleView,
                              {
                                flexDirection: 'column',
                                height: hp(18),
                              },
                            ]}>
                            <Text style={styles.titleText7}>{''}</Text>
                            <View style={[styles.optionTitleView1]}>
                              <View
                                style={[styles.mainViewDesign, {marginTop: 0}]}>
                                <Text
                                  style={[
                                    styles.dataHistoryText,
                                    {
                                      color: !item?.rsi_signal
                                        ? COLORS.errorColor
                                        : COLORS.greenColor,
                                    },
                                  ]}>
                                  {item?.rsi_signal ? 'Yes' : 'No'}
                                </Text>
                              </View>
                              <View
                                style={[styles.mainViewDesign, {marginTop: 0}]}>
                                <Text style={styles.dataHistoryText}>
                                  {parseFloat(item?.rsi_1).toFixed(2)}
                                </Text>
                              </View>
                              <View
                                style={[styles.mainViewDesign, {marginTop: 0}]}>
                                <Text style={styles.dataHistoryText}>
                                  {parseFloat(item?.resi_2).toFixed(2)}
                                </Text>
                              </View>
                            </View>
                          </View>

                          <View
                            style={[
                              styles.mainViewDesign,
                              {height: hp(5), marginTop: 0},
                            ]}>
                            <Text
                              style={[
                                styles.dataHistoryText,
                                {
                                  color:
                                    item?.last_price > item.ai_resistance
                                      ? COLORS.greenColor
                                      : COLORS.black,
                                },
                              ]}>
                              {parseFloat(item?.ai_resistance).toFixed(
                                decimalDigitsInPrice._j,
                              )}
                            </Text>
                          </View>

                          <View
                            style={[styles.mainViewDesign, {height: hp(5)}]}>
                            <Text
                              style={[
                                styles.dataHistoryText,
                                {
                                  color:
                                    item?.last_price < item.ai_support
                                      ? COLORS.errorColor
                                      : COLORS.black,
                                },
                              ]}>
                              {parseFloat(item?.ai_support).toFixed(
                                decimalDigitsInPrice._j,
                              )}
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.optionTitleView,
                              {
                                height: hp(22),
                                flexDirection: 'column',
                              },
                            ]}>
                            <Text style={styles.titleText7}>{''}</Text>
                            <View style={[styles.optionTitleView1]}>
                              <View
                                style={[styles.mainViewDesign, {marginTop: 0}]}>
                                <Text
                                  style={[
                                    styles.dataHistoryText,
                                    {
                                      color:
                                        item?.last_price > item.dav_top
                                          ? COLORS.greenColor
                                          : COLORS.black,
                                    },
                                  ]}>
                                  {item?.dav_top}
                                </Text>
                              </View>
                              <View
                                style={[styles.mainViewDesign, {marginTop: 0}]}>
                                <Text
                                  style={[
                                    styles.dataHistoryText,
                                    {
                                      color:
                                        item?.last_price < item.dav_bottom
                                          ? COLORS.errorColor
                                          : COLORS.black,
                                    },
                                  ]}>
                                  {item?.dav_bottom}
                                </Text>
                              </View>
                              <View
                                style={[styles.mainViewDesign, {marginTop: 0}]}>
                                <Text
                                  style={[
                                    styles.dataHistoryText,
                                    {
                                      color: !item?.dav_buy
                                        ? COLORS.errorColor
                                        : COLORS.greenColor,
                                    },
                                  ]}>
                                  {item?.dav_buy ? 'Yes' : 'No'}
                                </Text>
                              </View>
                              <View
                                style={[styles.mainViewDesign, {marginTop: 0}]}>
                                <Text
                                  style={[
                                    styles.dataHistoryText,
                                    {
                                      color: !item?.dav_sell
                                        ? COLORS.errorColor
                                        : COLORS.greenColor,
                                    },
                                  ]}>
                                  {item?.dav_sell ? 'Yes' : 'No'}
                                </Text>
                              </View>
                            </View>
                          </View>

                          <View
                            style={[
                              styles.optionTitleView,
                              {
                                height: hp(14),
                                flexDirection: 'column',
                              },
                            ]}>
                            <Text style={styles.titleText7}>{''}</Text>
                            <View style={[styles.optionTitleView1]}>
                              <View
                                style={[styles.mainViewDesign, {marginTop: 0}]}>
                                <Text style={styles.dataHistoryText}>
                                  {item?.zig_zigzag
                                    ? parseInt(item?.zig_zigzag)
                                    : '-'}
                                </Text>
                              </View>
                              <View
                                style={[styles.mainViewDesign, {marginTop: 0}]}>
                                <Text style={styles.dataHistoryText}>
                                  {item?.zig_direction
                                    ? parseInt(item?.zig_direction)
                                    : '-'}
                                </Text>
                              </View>
                              <View
                                style={[styles.mainViewDesign, {marginTop: 0}]}>
                                <Text style={styles.dataHistoryText}>
                                  {item?.zig_new_status && getFirstString(item?.zig_new_status)}
                                </Text>
                              </View>
                            </View>
                          </View>

                          <View
                            style={[
                              styles.optionTitleView,
                              {
                                height: hp(30),
                                flexDirection: 'column',
                              },
                            ]}>
                            <Text style={styles.titleText7}>{''}</Text>
                            <View style={[styles.optionTitleView1]}>
                              <View
                                style={[styles.mainViewDesign, {marginTop: 0}]}>
                                <Text style={styles.dataHistoryText}>
                                  {item?.hp_pattern}
                                </Text>
                              </View>
                              <View style={[styles.mainViewDesign, {marginTop: 0}]}>
                                <Text
                                  style={[
                                    styles.dataHistoryText,
                                    {
                                      color:
                                        item?.hp_direction == 'sell'
                                          ? COLORS.errorColor
                                          : COLORS.greenColor,
                                    },
                                  ]}>
                                  {item?.hp_direction == 'sell'
                                    ? 'Sell'
                                    : item?.hp_direction == 'buy'
                                    ? 'Buy'
                                    : '-'}
                                </Text>
                              </View>
                              <View style={[styles.mainViewDesign, {marginTop: 0}]}>
                                <Text style={styles.dataHistoryText}>
                                  {item?.hp_entry_price}
                                </Text>
                              </View>
                              <View style={[styles.mainViewDesign, {marginTop: 0}]}>
                                <Text style={styles.dataHistoryText}>
                                  {item?.hp_target_1}
                                </Text>
                              </View>
                              <View style={[styles.mainViewDesign, {marginTop: 0}]}>
                                <Text style={styles.dataHistoryText}>
                                  {item?.hp_stop_loss}
                                </Text>
                              </View>
                              <View style={[styles.mainViewDesign, {marginTop: 0}]}>
                                <Text
                                  style={[
                                    styles.dataHistoryText,
                                    {
                                      color:
                                        item?.hp_change_direction == 'sell'
                                          ? COLORS.errorColor
                                          : COLORS.greenColor,
                                    },
                                  ]}>
                                  {item?.hp_change_direction == 'sell'
                                    ? 'Sell'
                                    : item?.hp_change_direction == 'buy'
                                    ? 'Buy'
                                    : '-'}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    }
                  }}
                />
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default IndicatorScreen;
