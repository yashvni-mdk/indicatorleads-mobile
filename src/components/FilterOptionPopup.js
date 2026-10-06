import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';
import Modal from 'react-native-modal';

export function FilterOptionPopup({
  modelVisible,
  setModelVisible,
  setTrendSelect,
  trandsOptionArray,
}) {
  const selectedValue = (item, index) => {
    let FilterValue = trandsOptionArray;
    FilterValue[index].selected = !item.selected;
    setTrendSelect(FilterValue);
  };

  return (
    <Modal
      isVisible={modelVisible}
      animationIn={'bounceInUp'}
      animationOut={'bounceOutDown'}
      onBackdropPress={() => setModelVisible(false)}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={() => setModelVisible(false)}>
        <View style={styles.modalView}>
          <TouchableOpacity activeOpacity={1}>
            <ScrollView contentContainerStyle={{paddingBottom: hp(2)}}>
              {trandsOptionArray.map((item, index) => {
                return (
                  <View key={index} style={styles.checkboxView}>
                    <TouchableOpacity
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: item.selected
                            ? COLORS.primary
                            : COLORS.white,
                        },
                      ]}
                      onPress={() =>
                        selectedValue(item, index)
                      }></TouchableOpacity>
                    <Text style={styles.checkboxValueText}>{item.name}</Text>
                  </View>
                );
              })}
              {/* <View style={styles.checkboxView}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor:
                        trendSelect == 'Very Bullish'
                          ? COLORS.primary
                          : COLORS.white,
                    },
                  ]}
                  onPress={() => {
                    setTrendSelect('Very Bullish');
                  }}></TouchableOpacity>
                <Text style={styles.checkboxValueText}>Very Bullish</Text>
              </View>
              <View style={styles.checkboxView}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor:
                        trendSelect == 'Bullish' ? COLORS.primary : COLORS.white,
                    },
                  ]}
                  onPress={() => {
                    setTrendSelect('Bullish');
                  }}></TouchableOpacity>
                <Text style={styles.checkboxValueText}>Bullish</Text>
              </View>
              <View style={styles.checkboxView}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor:
                        trendSelect == 'Neutral' ? COLORS.primary : COLORS.white,
                    },
                  ]}
                  onPress={() => {
                    setTrendSelect('Neutral');
                  }}></TouchableOpacity>
                <Text style={styles.checkboxValueText}>Neutral</Text>
              </View>
              <View style={styles.checkboxView}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor:
                        trendSelect == 'Bearish' ? COLORS.primary : COLORS.white,
                    },
                  ]}
                  onPress={() => {
                    setTrendSelect('Bearish');
                  }}></TouchableOpacity>
                <Text style={styles.checkboxValueText}>Bearish</Text>
              </View>
              <View style={styles.checkboxView}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor:
                        trendSelect == 'Very Bearish' ? COLORS.primary : COLORS.white,
                    },
                  ]}
                  onPress={() => {
                    setTrendSelect('Very Bearish');
                  }}></TouchableOpacity>
                <Text style={styles.checkboxValueText}>Very Bearish</Text>
              </View>
              <View style={styles.checkboxView}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor:
                        trendSelect == 'Extremely Bearish' ? COLORS.primary : COLORS.white,
                    },
                  ]}
                  onPress={() => {
                    setTrendSelect('Extremely Bearish');
                  }}></TouchableOpacity>
                <Text style={styles.checkboxValueText}>Extremely Bearish</Text>
              </View> */}
            </ScrollView>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '110%',
    height: '100%',
    alignItems: 'center',
    marginLeft: -wp(5),
    justifyContent: 'flex-end',
  },
  modalView: {
    width: '100%',
    height: hp(39),
    backgroundColor: COLORS.white,
    marginBottom: -hp(2),
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
  },
  checkboxView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp(4),
    height: hp(5),
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  checkboxValueText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    marginLeft: wp(4),
  },
});
