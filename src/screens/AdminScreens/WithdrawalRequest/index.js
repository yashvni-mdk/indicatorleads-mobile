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
import {
  onPostTransactionApi,
  onRequestTransactionDataApi,
} from '../../../services/Api';
import moment from 'moment';
import check from '../../../images/check.png';
import close from '../../../images/close.png';
import {WithdrawRequestPopup} from '../../../components/WithdrawRequestPopup';

const WithdrawalRequest = ({navigation}) => {
  const [userRole, setUserRole] = useState('');
  const [search1, setSearch1] = useState('');
  const [CHG, setCHGSort] = useState(0);
  const [notificationData, setNotificationData] = useState([1]);
  const [modelVisible, setModelVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [id, setId] = useState('');
  const [from, setFrom] = useState('');

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
      const responseData = await onRequestTransactionDataApi();

      if (responseData.data.wallvet_transaction) {
        setNotificationData(responseData.data.wallvet_transaction);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (address == '') {
        setErrorVisible(true);
      } else {
        const requestBody = JSON.stringify({
          is_filled: true,
          description: address,
          transaction_status: from == 'success' ? true : false,
        });

        const response = await onPostTransactionApi(id, requestBody);
        if (response.data.status === 200) {
          setErrorVisible(false);
        }
      }
    } catch (err) {
      setErrorVisible(true);
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
            title={'Withdrawal Request'}
            userRole={userRole}
            onPress={() => navigation.openDrawer()}
            navigation={navigation}
            notify={true}
          />
        </View>
        <View style={styles.mainView}>
          <TextInput
            value={search1}
            onChangeText={text => setSearch1(text)}
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
                    <Text style={styles.titleText4}>{'Total balance'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={[styles.optionTitleView, {width: wp(45)}]}>
                    <Text style={styles.titleText4}>{'Withdrawal Amount'}</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={notificationData}
                  extraData={notificationData}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                  // contentContainerStyle={{paddingBottom: hp(2)}}
                  initialNumToRender={500000}
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
                          {item?.remarks?.mail_balance}
                        </Text>
                        <Text style={[styles.titleText7, {width: wp(45)}]}>
                          {item?.remarks?.debit}
                        </Text>
                        <View
                          style={[
                            {
                              width: wp(15),
                              alignItems: 'center',
                              justifyContent: 'center',
                            },
                          ]}>
                          <TouchableOpacity
                            onPress={() => {
                              setModelVisible(true);
                              setId(item.id);
                              setFrom('success');
                            }}>
                            <Image style={styles.checkIcon} source={check} />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={[
                            {
                              width: wp(15),
                              alignItems: 'center',
                              justifyContent: 'center',
                            },
                          ]}>
                          <TouchableOpacity
                            onPress={() => {
                              setModelVisible(true);
                              setId(item.id);
                              setFrom('close');
                            }}>
                            <Image style={styles.checkIcon1} source={close} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
      <WithdrawRequestPopup
        title={
          from == 'success'
            ? 'Set Status To Be Successful'
            : 'Set Status To Be Failed'
        }
        modelVisible={modelVisible}
        setModelVisible={setModelVisible}
        onPress={() => handleSubmit()}
        address={address}
        setAddress={text => {
          setAddress(text);
          setErrorVisible(false);
        }}
        errorVisible={errorVisible}
      />
    </View>
  );
};

export default WithdrawalRequest;
