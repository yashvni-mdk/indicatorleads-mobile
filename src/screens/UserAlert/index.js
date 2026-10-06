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
import {portraitStyles, landscapeStyles} from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import Header from '../../components/Header';
import {hasNotch} from 'react-native-device-info';
import {COLORS, Fonts} from '../../utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import arrowUp from '../../images/arrowUp.png';
import down from '../../images/down.png';
import PredictionSkeleton from '../../components/PredictionSkeleton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FilterOptionPopup} from '../../components/FilterOptionPopup';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import debounce from 'lodash/debounce';
import {
  onCustomerDeleteIndicatorAlertDataApi,
  onCustomerPutIndicatorAlertApi,
  onGetCustomerIndicatorAlertDataApi,
  onGetSpotBalanceApi,
  onGetSpotTickers,
  onPostCustomerTickerSettingApi,
} from '../../services/Api';
import moment from 'moment';
import SelectDropdown from 'react-native-select-dropdown';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import deleteIcon from '../../images/delete.png';
import draw from '../../images/draw.png';
import {EditPopup} from '../../components/EditPopup';
import {DeleteAlertPopup} from '../../components/DeleteAlertPopup';
import {ActivePlanPopup} from '../../components/ActivePlanPopup';
import {useTheme} from '../../utils/ThemeProvider';
import useOrientation from '../../components/OrientationComponent';

const direction = ['Smaller than', 'Greater than'];

