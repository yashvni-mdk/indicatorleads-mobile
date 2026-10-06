import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';
import useOrientation from './OrientationComponent';

export function ErrorComponent({errorMessage}) {
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  return (
    <View style={styles.container}>
      <View style={styles.errorIcon}>
        <Text style={styles.imageText}>{'!'}</Text>
      </View>
      <Text style={styles.errorText}>{errorMessage}</Text>
    </View>
  );
}

const portraitStyles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: hp(2),
    backgroundColor: COLORS.errorBG,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: hp(1.5),
    marginVertical: hp(1.5),
  },
  errorText: {
    fontSize: hp(2.2),
    color: COLORS.apiError,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    marginLeft: wp(2.5),
  },
  errorIcon: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(5),
    backgroundColor: COLORS.apiError,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(3),
    marginBottom: hp(0.2),
  },
  imageText: {
    fontSize: hp(1.6),
    color: COLORS.white,
    fontFamily: Fonts.FONTS.PoppinsBold,
  },
});

const landscapeStyles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: hp(2),
    backgroundColor: COLORS.errorBG,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: hp(1.5),
    marginVertical: hp(1.5),
  },
  errorText: {
    fontSize: hp(2.2),
    color: COLORS.apiError,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    marginLeft: wp(2.5),
  },
  errorIcon: {
    width: wp(3),
    height: wp(3),
    borderRadius: wp(3),
    backgroundColor: COLORS.apiError,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(3),
    marginBottom: hp(0.2),
  },
  imageText: {
    fontSize: hp(3),
    color: COLORS.white,
    fontFamily: Fonts.FONTS.PoppinsBold,
  },
});
