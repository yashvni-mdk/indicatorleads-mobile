import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import styles from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import {hasNotch} from 'react-native-device-info';
import {COLORS} from '../../utils';
import wifi from '../../images/wifi.png';

const WiFiScreen = ({navigation}) => {
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
        <Image style={styles.wifiImage} source={wifi} />
        <Text style={styles.titleHeader}>{`Network issue\nTry again after some time`}</Text>
      </View>
    </View>
  );
};

export default WiFiScreen;
