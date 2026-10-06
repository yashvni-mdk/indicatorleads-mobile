import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Modal,
  RefreshControl,
  TouchableHighlight,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {useIsFocused} from '@react-navigation/native';
import styles from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../../components/Pixel/index';
import Header from '../../../components/Header';
import {hasNotch} from 'react-native-device-info';
import {COLORS, Fonts} from '../../../utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import deleteIcon from '../../../images/delete.png';
import draw from '../../../images/draw.png';
import {EditPopup} from '../../../components/EditPopup';
import {
  onDeleteIndicatorAlertDataApi,
  onGetAdminIndicatorAlertDataApi,
  onPutIndicatorAlertApi,
} from '../../../services/Api';
import {DeleteAlertPopup} from '../../../components/DeleteAlertPopup';
import {fetchAdminIndicatorAlertList} from '../../../redux/reducer';

const IndicatorAlertScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const getAdminIndicatorAlert = useSelector(
    state => state.getAdminIndicatorAlert,
  );
  const textInputRef = useRef();
  const {t} = useTranslation();
  const scrollRef = useRef(null);
  const [userRole, setUserRole] = useState('');
  const [search, setSearch] = useState('');
  const [balanceData, setBalanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPressArray1, setIsPressArray1] = useState([]);
  const [dataActiveSort, setDataActiveSort] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [smallerData, setSmallerData] = useState('');
  const [gratterData, setGratterData] = useState('');
  const [selectCoin, setSelectCoin] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);

  useEffect(() => {
    getAllData();
    const allDataGet = async () => {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
    };
    allDataGet();
  }, []);

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

  const getAllData = async () => {
    try {
      const sortedDates = getAdminIndicatorAlert.sort(customSort);
      setBalanceData(sortedDates);
      setDataActiveSort(sortedDates);
      setRefresh(!refresh);
    } catch (err) {
      console.log('Error:::', err);
    }
  };

  const handleSearch = async text => {
    setSearch(text);
    if (text !== '') {
      let allData = dataActiveSort;
      const filtered = allData.filter(item =>
        item.ticker.toLowerCase().includes(text.toLowerCase()),
      );
      setBalanceData(filtered);
      setRefresh(!refresh);
    } else {
      setBalanceData(dataActiveSort);
      setRefresh(!refresh);
    }
  };

  const hasPrefix = (str, prefix) => {
    return str.startsWith(prefix);
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

  const onHandleEdit = async () => {
    try {
      let raw = JSON.stringify({
        gratter_than_price: gratterData != '' ? parseFloat(gratterData) : null,
        seller_than_price: smallerData != '' ? parseFloat(smallerData) : null,
      });
      const resposeEditValue = await onPutIndicatorAlertApi(selectCoin.id, raw);
      console.log('Get Response>>', resposeEditValue);
      if (resposeEditValue) {
        setModalVisible(false);
        const indicatorAlertResponse = await onGetAdminIndicatorAlertDataApi();
        if (indicatorAlertResponse.data) {
          const sortedDates = indicatorAlertResponse.data.sort(customSort);
          setBalanceData(sortedDates);
          setDataActiveSort(sortedDates);
          setRefresh(!refresh);
          dispatch(fetchAdminIndicatorAlertList(indicatorAlertResponse.data));
        }
      }
      setModalVisible(false);
    } catch (err) {
      setModalVisible(false);
      console.log('Error:::', err);
    }
  };

  const onHandleDelete = async () => {
    try {
      let array = [];
      const resposeEditValue = await onDeleteIndicatorAlertDataApi(selectCoin.id);
      if (resposeEditValue) {
        setBalanceData(prevData => {
          return prevData.filter(item => item.id != selectCoin.id);
        });
        setDataActiveSort(prevData => {
          return prevData.filter(item => item.id != selectCoin.id);
        });
        setRefresh(!refresh);
        console.log('Get Response>>', resposeEditValue);
      }
      setDeletePopup(false);
    } catch (err) {
      setDeletePopup(false);
      console.log('Error:::', err);
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
            title={'indicator alert'}
            userRole={userRole}
            onPress={() => navigation.openDrawer()}
            navigation={navigation}
            notify={true}
          />
        </View>
        <View style={styles.mainView}>
          <KeyboardAwareScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(12)}}>
            <TextInput
              ref={textInputRef}
              value={search}
              onChangeText={text => handleSearch(text)}
              placeholder={t('search_coin')}
              placeholderTextColor={COLORS.greyColor}
              style={styles.searchText}
            />
            <ScrollView>
              {balanceData.length > 0 ? (
                <View style={styles.headingView}>
                  <TouchableOpacity style={[styles.heading]}>
                    <Text style={styles.headingText}>{t('coins')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.heading1]}>
                    <Text style={styles.headingText}>{'Greater'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.heading1]}>
                    <Text style={styles.headingText}>{'Smaller'}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.headingView}>
                  <TouchableOpacity style={[styles.heading, {width: '40%'}]}>
                    <Text style={styles.headingText}>{t('coins')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.heading1, {width: '30%'}]}>
                    <Text style={styles.headingText}>{'Greater'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.heading1, {width: '30%'}]}>
                    <Text style={styles.headingText}>{'Smaller'}</Text>
                  </TouchableOpacity>
                </View>
              )}
              {balanceData.length > 0 ? (
                balanceData.map((item, index) => {
                  const originalNumber = parseFloat(item?.gratter_than_price);
                  const formattedNumber = originalNumber
                    .toFixed(10)
                    .replace(/\.?0*$/, '');
                  const originalNumber1 = parseFloat(item?.seller_than_price);
                  const formattedNumber1 = originalNumber1
                    .toFixed(10)
                    .replace(/\.?0*$/, '');
                  return (
                    <TouchableHighlight
                      // onHideUnderlay={() => handleHideUnderlay1(index)}
                      onShowUnderlay={() => handleShowUnderlay1(index)}
                      activeOpacity={1}
                      onPress={() => console.log('hello')}
                      underlayColor={COLORS.lightGreen1}>
                      <View
                        style={[
                          styles.headingView,
                          {
                            backgroundColor: isPressArray1[index]
                              ? COLORS.lightGreen1
                              : COLORS.white,
                          },
                        ]}>
                        <View style={styles.heading}>
                          <Text style={styles.coinText}>{item.ticker}</Text>
                        </View>
                        <View style={styles.heading1}>
                          <Text style={styles.coinText1}>
                            {formattedNumber != 'NaN' ? formattedNumber : ''}
                            {/* {item.gratter_than_price != null
                              ? parseFloat(item.gratter_than_price).toFixed(2)
                              : ''} */}
                          </Text>
                        </View>
                        <View style={styles.heading1}>
                          <Text style={styles.coinText1}>
                            {formattedNumber1 != 'NaN' ? formattedNumber1 : ''}
                            {/* {item.seller_than_price != null
                              ? parseFloat(item.seller_than_price).toFixed(2)
                              : ''} */}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            setSmallerData(
                              formattedNumber1 != 'NaN' ? formattedNumber1 : '',
                            );
                            setGratterData(
                              formattedNumber != 'NaN' ? formattedNumber : '',
                            );
                            setSelectCoin(item);
                            setModalVisible(true);
                          }}>
                          <Image style={styles.imageView} source={draw} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectCoin(item);
                            setDeletePopup(true);
                          }}>
                          <Image
                            style={styles.imageView1}
                            source={deleteIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableHighlight>
                  );
                })
              ) : (
                <View style={{marginVertical: hp(5)}}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        paddingTop: 15,
                        color: COLORS.primary,
                        fontSize: 16,
                      }}>
                      {'No Records Available'}
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </KeyboardAwareScrollView>
        </View>
      </View>
      <EditPopup
        modelVisible={modalVisible}
        setModelVisible={setModalVisible}
        amount={smallerData}
        setAmount={setSmallerData}
        address={gratterData}
        setAddress={setGratterData}
        onPress={() => onHandleEdit()}
        selectedCoin={selectCoin}
        loading={loading}
      />
      <DeleteAlertPopup
        modelVisible={deletePopup}
        setModelVisible={setDeletePopup}
        title={`Are You Sure You Want To Delete ${selectCoin?.ticker}?`}
        firstButtonTitle={t('cancel')}
        secondButtonTitle={t('delete')}
        firstButtonClick={() => setDeletePopup(false)}
        secondButtonClick={() => onHandleDelete()}
      />
    </View>
  );
};

export default IndicatorAlertScreen;
