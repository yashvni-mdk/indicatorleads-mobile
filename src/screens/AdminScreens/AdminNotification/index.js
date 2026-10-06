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
import {useSelector} from 'react-redux';
import moment from 'moment';
import {
  onGetAdminFilterCommonApi,
  onGetExtraHistoryApi,
  onGetNotificationAlertDataApi,
  onGetNotificationSettingDataApi,
  onPostAdminSettingApi,
  onPostNotificationSettingApi,
} from '../../../services/Api';
import check from '../../../images/check.png';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CalendarPicker from 'react-native-calendar-picker';
import close from '../../../images/close.png';
import calendar from '../../../images/calendar.png';

// {created_at: new Date(), message: {ticker: 'BOME', indicator_name: 'ALERT', price: 0.00975, status: '1 = 0.008201 2 = 0.009767'} }

const AdminNotification = ({navigation}) => {
  const getAdminNotificationList = useSelector(
    state => state.getAdminNotificationList,
  );
  const scrollRef = useRef(null);
  const [userRole, setUserRole] = useState('');
  const [search1, setSearch1] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const [emailVisible, setEmailVisible] = useState(false);
  const [twVisible, setTwVisible] = useState(false);
  const [nextUrl, setNextUrl] = useState('');
  const [isFooterLoader, setIsFooterLoader] = useState(false);
  const [searchingVisible, setSearchingVisible] = useState(false);
  const [filterHistory, setFilterHistory] = useState([]);
  const [prevUrl, setPrevUrl] = useState('');
  const [isPressArray, setIsPressArray] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [botVisible, setBotVisible] = useState(false);
  const [customVisible, setCustomVisible] = useState(false);
  const [oneDVisible, setOneDVisible] = useState(false);
  const [oneHVisible, setOneHVisible] = useState(false);
  const [fourHVisible, setFourHVisible] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [calenderVisible, setCalenderVisible] = useState(false);

  let tpCount = 0;
  let trpCount = 0;
  let slCount = 0;

  notificationData.forEach(item => {
    if (item?.result === 'TP') {
      tpCount++;
    }
    if (item.result === 'TRP') {
      trpCount++;
    }
    if (item.result === 'SL') {
      slCount++;
    }
  });

  useEffect(() => {
    notificationDataGet();
    const allDataGet = async () => {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
    };
    notificationSettingDataGet();
    allDataGet();
  }, []);

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

  const onDateFilterImplement = async date => {
    try {
      let modal = '';
      if (botVisible) {
        modal = 'auto_bot_config';
      } else if (customVisible) {
        modal = 'ai_config_bot_custom';
      } else if (oneDVisible) {
        modal = 'ai_config_bot';
      } else if (oneHVisible) {
        modal = 'ai_config_bot_1h';
      } else if (fourHVisible) {
        modal = 'ai_config_bot_4h';
      }
      let startDate = moment(selectedStartDate).format('YYYY-MM-DD');
      let lastDate = moment(date).format('YYYY-MM-DD');
      let url = `super-admin/api/v2/combined-alerts/?page_size=100&${
        search1 != '' ? `ticker=${search1}&` : ''
      }${date != null ? `start_date=${startDate}&end_date=${lastDate}` : ''}${
        botVisible ||
        oneDVisible ||
        oneHVisible ||
        fourHVisible ||
        customVisible
          ? `&source_model=${modal}`
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

  const onCloseDate = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    onDateFilterImplement(null);
  };

  const notificationDataGet = async () => {
    try {
      const response = await onGetNotificationAlertDataApi();
      if (response.data.results.length > 0) {
        setNotificationData(response.data.results);
        setFilterHistory(response.data.results);
        setNextUrl(response.data.next);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('notification::', err);
    }
  };

  const notificationSettingDataGet = async () => {
    try {
      const response = await onGetNotificationSettingDataApi();
      if (response.data) {
        setEmailVisible(response.data.email);
        setTwVisible(response.data.alert);
      }
    } catch (err) {
      console.log('notification::', err);
    }
  };

  const notificationSettingPost = async from => {
    try {
      let raw = JSON.stringify({
        email: from == 'email' ? !emailVisible : emailVisible,
        alert: from == 'alert' ? !twVisible : twVisible,
      });
      if (from == 'email') {
        setEmailVisible(!emailVisible);
      }
      if (from == 'alert') {
        setTwVisible(!twVisible);
      }
      const response = await onPostNotificationSettingApi(raw);
      if (response.data) {
        console.log('Success fully', response.data);
      }
    } catch (err) {
      console.log('post data error::', err);
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
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  };

  const onGetExtraHistoryData = async () => {
    try {
      console.log('enter Extra data');
      if (nextUrl && !isFooterLoader) {
        let array = filterHistory;
        setIsFooterLoader(true);
        const response = await onGetExtraHistoryApi(nextUrl);
        console.log('Response>>', response.data);
        if (response.data) {
          // setDataHistory(response.data.history_trade_list.results);
          setIsFooterLoader(false);
          response.data.results.map(item => {
            array.push(item);
          });
          setFilterHistory(array);
          setNotificationData(array);
          setIsPressArray(Array(array.length).fill(false));
          setNextUrl(response.data.next);
          if (response.data.previous != null) {
            setPrevUrl(response.data.previous);
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

  const onFilterHandle = async from => {
    if (from == 'bot') {
      if (botVisible) {
        onCategoryWithoutFilterImplement();
        setBotVisible(false);
      } else {
        onCategoryFilterImplement('auto_bot_config');
        setBotVisible(true);
      }
      setCustomVisible(false);
      setOneDVisible(false);
      setOneHVisible(false);
      setFourHVisible(false);
    } else if (from == 'custom') {
      if (customVisible) {
        onCategoryWithoutFilterImplement();
        setCustomVisible(false);
      } else {
        onCategoryFilterImplement('ai_config_bot_custom');
        setCustomVisible(true);
      }
      setBotVisible(false);
      setOneDVisible(false);
      setOneHVisible(false);
      setFourHVisible(false);
    } else if (from == '1d') {
      if (oneDVisible) {
        onCategoryWithoutFilterImplement();
        setOneDVisible(false);
      } else {
        onCategoryFilterImplement('ai_config_bot');
        setOneDVisible(true);
      }
      setCustomVisible(false);
      setBotVisible(false);
      setOneHVisible(false);
      setFourHVisible(false);
    } else if (from == '1h') {
      if (oneHVisible) {
        onCategoryWithoutFilterImplement();
        setOneHVisible(false);
      } else {
        onCategoryFilterImplement('ai_config_bot_1h');
        setOneHVisible(true);
      }
      setCustomVisible(false);
      setBotVisible(false);
      setFourHVisible(false);
      setOneDVisible(false);
    } else if (from == '4h') {
      if (fourHVisible) {
        onCategoryWithoutFilterImplement();
        setFourHVisible(false);
      } else {
        onCategoryFilterImplement('ai_config_bot_4h');
        setFourHVisible(true);
      }
      setCustomVisible(false);
      setBotVisible(false);
      setOneHVisible(false);
      setOneDVisible(false);
    }
  };

  const onCategoryFilterImplement = async text => {
    try {
      let startDate = moment(selectedStartDate).format('YYYY-MM-DD');
      let lastDate = moment(selectedEndDate).format('YYYY-MM-DD');
      let url = `super-admin/api/v2/combined-alerts/?page_size=100&${
        search1 != '' ? `ticker=${search1}&` : ''
      }${
        selectedEndDate != null
          ? `start_date=${startDate}&end_date=${lastDate}`
          : ''
      }&source_model=${text}`;
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
      let url = `super-admin/api/v2/combined-alerts/?page_size=100&${
        search1 != '' ? `ticker=${search1}&` : ''
      }${
        selectedEndDate != null
          ? `start_date=${startDate}&end_date=${lastDate}`
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

  const handleSearch = text => {
    setSearchingVisible(true);
    setSearch1(text);
    if (text !== '') {
      onSearchFilterImplement(text);
      setRefresh(!refresh);
    } else {
      setSearchingVisible(false);
      onSearchFilterImplement('');
      setRefresh(!refresh);
    }
  };

  const onSearchFilterImplement = async text => {
    try {
      let modal = '';
      if (botVisible) {
        modal = 'auto_bot_config';
      } else if (customVisible) {
        modal = 'ai_config_bot_custom';
      } else if (oneDVisible) {
        modal = 'ai_config_bot';
      } else if (oneHVisible) {
        modal = 'ai_config_bot_1h';
      } else if (fourHVisible) {
        modal = 'ai_config_bot_4h';
      }
      let startDate = moment(selectedStartDate).format('YYYY-MM-DD');
      let lastDate = moment(selectedEndDate).format('YYYY-MM-DD');
      let url = `super-admin/api/v2/combined-alerts/?page_size=100&${
        text != '' ? `ticker=${text}&` : ''
      }${
        selectedEndDate != null
          ? `start_date=${startDate}&end_date=${lastDate}`
          : ''
      }${
        botVisible ||
        customVisible ||
        oneDVisible ||
        oneHVisible ||
        fourHVisible
          ? `&source_model=${modal}`
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
            title={'Notification'}
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
            style={{width: '100%'}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(15)}}>
            <View style={styles.fullDateView}>
              <View>
                <Text style={[styles.valueText, {color: '#39ff14'}]}>
                  {tpCount}
                </Text>
                <View style={[styles.titleView, {backgroundColor: '#39ff14'}]}>
                  <Text style={styles.titleText}>TP</Text>
                </View>
              </View>
              <View>
                <Text style={[styles.valueText, {color: '#00008b'}]}>
                  {trpCount}
                </Text>
                <View style={[styles.titleView, {backgroundColor: '#00008b'}]}>
                  <Text style={styles.titleText}>TRP</Text>
                </View>
              </View>
              <View>
                <Text style={[styles.valueText, {color: '#ff3314'}]}>
                  {slCount}
                </Text>
                <View style={[styles.titleView, {backgroundColor: '#ff3314'}]}>
                  <Text style={styles.titleText}>SL</Text>
                </View>
              </View>
            </View>
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
            <View style={[styles.rowView1, {marginBottom: hp(2.5)}]}>
              <View style={styles.rowView2}>
                <Text style={styles.titleText6}>{'EMAIL'}</Text>
                <Switch
                  trackColor={{
                    false: emailVisible ? COLORS.greenColor : COLORS.errorColor,
                    true: emailVisible ? COLORS.greenColor : COLORS.errorColor,
                  }}
                  thumbColor={emailVisible ? '#f4f3f4' : '#f4f3f4'}
                  ios_backgroundColor={COLORS.errorColor}
                  onValueChange={() => notificationSettingPost('email')}
                  value={emailVisible}
                />
              </View>
              <View style={styles.rowView2}>
                <Text style={styles.titleText6}>{'Alert'}</Text>
                <Switch
                  trackColor={{
                    false: twVisible ? COLORS.greenColor : COLORS.errorColor,
                    true: twVisible ? COLORS.greenColor : COLORS.errorColor,
                  }}
                  thumbColor={twVisible ? '#f4f3f4' : '#f4f3f4'}
                  ios_backgroundColor={COLORS.errorColor}
                  onValueChange={() => notificationSettingPost('alert')}
                  value={twVisible}
                />
              </View>
            </View>
            <View style={styles.filterView}>
              <TextInput
                value={search1}
                onChangeText={text => handleSearch(text)}
                placeholder={'Search Coin'}
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
                  <Text style={styles.indicatorText}>TIME FRAME</Text>

                  <TouchableOpacity
                    style={[styles.optionView, {marginTop: hp(2)}]}
                    onPress={() => onFilterHandle('bot')}>
                    <View
                      style={[
                        styles.checkBoxView,
                        {
                          backgroundColor: botVisible
                            ? COLORS.primary
                            : COLORS.white,
                        },
                      ]}>
                      <Image style={styles.rightImage} source={check} />
                    </View>
                    <Text style={styles.optionText}>BOT</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.optionView}
                    onPress={() => onFilterHandle('1h')}>
                    <View
                      style={[
                        styles.checkBoxView,
                        {
                          backgroundColor: oneHVisible
                            ? COLORS.primary
                            : COLORS.white,
                        },
                      ]}>
                      <Image style={styles.rightImage} source={check} />
                    </View>
                    <Text style={styles.optionText}>BEGINNER</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.optionView}
                    onPress={() => onFilterHandle('1d')}>
                    <View
                      style={[
                        styles.checkBoxView,
                        {
                          backgroundColor: oneDVisible
                            ? COLORS.primary
                            : COLORS.white,
                        },
                      ]}>
                      <Image style={styles.rightImage} source={check} />
                    </View>
                    <Text style={styles.optionText}>INTERMEDIATE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.optionView}
                    onPress={() => onFilterHandle('4h')}>
                    <View
                      style={[
                        styles.checkBoxView,
                        {
                          backgroundColor: fourHVisible
                            ? COLORS.primary
                            : COLORS.white,
                        },
                      ]}>
                      <Image style={styles.rightImage} source={check} />
                    </View>
                    <Text style={styles.optionText}>ADVANCE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.optionView}
                    onPress={() => onFilterHandle('custom')}>
                    <View
                      style={[
                        styles.checkBoxView,
                        {
                          backgroundColor: customVisible
                            ? COLORS.primary
                            : COLORS.white,
                        },
                      ]}>
                      <Image style={styles.rightImage} source={check} />
                    </View>
                    <Text style={styles.optionText}>EXPERT</Text>
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
                  style={styles.optionTitleView}>
                  <Text style={styles.titleText4}>{'Date'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.optionTitleView}>
                  <Text style={styles.titleText4}>{'Time'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.optionTitleView}>
                  <Text style={styles.titleText4}>{'Type'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.optionTitleView}>
                  <Text style={styles.titleText4}>{'Coin'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.optionTitleView}>
                  <Text style={styles.titleText4}>{'Signal'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.optionTitleView}>
                  <Text style={styles.titleText4}>{'Result'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.optionTitleView}>
                  <Text style={styles.titleText4}>{'Strategy'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.optionTitleView}>
                  <Text style={styles.titleText4}>{'Entry Price'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.optionTitleView}>
                  <Text style={styles.titleText4}>{'TP'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.optionTitleView}>
                  <Text style={styles.titleText4}>{'SL'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.optionTitleView}>
                  <Text style={styles.titleText4}>{'TRP'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.optionTitleView}>
                  <Text style={styles.titleText4}>{'Date'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.optionTitleView}>
                  <Text style={styles.titleText4}>{'Time'}</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={notificationData}
                extraData={notificationData}
                nestedScrollEnabled
                initialNumToRender={5000000}
                virtualized
                horizontal
                keyExtractor={item => item.created_at}
                ListEmptyComponent={() => (
                  <View key={0} style={styles.ListEmptyView}>
                    <View style={styles.subEmptyView}>
                      <Text style={styles.emptyText}>
                        {'No record available'}
                      </Text>
                    </View>
                  </View>
                )}
                onMomentumScrollBegin={isFooterLoader && !searchingVisible ? renderFooter : null}
                onEndReachedThreshold={0.5}
                onEndReached={() => onGetExtraHistoryData()}
                renderItem={({item, index}) => {
                  let splitValues = [];
                  if (item.message?.status.includes(' 2 = ')) {
                    splitValues = item.message?.status.split(' 2 = ');
                  }
                  return (
                    <View
                      key={item.created_at}
                      style={[
                        styles.dataActiveView,
                        {
                          backgroundColor:
                            index % 2 === 0
                              ? COLORS.lightPrimary
                              : COLORS.lightPrimary3,
                        },
                      ]}>
                      <View style={styles.mainViewDesign}>
                        <Text style={[styles.dataHistoryText]}>
                          {moment(item?.created_at).format('YYYY-MM-DD')}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text style={[styles.dataHistoryText]}>
                          {moment(item?.created_at).format('HH:mm:ss')}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text style={[styles.dataHistoryText]}>
                          {item?.source_model === 'ai_config_bot'
                            ? 'I'
                            : item?.source_model === null ||
                              item?.source_model === 'ai_config_bot_custom'
                            ? 'E'
                            : item?.source_model === 'auto_bot_config'
                            ? 'BOT'
                            : item?.source_model === 'ai_config_bot_1h'
                            ? 'B'
                            : item?.source_model === 'ai_config_bot_4h'
                            ? 'A'
                            : ''}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text style={styles.dataHistoryText}>
                          {item?.ticker}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text
                          style={[
                            styles.dataHistoryText,
                            {
                              color:
                                item?.signal == 'sell'
                                  ? COLORS.errorColor
                                  : COLORS.greenColor,
                            },
                          ]}>
                          {item?.signal == 'sell' ? 'SELL' : 'BUY'}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text
                          style={[
                            styles.dataHistoryText,
                            {
                              color:
                                item?.result === 'TP'
                                  ? '#39ff14'
                                  : item?.result === 'SL'
                                  ? '#ff3314'
                                  : item?.result === 'TRP'
                                  ? '#00008b'
                                  : '#85492e',
                            },
                          ]}>
                          {item?.result}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text style={styles.dataHistoryText}>
                          {item.stretegy_info}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text style={styles.dataHistoryText}>
                          {item.entry_price}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text style={styles.dataHistoryText}>
                          {item.take_profit}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text style={styles.dataHistoryText}>
                          {item.stoploss}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text style={[styles.dataHistoryText]}>{item.trp}</Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text style={[styles.dataHistoryText]}>
                          {moment(item?.updated_at).format('YYYY-MM-DD')}
                        </Text>
                      </View>
                      <View style={styles.mainViewDesign}>
                        <Text style={[styles.dataHistoryText]}>
                          {moment(item?.updated_at).format('HH:mm:ss')}
                        </Text>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </View>
  );
};

export default AdminNotification;