const UserAlert = ({navigation}) => {
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const textInputRef = useRef();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const percentageStatusData = useSelector(state => state.percentageStatusData);
  const user_data = useSelector(state => state.user_data);
  const getBinanceApiError = useSelector(state => state.getBinanceApiError);
  const isFocused = useIsFocused();
  const scrollRef = useRef(null);
  const [search, setSearch] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [balanceData, setBalanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPressArray1, setIsPressArray1] = useState([]);
  const [coinSort, setCoinSort] = useState(0);
  const [amountSort, setAmountSort] = useState(0);
  const [dataActiveSort, setDataActiveSort] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [defaultValueBuy, setDefaultValueBuy] = useState('');
  const [directionValue, setDirectionValue] = useState('');
  const [spotBalanceList, setSpotBalanceList] = useState([]);
  const [price, setPrice] = useState('50');
  const [buyError, setBuyError] = useState(false);
  const [buyMessage, setBuyMessage] = useState('');
  const [smallerData, setSmallerData] = useState('');
  const [gratterData, setGratterData] = useState('');
  const [selectCoin, setSelectCoin] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [activatePopup, setActivatePopup] = useState(false);
  const [keyPopup, setKeyPopup] = useState(false);
  const [activePackage, setActivePackage] = useState(1);
  const [apiErrorVisible, setApiErrorVisible] = useState(false);

  useEffect(() => {
    SpotData();
    getAllData();
  }, []);

  const removePrefix = (str, prefix) => {
    if (str) {
      const lastIndex = str.lastIndexOf(prefix);
      if (lastIndex !== -1) {
        return str.slice(0, lastIndex) + str.slice(lastIndex + prefix.length);
      }
    }
    return str;
  };

  const customSort1 = (a, b) => {
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

  const SpotData = async () => {
    try {
      if (getBinanceApiError != '') {
        setApiErrorVisible(true);
      }
      const data = await AsyncStorage.getItem('timePeriod');
      setActivePackage(parseFloat(data));
      let count = await AsyncStorage.getItem('notificationCount');
      setNotificationCount(count);
      const response1 = await onGetSpotTickers();
      let array1 = [];
      response1.data.data.map(item => {
        array1.push(removePrefix(item, 'USDT'));
      });
      // setAllTickerData(response.data.data);
      setSpotBalanceList(array1);
    } catch (err) {
      console.log('Error', err);
    }
  };

  const getAllData = async () => {
    try {
      const response = await onGetCustomerIndicatorAlertDataApi();
      console.log('get Response:::', response.data);
      const sortedDates = response.data.sort(customSort1);
      setBalanceData(sortedDates);
      setDataActiveSort(sortedDates);
      setIsPressArray1(Array(sortedDates.length).fill(false));
      setLoading(!loading);
    } catch (err) {
      console.log('err::', err);
    }
  };

  const handleSearch = async text => {
    setSearch(text);
    if (text !== '') {
      let allData = dataActiveSort;
      const filtered = allData.filter(item =>
        item.asset.toLowerCase().includes(text.toLowerCase()),
      );
      setBalanceData(filtered);
      setRefresh(!refresh);
    } else {
      setBalanceData(dataActiveSort);
      setRefresh(!refresh);
    }
  };

  const handleFocus = debounce(() => {
    textInputRef.current.focus();
  }, 300);

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

  const customSort = (a, b) => {
    // const aValue = removePrefix(a?.asset, 'LD');
    // const bValue = removePrefix(b?.asset, 'LD');
    // Convert strings to lowercase for case-insensitive comparison
    const stringA = a.asset.toLowerCase();
    const stringB = b.asset.toLowerCase();

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

  const firstSorting = from => {
    if (from === 'coin') {
      if (coinSort === 2) {
        setCoinSort(0);
        setAmountSort(0);
      } else {
        setCoinSort(coinSort + 1);
        setAmountSort(0);
      }
      if (coinSort + 1 === 1) {
        const sortedDates = balanceData.sort(customSort).reverse();
        setBalanceData(sortedDates);
      } else if (coinSort + 1 === 2) {
        const sortedDates = balanceData.sort(customSort);
        setBalanceData(sortedDates);
      } else {
        setBalanceData(dataActiveSort);
      }
    } else if (from === 'amount') {
      if (amountSort === 2) {
        setCoinSort(0);
        setAmountSort(0);
      } else {
        setAmountSort(amountSort + 1);
        setCoinSort(0);
      }
      if (amountSort + 1 === 1) {
        const sortedDates = balanceData
          .sort((a, b) => a.free - b.free)
          .reverse();
        setBalanceData(sortedDates);
      } else if (amountSort + 1 === 2) {
        const sortedDates = balanceData.sort((a, b) => a.free - b.free);
        setBalanceData(sortedDates);
      } else {
        setBalanceData(dataActiveSort);
      }
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
          gratter_than_price: directionValue == 'Greater than' ? price : '0.00',
          seller_than_price: directionValue == 'Smaller than' ? price : '0.00',
        });

        const tickerAdd = await onPostCustomerTickerSettingApi(raw);

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

  const onHandleEdit = async () => {
    try {
      let raw = JSON.stringify({
        gratter_than_price: gratterData != '' ? parseFloat(gratterData) : null,
        seller_than_price: smallerData != '' ? parseFloat(smallerData) : null,
      });
      const resposeEditValue = await onCustomerPutIndicatorAlertApi(selectCoin.id, raw);
      console.log('Get Response>>', resposeEditValue);
      if (resposeEditValue) {
        setEditVisible(false);
        getAllData();
      }
      setEditVisible(false);
    } catch (err) {
      setEditVisible(false);
      console.log('Error:::', err);
    }
  };

  const onHandleDelete = async () => {
    try {
      let array = [];
      const resposeEditValue = await onCustomerDeleteIndicatorAlertDataApi(selectCoin.id);
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
            title={t('indicator_alert')}
            notificationPress={() =>
              navigation.navigate('NotificationScreen', {
                count: notificationCount,
              })
            }
            navigation={navigation}
            onPress={() => navigation.goBack()}
            notificationCount={notificationCount}
            backVisible={true}
          />
        </View>
        <View style={[styles.mainView, {backgroundColor: theme.background}]}>
          <KeyboardAwareScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(12)}}>
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
                    value={price}
                    onChangeText={text => setPrice(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.buyButtonView,
                    {marginTop: hp(3), marginHorizontal: wp(4)},
                  ]}
                  onPress={() => {
                    if (activePackage > 0) {
                      if (
                        user_data?.binance_api == null ||
                        user_data?.binance_secret_key == null
                      ) {
                        setKeyPopup(true);
                      } else if (
                        apiErrorVisible &&
                        getBinanceApiError != 'error'
                      ) {
                        setKeyPopup(true);
                      } else {
                        onHandleTickerAdd();
                      }
                    } else {
                      setActivatePopup(true);
                    }
                  }}>
                  <Text style={styles.buyText}>{'Submit'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TextInput
              ref={textInputRef}
              value={search}
              onChangeText={text => handleSearch(text)}
              onFocus={handleFocus}
              placeholder={t('search_coin')}
              placeholderTextColor={COLORS.greyColor}
              style={styles.searchText}
            />
            <ScrollView>
              {balanceData.length > 0 ? (
                <View style={styles.headingView}>
                  <TouchableOpacity style={styles.heading2}>
                    <Text style={styles.headingText}>{t('coins')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.heading1}>
                    <Text style={styles.headingText}>{'Greater'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.heading1}>
                    <Text style={styles.headingText}>{'Smaller'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.heading1}></TouchableOpacity>
                </View>
              ) : null}
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
                              ? COLORS.lightPrimary2
                              : theme.background,
                          },
                        ]}>
                        <View style={styles.heading2}>
                          <Text style={styles.coinText}>{item.ticker}</Text>
                        </View>
                        <View style={styles.heading1}>
                          <Text style={styles.coinText1}>
                            {formattedNumber != 'NaN' ? formattedNumber : ''}
                          </Text>
                        </View>
                        <View style={styles.heading1}>
                          <Text style={styles.coinText1}>
                            {formattedNumber1 != 'NaN' ? formattedNumber1 : ''}
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
                            setEditVisible(true);
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
        modelVisible={editVisible}
        setModelVisible={setEditVisible}
        amount={smallerData}
        setAmount={setSmallerData}
        address={gratterData}
        setAddress={setGratterData}
        onPress={() => onHandleEdit()}
        selectedCoin={selectCoin}
        // loading={loading}
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
      <ActivePlanPopup
        modelVisible={activatePopup}
        setModelVisible={setActivatePopup}
        title={' to Activate Plan.'}
        firstButtonTitle={t('explore_plan')}
        secondButtonTitle={t('cancel')}
        secondButtonClick={() => setActivatePopup(false)}
        firstButtonClick={() => {
          setActivatePopup(false);
          navigation.navigate('PlanScreen');
        }}
      />
      <ActivePlanPopup
        modelVisible={keyPopup}
        setModelVisible={setKeyPopup}
        title={' to Enter API Key.'}
        firstButtonTitle={t('proceed')}
        secondButtonTitle={t('cancel')}
        secondButtonClick={() => setKeyPopup(false)}
        firstButtonClick={() => {
          setKeyPopup(false);
          navigation.navigate('ProfileScreen');
        }}
      />
    </View>
  );
};

export default UserAlert;
