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
import {useSelector, useDispatch} from 'react-redux';
import {
  onDeleteWebNotificationDataApi,
  onPostWebNotificationApi,
} from '../../../services/Api';
import {
  fetchAdminWebNotificationCryptoList,
  fetchAdminWebNotificationIndiaList,
  fetchAdminWebNotificationUsaList,
  fetchAdminWebNotificationVindexList,
} from '../../../redux/reducer';

const WebNotification = ({navigation}) => {
  const dispatch = useDispatch();
  const getWebNotificationCrypto = useSelector(
    state => state.getWebNotificationCrypto,
  );
  const [userRole, setUserRole] = useState('');
  const [search1, setSearch1] = useState('');
  const [searchIndia, setSearchIndia] = useState('');
  const [searchVindex, setSearchVindex] = useState('');
  const [USAsearch1, setUSASearch1] = useState('');
  const [alertData, setAlertData] = useState(false);
  const [cryptoDataList, setCryptoDataList] = useState([]);
  const [indiaDataList, setIndiaDataList] = useState([]);
  const [vindexDataList, setVindexDataList] = useState([]);
  const [usaDataList, setUsaDataList] = useState([]);
  const [refresh, setRefresh] = useState(false);

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
      setCryptoDataList(getWebNotificationCrypto);
    } catch (err) {
      console.log('err', err);
    }
  };

  const handleAddCoin = async (from, text) => {
    try {
      let raw = JSON.stringify({
        is_active: true,
        page: from,
        tag: text,
      });
      console.log(' get Request>>', raw);
      const response = await onPostWebNotificationApi(raw);
      if (response.data) {
        console.log('get Response::', response.data);
        if (from == 'crypto') {
          setSearch1('');
          const newArray = [response.data, ...cryptoDataList];
          setAlertData(!alertData);
          dispatch(fetchAdminWebNotificationCryptoList(newArray));
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
      const response = await onDeleteWebNotificationDataApi(id);
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
            title={'Web Notification'}
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
            <View style={styles.filterView}>
              <TextInput
                value={search1}
                onChangeText={text => setSearch1(text)}
                placeholder={'Type Tagline here...'}
                placeholderTextColor={COLORS.greyColor}
                style={styles.searchText1}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => handleAddCoin('crypto', search1)}>
                <Text style={styles.filterText}>Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.alertViews}>
              <View style={styles.headingView}>
                <TouchableOpacity style={styles.heading}>
                  <Text style={styles.headingText}>{'Values'}</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{marginBottom: hp(2)}}>
                {cryptoDataList.map((item, index) => {
                  return (
                    <View style={styles.headingView1}>
                      <View style={[styles.heading1, {width: wp(65)}]}>
                        <Text style={styles.coinText}>{item.tag}</Text>
                      </View>
                      <View style={[styles.heading, {width: wp(20)}]}>
                        <TouchableOpacity
                          style={styles.deleteView}
                          onPress={() => deleteCoinData(item.id, 'crypto')}>
                          <Text style={styles.deleteText}>{'Delete'}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default WebNotification;

// import {
//   Text,
//   View,
//   SafeAreaView,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
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
// import {useSelector, useDispatch} from 'react-redux';
// import {
//   onDeleteWebNotificationDataApi,
//   onPostWebNotificationApi,
// } from '../../../services/Api';
// import {
//   fetchAdminWebNotificationCryptoList,
//   fetchAdminWebNotificationIndiaList,
//   fetchAdminWebNotificationUsaList,
//   fetchAdminWebNotificationVindexList,
// } from '../../../redux/reducer';

// const WebNotification = ({navigation}) => {
//   const dispatch = useDispatch();
//   const getWebNotificationCrypto = useSelector(
//     state => state.getWebNotificationCrypto,
//   );
//   const getWebNotificationIndia = useSelector(
//     state => state.getWebNotificationIndia,
//   );
//   const getWebNotificationUsa = useSelector(
//     state => state.getWebNotificationUsa,
//   );
//   const getWebNotificationVindex = useSelector(
//     state => state.getWebNotificationVindex,
//   );
//   const [userRole, setUserRole] = useState('');
//   const [search1, setSearch1] = useState('');
//   const [searchIndia, setSearchIndia] = useState('');
//   const [searchVindex, setSearchVindex] = useState('');
//   const [USAsearch1, setUSASearch1] = useState('');
//   const [alertData, setAlertData] = useState(false);
//   const [cryptoDataList, setCryptoDataList] = useState([]);
//   const [indiaDataList, setIndiaDataList] = useState([]);
//   const [vindexDataList, setVindexDataList] = useState([]);
//   const [usaDataList, setUsaDataList] = useState([]);
//   const [refresh, setRefresh] = useState(false);

//   useEffect(() => {
//     onGetSpotBalanceData();
//     const allDataGet = async () => {
//       const role = await AsyncStorage.getItem('userRole');
//       setUserRole(role);
//     };
//     allDataGet();
//   }, []);

//   const onGetSpotBalanceData = async () => {
//     try {
//       setCryptoDataList(getWebNotificationCrypto);
//       setIndiaDataList(getWebNotificationIndia);
//       setVindexDataList(getWebNotificationVindex);
//       setUsaDataList(getWebNotificationUsa);
//     } catch (err) {
//       console.log('err', err);
//     }
//   };

//   const handleAddCoin = async (from, text) => {
//     try {
//       let raw = JSON.stringify({
//         is_active: true,
//         page: from,
//         tag: text,
//       });
//       console.log(' get Request>>', raw);
//       const response = await onPostWebNotificationApi(raw);
//       if (response.data) {
//         console.log('get Response::', response.data);
//         if (from == 'crypto') {
//           setSearch1('');
//           const newArray = [response.data, ...cryptoDataList];
//           setAlertData(!alertData);
//           dispatch(fetchAdminWebNotificationCryptoList(newArray));
//           setCryptoDataList(prevData => {
//             return [response.data, ...prevData];
//           });
//           setRefresh(!refresh);
//           console.log('get Data::', cryptoDataList);
//         } else if (from == 'india') {
//           setSearchIndia('');
//           const newArray = [response.data, ...indiaDataList];
//           setAlertData(!alertData);
//           dispatch(fetchAdminWebNotificationIndiaList(newArray));
//           setIndiaDataList(prevData => {
//             return [response.data, ...prevData];
//           });
//           setRefresh(!refresh);
//         } else if (from == 'vindex') {
//           setSearchVindex('');
//           const newArray = [response.data, ...vindexDataList];
//           setAlertData(!alertData);
//           dispatch(fetchAdminWebNotificationVindexList(newArray));
//           setVindexDataList(prevData => {
//             return [response.data, ...prevData];
//           });
//           setRefresh(!refresh);
//         } else if (from == 'usa') {
//           setUSASearch1('');
//           const newArray = [response.data, ...usaDataList];
//           setAlertData(!alertData);
//           dispatch(fetchAdminWebNotificationUsaList(newArray));
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
//       const response = await onDeleteWebNotificationDataApi(id);
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
//             title={'Web Notification'}
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
//             <View style={styles.filterView}>
//               <TextInput
//                 value={search1}
//                 onChangeText={text => setSearch1(text)}
//                 placeholder={'Type Tagline here...'}
//                 placeholderTextColor={COLORS.greyColor}
//                 style={styles.searchText1}
//                 autoCapitalize="none"
//               />
//               <TouchableOpacity
//                 style={styles.filterButton}
//                 onPress={() => handleAddCoin('crypto', search1)}>
//                 <Text style={styles.filterText}>Add</Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.alertViews}>
//               <View style={styles.headingView}>
//                 <TouchableOpacity style={styles.heading}>
//                   <Text style={styles.headingText}>{'Values'}</Text>
//                 </TouchableOpacity>
//               </View>
//               <ScrollView
//                 nestedScrollEnabled={true}
//                 contentContainerStyle={{marginBottom: hp(2)}}>
//                 {cryptoDataList.map((item, index) => {
//                   return (
//                     <View style={styles.headingView1}>
//                       <View style={[styles.heading1, {width: wp(65)}]}>
//                         <Text style={styles.coinText}>{item.tag}</Text>
//                       </View>
//                       <View style={[styles.heading, {width: wp(20)}]}>
//                         <TouchableOpacity
//                           style={styles.deleteView}
//                           onPress={() => deleteCoinData(item.id, 'crypto')}>
//                           <Text style={styles.deleteText}>{'Delete'}</Text>
//                         </TouchableOpacity>
//                       </View>
//                     </View>
//                   );
//                 })}
//               </ScrollView>
//             </View>

//             <Text style={styles.titleText}>India</Text>
//             <View style={styles.filterView}>
//               <TextInput
//                 value={searchIndia}
//                 onChangeText={text => setSearchIndia(text)}
//                 placeholder={'Type Tagline here...'}
//                 placeholderTextColor={COLORS.greyColor}
//                 style={styles.searchText1}
//                 autoCapitalize="none"
//               />
//               <TouchableOpacity
//                 style={styles.filterButton}
//                 onPress={() => handleAddCoin('india', searchIndia)}>
//                 <Text style={styles.filterText}>Add</Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.alertViews}>
//               <View style={styles.headingView}>
//                 <TouchableOpacity style={styles.heading}>
//                   <Text style={styles.headingText}>{'Values'}</Text>
//                 </TouchableOpacity>
//               </View>
//               <ScrollView
//                 nestedScrollEnabled={true}
//                 contentContainerStyle={{marginBottom: hp(2)}}>
//                 {indiaDataList.map((item, index) => {
//                   return (
//                     <View style={styles.headingView1}>
//                       <View style={[styles.heading1, {width: wp(65)}]}>
//                         <Text style={styles.coinText}>{item.tag}</Text>
//                       </View>
//                       <View style={[styles.heading, {width: wp(20)}]}>
//                         <TouchableOpacity
//                           style={styles.deleteView}
//                           onPress={() => deleteCoinData(item.id, 'india')}>
//                           <Text style={styles.deleteText}>{'Delete'}</Text>
//                         </TouchableOpacity>
//                       </View>
//                     </View>
//                   );
//                 })}
//               </ScrollView>
//             </View>

//             <Text style={styles.titleText}>Vindex</Text>

//             <View style={styles.filterView}>
//               <TextInput
//                 value={searchVindex}
//                 onChangeText={text => setSearchVindex(text)}
//                 placeholder={'Type Tagline here...'}
//                 placeholderTextColor={COLORS.greyColor}
//                 style={styles.searchText1}
//                 autoCapitalize="none"
//               />
//               <TouchableOpacity
//                 style={styles.filterButton}
//                 onPress={() => handleAddCoin('vindex', searchVindex)}>
//                 <Text style={styles.filterText}>Add</Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.alertViews}>
//               <View style={styles.headingView}>
//                 <TouchableOpacity style={styles.heading}>
//                   <Text style={styles.headingText}>{'Values'}</Text>
//                 </TouchableOpacity>
//               </View>
//               <ScrollView
//                 nestedScrollEnabled={true}
//                 contentContainerStyle={{marginBottom: hp(2)}}>
//                 {vindexDataList.map((item, index) => {
//                   return (
//                     <View style={styles.headingView1}>
//                       <View style={[styles.heading1, {width: wp(65)}]}>
//                         <Text style={styles.coinText}>{item.tag}</Text>
//                       </View>
//                       <View style={[styles.heading, {width: wp(20)}]}>
//                         <TouchableOpacity
//                           style={styles.deleteView}
//                           onPress={() => deleteCoinData(item.id, 'india')}>
//                           <Text style={styles.deleteText}>{'Delete'}</Text>
//                         </TouchableOpacity>
//                       </View>
//                     </View>
//                   );
//                 })}
//               </ScrollView>
//             </View>

//             <Text style={styles.titleText}>USA</Text>

//             <View style={styles.filterView}>
//               <TextInput
//                 value={USAsearch1}
//                 onChangeText={text => setUSASearch1(text)}
//                 placeholder={'Type Tagline here...'}
//                 placeholderTextColor={COLORS.greyColor}
//                 style={styles.searchText1}
//                 autoCapitalize="none"
//               />
//               <TouchableOpacity
//                 style={styles.filterButton}
//                 onPress={() => handleAddCoin('usa', USAsearch1)}>
//                 <Text style={styles.filterText}>Add</Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.alertViews}>
//               <View style={styles.headingView}>
//                 <TouchableOpacity style={styles.heading}>
//                   <Text style={styles.headingText}>{'Values'}</Text>
//                 </TouchableOpacity>
//               </View>
//               <ScrollView
//                 nestedScrollEnabled={true}
//                 contentContainerStyle={{marginBottom: hp(2)}}>
//                 {usaDataList.map((item, index) => {
//                   return (
//                     <View style={styles.headingView1}>
//                       <View style={[styles.heading1, {width: wp(65)}]}>
//                         <Text style={styles.coinText}>{item.tag}</Text>
//                       </View>
//                       <View style={[styles.heading, {width: wp(20)}]}>
//                         <TouchableOpacity
//                           style={styles.deleteView}
//                           onPress={() => deleteCoinData(item.id, 'india')}>
//                           <Text style={styles.deleteText}>{'Delete'}</Text>
//                         </TouchableOpacity>
//                       </View>
//                     </View>
//                   );
//                 })}
//               </ScrollView>
//             </View>
//           </ScrollView>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default WebNotification;
