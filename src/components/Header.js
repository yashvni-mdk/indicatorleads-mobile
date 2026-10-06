import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  DevSettings,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from './Pixel/index';
import bell from '../images/bell.png';
import sort from '../images/sort.png';
import volumeMute from '../images/volumeMute.png';
import sync from '../images/sync.png';
import {COLORS, Fonts} from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import {onPostAIDataApi} from '../services/Api';
import {fetchSttingData} from '../redux/reducer';
import back from '../images/back.png';
import RNRestart from 'react-native-restart';
import useOrientation from './OrientationComponent';

const Header = ({
  backbutton,
  title,
  onPress,
  notificationPress,
  navigation,
  backVisible,
  userRole,
  notify,
  filterVisible,
  setFilterVisible,
}) => {
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const dispatch = useDispatch();
  const settingData = useSelector(state => state.settingData);
  const [volumeState, setVolumeState] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (settingData) {
      setVolumeState(settingData.sound_notification);
    }
  }, [settingData]);

  useEffect(() => {
    const subscribe = navigation.addListener('focus', () => {
      onGetCountData();
    });
  }, [navigation]);

  const onGetCountData = async () => {
    let count = await AsyncStorage.getItem('notificationCount');
    console.log('get Count>>>>>>>>>', count);
    setRefresh(!refresh);
    setNotificationCount(count);
  };

  const soundOnPress = async value => {
    // AsyncStorage.setItem('soundValue', JSON.stringify(!volumeState));
    try {
      setVolumeState(value);
      let raw = JSON.stringify({
        sound_notification: value,
      });
      const response = await onPostAIDataApi(raw);
      console.log('Response volume>>', response.data);
      if (response.data) {
        dispatch(fetchSttingData(response.data));
      }
    } catch (err) {
      console.log('Error:', err.response.data);
      // alert(err.response.data.detail);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      <View style={styles.container}>
        <View style={styles.titleView}>
          {backVisible && (
            <TouchableOpacity style={styles.backIcon} onPress={onPress}>
              <Image style={styles.moreIcon} source={back} />
            </TouchableOpacity>
          )}
          {userRole == 'admin' && (
            <TouchableOpacity
              style={styles.backIcon}
              onPress={() => {
                navigation.openDrawer();
                if (filterVisible) {
                  setFilterVisible(false);
                }
              }}>
              <Image style={styles.moreIcon} source={sort} />
            </TouchableOpacity>
          )}
          <Text style={styles.titleHeader}>{title}</Text>
        </View>
        <View style={styles.titleView}>
          {/* <TouchableOpacity onPress={() => soundOnPress(!volumeState)}>
            <Image
              style={styles.bellIcon}
              source={volumeState ? volume : volumeMute}
            />
          </TouchableOpacity> */}
          {!notify && (
            <TouchableOpacity
              style={styles.bellButtonView}
              onPress={notificationPress}>
              <Image
                style={[styles.bellIcon, {marginHorizontal: wp(3)}]}
                source={bell}
              />
              {notificationCount > 0 && (
                <View style={styles.notificationView}>
                  <Text style={styles.countText}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{marginHorizontal: isPortrait ? wp(2) : 0}}
            onPress={() => RNRestart.restart()}>
            <Image style={styles.bellIcon} source={sync} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const portraitStyles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: wp(3),
    justifyContent: 'space-between',
    position: 'absolute',
    width: '100%',
  },
  moreIcon: {
    width: wp(6),
    height: hp(5),
    resizeMode: 'contain',
    tintColor: COLORS.titleText,
  },
  titleHeader: {
    fontSize: hp(2.5),
    color: COLORS.titleText,
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    marginLeft: wp(3),
  },
  bellIcon: {
    width: wp(5),
    height: hp(4),
    resizeMode: 'contain',
    tintColor: COLORS.primary,
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: wp(10),
  },
  notificationView: {
    position: 'absolute',
    top: -5,
    right: 0,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    height: hp(3),
    width: hp(3),
    borderRadius: hp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: hp(1.3),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.primary,
  },
  bellButtonView: {
    width: wp(11),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(5),
  },
});

const landscapeStyles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: wp(3),
    justifyContent: 'space-between',
    // position: 'absolute',
    width: '100%',
  },
  moreIcon: {
    width: wp(6),
    height: hp(4),
    resizeMode: 'contain',
    tintColor: COLORS.titleText,
  },
  titleHeader: {
    fontSize: wp(2.2),
    color: COLORS.titleText,
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    marginLeft: wp(1),
  },
  bellIcon: {
    width: wp(5),
    height: hp(4),
    resizeMode: 'contain',
    tintColor: COLORS.primary,
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: wp(7),
  },
  notificationView: {
    position: 'absolute',
    top: -5,
    right: 0,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    height: hp(3),
    width: hp(3),
    borderRadius: hp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: hp(1.3),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.primary,
  },
  bellButtonView: {
    width: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(4),
  },
});
