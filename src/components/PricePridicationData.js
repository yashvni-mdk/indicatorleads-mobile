import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';
import star from '../images/star.png';
import star1 from '../images/star1.png';
import bell1 from '../images/bell1.png';
import bell2 from '../images/bell2.png';
// import Modal from 'react-native-modal';

export function PricePridicationData({
  item,
  index,
  onDeleteFavoriteData,
  onPostFavoriteData,
  setBottomModal,
  setTickerSelected,
  setTrendSelect,
}) {
  const countDecimalDigits = async number => {
    const numberString = number;

    if (numberString.includes('.')) {
      // Split the string at the decimal point
      const decimalPart = numberString.split('.')[1];
      // Return the length of the decimal part
      return decimalPart.length;
    } else {
      // If there is no decimal point, return 0
      return 0;
    }
  };

  const decimalDigitsInPrice = countDecimalDigits(item?.lastPrice);
  return (
    <View
      key={item.symbol}
      style={[
        styles.dataActiveView,
        {
          backgroundColor:
            index % 2 === 0 ? COLORS.lightPrimary : COLORS.lightPrimary3,
        },
      ]}>
      <TouchableOpacity
        style={styles.imageView1}
        onPress={() => {
          item.favoriteStatus
            ? onDeleteFavoriteData(item.symbol)
            : onPostFavoriteData(item.symbol);
        }}>
        <Image
          style={[
            styles.starIcon,
            {
              tintColor: item.favoriteStatus
                ? COLORS.goldenColor
                : COLORS.black,
            },
          ]}
          source={item.favoriteStatus ? star1 : star}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.imageView}
        onPress={() => {
          setBottomModal(true);
          setTickerSelected(item.symbol);
          if (item.trends) {
            setTrendSelect(item.trends);
          } else {
            setTrendSelect('None');
          }
        }}>
        <Image
          style={[
            styles.starIcon,
            {
              tintColor: item.notificationStatus
                ? COLORS.goldenColor
                : COLORS.black,
            },
          ]}
          source={item.notificationStatus ? bell2 : bell1}
        />
      </TouchableOpacity>
      <View style={styles.coinStartView}>
        <Text style={styles.dataText3}>{item.symbol}</Text>
      </View>
      <View style={styles.coinStartView}>
        <Text style={[styles.dataText1]}>{item.lastPrice}</Text>
      </View>
      <View style={styles.coinStartView}>
        <Text style={[styles.dataText1]}>{item.priceChangePercent}</Text>
      </View>
      <View style={styles.coinStartView}>
        <Text
          style={[
            styles.dataText1,
            {
              color:
                item.status === 'Resistance Broken'
                  ? '#00008b'
                  : item.status === 'Bullish'
                  ? '#236a4f'
                  : item.status === 'Very Bullish'
                  ? '#349b73'
                  : item.status === 'Extremely Bullish'
                  ? '#39ff14'
                  : item.status === 'Support Broken'
                  ? '#4444b2'
                  : item.status === 'Bearish'
                  ? '#a81e08eb'
                  : item.status === 'Very Bearish'
                  ? '#d83218eb'
                  : item.status === 'Extremely Bearish'
                  ? '#ff3314'
                  : '#ffa500',
            },
          ]}>
          {item.status}
        </Text>
      </View>
      <View style={styles.coinStartView}>
        <Text style={[styles.dataText]}>
          {parseFloat(item.tomorrow_prediction).toFixed(
            decimalDigitsInPrice._j,
          )}
        </Text>
      </View>
      <View style={styles.coinStartView}>
        <Text style={[styles.dataText]}>
          {parseFloat(item.day_after_tomorrow_prediction).toFixed(
            decimalDigitsInPrice._j,
          )}
        </Text>
      </View>
      <View style={styles.coinStartView}>
        <Text
          style={[
            styles.dataText1,
            {
              color:
                item.selectedValue === item.tomorrow_prediction
                  ? COLORS.darkGreen
                  : COLORS.errorColor,
            },
          ]}>
          {parseFloat(item.futurePriceVisible).toFixed(decimalDigitsInPrice._j)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dataActiveView: {
    width: wp(32),
    maxHeight: hp(86),
    minHeight: hp(28),
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderRightColor: COLORS.white,
    // flexDirection: 'row',
    // borderBottomWidth: 0.5,
  },
  dataText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.apiError,
    textAlign: 'center',
    // height: hp(7),
  },
  dataText3: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    textAlign: 'center',
    marginHorizontal: wp(2),
  },
  dataText1: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.apiError,
    textAlign: 'center',
    marginHorizontal: wp(2),
  },
  dataText5: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.apiError,
    textAlign: 'center',
    marginHorizontal: wp(2),
    position: 'absolute',
    left: 0,
  },
  starIcon: {
    width: wp(5),
    height: hp(3),
    resizeMode: 'contain',
  },
  imageView: {
    width: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(7),
  },
  imageView1: {
    // width: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(7),
    // marginLeft: wp(31),
  },
  coinStartView: {
    height: hp(7),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 0.5,
    borderTopColor: COLORS.white,
    width: wp(35),
  },
  coinStartView1: {
    height: hp(7),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
