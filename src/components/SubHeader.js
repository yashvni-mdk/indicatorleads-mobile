import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from './Pixel/index';
import bell from '../images/bell.png';
import volume from '../images/volume.png';
import volumeMute from '../images/volumeMute.png';
import back from '../images/back.png';
import {COLORS, Fonts} from '../utils';
import {useTranslation} from 'react-i18next';

const SubHeader = ({
  backbutton,
  title,
  onPress,
  rightValue,
  readPress,
  notificationCount,
}) => {
  const {t} = useTranslation();
  const [volumeState, setVolumeState] = useState(true);
  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      <View style={styles.container}>
        <View style={styles.titleView}>
          <TouchableOpacity style={styles.backIcon} onPress={onPress}>
            <Image style={styles.moreIcon} source={back} />
          </TouchableOpacity>
          <Text style={styles.titleHeader}>{title}</Text>
        </View>
        {rightValue ? (
          <View style={styles.titleView}>
            <TouchableOpacity
              style={{
                width: wp(25),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={readPress}>
              <Text
                style={[
                  styles.readAllText,
                  {
                    color:
                      notificationCount > 0 ? COLORS.primary : COLORS.greyColor,
                  },
                ]}>
                {t('read_all')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.titleView}></View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SubHeader;

const styles = StyleSheet.create({
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
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(5),
  },
  readAllText: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.greyColor,
  },
});
