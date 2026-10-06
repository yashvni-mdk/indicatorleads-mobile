import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  TouchableHighlight,
  Linking,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import styles from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import Header from '../../components/Header';
import {hasNotch} from 'react-native-device-info';
import {COLORS} from '../../utils';
import coin13 from '../../images/coin13.png';
import bitcoin from '../../images/bitcoin.png';
import bitcoin1 from '../../images/bitcoin1.png';
import bitcoin2 from '../../images/bitcoin2.png';
import bitcoin3 from '../../images/bitcoin3.png';
import check from '../../images/check.png';
import {
  onGetActivePackageDataApi,
  onGetPackageDataApi,
  onGetPaymentDetailsDataApi,
  onGetTransactionListApi,
  onPostGenerateInvoiceApi,
  onPostWithdrawApi,
} from '../../services/Api';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import arrowUp from '../../images/arrowUp.png';
import down from '../../images/down.png';
import {BuyPopup} from '../../components/BuyPopup';
import SubHeader from '../../components/SubHeader';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import {showMessage} from 'react-native-flash-message';
import copy from '../../images/copy.png';
import {useSelector} from 'react-redux';
import {WithdrawPopup} from '../../components/WithdrawPopup';
import {useTranslation} from 'react-i18next';

const WalletScreen = ({navigation}) => {
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const user_data = useSelector(state => state.user_data);
  const [search, setSearch] = useState('');
  const [dataActive, setDataActive] = useState([]);
  const [filterPlanHistory, setFilterPlanHistory] = useState([]);
  const [dataActiveSort, setDataActiveSort] = useState([]);
  const [planListData, setPlanListData] = useState([]);
  const [packagesActive, setPackagesActive] = useState(null);
  const [dateSort, setDateSort] = useState(0);
  const [coinSort, setCoinSort] = useState(0);
  const [amountSort, setAmountSort] = useState(0);
  const [txnIdSort, setTxnIdSort] = useState(0);
  const [statusSort, setStatusSort] = useState(0);
  const [modelVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [planId, setPlanId] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [isPressArray, setIsPressArray] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [keyStore, setKeyStore] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [referalCopy, setReferalCopy] = useState(false);
  const [allData, setAllData] = useState(null);
  const [withdrawPopup, setWithdrawPopup] = useState(false);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [referralTotal, setReferralTotal] = useState(0);
  const [totalEarning, setTotalEarning] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    onGetPackageData();
    onGetPaymentDetailsData();
    if (isFocused) {
      const interval = setInterval(onGetPaymentDetailsData, 17000);
      // Cleanup function to clear the interval
      return () => clearInterval(interval);
    }
  }, [isFocused]);

  const onGetPackageData = async () => {
    try {
      let count = await AsyncStorage.getItem('notificationCount');
      setNotificationCount(count);
      // const response = await onGetPackageDataApi();
      // if (response.data) {
      //   response.data.map((item, index) => {
      //     if (index == 1) {
      //       item.features.map((item1, index1) => {
      //         if (index1 > 0) {
      //           keyStore.push(item1.key);
      //         }
      //       });
      //     }
      //   });
      //   setPlanListData(response.data);
      // }
    } catch (err) {
      console.log('Error:', err);
    }
  };

  const onReferralCount = array => {
    const uniqueEmails = new Set();
    array.forEach(item => {
      uniqueEmails.add(item.remarks.email);
    });
    // Get the count of unique emails
    const uniqueEmailCount = uniqueEmails.size;
    console.log("Unique Email Count:", uniqueEmailCount);
    setReferralTotal(uniqueEmailCount);
  };

  const onTotalEarningCount = array => {
    let totalEarning = 0;
    array.forEach(item => {
      totalEarning = totalEarning + item.credit;
    });
    console.log("Unique Email Count:", totalEarning);
    setTotalEarning(totalEarning);
  };

  const onGetPaymentDetailsData = async () => {
    try {
      const response = await onGetTransactionListApi();
      if (response.data) {
        setAllData(response.data);
        setDataActive(response.data?.wallvet_transaction);
        onReferralCount(response.data?.wallvet_transaction);
        onTotalEarningCount(response.data?.wallvet_transaction);
        setFilterPlanHistory(response.data?.wallvet_transaction);
        setIsPressArray(Array(response.data?.wallvet_transaction.length).fill(false));
        setDataActiveSort(response.data?.wallvet_transaction);
      }
    } catch (err) {
      console.log('Error:', err);
    }
  };

  const customSort = (a, b) => {
    // Convert strings to lowercase for case-insensitive comparison
    const stringA = a.remarks?.email.toLowerCase();
    const stringB = b.remarks?.email.toLowerCase();

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

  const firstSorting = async from => {
    if (from === 'Date') {
      if (dateSort === 2) {
        setCoinSort(0);
        setDateSort(0);
        setAmountSort(0);
        setStatusSort(0);
        setTxnIdSort(0);
      } else {
        setDateSort(dateSort + 1);
        setCoinSort(0);
        setAmountSort(0);
        setStatusSort(0);
        setTxnIdSort(0);
      }
      if (dateSort + 1 === 1) {
        const sortedDates = dataActive
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .reverse();
        setDataActive(sortedDates);
      } else if (dateSort + 1 === 2) {
        const sortedDates = dataActive.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at),
        );
        setDataActive(sortedDates);
      } else {
        setDataActive(dataActiveSort);
      }
    } else if (from === 'Coin') {
      if (coinSort === 2) {
        setCoinSort(0);
        setDateSort(0);
        setAmountSort(0);
        setStatusSort(0);
        setTxnIdSort(0);
      } else {
        setCoinSort(coinSort + 1);
        setDateSort(0);
        setAmountSort(0);
        setStatusSort(0);
        setTxnIdSort(0);
      }
      if (coinSort + 1 === 1) {
        const sortedDates = dataActive.sort(customSort).reverse();
        setDataActive(sortedDates);
      } else if (coinSort + 1 === 2) {
        const sortedDates = dataActive.sort(customSort);
        setDataActive(sortedDates);
      } else {
        setDataActive(dataActiveSort);
      }
    } else if (from === 'Amount') {
      if (amountSort === 2) {
        setCoinSort(0);
        setDateSort(0);
        setAmountSort(0);
        setStatusSort(0);
        setTxnIdSort(0);
      } else {
        setAmountSort(amountSort + 1);
        setCoinSort(0);
        setDateSort(0);
        setStatusSort(0);
        setTxnIdSort(0);
      }
      if (amountSort + 1 === 1) {
        const sortedDates = dataActive
          .sort((a, b) => a.remarks?.product_price - b.remarks?.product_price)
          .reverse();
        setDataActive(sortedDates);
      } else if (amountSort + 1 === 2) {
        const sortedDates = dataActive.sort(
          (a, b) => a.remarks?.product_price - b.remarks?.product_price,
        );
        setDataActive(sortedDates);
      } else {
        setDataActive(dataActiveSort);
      }
    } else if (from === 'TxnId') {
      if (txnIdSort === 2) {
        setCoinSort(0);
        setDateSort(0);
        setAmountSort(0);
        setStatusSort(0);
        setTxnIdSort(0);
      } else {
        setTxnIdSort(txnIdSort + 1);
        setCoinSort(0);
        setDateSort(0);
        setAmountSort(0);
        setStatusSort(0);
      }
      if (txnIdSort + 1 === 1) {
        let sortedDates = [];
        filterPlanHistory.map(item => {
          if (item.credit > 0) {
            sortedDates.push(item);
          }
        });
        setDataActive(sortedDates);
      } else if (txnIdSort + 1 === 2) {
        let sortedDates = [];
        filterPlanHistory.map(item => {
          if (item.debit > 0) {
            sortedDates.push(item);
          }
        });
        setDataActive(sortedDates);
      } else {
        setDataActive(dataActiveSort);
      }
    } else if (from === 'Status') {
      if (statusSort === 2) {
        setStatusSort(0);
        setCoinSort(0);
        setDateSort(0);
        setAmountSort(0);
        setTxnIdSort(0);
      } else {
        setStatusSort(statusSort + 1);
        setCoinSort(0);
        setDateSort(0);
        setAmountSort(0);
        setTxnIdSort(0);
      }
      if (statusSort + 1 === 1) {
        const sortedDates = dataActive.sort(
          (a, b) => a.remarks?.referral_balance - b.remarks?.referral_balance,
        );
        setDataActive(sortedDates);
      } else if (statusSort + 1 === 2) {
        const sortedDates = dataActive
          .sort((a, b) => a.remarks?.referral_balance - b.remarks?.referral_balance)
          .reverse();
        setDataActive(sortedDates);
      } else {
        setDataActive(dataActiveSort);
      }
    }
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

  const handleSearch = text => {
    setSearch(text);
    if (text !== '') {
      const filtered = filterPlanHistory.filter(item =>
        item.remarks?.email.toLowerCase().includes(text.toLowerCase()),
      );
      setDataActive(filtered);
      setRefresh(!refresh);
    } else {
      setDataActive(filterPlanHistory);
      setRefresh(!refresh);
    }
  };

  const onSubmitWithdrawal = async () => {
    setErrorVisible(false);
    setLoading(true);
    try {
      if (amount == '') {
        setLoading(false);
        setErrorVisible(true);
        setErrorMessage(t('all_fields_are_necessary'));
      } else if (address == '') {
        setLoading(false);
        setErrorVisible(true);
        setErrorMessage(t('all_fields_are_necessary'));
      } else {
        console.log('get Value>>>>', parseFloat(amount), address);
        let raw = JSON.stringify({
          amount: parseFloat(amount),
          wallet_address: address,
        });
        const responseData = await onPostWithdrawApi(raw);
        setLoading(false);
        console.log('Get ERropr::::::', responseData.data);
        if (responseData.data) {
          setWithdrawPopup(false);
          showMessage({
            message: t('successfully_withdraw'),
            type: 'success',
            duration: 3000,
          });
          onGetPaymentDetailsData();
        }
      }
    } catch (err) {
      setLoading(false);
      console.log('error', err.response.data.detail);
      setErrorVisible(true);
      setErrorMessage(err.response.data.detail);
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
          {/* <SubHeader title={'Plans'} onPress={() => navigation.goBack()} /> */}
          <Header
            title={t('wallet')}
            notificationPress={() =>
              navigation.navigate('NotificationScreen', {
                count: notificationCount,
              })
            }
            notificationCount={notificationCount}
            backVisible={true}
            onPress={() => navigation.goBack()}
            navigation={navigation}
          />
        </View>
        <View style={styles.mainView}>
          <KeyboardAwareScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(15)}}>
            <View style={styles.walletBalanceView}>
              <Text
                style={styles.linkText}
                onPress={() => {
                  setReferalCopy(true);
                  Clipboard.setString(
                    `https://indicatorleads.com/login?referralId=${user_data?.referal_code}`,
                  );
                  showMessage({
                    message: t('successfully_copied'),
                    type: 'success',
                    duration: 3000,
                  });
                }}>
                {`https://indicatorleads.com/login?referralId=${user_data?.referal_code}  `}
                {user_data?.referal_code != '' && (
                  <TouchableOpacity
                    onPress={() => {
                      setReferalCopy(true);
                      Clipboard.setString(
                        `https://indicatorleads.com/login?referralId=${user_data?.referal_code}`,
                      );
                      showMessage({
                        message: t('successfully_copied'),
                        type: 'success',
                        duration: 3000,
                      });
                    }}>
                    <Image
                      source={copy}
                      style={{
                        height: hp(2),
                        width: wp(4),
                        resizeMode: 'contain',
                        tintColor: referalCopy
                          ? COLORS.greenColor
                          : COLORS.white,
                        marginTop: hp(1),
                      }}
                    />
                  </TouchableOpacity>
                )}
              </Text>
              <Text style={styles.balanceText}>
                {t('wallet_balance')}
                <Text style={styles.walletBalance}>
                  ${allData?.main_balance != null ? parseFloat(allData?.main_balance).toFixed(2) : '0.00'}
                </Text>
              </Text>
              <TouchableOpacity
                style={styles.withdrawButton}
                onPress={() => setWithdrawPopup(true)}>
                <Text style={styles.withdrawText}>{t('withdrawal')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.referralsView}>
              <Text style={styles.referralsText}>{t('total_referrals')}</Text>
              <Text style={styles.referralsBalanceText}>{referralTotal}</Text>
            </View>
            <View style={styles.totalEarningView}>
              <Text style={styles.totalEarningText}>{t('total_earning')}<Text style={styles.usdText}>{'[$]'}</Text></Text>
              <Text style={styles.totalEarningBalanceText}>{totalEarning}</Text>
            </View>
            {/* <View style={styles.extraView} /> */}
            <TextInput
              value={search}
              onChangeText={text => handleSearch(text)}
              placeholder={t('search_coin')}
              placeholderTextColor={COLORS.greyColor}
              style={styles.searchText}
            />

            <View style={styles.activeView}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                  <View style={styles.titleActiveView}>
                    <TouchableOpacity
                      onPress={() => firstSorting('Date')}
                      style={[styles.optionTitleView, {width: wp(25)}]}>
                      <Text style={styles.titleText1}>{t('small_date')}</Text>
                      {dateSort === 0 || dateSort === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {dateSort === 0 || dateSort === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => firstSorting('Coin')}
                      style={[styles.optionTitleView, {width: wp(70)}]}>
                      <Text style={styles.titleText1}>{t('user_name')}</Text>
                      {coinSort === 0 || coinSort === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {coinSort === 0 || coinSort === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => firstSorting('Amount')}
                      style={[styles.optionTitleView, {width: wp(27)}]}>
                      <Text style={styles.titleText1}>{t('plan')}</Text>
                      {amountSort === 0 || amountSort === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {amountSort === 0 || amountSort === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => firstSorting('TxnId')}
                      style={[styles.optionTitleView, {width: wp(35)}]}>
                      <Text style={styles.titleText1}>{t('credit_debit')}</Text>
                      {txnIdSort === 0 || txnIdSort === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {txnIdSort === 0 || txnIdSort === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => firstSorting('Status')}
                      style={[styles.optionTitleView, {width: wp(35)}]}>
                      <Text style={styles.titleText1}>
                        {t('total_balance')}
                      </Text>
                      {statusSort === 0 || statusSort === 1 ? (
                        <Image style={styles.upDownImage} source={arrowUp} />
                      ) : null}
                      {statusSort === 0 || statusSort === 2 ? (
                        <Image style={styles.upDownImage} source={down} />
                      ) : null}
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={dataActive}
                    extraData={dataActive}
                    initialNumToRender={5000000}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                    // contentContainerStyle={{paddingBottom: hp(2)}}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={() => (
                      <View style={{marginVertical: hp(10)}}>
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
                      return (
                        <TouchableHighlight
                          onShowUnderlay={() => handleShowUnderlay(index)}
                          activeOpacity={1}
                          onPress={() => console.log('hello')}
                          underlayColor={COLORS.lightPrimary2}>
                          <View
                            style={[
                              styles.dataActiveView,
                              {
                                backgroundColor: isPressArray[index]
                                  ? COLORS.lightPrimary2
                                  : COLORS.white,
                              },
                            ]}
                            key={item.id}>
                            <Text style={[styles.dataText1, {width: wp(25)}]}>
                              {moment(item?.updated_at).format('YYYY-MM-DD')}
                            </Text>
                            <Text style={[styles.dataText5, {width: wp(70)}]}>
                              {item.remarks?.email}
                            </Text>
                            <Text style={[styles.dataText1, {width: wp(30)}]}>
                              $ {item.remarks?.product_price}
                            </Text>
                            <Text
                              style={[
                                styles.dataText1,
                                {
                                  width: wp(35),
                                  color:
                                    item.credit > 0
                                      ? COLORS.greenColor
                                      : COLORS.errorColor,
                                },
                              ]}>
                              $ {item.credit > 0 ? item.credit : item.debit}
                            </Text>
                            <Text
                              style={[
                                styles.dataText1,
                                {
                                  width: wp(35),
                                  color:
                                    item.credit > 0
                                      ? COLORS.greenColor
                                      : COLORS.errorColor,
                                },
                              ]}>
                              $ {item.remarks?.referral_balance}
                            </Text>
                          </View>
                        </TouchableHighlight>
                      );
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
      <BuyPopup
        modelVisible={modelVisible}
        setModelVisible={setModalVisible}
        onPress={() => onBuyClick()}
        isLoading={isLoading}
        setSelectedItem={value => setSelectedItem(value)}
      />
      <WithdrawPopup
        modelVisible={withdrawPopup}
        setModelVisible={() => {
          setWithdrawPopup(false);
          setAddress('');
          setAmount('');
          setErrorVisible(false);
        }}
        address={address}
        setAddress={text => setAddress(text)}
        amount={amount}
        setAmount={text => setAmount(text)}
        errorVisible={errorVisible}
        errorMessage={errorMessage}
        onPress={() => onSubmitWithdrawal()}
        loading={loading}
      />
    </View>
  );
};

export default WalletScreen;
