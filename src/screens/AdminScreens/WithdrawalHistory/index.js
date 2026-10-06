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
import {onGetTransactionDataApi} from '../../../services/Api';
import moment from 'moment';
import check from '../../../images/check.png';

const WithdrawalHistory = ({navigation}) => {
  const [userRole, setUserRole] = useState('');
  const [search1, setSearch1] = useState('');
  const [CHG, setCHGSort] = useState(0);
  const [notificationData, setNotificationData] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [failedVisible, setFailedVisible] = useState(false);

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
      const responseData = await onGetTransactionDataApi();

      if (responseData.data.wallvet_transaction) {
        setNotificationData(responseData.data.wallvet_transaction);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  const onFilterHandle = from => {
    if (from == 'success') {
      if (successVisible) {
        setSuccessVisible(false);
      } else {
        setSuccessVisible(true);
      }
      setFailedVisible(false);
    } else if (from == 'failed') {
      setSuccessVisible(false);
      if (failedVisible) {
        setFailedVisible(false);
      } else {
        setFailedVisible(true);
      }
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
            title={'Withdrawal History'}
            userRole={userRole}
            adminOnPress={() => {
              navigation.openDrawer();
            }}
            filterVisible={filterVisible}
            setFilterVisible={setFilterVisible}
            navigation={navigation}
            notify={true}
          />
        </View>
        <View style={styles.mainView}>
          <View style={styles.filterView}>
            <TextInput
              value={search1}
              onChangeText={text => setSearch1(text)}
              placeholder={'Search...'}
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
                <Text style={styles.indicatorText}>Status</Text>

                <TouchableOpacity
                  style={[styles.optionView, {marginTop: hp(2)}]}
                  onPress={() => onFilterHandle('success')}>
                  <View
                    style={[
                      styles.checkBoxView,
                      {
                        backgroundColor: successVisible
                          ? COLORS.primary
                          : COLORS.white,
                      },
                    ]}>
                    <Image style={styles.rightImage} source={check} />
                  </View>
                  <Text style={styles.optionText}>Success</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionView}
                  onPress={() => onFilterHandle('failed')}>
                  <View
                    style={[
                      styles.checkBoxView,
                      {
                        backgroundColor: failedVisible
                          ? COLORS.primary
                          : COLORS.white,
                      },
                    ]}>
                    <Image style={styles.rightImage} source={check} />
                  </View>
                  <Text style={styles.optionText}>Failed</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.activeView1}>
            <ScrollView
              horizontal
              nestedScrollEnabled={true}
              contentContainerStyle={{paddingBottom: hp(1)}}
              showsHorizontalScrollIndicator={false}>
              <View>
                <View style={styles.titleActiveView1}>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={[styles.optionTitleView, {width: wp(23)}]}>
                    <Text style={styles.titleText4}>{'Sr.No.'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={[styles.optionTitleView, {width: wp(25)}]}>
                    <Text style={styles.titleText4}>{'Date'}</Text>
                    {CHG === 0 || CHG === 1 ? (
                      <Image style={styles.upDownImage} source={arrowUp} />
                    ) : null}
                    {CHG === 0 || CHG === 2 ? (
                      <Image style={styles.upDownImage} source={down} />
                    ) : null}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={[styles.optionTitleView, {width: wp(55)}]}>
                    <Text style={styles.titleText4}>{'Email'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={[styles.optionTitleView, {width: wp(45)}]}>
                    <Text style={styles.titleText4}>{'Withdrawal Amount'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={[styles.optionTitleView, {width: wp(26)}]}>
                    <Text style={styles.titleText4}>{'Status'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={[styles.optionTitleView, {width: wp(70)}]}>
                    <Text style={styles.titleText4}>{'Message'}</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={notificationData}
                  extraData={notificationData}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                  // contentContainerStyle={{paddingBottom: hp(2)}}
                  initialNumToRender={1000}
                  keyExtractor={item => item.symbol}
                  ListEmptyComponent={() => (
                    <View style={{marginVertical: hp(2)}}>
                      <View style={styles.dataFoundView}>
                        <Text style={styles.dataFoundText}>
                          {'No Data Found'}
                        </Text>
                      </View>
                    </View>
                  )}
                  renderItem={({item, index}) => {
                    return (
                      <View style={styles.titleActiveView}>
                        <Text style={[styles.titleText7, {width: wp(23)}]}>
                          {index + 1}
                        </Text>
                        <Text style={[styles.titleText7, {width: wp(25)}]}>
                          {moment(item.created_at).format('YYYY-MM-DD')}
                        </Text>
                        <Text style={[styles.titleText7, {width: wp(55)}]}>
                          {item?.remarks?.email}
                        </Text>
                        <Text style={[styles.titleText7, {width: wp(45)}]}>
                          {item?.debit}
                        </Text>
                        <Text
                          style={[
                            styles.titleText7,
                            {
                              width: wp(26),
                              color:
                                item?.transaction_status == true
                                  ? COLORS.greenColor
                                  : COLORS.errorColor,
                            },
                          ]}>
                          {item?.transaction_status == true
                            ? 'Successful'
                            : 'Failed'}
                        </Text>
                        <Text style={[styles.titleText8, {width: wp(70)}]}>
                          {item?.description}
                        </Text>
                      </View>
                    );
                  }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WithdrawalHistory;
