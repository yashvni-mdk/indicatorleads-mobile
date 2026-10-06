import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
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
import chart from '../../../images/chart.png';
import addFriend from '../../../images/addFriend.png';
import coinStack from '../../../images/coinStack.png';
import moneyCoin from '../../../images/moneyCoin.png';
import people from '../../../images/people.png';
import recession from '../../../images/recession.png';
import {useSelector, useDispatch} from 'react-redux';
import {
  onGetBinanceDataApi,
  onGetFutureYahooTickerApi,
  onGetNotificationStatusApi,
  onGetPmsLastLeadsApi,
  onGetSpot1hPriceStatusApi,
  onGetSpot4hPriceStatusApi,
  onGetSpotCustomPriceStatusApi,
  onGetSpotPmsLastLeadsApi,
  onGetSpotPriceStatusApi,
  onGetSpotYahooTickerApi,
  onGetTickerDataApi,
} from '../../../services/Api';
import {
  fetchAdmin1hSpotPriceStatus,
  fetchAdmin4hSpotPriceStatus,
  fetchAdminCustomPrice,
  fetchAdminFutureYahooTicker,
  fetchAdminPmsLastLead,
  fetchAdminSpotPmsLastLead,
  fetchAdminSpotPriceStatus,
  fetchBinanceData,
  fetchNotificationData,
  fetchTickerData,
} from '../../../redux/reducer';

const DashboardScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const getAdminDashboardList = useSelector(
    state => state.getAdminDashboardList,
  );
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    getAllData();
    const allDataGet = async () => {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
    };
    allDataGet();
  }, []);

  const getAllData = async () => {
    try {
      try {
        const pmsLastLead = await onGetPmsLastLeadsApi();
        if (pmsLastLead.data) {
          dispatch(fetchAdminPmsLastLead(pmsLastLead.data));
        }
      } catch (err) {
        console.log('pmsLastLead::', err);
      }
      try {
        console.log('onGetTickerDataApi::');
        const response5 = await onGetTickerDataApi();
        if (response5.data?.data) {
          dispatch(fetchTickerData(response5.data?.data));
        }
      } catch (err) {
        console.log('onGetTickerDataApi::', err);
      }
      try {
        const responseNotification = await onGetNotificationStatusApi();
        if (responseNotification.data) {
          dispatch(fetchNotificationData(responseNotification.data));
        }
      } catch (err) {
        console.log('responseNotification::', err);
      }
      try {
        console.log('onGetBinanceDataApi::');
        const response6 = await onGetBinanceDataApi();
        if (response6.data) {
          dispatch(fetchBinanceData(response6.data));
        }
      } catch (err) {
        console.log('onGetBinanceDataApi::', err);
      }
      try {
        const pmsLastLead = await onGetSpotPmsLastLeadsApi();
        if (pmsLastLead.data) {
          dispatch(fetchAdminSpotPmsLastLead(pmsLastLead.data));
        }
      } catch (err) {
        console.log('pmsLastLead::', err);
      }
      console.log('onGetFutureYahooTickerApi::');
      const response6 = await onGetSpotYahooTickerApi();
      if (response6.data) {
        dispatch(fetchAdminFutureYahooTicker(response6.data));
      }

      console.log('onGetSpotPriceStatusApi::');
      const SpotPriceStatus = await onGetSpotPriceStatusApi();
      if (SpotPriceStatus.data) {
        dispatch(fetchAdminSpotPriceStatus(SpotPriceStatus.data));
      }

      console.log('onGetSpotCustomPriceStatusApi::');
      const SpotCustomPriceStatus = await onGetSpotCustomPriceStatusApi();
      if (SpotCustomPriceStatus.data) {
        dispatch(fetchAdminCustomPrice(SpotCustomPriceStatus.data));
      }

      console.log('onGetSpot4hPriceStatusApi::');
      const Spot4hPriceStatus = await onGetSpot4hPriceStatusApi();
      if (Spot4hPriceStatus.data) {
        dispatch(fetchAdmin4hSpotPriceStatus(Spot4hPriceStatus.data));
      }

      console.log('onGetSpot1hPriceStatusApi::');
      const Spot1hPriceStatus = await onGetSpot1hPriceStatusApi();
      if (Spot1hPriceStatus.data) {
        dispatch(fetchAdmin1hSpotPriceStatus(Spot1hPriceStatus.data));
      }
    } catch (err) {
      console.log('Error::', err);
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
            title={'Dashboard'}
            userRole={userRole}
            onPress={() => navigation.openDrawer()}
            navigation={navigation}
            notify={true}
          />
        </View>
        <View style={styles.mainView}>
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{width: '100%'}}
            contentContainerStyle={{paddingBottom: hp(4)}}>
            {getAdminDashboardList.map((item, index) => {
              console.log('get Value:::', item.key);
              {/* let backgroundColor = '';
              let color = '';
              if (item?.key == 'total_user') {
                backgroundColor = '#FFF7D7';
                color = COLORS.goldenColor;
              } else if (item?.key == 'today_purchase') {
                backgroundColor = '#FFF7D7';
                color = COLORS.orangeColor;
              } else if (item?.key == 'new_member') {
                backgroundColor = 'rgb(255,235,242)';
                color = COLORS.pinkColor;
              } else if (item?.key == 'ai_active_trades') {
                backgroundColor = 'rgb(219,223,248)';
                color = COLORS.blueColor;
              } else if (item?.key == 'active_total_profit') {
                backgroundColor = 'rgb(228,217,241)';
                color = COLORS.purpleColor;
              } else if (item?.key == 'active_total_loss') {
                backgroundColor = 'rgb(222,252,252)';
                color = COLORS.lightBlueColor;
              } */
              }
              return (
                <View
                  style={[
                    styles.boxView,
                    {backgroundColor: 'rgb(253,234,224)'},
                  ]}>
                  <Text style={[styles.optionText, {color: COLORS.apiError}]}>
                    {item?.name}
                  </Text>
                  <View style={styles.subViews}>
                    <View
                      style={[
                        styles.roundView,
                        {backgroundColor: COLORS.white},
                      ]}>
                      <Image
                        source={{uri: item?.icon}}
                        style={styles.iconStyle1}
                      />
                    </View>
                    <Text style={[styles.optionText, {color: COLORS.apiError}]}>
                      {item?.value}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default DashboardScreen;
