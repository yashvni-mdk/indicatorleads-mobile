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
import moment from 'moment';
import close from '../../../images/close.png';
import calendar from '../../../images/calendar.png';
import check from '../../../images/check.png';
import CalendarPicker from 'react-native-calendar-picker';
import {useSelector} from 'react-redux';
import {CancelPopup} from '../../../components/CancelPopup';
import {
  onGetAdminFilterCommonApi,
  onGetExtraHistoryApi,
  onPostCancelActivePMSApi,
} from '../../../services/Api';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';

const SpotPmsActive = ({navigation}) => {
  const getAdminSpotSpmActive = useSelector(
    state => state.getAdminSpotSpmActive,
  );
  const [userRole, setUserRole] = useState('');
  const [search1, setSearch1] = useState('');
  const [notificationData, setNotificationData] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [calenderVisible, setCalenderVisible] = useState(false);
  const [filterHistory, setFilterHistory] = useState([]);
  const [nextUrl, setNextUrl] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [cancelAllVisible, setCancelAllVisible] = useState(false);
  const [isFooterLoader, setIsFooterLoader] = useState(false);
  const [searchingVisible, setSearchingVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [buyVisible, setBuyVisible] = useState(false);
  const [sellVisible, setSellVisible] = useState(false);
  const [s1Visible, setS1Visible] = useState(false);
  const [s2Visible, setS2Visible] = useState(false);

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
      const historyData = getAdminSpotSpmActive;
      setNotificationData(historyData.results);
      setFilterHistory(historyData.results);
      setNextUrl(historyData.next);
      setRefresh(!refresh);
    } catch (err) {
      console.log('History Data>>', err);
    }
  };

  const AllCancelHandle = async () => {
    try {
      setCancelAllVisible(false);
    } catch (err) {
      console.log('Error:::', err);
    }
  };

  const onCancelHandle = async item => {
    try {
      const raw = JSON.stringify({
        user_email: item?.user?.email,
      });
      const response = await onPostCancelActivePMSApi(item.id, raw);

      if (response.data) {
        showMessage({
          message: 'Spot PMS Active coin cancel successfully!',
          type: 'success',
          duration: 3000,
        });
      }
    } catch (err) {
      console.log('Error:::', err);
    }
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

  const onCloseDate = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    onWithoutDateFilterImplement();
  };

  const onWithoutDateFilterImplement = async () => {
    try {
      let url = `super-admin/bot-trading/active-trading-bot/?${
        search1 != '' ? `email=${search1}&` : ''
      }bot_type=spot-pms-bot&trade_status=taken&trade_status=pending${
        buyVisible || sellVisible ? `&webhook_signal_direction=${buyVisible ? 'BUY' : 'SELL'}` : ''}${
        s1Visible || s2Visible ? `&stretegy_info=${s1Visible ? 's1' : 's2'}` : ''}`;
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setNotificationData(responseAPI.data.results);
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
      let url = `super-admin/bot-trading/active-trading-bot/?${
        search1 != '' ? `email=${search1}&` : ''
      }bot_type=spot-pms-bot&trade_status=taken&trade_status=pending&start_date=${moment(
        selectedStartDate,
      ).format('YYYY-MM-DD')}&end_date=${moment(date).format('YYYY-MM-DD')}${
        buyVisible || sellVisible ? `&webhook_signal_direction=${buyVisible ? 'BUY' : 'SELL'}` : ''}${
        s1Visible || s2Visible ? `&stretegy_info=${s1Visible ? 's1' : 's2'}` : ''}`;
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setNotificationData(responseAPI.data.results);
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
        setNotificationData(prevArray => [...prevArray, ...response.data.results]);
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
      onSearchFilterImplement(text);
      setRefresh(!refresh);
    } else {
      setSearchingVisible(false);
      onWithoutSearchFilterImplement();
      setRefresh(!refresh);
    }
  };

  const onWithoutSearchFilterImplement = async () => {
    try {
      let startDate = moment(selectedStartDate).format('YYYY-MM-DD');
      let lastDate = moment(selectedEndDate).format('YYYY-MM-DD');
      let url = `super-admin/bot-trading/active-trading-bot/?bot_type=spot-pms-bot&trade_status=taken&trade_status=pending${
        selectedEndDate != null
          ? `&start_date=${startDate}&end_date=${lastDate}`
          : ''
      }${
        buyVisible || sellVisible
          ? `&webhook_signal_direction=${buyVisible ? 'BUY' : 'SELL'}`
          : ''
      }${
        s1Visible || s2Visible
          ? `&stretegy_info=${s1Visible ? 's1' : 's2'}`
          : ''
      }`;
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setNotificationData(responseAPI.data.results);
        setFilterHistory(responseAPI.data.results);
        setNextUrl(responseAPI.data.next);
        setRefresh(!refresh);
      }
    } catch (Err) {
      console.log('get Error::', Err);
    }
  };

  const onSearchFilterImplement = async text => {
    try {
      let startDate = moment(selectedStartDate).format('YYYY-MM-DD');
      let lastDate = moment(selectedEndDate).format('YYYY-MM-DD');
      let url = `super-admin/bot-trading/active-trading-bot/?email=${text}&
      bot_type=spot-pms-bot&trade_status=taken&trade_status=pending${
        selectedEndDate != null
          ? `&start_date=${startDate}&end_date=${lastDate}`
          : ''
      }${
        buyVisible || sellVisible
          ? `&webhook_signal_direction=${buyVisible ? 'BUY' : 'SELL'}`
          : ''
      }${
        s1Visible || s2Visible
          ? `&stretegy_info=${s1Visible ? 's1' : 's2'}`
          : ''
      }`;
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setNotificationData(responseAPI.data.results);
        setFilterHistory(responseAPI.data.results);
        setNextUrl(responseAPI.data.next);
        setRefresh(!refresh);
      }
    } catch (Err) {
      console.log('get Error::', Err);
    }
  };

  const onFilterHandle = from => {
    if (from == 'buy') {
      if (buyVisible) {
        onCategoryWithoutFilterImplement();
        setBuyVisible(false);
      } else {
        onCategoryFilterImplement('BUY');
        setBuyVisible(true);
      }
      setSellVisible(false);
    } else if (from == 'sell') {
      setBuyVisible(false);
      if (sellVisible) {
        onCategoryWithoutFilterImplement();
        setSellVisible(false);
      } else {
        onCategoryFilterImplement('SELL');
        setSellVisible(true);
      }
    } else if (from == 's1') {
      if (s1Visible) {
        onCategoryWithoutFilterImplement1();
        setS1Visible(false);
      } else {
        onCategoryFilterImplement1('s1');
        setS1Visible(true);
      }
      setS2Visible(false);
    } else if (from == 's2') {
      setS1Visible(false);
      if (s2Visible) {
        onCategoryWithoutFilterImplement1();
        setS2Visible(false);
      } else {
        onCategoryFilterImplement1('s2');
        setS2Visible(true);
      }
    }
  };

  const onCategoryFilterImplement = async text => {
    try {
      let startDate = moment(selectedStartDate).format('YYYY-MM-DD');
      let lastDate = moment(selectedEndDate).format('YYYY-MM-DD');
      let url = `super-admin/bot-trading/active-trading-bot/?${
        search1 != '' ? `email=${search1}&` : ''
      }bot_type=spot-pms-bot&trade_status=taken&trade_status=pending${
        selectedEndDate != null
          ? `&start_date=${startDate}&end_date=${lastDate}`
          : ''
      }&webhook_signal_direction=${text}${
        s1Visible || s2Visible
          ? `&stretegy_info=${s1Visible ? 's1' : 's2'}`
          : ''
      }`;
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setNotificationData(responseAPI.data.results);
        setFilterHistory(responseAPI.data.results);
        setNextUrl(responseAPI.data.next);
        setRefresh(!refresh);
      }
    } catch (Err) {
      console.log('get Error::', Err);
    }
  };

  const onCategoryWithoutFilterImplement = async text => {
    try {
      let startDate = moment(selectedStartDate).format('YYYY-MM-DD');
      let lastDate = moment(selectedEndDate).format('YYYY-MM-DD');
      let url = `super-admin/bot-trading/active-trading-bot/?${
        search1 != '' ? `email=${search1}&` : ''
      }bot_type=spot-pms-bot&trade_status=taken&trade_status=pending${
        selectedEndDate != null
          ? `&start_date=${startDate}&end_date=${lastDate}`
          : ''
      }${
        s1Visible || s2Visible
          ? `&stretegy_info=${s1Visible ? 's1' : 's2'}`
          : ''
      }`;
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setNotificationData(responseAPI.data.results);
        setFilterHistory(responseAPI.data.results);
        setNextUrl(responseAPI.data.next);
        setRefresh(!refresh);
      }
    } catch (Err) {
      console.log('get Error::', Err);
    }
  };

  const onCategoryFilterImplement1 = async text => {
    try {
      let startDate = moment(selectedStartDate).format('YYYY-MM-DD');
      let lastDate = moment(selectedEndDate).format('YYYY-MM-DD');
      let url = `super-admin/bot-trading/active-trading-bot/?${
        search1 != '' ? `email=${search1}&` : ''
      }bot_type=spot-pms-bot&trade_status=taken&trade_status=pending${
        selectedEndDate != null
          ? `&start_date=${startDate}&end_date=${lastDate}`
          : ''
      }${
        buyVisible || sellVisible
          ? `&webhook_signal_direction=${buyVisible ? 'BUY' : 'SELL'}`
          : ''
      }&stretegy_info=${text}`;
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setNotificationData(responseAPI.data.results);
        setFilterHistory(responseAPI.data.results);
        setNextUrl(responseAPI.data.next);
        setRefresh(!refresh);
      }
    } catch (Err) {
      console.log('get Error::', Err);
    }
  };

  const onCategoryWithoutFilterImplement1 = async text => {
    try {
      let startDate = moment(selectedStartDate).format('YYYY-MM-DD');
      let lastDate = moment(selectedEndDate).format('YYYY-MM-DD');
      let url = `super-admin/bot-trading/active-trading-bot/?${
        search1 != '' ? `email=${search1}&` : ''
      }bot_type=spot-pms-bot&trade_status=taken&trade_status=pending${
        selectedEndDate != null
          ? `&start_date=${startDate}&end_date=${lastDate}`
          : ''
      }${
        buyVisible || sellVisible
          ? `&webhook_signal_direction=${buyVisible ? 'BUY' : 'SELL'}`
          : ''
      }`;
      const responseAPI = await onGetAdminFilterCommonApi(url);
      if (responseAPI.data) {
        console.log('get Log::::', responseAPI.data);
        setNotificationData(responseAPI.data.results);
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
            title={'Spot PMS Active'}
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
            <TextInput
              value={search1}
              onChangeText={text => handleSearch(text)}
              placeholder={'Search...'}
              placeholderTextColor={COLORS.greyColor}
              style={styles.searchText1}
              autoCapitalize="none"
            />
            <View style={styles.filterView}>
              <TouchableOpacity
                style={[styles.filterButton]}
                onPress={() => setCancelAllVisible(true)}>
                <Text style={styles.filterText}>Cancel All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, {marginLeft: wp(4)}]}
                onPress={() => setFilterVisible(!filterVisible)}>
                <Text style={styles.filterText}>Filters</Text>
              </TouchableOpacity>
              {filterVisible && (
                <View style={styles.filterVisibleView}>
                  <Text style={styles.indicatorText}>Signal Type</Text>

                  <TouchableOpacity
                    activeOpacity={1}
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
                    <Text style={styles.optionText}>Buy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
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
                    <Text style={styles.optionText}>Sell</Text>
                  </TouchableOpacity>

                  <Text style={[styles.indicatorText, {marginTop: hp(1)}]}>
                    Strategy
                  </Text>

                  <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.optionView, {marginTop: hp(2)}]}
                    onPress={() => onFilterHandle('s1')}>
                    <View
                      style={[
                        styles.checkBoxView,
                        {
                          backgroundColor: s1Visible
                            ? COLORS.primary
                            : COLORS.white,
                        },
                      ]}>
                      <Image style={styles.rightImage} source={check} />
                    </View>
                    <Text style={styles.optionText}>S1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.optionView}
                    onPress={() => onFilterHandle('s2')}>
                    <View
                      style={[
                        styles.checkBoxView,
                        {
                          backgroundColor: s2Visible
                            ? COLORS.primary
                            : COLORS.white,
                        },
                      ]}>
                      <Image style={styles.rightImage} source={check} />
                    </View>
                    <Text style={styles.optionText}>S2</Text>
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
                      : wp(67),
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
                  style={[styles.optionTitleView, {width: wp(35)}]}>
                  <Text style={styles.titleText4}>{'Amount'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={[styles.optionTitleView, {width: wp(35)}]}>
                  <Text style={styles.titleText4}>{'Entry Price'}</Text>
                </TouchableOpacity>
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
              </View>
              <FlatList
                data={notificationData}
                extraData={notificationData}
                nestedScrollEnabled
                horizontal
                disableVirtualization={false}
                showsHorizontalScrollIndicator={false}
                // contentContainerStyle={{paddingRight: hp(1)}}
                initialNumToRender={500000}
                keyExtractor={item => item.created_at.toString()}
                ListFooterComponent={isFooterLoader ? renderFooter : null}
                onEndReachedThreshold={0.1}
                onEndReached={() => {
                  console.log('End reached'); // Add this log to see if it triggers
                  onGetExtraHistoryData();
                }}
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
                    <View
                      key={item.created_at}
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
                          {moment(item.created_at).format('YYYY-MM-DD')}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text style={[styles.dataHistoryText]}>
                          {moment(item.created_at).format('hh:mm:ss')}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign1}>
                        <Text style={[styles.dataHistoryText1]}>
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
                          {item?.first_trade_amount != null
                            ? item?.first_trade_amount === 0
                              ? '0.0'
                              : item?.first_trade_amount >= 1
                              ? item?.first_trade_amount.toFixed(2)
                              : item?.first_trade_amount
                                  .toString()
                                  .replace(/0+$/, '')
                                  .replace(/\.$/, '')
                            : null}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text style={[styles.dataHistoryText]}>
                          {item?.trade_json?.jam_ratio_1
                            ?.binance__new_trade_data?.price != null
                            ? Number(
                                item?.trade_json?.jam_ratio_1
                                  ?.binance__new_trade_data?.price,
                              ) > 1 ||
                              Number(
                                item?.trade_json?.jam_ratio_1
                                  ?.binance__new_trade_data?.price,
                              ) === 0
                              ? Number(
                                  item?.trade_json?.jam_ratio_1
                                    ?.binance__new_trade_data?.price,
                                ).toFixed(2)
                              : (() => {
                                  const priceStr =
                                    item?.trade_json?.jam_ratio_1?.binance__new_trade_data?.price.toString();
                                  const match = priceStr.match(/^-?\d*\.?\d*?(?=(00))/);
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
                            ?.binance__new_trade_data?.origQty != null
                            ? Number(
                                item?.trade_json?.jam_ratio_1
                                  ?.binance__new_trade_data?.origQty,
                              ) >= 1
                              ? Number(
                                  item?.trade_json?.jam_ratio_1
                                    ?.binance__new_trade_data?.origQty,
                                ).toFixed(2)
                              : (() => {
                                  const origQtyStr =
                                    item?.trade_json?.jam_ratio_1?.binance__new_trade_data?.origQty.toString();
                                  const match = origQtyStr.match(/^-?\d*\.?\d*?(?=(00))/);
                                  return match
                                    ? match[0]
                                    : origQtyStr.length > 8
                                    ? Number(origQtyStr).toFixed(8)
                                    : origQtyStr;
                                })()
                            : null}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text style={[styles.dataHistoryText]}>
                          {
                            item?.trade_json?.jam_ratio_1
                              ?.binance__new_trade_data?.status
                          }
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
                        <Text
                          style={[styles.dataHistoryText]}
                          onPress={() => onCancelHandle(item)}>
                          Cancel
                        </Text>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
      <CancelPopup
        modelVisible={cancelAllVisible}
        setModelVisible={setCancelAllVisible}
        onPress={() => AllCancelHandle()}
      />
    </View>
  );
};

export default SpotPmsActive;
