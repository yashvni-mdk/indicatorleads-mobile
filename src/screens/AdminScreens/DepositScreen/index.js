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
import {onGetDepositDataApi} from '../../../services/Api';
import moment from 'moment';

const DepositScreen = ({navigation}) => {
  const [userRole, setUserRole] = useState('');
  const [search1, setSearch1] = useState('');
  const [notificationData, setNotificationData] = useState([]);
  const [filterDeposit, setFilterDeposit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    onGetDepositData();
    const allDataGet = async () => {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
    };
    allDataGet();
  }, []);

  const onGetDepositData = async () => {
    try {
      const responseData = await onGetDepositDataApi();

      if (responseData.data) {
        setIsLoading(!isLoading);
        setNotificationData(responseData.data.results);
        setFilterDeposit(responseData.data.results);
      }
    } catch (err) {
      console.log('Error:::', err);
    }
  };

  const capitalizeFirstLetter = string => {
    if (typeof string !== 'string' || string.length === 0) {
      return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleSearch = text => {
    setSearch1(text);
    if (text !== '') {
      const filtered = filterDeposit.filter(item =>
        item.invoice?.user?.email.toLowerCase().includes(text.toLowerCase()),
      );
      setNotificationData(filtered);
      setRefresh(!refresh);
    } else {
      setNotificationData(filterDeposit);
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
            title={'Deposit'}
            userRole={userRole}
            onPress={() => navigation.openDrawer()}
            navigation={navigation}
            notify={true}
          />
        </View>
        <View style={styles.mainView}>
          <TextInput
            value={search1}
            onChangeText={text => handleSearch(text)}
            placeholder={'Search...'}
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
                    onPress={() => {}}
                    style={[styles.optionTitleView, {width: wp(35)}]}>
                    <Text style={styles.titleText4}>{'Date'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={[styles.optionTitleView, {width: wp(64)}]}>
                    <Text style={styles.titleText4}>{'Email'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={[styles.optionTitleView, {width: wp(35)}]}>
                    <Text style={styles.titleText4}>{'Amount'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={[styles.optionTitleView, {width: wp(26)}]}>
                    <Text style={styles.titleText4}>{'Status'}</Text>
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
                      <View style={styles.dataActiveView1}>
                        <Text style={[styles.dataText4, {width: wp(35)}]}>
                          {moment(item?.created_at).format('YYYY-MM-DD')}
                        </Text>
                        <Text style={[styles.dataText4, {width: wp(64)}]}>
                          {item?.invoice?.user?.email}
                        </Text>
                        <Text style={[styles.dataText4, {width: wp(35)}]}>
                          {item?.amount_received}
                        </Text>
                        <Text style={[styles.dataText4, {width: wp(26)}]}>
                          {capitalizeFirstLetter(item?.payment_status)}
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

export default DepositScreen;
