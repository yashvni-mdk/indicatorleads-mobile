import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
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
import SelectDropdown from 'react-native-select-dropdown';
import {
  onDeleteAdminAnalyticsDataApi,
  onGetIndiaTickerDataApi,
  onGetTickerDataApi,
  onGetUSATickerDataApi,
  onGetVindexTickerDataApi,
  onPostAdminAnalyticsApi,
} from '../../../services/Api';
import {useSelector} from 'react-redux';
import {
  fetchAdminAnalyticsCryptoList,
  fetchAdminAnalyticsIndiaList,
  fetchAdminAnalyticsUsaList,
  fetchAdminAnalyticsVindexList,
} from '../../../redux/reducer';
import {useDispatch} from 'react-redux';

const searchData = ['Bullish', 'Bearish', 'Neutral'];

const AnalyticsAdmin = ({navigation}) => {
  const dispatch = useDispatch();
  const getAdminAnalyticsCrypto = useSelector(
    state => state.getAdminAnalyticsCrypto,
  );
  const getAdminAnalyticsIndia = useSelector(
    state => state.getAdminAnalyticsIndia,
  );
  const getAdminAnalyticsUsa = useSelector(state => state.getAdminAnalyticsUsa);
  const getAdminAnalyticsVindex = useSelector(
    state => state.getAdminAnalyticsVindex,
  );
  const [userRole, setUserRole] = useState('');
  const [defaultValueCoin, setDefaultValueCoin] = useState('');
  const [selectedIndia, setSelectedIndia] = useState('');
  const [selectedVindex, setSelectedVindex] = useState('');
  const [selectedUsa, setSelectedUsa] = useState('');
  const [defaultValueSearch, setDefaultValueSearch] = useState('');
  const [selectedSearchIndia, setSelectedSearchIndia] = useState('');
  const [selectedSearchVindex, setSelectedSearchVindex] = useState('');
  const [selectedSearchUsa, setSelectedSearchUsa] = useState('');
  const [cryptoCoinList, setCryptoCoinList] = useState([]);
  const [indiaCoinList, setIndiaCoinList] = useState([]);
  const [vindexCoinList, setVindexCoinList] = useState([]);
  const [usaCoinList, setUsaCoinList] = useState([]);
  const [cryptoDataList, setCryptoDataList] = useState([]);
  const [indiaDataList, setIndiaDataList] = useState([]);
  const [vindexDataList, setVindexDataList] = useState([]);
  const [usaDataList, setUsaDataList] = useState([]);
  const [search1, setSearch1] = useState('');
  const [searchIndia, setSearchIndia] = useState('');
  const [searchVindex, setSearchVindex] = useState('');
  const [USAsearch1, setUSASearch1] = useState('');
  const [alertData, setAlertData] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setCryptoDataList(getAdminAnalyticsCrypto);
    onGetSpotBalanceData();
    const allDataGet = async () => {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
    };
    allDataGet();
  }, []);

  const onGetSpotBalanceData = async () => {
    try {
      const response = await onGetTickerDataApi();
      setCryptoCoinList(response.data.data);
    } catch (err) {
      console.log('err', err);
    }
  };

  const handleAddCoin = async from => {
    let symbol = '';
    let trend = '';
    let tagline = '';
    let array = [];
    if (from == 'crypto') {
      symbol = defaultValueCoin;
      trend = defaultValueSearch.toLowerCase();
      tagline = search1;
      array = cryptoDataList;
    }
    try {
      let raw = JSON.stringify({
        symbol: symbol,
        trend: trend,
        is_active: true,
        page: from,
        tagline: tagline,
      });
      console.log(' get Request>>', raw);
      const response = await onPostAdminAnalyticsApi(raw);
      if (response.data) {
        console.log('get Response::', response.data, from);
        if (from == 'crypto') {
          const newArray = [response.data, ...array];
          setAlertData(!alertData);
          dispatch(fetchAdminAnalyticsCryptoList(newArray));
          setCryptoDataList(prevData => {
            return [response.data, ...prevData];
          });
          setRefresh(!refresh);
          console.log('get Data::', cryptoDataList);
        }
      }
    } catch (err) {
      console.log('Get add Coin Error::', err.response.data);
    }
  };

  const deleteCoinData = async (id, from) => {
    try {
      const response = await onDeleteAdminAnalyticsDataApi(id);
      if (response.data) {
        console.log('get Response::', response.data);
        if (from == 'crypto') {
          setCryptoDataList(prevData => {
            return prevData.filter(item => item.id != id);
          });
        }
      }
    } catch (err) {
      console.log('Get Error::', err);
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
            title={'Analytics'}
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
            contentContainerStyle={{paddingBottom: hp(4)}}>
            <Text style={styles.titleText}>CRYPTO</Text>
            <View style={[styles.balanceBuyMathView]}>
              <View style={styles.rowView}>
                <SelectDropdown
                  data={cryptoCoinList}
                  onSelect={(selectedItem, index) => {
                    setDefaultValueCoin(selectedItem);
                    console.log('gert Value:::', selectedItem);
                  }}
                  defaultValue={defaultValueCoin}
                  defaultButtonText={'Select Coin'}
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
                <View style={{marginHorizontal: wp(4)}}>
                  <SelectDropdown
                    data={searchData}
                    onSelect={(selectedItem, index) => {
                      setDefaultValueSearch(selectedItem);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={defaultValueSearch}
                    defaultButtonText={'Search'}
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
            </View>

            <View style={styles.filterView}>
              <TextInput
                value={search1}
                onChangeText={text => setSearch1(text)}
                placeholder={'Type Tagline here...'}
                placeholderTextColor={COLORS.greyColor}
                style={styles.searchText1}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.filterButton} onPress={() => handleAddCoin('crypto')}>
                <Text style={styles.filterText}>Add</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              nestedScrollEnabled={true}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{marginBottom: hp(2)}}>
              <View style={styles.alertViews}>
                <View style={styles.headingView}>
                  <TouchableOpacity style={[styles.heading, {width: wp(24)}]}>
                    <Text style={styles.headingText}>{'Symbol'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.heading, {width: wp(26)}]}>
                    <Text style={styles.headingText}>{'Trend'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.heading,
                      {width: cryptoDataList.length > 0 ? wp(50) : wp(34)},
                    ]}>
                    <Text style={styles.headingText}>{'Tag Line'}</Text>
                  </TouchableOpacity>
                  {cryptoDataList.length > 0 && (
                    <View style={[styles.heading, {width: wp(26)}]}></View>
                  )}
                </View>
                <FlatList
                  key={cryptoDataList.length}
                  data={cryptoDataList}
                  extraData={cryptoDataList}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => item.id}
                  renderItem={({item, index}) => {
                    return (
                      <View style={styles.allDataView}>
                        <View style={[styles.heading, {width: wp(24)}]}>
                          <Text style={styles.coinText}>{item.symbol}</Text>
                        </View>
                        <View style={[styles.heading, {width: wp(26)}]}>
                          <Text style={styles.amountText}>{item.trend}</Text>
                        </View>
                        <View style={[styles.heading, {width: wp(50)}]}>
                          <Text style={styles.amountText}>{item.tagline}</Text>
                        </View>
                        <View style={[styles.heading, {width: wp(26)}]}>
                          <TouchableOpacity style={styles.deleteView} onPress={() => deleteCoinData(item.id, 'crypto')}>
                            <Text style={styles.deleteText}>{'Delete'}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            </ScrollView>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default AnalyticsAdmin;

// import {
//   Text,
//   View,
//   SafeAreaView,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   FlatList,
// } from 'react-native';
// import React, {useEffect, useState, useRef} from 'react';
// import styles from './styles';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from '../../../components/Pixel/index';
// import Header from '../../../components/Header';
// import {hasNotch} from 'react-native-device-info';
// import {COLORS} from '../../../utils';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import SelectDropdown from 'react-native-select-dropdown';
// import {
//   onDeleteAdminAnalyticsDataApi,
//   onGetIndiaTickerDataApi,
//   onGetTickerDataApi,
//   onGetUSATickerDataApi,
//   onGetVindexTickerDataApi,
//   onPostAdminAnalyticsApi,
// } from '../../../services/Api';
// import {useSelector} from 'react-redux';
// import {
//   fetchAdminAnalyticsCryptoList,
//   fetchAdminAnalyticsIndiaList,
//   fetchAdminAnalyticsUsaList,
//   fetchAdminAnalyticsVindexList,
// } from '../../../redux/reducer';
// import {useDispatch} from 'react-redux';

// const searchData = ['Bullish', 'Bearish', 'Neutral'];

// const AnalyticsAdmin = ({navigation}) => {
//   const dispatch = useDispatch();
//   const getAdminAnalyticsCrypto = useSelector(
//     state => state.getAdminAnalyticsCrypto,
//   );
//   const getAdminAnalyticsIndia = useSelector(
//     state => state.getAdminAnalyticsIndia,
//   );
//   const getAdminAnalyticsUsa = useSelector(state => state.getAdminAnalyticsUsa);
//   const getAdminAnalyticsVindex = useSelector(
//     state => state.getAdminAnalyticsVindex,
//   );
//   const [userRole, setUserRole] = useState('');
//   const [defaultValueCoin, setDefaultValueCoin] = useState('');
//   const [selectedIndia, setSelectedIndia] = useState('');
//   const [selectedVindex, setSelectedVindex] = useState('');
//   const [selectedUsa, setSelectedUsa] = useState('');
//   const [defaultValueSearch, setDefaultValueSearch] = useState('');
//   const [selectedSearchIndia, setSelectedSearchIndia] = useState('');
//   const [selectedSearchVindex, setSelectedSearchVindex] = useState('');
//   const [selectedSearchUsa, setSelectedSearchUsa] = useState('');
//   const [cryptoCoinList, setCryptoCoinList] = useState([]);
//   const [indiaCoinList, setIndiaCoinList] = useState([]);
//   const [vindexCoinList, setVindexCoinList] = useState([]);
//   const [usaCoinList, setUsaCoinList] = useState([]);
//   const [cryptoDataList, setCryptoDataList] = useState([]);
//   const [indiaDataList, setIndiaDataList] = useState([]);
//   const [vindexDataList, setVindexDataList] = useState([]);
//   const [usaDataList, setUsaDataList] = useState([]);
//   const [search1, setSearch1] = useState('');
//   const [searchIndia, setSearchIndia] = useState('');
//   const [searchVindex, setSearchVindex] = useState('');
//   const [USAsearch1, setUSASearch1] = useState('');
//   const [alertData, setAlertData] = useState(false);
//   const [refresh, setRefresh] = useState(false);

//   useEffect(() => {
//     setCryptoDataList(getAdminAnalyticsCrypto);
//     setIndiaDataList(getAdminAnalyticsIndia);
//     setVindexDataList(getAdminAnalyticsUsa);
//     setUsaDataList(getAdminAnalyticsVindex);
//     onGetSpotBalanceData();
//     const allDataGet = async () => {
//       const role = await AsyncStorage.getItem('userRole');
//       setUserRole(role);
//     };
//     allDataGet();
//   }, []);

//   const onGetSpotBalanceData = async () => {
//     try {
//       const response = await onGetTickerDataApi();
//       setCryptoCoinList(response.data.data);
//       const responseVindex = await onGetVindexTickerDataApi();
//       setVindexCoinList(responseVindex.data.data);
//       const responseIndia = await onGetIndiaTickerDataApi();
//       setIndiaCoinList(responseIndia.data.data);
//       const responseUSA = await onGetUSATickerDataApi();
//       setUsaCoinList(responseUSA.data.data);
//     } catch (err) {
//       console.log('err', err);
//     }
//   };

//   const handleAddCoin = async from => {
//     let symbol = '';
//     let trend = '';
//     let tagline = '';
//     let array = [];
//     if (from == 'crypto') {
//       symbol = defaultValueCoin;
//       trend = defaultValueSearch.toLowerCase();
//       tagline = search1;
//       array = cryptoDataList;
//     } else if (from == 'india') {
//       symbol = selectedIndia;
//       trend = selectedSearchIndia.toLowerCase();
//       tagline = searchIndia;
//       array = indiaDataList;
//     } else if (from == 'vindex') {
//       symbol = selectedVindex;
//       trend = selectedSearchVindex.toLowerCase();
//       tagline = searchVindex;
//       array = vindexDataList;
//     } else if (from == 'usa') {
//       symbol = selectedUsa;
//       trend = selectedSearchUsa.toLowerCase();
//       tagline = USAsearch1;
//       array = usaDataList;
//     }
//     try {
//       let raw = JSON.stringify({
//         symbol: symbol,
//         trend: trend,
//         is_active: true,
//         page: from,
//         tagline: tagline,
//       });
//       console.log(' get Request>>', raw);
//       const response = await onPostAdminAnalyticsApi(raw);
//       if (response.data) {
//         console.log('get Response::', response.data, from);
//         if (from == 'crypto') {
//           const newArray = [response.data, ...array];
//           setAlertData(!alertData);
//           dispatch(fetchAdminAnalyticsCryptoList(newArray));
//           setCryptoDataList(prevData => {
//             return [response.data, ...prevData];
//           });
//           setRefresh(!refresh);
//           console.log('get Data::', cryptoDataList);
//         } else if (from == 'india') {
//           const newArray = [...array, response.data];
//           setAlertData(!alertData);
//           dispatch(fetchAdminAnalyticsIndiaList(newArray));
//           setIndiaDataList(prevData => {
//             return [response.data, ...prevData];
//           });
//           setRefresh(!refresh);
//         } else if (from == 'vindex') {
//           const newArray = [...array, response.data];
//           setAlertData(!alertData);
//           dispatch(fetchAdminAnalyticsVindexList(newArray));
//           setVindexDataList(prevData => {
//             return [response.data, ...prevData];
//           });
//           setRefresh(!refresh);
//         } else if (from == 'usa') {
//           const newArray = [...array, response.data];
//           setAlertData(!alertData);
//           dispatch(fetchAdminAnalyticsUsaList(newArray));
//           setUsaDataList(prevData => {
//             return [response.data, ...prevData];
//           });
//           setRefresh(!refresh);
//         }
//       }
//     } catch (err) {
//       console.log('Get add Coin Error::', err.response.data);
//     }
//   };

//   const deleteCoinData = async (id, from) => {
//     try {
//       const response = await onDeleteAdminAnalyticsDataApi(id);
//       if (response.data) {
//         console.log('get Response::', response.data);
//         if (from == 'crypto') {
//           setCryptoDataList(prevData => {
//             return prevData.filter(item => item.id != id);
//           });
//         } else if (from == 'india') {
//           setIndiaDataList(prevData => {
//             return prevData.filter(item => item.id != id);
//           });
//         } else if (from == 'vindex') {
//           setVindexDataList(prevData => {
//             return prevData.filter(item => item.id != id);
//           });
//         } else if (from == 'usa') {
//           setUsaDataList(prevData => {
//             return prevData.filter(item => item.id != id);
//           });
//         }
//       }
//     } catch (err) {
//       console.log('Get Error::', err);
//     }
//   };

//   return (
//     <View style={styles.safeAreaStyle}>
//       <View
//         style={{
//           width: '100%',
//           height: hasNotch() ? hp(5) : 0,
//           backgroundColor: COLORS.white,
//         }}
//       />
//       <View style={styles.container}>
//         <View style={styles.headerView}>
//           <Header
//             title={'Analytics'}
//             userRole={userRole}
//             onPress={() => navigation.openDrawer()}
//             navigation={navigation}
//             notify={true}
//           />
//         </View>
//         <View style={styles.mainView}>
//           <ScrollView
//             nestedScrollEnabled={true}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{paddingBottom: hp(4)}}>
//             <Text style={styles.titleText}>CRYPTO</Text>
//             <View style={[styles.balanceBuyMathView]}>
//               <View style={styles.rowView}>
//                 <SelectDropdown
//                   data={cryptoCoinList}
//                   onSelect={(selectedItem, index) => {
//                     setDefaultValueCoin(selectedItem);
//                     console.log('gert Value:::', selectedItem);
//                   }}
//                   defaultValue={defaultValueCoin}
//                   defaultButtonText={'Select Coin'}
//                   renderCustomizedRowChild={(item, index, isSelected) => {
//                     return (
//                       <View style={styles.dropdownView}>
//                         <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
//                       </View>
//                     );
//                   }}
//                   rowStyle={styles.dropdownView}
//                   buttonStyle={styles.dropdown2BtnStyle}
//                   buttonTextStyle={styles.dropdown2BtnTxtStyle}
//                   dropdownIconPosition={'right'}
//                   dropdownStyle={styles.dropdown2DropdownStyle}
//                 />
//                 <View style={{marginHorizontal: wp(4)}}>
//                   <SelectDropdown
//                     data={searchData}
//                     onSelect={(selectedItem, index) => {
//                       setDefaultValueSearch(selectedItem);
//                       console.log('gert Value:::', selectedItem);
//                     }}
//                     defaultValue={defaultValueSearch}
//                     defaultButtonText={'Search'}
//                     renderCustomizedRowChild={(item, index, isSelected) => {
//                       return (
//                         <View style={styles.dropdownView}>
//                           <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
//                         </View>
//                       );
//                     }}
//                     rowStyle={styles.dropdownView}
//                     buttonStyle={styles.dropdown2BtnStyle}
//                     buttonTextStyle={styles.dropdown2BtnTxtStyle}
//                     dropdownIconPosition={'right'}
//                     dropdownStyle={styles.dropdown2DropdownStyle}
//                   />
//                 </View>
//               </View>
//             </View>

//             <View style={styles.filterView}>
//               <TextInput
//                 value={search1}
//                 onChangeText={text => setSearch1(text)}
//                 placeholder={'Type Tagline here...'}
//                 placeholderTextColor={COLORS.greyColor}
//                 style={styles.searchText1}
//                 autoCapitalize="none"
//               />
//               <TouchableOpacity style={styles.filterButton} onPress={() => handleAddCoin('crypto')}>
//                 <Text style={styles.filterText}>Add</Text>
//               </TouchableOpacity>
//             </View>
//             <ScrollView
//               nestedScrollEnabled={true}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={{marginBottom: hp(2)}}>
//               <View style={styles.alertViews}>
//                 <View style={styles.headingView}>
//                   <TouchableOpacity style={[styles.heading, {width: wp(24)}]}>
//                     <Text style={styles.headingText}>{'Symbol'}</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.heading, {width: wp(26)}]}>
//                     <Text style={styles.headingText}>{'Trend'}</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.heading,
//                       {width: cryptoDataList.length > 0 ? wp(50) : wp(34)},
//                     ]}>
//                     <Text style={styles.headingText}>{'Tag Line'}</Text>
//                   </TouchableOpacity>
//                   {cryptoDataList.length > 0 && (
//                     <View style={[styles.heading, {width: wp(26)}]}></View>
//                   )}
//                 </View>
//                 <FlatList
//                   key={cryptoDataList.length}
//                   data={cryptoDataList}
//                   extraData={cryptoDataList}
//                   nestedScrollEnabled
//                   showsVerticalScrollIndicator={false}
//                   keyExtractor={item => item.id}
//                   renderItem={({item, index}) => {
//                     return (
//                       <View style={styles.allDataView}>
//                         <View style={[styles.heading, {width: wp(24)}]}>
//                           <Text style={styles.coinText}>{item.symbol}</Text>
//                         </View>
//                         <View style={[styles.heading, {width: wp(26)}]}>
//                           <Text style={styles.amountText}>{item.trend}</Text>
//                         </View>
//                         <View style={[styles.heading, {width: wp(50)}]}>
//                           <Text style={styles.amountText}>{item.tagline}</Text>
//                         </View>
//                         <View style={[styles.heading, {width: wp(26)}]}>
//                           <TouchableOpacity style={styles.deleteView} onPress={() => deleteCoinData(item.id, 'crypto')}>
//                             <Text style={styles.deleteText}>{'Delete'}</Text>
//                           </TouchableOpacity>
//                         </View>
//                       </View>
//                     );
//                   }}
//                 />
//               </View>
//             </ScrollView>

//             <Text style={styles.titleText}>India</Text>
//             <View style={[styles.balanceBuyMathView]}>
//               <View style={styles.rowView}>
//                 <SelectDropdown
//                   data={indiaCoinList}
//                   onSelect={(selectedItem, index) => {
//                     setSelectedIndia(selectedItem);
//                     console.log('gert Value:::', selectedItem);
//                   }}
//                   defaultValue={selectedIndia}
//                   defaultButtonText={'Select Stock'}
//                   renderCustomizedRowChild={(item, index, isSelected) => {
//                     return (
//                       <View style={styles.dropdownView}>
//                         <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
//                       </View>
//                     );
//                   }}
//                   rowStyle={styles.dropdownView}
//                   buttonStyle={styles.dropdown2BtnStyle}
//                   buttonTextStyle={styles.dropdown2BtnTxtStyle}
//                   dropdownIconPosition={'right'}
//                   dropdownStyle={styles.dropdown2DropdownStyle}
//                 />
//                 <View style={{marginHorizontal: wp(4)}}>
//                   <SelectDropdown
//                     data={searchData}
//                     onSelect={(selectedItem, index) => {
//                       setSelectedSearchIndia(selectedItem);
//                       console.log('gert Value:::', selectedItem);
//                     }}
//                     defaultValue={selectedSearchIndia}
//                     defaultButtonText={'Search'}
//                     renderCustomizedRowChild={(item, index, isSelected) => {
//                       return (
//                         <View style={styles.dropdownView}>
//                           <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
//                         </View>
//                       );
//                     }}
//                     rowStyle={styles.dropdownView}
//                     buttonStyle={styles.dropdown2BtnStyle}
//                     buttonTextStyle={styles.dropdown2BtnTxtStyle}
//                     dropdownIconPosition={'right'}
//                     dropdownStyle={styles.dropdown2DropdownStyle}
//                   />
//                 </View>
//               </View>
//             </View>

//             <View style={styles.filterView}>
//               <TextInput
//                 value={searchIndia}
//                 onChangeText={text => setSearchIndia(text)}
//                 placeholder={'Type Tagline here...'}
//                 placeholderTextColor={COLORS.greyColor}
//                 style={styles.searchText1}
//                 autoCapitalize="none"
//               />
//               <TouchableOpacity style={styles.filterButton} onPress={() => handleAddCoin('india')}>
//                 <Text style={styles.filterText}>Add</Text>
//               </TouchableOpacity>
//             </View>
//             <ScrollView
//               nestedScrollEnabled={true}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={{marginBottom: hp(2)}}>
//               <View style={styles.alertViews}>
//                 <View style={styles.headingView}>
//                   <TouchableOpacity style={[styles.heading, {width: wp(24)}]}>
//                     <Text style={styles.headingText}>{'Symbol'}</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.heading, {width: wp(26)}]}>
//                     <Text style={styles.headingText}>{'Trend'}</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.heading, {width: indiaDataList.length > 0 ? wp(50) : wp(34)}]}>
//                     <Text style={styles.headingText}>{'Tag Line'}</Text>
//                   </TouchableOpacity>
//                   {indiaDataList.length > 0 && (
//                     <View style={[styles.heading, {width: wp(26)}]}></View>
//                   )}
//                 </View>
//                 <FlatList
//                   data={indiaDataList}
//                   nestedScrollEnabled
//                   showsVerticalScrollIndicator={false}
//                   keyExtractor={item => item.id}
//                   renderItem={({item, index}) => {
//                     return (
//                       <View style={styles.allDataView}>
//                         <View style={[styles.heading, {width: wp(24)}]}>
//                           <Text style={styles.coinText}>{item.symbol}</Text>
//                         </View>
//                         <View style={[styles.heading, {width: wp(26)}]}>
//                           <Text style={styles.amountText}>{item.trend}</Text>
//                         </View>
//                         <View style={[styles.heading, {width: wp(50)}]}>
//                           <Text style={styles.amountText}>{item.tagline}</Text>
//                         </View>
//                         <View style={[styles.heading, {width: wp(26)}]}>
//                           <TouchableOpacity style={styles.deleteView} onPress={() => deleteCoinData(item.id, 'india')}>
//                             <Text style={styles.deleteText}>{'Delete'}</Text>
//                           </TouchableOpacity>
//                         </View>
//                       </View>
//                     );
//                   }}
//                 />
//               </View>
//             </ScrollView>

//             <Text style={styles.titleText}>Vindex</Text>
//             <View style={[styles.balanceBuyMathView]}>
//               <View style={styles.rowView}>
//                 <SelectDropdown
//                   data={vindexCoinList}
//                   onSelect={(selectedItem, index) => {
//                     setSelectedVindex(selectedItem);
//                     console.log('gert Value:::', selectedItem);
//                   }}
//                   defaultValue={selectedVindex}
//                   defaultButtonText={'Select Stock'}
//                   renderCustomizedRowChild={(item, index, isSelected) => {
//                     return (
//                       <View style={styles.dropdownView}>
//                         <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
//                       </View>
//                     );
//                   }}
//                   rowStyle={styles.dropdownView}
//                   buttonStyle={styles.dropdown2BtnStyle}
//                   buttonTextStyle={styles.dropdown2BtnTxtStyle}
//                   dropdownIconPosition={'right'}
//                   dropdownStyle={styles.dropdown2DropdownStyle}
//                 />
//                 <View style={{marginHorizontal: wp(4)}}>
//                   <SelectDropdown
//                     data={searchData}
//                     onSelect={(selectedItem, index) => {
//                       setSelectedSearchVindex(selectedItem);
//                       console.log('gert Value:::', selectedItem);
//                     }}
//                     defaultValue={selectedSearchVindex}
//                     defaultButtonText={'Search'}
//                     renderCustomizedRowChild={(item, index, isSelected) => {
//                       return (
//                         <View style={styles.dropdownView}>
//                           <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
//                         </View>
//                       );
//                     }}
//                     rowStyle={styles.dropdownView}
//                     buttonStyle={styles.dropdown2BtnStyle}
//                     buttonTextStyle={styles.dropdown2BtnTxtStyle}
//                     dropdownIconPosition={'right'}
//                     dropdownStyle={styles.dropdown2DropdownStyle}
//                   />
//                 </View>
//               </View>
//             </View>

//             <View style={styles.filterView}>
//               <TextInput
//                 value={searchVindex}
//                 onChangeText={text => setSearchVindex(text)}
//                 placeholder={'Type Tagline here...'}
//                 placeholderTextColor={COLORS.greyColor}
//                 style={styles.searchText1}
//                 autoCapitalize="none"
//               />
//               <TouchableOpacity style={styles.filterButton} onPress={() => handleAddCoin('vindex')}>
//                 <Text style={styles.filterText}>Add</Text>
//               </TouchableOpacity>
//             </View>
//             <ScrollView
//               nestedScrollEnabled={true}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={{marginBottom: hp(2)}}>
//               <View style={styles.alertViews}>
//                 <View style={styles.headingView}>
//                   <TouchableOpacity style={[styles.heading, {width: wp(24)}]}>
//                     <Text style={styles.headingText}>{'Symbol'}</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.heading, {width: wp(26)}]}>
//                     <Text style={styles.headingText}>{'Trend'}</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.heading, {width: vindexDataList.length > 0 ? wp(50) : wp(34)}]}>
//                     <Text style={styles.headingText}>{'Tag Line'}</Text>
//                   </TouchableOpacity>
//                   {vindexDataList.length > 0 && (
//                     <View style={[styles.heading, {width: wp(26)}]}></View>
//                   )}
//                 </View>
//                 <FlatList
//                   data={vindexDataList}
//                   nestedScrollEnabled
//                   showsVerticalScrollIndicator={false}
//                   keyExtractor={item => item.id}
//                   renderItem={({item, index}) => {
//                     return (
//                       <View style={styles.allDataView}>
//                         <View style={[styles.heading, {width: wp(24)}]}>
//                           <Text style={styles.coinText}>{item.symbol}</Text>
//                         </View>
//                         <View style={[styles.heading, {width: wp(26)}]}>
//                           <Text style={styles.amountText}>{item.trend}</Text>
//                         </View>
//                         <View style={[styles.heading, {width: wp(50)}]}>
//                           <Text style={styles.amountText}>{item.tagline}</Text>
//                         </View>
//                         <View style={[styles.heading, {width: wp(26)}]}>
//                           <TouchableOpacity style={styles.deleteView} onPress={() => deleteCoinData(item.id, 'vindex')}>
//                             <Text style={styles.deleteText}>{'Delete'}</Text>
//                           </TouchableOpacity>
//                         </View>
//                       </View>
//                     );
//                   }}
//                 />
//               </View>
//             </ScrollView>

//             <Text style={styles.titleText}>USA</Text>
//             <View style={[styles.balanceBuyMathView]}>
//               <View style={styles.rowView}>
//                 <SelectDropdown
//                   data={usaCoinList}
//                   onSelect={(selectedItem, index) => {
//                     setSelectedUsa(selectedItem);
//                     console.log('gert Value:::', selectedItem);
//                   }}
//                   defaultValue={selectedUsa}
//                   defaultButtonText={'Select Stock'}
//                   renderCustomizedRowChild={(item, index, isSelected) => {
//                     return (
//                       <View style={styles.dropdownView}>
//                         <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
//                       </View>
//                     );
//                   }}
//                   rowStyle={styles.dropdownView}
//                   buttonStyle={styles.dropdown2BtnStyle}
//                   buttonTextStyle={styles.dropdown2BtnTxtStyle}
//                   dropdownIconPosition={'right'}
//                   dropdownStyle={styles.dropdown2DropdownStyle}
//                 />
//                 <View style={{marginHorizontal: wp(4)}}>
//                   <SelectDropdown
//                     data={searchData}
//                     onSelect={(selectedItem, index) => {
//                       setSelectedSearchUsa(selectedItem);
//                       console.log('gert Value:::', selectedItem);
//                     }}
//                     defaultValue={selectedSearchUsa}
//                     defaultButtonText={'Search'}
//                     renderCustomizedRowChild={(item, index, isSelected) => {
//                       return (
//                         <View style={styles.dropdownView}>
//                           <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
//                         </View>
//                       );
//                     }}
//                     rowStyle={styles.dropdownView}
//                     buttonStyle={styles.dropdown2BtnStyle}
//                     buttonTextStyle={styles.dropdown2BtnTxtStyle}
//                     dropdownIconPosition={'right'}
//                     dropdownStyle={styles.dropdown2DropdownStyle}
//                   />
//                 </View>
//               </View>
//             </View>

//             <View style={styles.filterView}>
//               <TextInput
//                 value={USAsearch1}
//                 onChangeText={text => setUSASearch1(text)}
//                 placeholder={'Type Tagline here...'}
//                 placeholderTextColor={COLORS.greyColor}
//                 style={styles.searchText1}
//                 autoCapitalize="none"
//               />
//               <TouchableOpacity style={styles.filterButton} onPress={() => handleAddCoin('usa')}>
//                 <Text style={styles.filterText}>Add</Text>
//               </TouchableOpacity>
//             </View>
//             <ScrollView
//               nestedScrollEnabled={true}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={{marginBottom: hp(2)}}>
//               <View style={styles.alertViews}>
//                 <View style={styles.headingView}>
//                   <TouchableOpacity style={[styles.heading, {width: wp(24)}]}>
//                     <Text style={styles.headingText}>{'Symbol'}</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.heading, {width: wp(26)}]}>
//                     <Text style={styles.headingText}>{'Trend'}</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.heading, {width: usaDataList.length > 0 ? wp(50) : wp(34)}]}>
//                     <Text style={styles.headingText}>{'Tag Line'}</Text>
//                   </TouchableOpacity>
//                   {usaDataList.length > 0 && (
//                     <View style={[styles.heading, {width: wp(26)}]}></View>
//                   )}
//                 </View>
//                 <FlatList
//                   data={usaDataList}
//                   nestedScrollEnabled
//                   showsVerticalScrollIndicator={false}
//                   keyExtractor={item => item.id}
//                   renderItem={({item, index}) => {
//                     return (
//                       <View style={styles.allDataView}>
//                         <View style={[styles.heading, {width: wp(24)}]}>
//                           <Text style={styles.coinText}>{item.symbol}</Text>
//                         </View>
//                         <View style={[styles.heading, {width: wp(26)}]}>
//                           <Text style={styles.amountText}>{item.trend}</Text>
//                         </View>
//                         <View style={[styles.heading, {width: wp(50)}]}>
//                           <Text style={styles.amountText}>{item.tagline}</Text>
//                         </View>
//                         <View style={[styles.heading, {width: wp(26)}]}>
//                           <TouchableOpacity style={styles.deleteView} onPress={() => deleteCoinData(item.id, 'usa')}>
//                             <Text style={styles.deleteText}>{'Delete'}</Text>
//                           </TouchableOpacity>
//                         </View>
//                       </View>
//                     );
//                   }}
//                 />
//               </View>
//             </ScrollView>
//           </ScrollView>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default AnalyticsAdmin;
