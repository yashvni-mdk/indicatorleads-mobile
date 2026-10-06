import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';

const titleArray = [
  {name: 'None'},
  {name: 'All'},
  {name: 'Extremely Bullish'},
  {name: 'Extremely Bearish'},
  {name: 'Very Bullish'},
  {name: 'Very Bearish'},
  {name: 'Bullish'},
  {name: 'Bearish'},
  {name: 'Resistance Broken'},
  {name: 'Support Broken'},
  {name: 'Neutral'},
];

export function TredListPopup({
  modalVisible,
  setModalVisible,
  ticker,
  selectedValue,
  onSelectValue,
  selectedTicker,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.maneModalView}>
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false);
          }}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={[styles.container]}>
          <Text style={styles.titleText}>{selectedTicker}</Text>
          <View style={styles.headingsView}>
            {titleArray.map((item, index) => {
              if (index === titleArray.length - 1) {
                return (
                  <View key={item.name} style={styles.heading1}>
                    <TouchableOpacity
                      onPress={() => {
                        onSelectValue(item.name);
                        setModalVisible(false);
                      }}
                      style={[
                        styles.titleView,
                        {
                          backgroundColor:
                            selectedValue === item.name
                              ? COLORS.primary
                              : COLORS.white,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color:
                              selectedValue !== item.name
                                ? COLORS.primary
                                : COLORS.white,
                          },
                        ]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              } else {
                return (
                  <View key={item.name} style={styles.heading}>
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        onSelectValue(item.name);
                        setModalVisible(false);
                      }}
                      style={[
                        styles.titleView,
                        {
                          backgroundColor:
                            selectedValue == item.name
                              ? item.name == 'None'
                                ? COLORS.black
                                : COLORS.primary
                              : COLORS.white,
                          borderColor:
                            item.name == 'None' ? COLORS.black : COLORS.primary,
                        },
                      ]}>
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color:
                              selectedValue != item.name
                                ? item.name == 'None'
                                  ? COLORS.black
                                  : COLORS.primary
                                : COLORS.white,
                          },
                        ]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    // minHeight: hp(25),
    // maxHeight: hp(60),
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: hp(1.5),
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  maneModalView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  listingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(1),
  },
  titleText: {
    fontSize: hp(2.6),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
    width: '92%',
  },
  headingsView: {
    width: '92%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginVertical: hp(3),
  },
  heading1: {
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleView: {
    width: wp(40),
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(1),
    marginTop: hp(2),
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  optionText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
  },
  valueText: {
    fontSize: hp(2.4),
    fontFamily: Fonts.FONTS.PoppinsBold,
    textAlign: 'center',
    marginVertical: hp(0.75),
  },
});
