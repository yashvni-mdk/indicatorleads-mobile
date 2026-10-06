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
  Platform,
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
import {
  onGetPlanDataApi,
  onGetSplashLogoApi,
  onPostPlanDataApi,
  onPutBannerApi,
  onPutPlanApi,
} from '../../../services/Api';
import {EditPlanPopup} from '../../../components/EditPlanPopup';
import {AddPlanPopup} from '../../../components/AddPlanPopup';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import ImagePicker from 'react-native-image-crop-picker';

const ManagePlans = ({navigation}) => {
  const [userRole, setUserRole] = useState('');
  const [notificationData, setNotificationData] = useState([]);
  const [contentText, setContentText] = useState('');
  const [lastDate, setLastDate] = useState('0');
  const [addPopupVisible, setAddPopupVisible] = useState(false);
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('Monthly');
  const [period, setPeriod] = useState('1');
  const [discount, setDiscount] = useState('');
  const [bot, setBot] = useState('');
  const [FinishOnPress, setFinishOnPress] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [bannerId, setBannerId] = useState('');
  const [bannerLoader, setBannerLoader] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    onGetPlanData();
    const allDataGet = async () => {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
    };
    allDataGet();
    getBannerData();
  }, []);

  const getBannerData = async () => {
    try {
      const response = await onGetSplashLogoApi();
      if (response.data) {
        console.log('onGetProfileApi Data>>>>', response.data);
        response.data.forEach(item => {
          if (item.name === 'PLANS_BANNER') {
            if (item.images) {
              let url = item.images;
              const filename = url.substring(url.lastIndexOf('/') + 1);
              const fileExtension = url.substring(url.lastIndexOf('.') + 1);
              const mimeTypes = {
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                png: 'image/png',
                gif: 'image/gif',
                // Add more mappings as needed
              };
              let mimeType = mimeTypes[fileExtension.toLowerCase()];
              let avatarObject = {
                uri: url,
                name: filename,
                type: mimeType,
              };
              setBannerId(item.id);
              setAvatar(avatarObject);
            }
          }
        });
      }
    } catch (err) {
      console.log('Error', err);
    }
  };

  const onGetPlanData = async () => {
    try {
      const response = await onGetPlanDataApi();
      if (response.data) {
        console.log('Response', response.data);
        setNotificationData(response.data);
      }
    } catch (err) {
      console.log('Get Error:::', err);
    }
  };

  const handleAddPlan = async () => {
    try {
      setFinishOnPress(true);
      let raw = JSON.stringify({
        name: name,
        period: parseInt(period),
        duration: 'days',
        price: price != '' ? parseFloat(price) : 0,
        cutoff_price: discount != '' ? parseFloat(discount) : 0,
        is_active: true,
        features: [
          {
            key: 'COINS',
            int_value: bot != '' ? parseInt(bot) : 0,
            is_active: true,
          },
        ],
      });
      console.log('get Response LLLL', raw);
      const response = await onPostPlanDataApi(raw);
      if (response.data) {
        onGetPlanData();
        setName('');
        setPrice('');
        setDuration('');
        setPeriod('1');
        setDiscount('');
        setBot('');
        showMessage({
          message: 'Package has been edited successfully!',
          type: 'success',
          duration: 3000,
        });
      }
      setFinishOnPress(false);
      setAddPopupVisible(false);
    } catch (err) {
      setFinishOnPress(false);
      setAddPopupVisible(false);
      showMessage({
        message: 'Unable to add package. Try again!',
        type: 'warning',
        duration: 3000,
        icon: 'warning',
      });
      console.log('error:::::', err);
    }
  };

  const handleEditPlan = async () => {
    try {
      setFinishOnPress(true);
      let raw = JSON.stringify({
        period: parseInt(period),
        duration: 'days',
        price: parseFloat(price),
        cutoff_price: parseFloat(discount),
        features: [
          {
            key: 'COINS',
            int_value: parseInt(bot),
            is_active: true,
          },
        ],
      });
      const response = await onPutPlanApi(selectedId, raw);
      console.log('get Response LLLL', response);
      if (response) {
        onGetPlanData();
        setName('');
        setPrice('');
        setDuration('');
        setPeriod('1');
        setDiscount('');
        setBot('');
        setSelectedId('');
        showMessage({
          message: 'Package has been edited successfully!',
          type: 'success',
          duration: 3000,
        });
      }
      setFinishOnPress(false);
      setEditPopupVisible(false);
    } catch (err) {
      setFinishOnPress(false);
      setEditPopupVisible(false);
      showMessage({
        message: 'Unable to add package. Try again!',
        type: 'warning',
        duration: 3000,
        icon: 'warning',
      });
      console.log('error:::::', err);
    }
  };

  const handleEditStatus = async item => {
    try {
      let raw = JSON.stringify({
        period: item?.period,
        duration: 'days',
        price: item?.price,
        cutoff_price: item?.cutoff_price,
        is_active: !item.is_active,
        features: [
          {
            key: 'COINS',
            int_value: item?.features[item?.features.length - 1].int_value,
            is_active: true,
          },
        ],
      });
      const response = await onPutPlanApi(item.id, raw);
      console.log('get Response LLLL', response);
      if (response) {
        onGetPlanData();
      }
      setEditPopupVisible(false);
    } catch (err) {
      setEditPopupVisible(false);
      console.log('error:::::', err);
    }
  };

  const openProfileImagePicker = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: false,
        multiple: false, // Allow selecting only one image
        compressImageQuality: 0.5,
      });

      if (image && image.path) {
        var filename = image.path.substring(image.path.lastIndexOf('/') + 1);
        let imageData = {
          uri: Platform.OS === 'ios' ? image.sourceURL : image.path,
          type: image.mime,
          name: Platform.OS === 'ios' ? image.filename : filename,
        };
        console.log('Selected image:', image);
        setAvatar(imageData);
        setRefresh(!refresh);
      } else {
        console.log('No image selected');
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  const onSubmitBanner = async () => {
    try {
      setBannerLoader(true);
      if (avatar && avatar?.uri) {
        const formdata = new FormData();
        formdata.append('images', avatar);
        console.log('Selected image:', avatar, bannerId);
        const response = await onPutBannerApi(bannerId, formdata);
        if (response) {
          setBannerLoader(false);
          console.log('Get Response>>', response);
        }
      }
    } catch (err) {
      setBannerLoader(false);
      console.log('Error', err);
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
            title={'Manage Plans'}
            userRole={userRole}
            onPress={() => navigation.openDrawer()}
            navigation={navigation}
            notify={true}
          />
        </View>
        <View style={styles.mainView}>
          <ScrollView
            style={{width: '100%'}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(4)}}>
            <View style={[styles.balanceBuyMathView, {marginVertical: hp(3)}]}>
              <View style={styles.rowView5}>
                <View style={styles.roundView}>
                  <Text style={styles.iText}>i</Text>
                </View>
                <Text style={styles.discountText}>Discount Banner</Text>
              </View>

              {/* <Text style={styles.selectCoinText1}>{'CONTENT'}</Text>
              <TextInput
                value={contentText}
                onChangeText={text => setContentText(text)}
                keyboardType={'decimal-pad'}
                placeholderTextColor={COLORS.greyColor}
                style={styles.coinPostText}
              /> */}
              <View style={styles.rowView}>
                <View style={{width: '100%'}}>
                  <Text style={styles.selectCoinText1}>CHOOSE LOGO</Text>
                  <TouchableOpacity
                    style={styles.chooseFileView}
                    onPress={() => openProfileImagePicker()}>
                    <Text style={styles.bannerText}>
                      {avatar && avatar?.name ? avatar?.name : 'Choose File'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* <View style={{width: '34%'}}>
                  <Text style={styles.selectCoinText1}>LAST DATE</Text>
                  <TextInput
                    value={lastDate}
                    onChangeText={text => setLastDate(text)}
                    keyboardType={'decimal-pad'}
                    placeholderTextColor={COLORS.greyColor}
                    style={styles.coinPostText1}
                  />
                </View> */}
              </View>
              <View style={styles.rowView}>
                <TouchableOpacity
                  style={styles.buyButtonView}
                  onPress={() => onSubmitBanner()}>
                  {bannerLoader ? (
                    <ActivityIndicator size={'small'} color={COLORS.white} />
                  ) : (
                    <Text style={styles.buyText}>{'SUBMIT'}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.TitleViews}>
              <Text style={styles.titleText}>Edit Plan Packages</Text>
              <TouchableOpacity
                style={styles.addView}
                onPress={() => {
                  setName('');
                  setPrice('');
                  setDuration('');
                  setPeriod('1');
                  setDiscount('');
                  setBot('');
                  setAddPopupVisible(true);
                }}>
                <Text style={styles.plusText}>Add</Text>
              </TouchableOpacity>
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
                      style={[styles.optionTitleView, {width: wp(19)}]}>
                      <Text style={styles.titleText4}>{'SR.NO.'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {}}
                      style={[styles.optionTitleView, {width: wp(24)}]}>
                      <Text style={styles.titleText4}>{'PLAN'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {}}
                      style={[styles.optionTitleView, {width: wp(20)}]}>
                      <Text style={styles.titleText4}>{'BOT'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {}}
                      style={[styles.optionTitleView, {width: wp(30)}]}>
                      <Text style={styles.titleText4}>{'ACTUAL PRICE'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {}}
                      style={[styles.optionTitleView, {width: wp(35)}]}>
                      <Text style={styles.titleText4}>
                        {'DISCOUNTED PRICE'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {}}
                      style={[styles.optionTitleView, {width: wp(16)}]}>
                      <Text style={styles.titleText4}>{'DAYS'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {}}
                      style={[styles.optionTitleView, {width: wp(22)}]}>
                      <Text style={styles.titleText4}>{'STATUS'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {}}
                      style={[styles.optionTitleView, {width: wp(29)}]}>
                      <Text style={styles.titleText4}>{'ACTION'}</Text>
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
                          <Text style={[styles.dataText4, {width: wp(19)}]}>
                            {index + 1}
                          </Text>
                          <Text style={[styles.dataText4, {width: wp(24)}]}>
                            {item?.name}
                          </Text>
                          <Text style={[styles.dataText4, {width: wp(20)}]}>
                            {
                              item?.features[item?.features.length - 1]
                                .int_value
                            }
                          </Text>
                          <Text style={[styles.dataText4, {width: wp(30)}]}>
                            {`$ ${item?.price}`}
                          </Text>
                          <Text style={[styles.dataText4, {width: wp(35)}]}>
                            {`$ ${item?.cutoff_price}`}
                          </Text>
                          <Text style={[styles.dataText4, {width: wp(16)}]}>
                            {item?.duration == 'weekly'
                              ? '7'
                              : item?.duration == 'month'
                              ? '28'
                              : item?.period}
                          </Text>
                          <Text style={[styles.dataText4, {width: wp(22)}]}>
                            <Switch
                              trackColor={{
                                false: COLORS.errorColor,
                                true: COLORS.greenColor,
                              }}
                              thumbColor={
                                item?.is_active ? '#f4f3f4' : '#f4f3f4'
                              }
                              ios_backgroundColor={COLORS.errorColor}
                              onValueChange={() => handleEditStatus(item)}
                              value={item?.is_active}
                            />
                          </Text>
                          <View style={styles.editButtonView}>
                            <TouchableOpacity
                              style={styles.editButton}
                              onPress={() => {
                                setSelectedId(item.id);
                                setName(item?.name);
                                setPrice(`${item?.price}`);
                                setPeriod(`${item?.period}`);
                                setDiscount(`${item?.cutoff_price}`);
                                setBot(
                                  `${
                                    item?.features[item?.features.length - 1]
                                      .int_value
                                  }`,
                                );
                                setEditPopupVisible(true);
                              }}>
                              <Text style={[styles.editText]}>Edit Plan</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
      <EditPlanPopup
        modalVisible={editPopupVisible}
        setModalVisible={setEditPopupVisible}
        name={name}
        price={price}
        setPrice={setPrice}
        period={period}
        setPeriod={setPeriod}
        discount={discount}
        setDiscount={setDiscount}
        bot={bot}
        setBot={setBot}
        onPress={() => handleEditPlan()}
        FinishOnPress={FinishOnPress}
      />
      <AddPlanPopup
        modalVisible={addPopupVisible}
        setModalVisible={setAddPopupVisible}
        name={name}
        setName={setName}
        price={price}
        setPrice={setPrice}
        period={period}
        setPeriod={setPeriod}
        discount={discount}
        setDiscount={setDiscount}
        bot={bot}
        setBot={setBot}
        onPress={() => handleAddPlan()}
        FinishOnPress={FinishOnPress}
      />
    </View>
  );
};

export default ManagePlans;
