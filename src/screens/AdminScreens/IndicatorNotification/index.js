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
import {onGetAdminFilterCommonApi, onGetExtraHistoryApi, onPostAdminSettingApi} from '../../../services/Api';
import check from '../../../images/check.png';

const IndicatorNotification = ({navigation}) => {
  const getAdminNotificationList = useSelector(
    state => state.getAdminNotificationList,
  );
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
  const [AIVisible, setAIVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [bothVisible, setBothVisible] = useState(false);
  const [pointsVisible, setPointsVisible] = useState(false);
  const [preVisible, setPreVisible] = useState(false);
  const [levelVisible, setLevelVisible] = useState(false);

  useEffect(() => {
    notificationDataGet();
    const allDataGet = async () => {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
    };
    allDataGet();
  }, []);

  const notificationDataGet = async () => {
    try {
      const data = getAdminNotificationList;
      if (data.results.length > 0) {
        setNotificationData(data.results);
        setFilterHistory(data.results);
        setNextUrl(data.next);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('notification::', err);
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
    if (from == 'AI') {
      if (AIVisible) {
        onCategoryWithoutFilterImplement();
        setAIVisible(false);
      } else {
        onCategoryFilterImplement('DAV');
        setAIVisible(true);
      }
      setAlertVisible(false);
      setBothVisible(false);
      setPointsVisible(false);
      setPreVisible(false);
      setLevelVisible(false);
    } else if (from == 'alert') {
      if (alertVisible) {
        onCategoryWithoutFilterImplement();
        setAlertVisible(false);
      } else {
        onCategoryFilterImplement('ALERT');
        setAlertVisible(true);
      }
      setAIVisible(false);
      setBothVisible(false);
      setPointsVisible(false);
      setPreVisible(false);
      setLevelVisible(false);
    } else if (from == 'both') {
      if (bothVisible) {
        onCategoryWithoutFilterImplement();
        setBothVisible(false);
      } else {
        onCategoryFilterImplement('BOTH');
        setBothVisible(true);
      }
      setAIVisible(false);
      setAlertVisible(false);
      setPointsVisible(false);
      setPreVisible(false);
      setLevelVisible(false);
    } else if (from == 'point') {
      if (pointsVisible) {
        onCategoryWithoutFilterImplement();
        setPointsVisible(false);
      } else {
        onCategoryFilterImplement('RSI');
        setPointsVisible(true);
      }
      setAIVisible(false);
      setAlertVisible(false);
      setBothVisible(false);
      setPreVisible(false);
      setLevelVisible(false);
    } else if (from == 'pre') {
      if (preVisible) {
        onCategoryWithoutFilterImplement();
        setPreVisible(false);
      } else {
        onCategoryFilterImplement('HP');
        setPreVisible(true);
      }
      setAIVisible(false);
      setAlertVisible(false);
      setBothVisible(false);
      setPointsVisible(false);
      setLevelVisible(false);
    } else if (from == 'level') {
      if (levelVisible) {
        onCategoryWithoutFilterImplement();
        setLevelVisible(false);
      } else {
        onCategoryFilterImplement('ZIG');
        setLevelVisible(true);
      }
      setAIVisible(false);
      setAlertVisible(false);
      setBothVisible(false);
      setPointsVisible(false);
      setPreVisible(false);
    }
  };

  const onCategoryFilterImplement = async text => {
    try {
      let url = `super-admin/dashboard/notifications/?type=indicator-signal-notification&page_size=100&${
        search1 != '' ? `ticker=${search1}&` : ''
      }indicator_name=${text}`;
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

  const onCategoryWithoutFilterImplement = async () => {
    try {
      let url = `super-admin/dashboard/notifications/?type=indicator-signal-notification&page_size=100&${
        search1 != '' ? `ticker=${search1}` : ''
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

  const onHandleSetting = async () => {
    try {
      let raw = JSON.stringify({
        email_button: !emailVisible,
      });
      setEmailVisible(!emailVisible);

      const settingDataIcon = await onPostAdminSettingApi(raw);
      if (settingDataIcon?.data) {
        console.log('settingData', settingDataIcon?.data);
      }
    } catch (err) {
      console.log('setting>', err);
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
      if (AIVisible) {
        modal = 'DAV';
      } else if (alertVisible) {
        modal = 'ALERT';
      } else if (bothVisible) {
        modal = 'BOTH';
      } else if (pointsVisible) {
        modal = 'RSI';
      } else if (preVisible) {
        modal = 'HP';
      } else if (levelVisible) {
        modal = 'ZIG';
      }
      let url = `super-admin/dashboard/notifications/?type=indicator-signal-notification&page_size=100&${
        text != '' ? `ticker=${text}&` : ''
      }${
        AIVisible ||
        alertVisible ||
        bothVisible ||
        pointsVisible ||
        preVisible ||
        levelVisible
          ? `indicator_name=${modal}`
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
            title={'Indicator Notification'}
            userRole={userRole}
            onPress={() => navigation.openDrawer()}
            navigation={navigation}
            notify={true}
            filterVisible={filterVisible}
            setFilterVisible={setFilterVisible}
          />
        </View>
        <View style={styles.mainView}>
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
                onValueChange={() => onHandleSetting()}
                value={emailVisible}
              />
            </View>
            <View style={styles.rowView2}>
              <Text style={styles.titleText6}>{'TW'}</Text>
              <Switch
                trackColor={{
                  false: twVisible ? COLORS.greenColor : COLORS.errorColor,
                  true: twVisible ? COLORS.greenColor : COLORS.errorColor,
                }}
                thumbColor={twVisible ? '#f4f3f4' : '#f4f3f4'}
                ios_backgroundColor={COLORS.errorColor}
                onValueChange={() => setTwVisible(!twVisible)}
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
                <Text style={styles.indicatorText}>INDICATORS</Text>

                <TouchableOpacity
                  style={[styles.optionView, {marginTop: hp(2)}]}
                  onPress={() => onFilterHandle('AI')}>
                  <View
                    style={[
                      styles.checkBoxView,
                      {
                        backgroundColor: AIVisible
                          ? COLORS.primary
                          : COLORS.white,
                      },
                    ]}>
                    <Image style={styles.rightImage} source={check} />
                  </View>
                  <Text style={styles.optionText}>AI</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionView}
                  onPress={() => onFilterHandle('alert')}>
                  <View
                    style={[
                      styles.checkBoxView,
                      {
                        backgroundColor: alertVisible
                          ? COLORS.primary
                          : COLORS.white,
                      },
                    ]}>
                    <Image style={styles.rightImage} source={check} />
                  </View>
                  <Text style={styles.optionText}>ALERT</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionView}
                  onPress={() => onFilterHandle('both')}>
                  <View
                    style={[
                      styles.checkBoxView,
                      {
                        backgroundColor: bothVisible
                          ? COLORS.primary
                          : COLORS.white,
                      },
                    ]}>
                    <Image style={styles.rightImage} source={check} />
                  </View>
                  <Text style={styles.optionText}>BOTH</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionView}
                  onPress={() => onFilterHandle('point')}>
                  <View
                    style={[
                      styles.checkBoxView,
                      {
                        backgroundColor: pointsVisible
                          ? COLORS.primary
                          : COLORS.white,
                      },
                    ]}>
                    <Image style={styles.rightImage} source={check} />
                  </View>
                  <Text style={styles.optionText}>POINTS</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionView}
                  onPress={() => onFilterHandle('pre')}>
                  <View
                    style={[
                      styles.checkBoxView,
                      {
                        backgroundColor: preVisible
                          ? COLORS.primary
                          : COLORS.white,
                      },
                    ]}>
                    <Image style={styles.rightImage} source={check} />
                  </View>
                  <Text style={styles.optionText}>PRE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionView}
                  onPress={() => onFilterHandle('level')}>
                  <View
                    style={[
                      styles.checkBoxView,
                      {
                        backgroundColor: levelVisible
                          ? COLORS.primary
                          : COLORS.white,
                      },
                    ]}>
                    <Image style={styles.rightImage} source={check} />
                  </View>
                  <Text style={styles.optionText}>LEVELS</Text>
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
                <Text style={styles.titleText4}>{'Coin'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {}}
                style={styles.optionTitleView}>
                <Text style={styles.titleText4}>{'Indicator\nName'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {}}
                style={styles.optionTitleView}>
                <Text style={styles.titleText4}>{'Price'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {}}
                style={styles.optionTitleView1}>
                <Text style={styles.titleText4}>{'Status'}</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={notificationData}
              extraData={notificationData}
              nestedScrollEnabled
              // contentContainerStyle={{paddingRight: hp(2)}}
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
                        borderTopRightRadius:
                          notificationData.length - 1 == index ? wp(3) : 0,
                        borderBottomRightRadius:
                          notificationData.length - 1 == index ? wp(3) : 0,
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
                      <Text style={styles.dataHistoryText}>
                        {item?.message?.ticker}
                      </Text>
                    </View>
                    <View style={styles.mainViewDesign}>
                      <Text style={styles.dataHistoryText}>
                        {item?.message?.indicator_name}
                      </Text>
                    </View>
                    <View style={styles.mainViewDesign}>
                      <Text style={styles.dataHistoryText}>
                        {item.message?.price}
                      </Text>
                    </View>
                    <View style={styles.optionTitleView1}>
                      <Text
                        style={[styles.dataHistoryText, {fontSize: hp(1.7)}]}>
                        {item.message?.status.includes(' 2 = ')
                          ? `${splitValues[0]}\n2 = ${splitValues[1]}`
                          : item.message?.status}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default IndicatorNotification;
