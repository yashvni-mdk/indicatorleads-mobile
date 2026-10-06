import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  TouchableWithoutFeedback,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';
import SelectDropdown from 'react-native-select-dropdown';

const durationArray = ['Days', 'Weekly', 'Monthly'];

export function AddPlanPopup({
  modalVisible,
  setModalVisible,
  name,
  setName,
  price,
  setPrice,
  duration,
  setDuration,
  period,
  setPeriod,
  discount,
  setDiscount,
  bot,
  setBot,
  onPress,
  FinishOnPress,
  from,
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
          <View style={styles.firstStepView}>
            <Text style={styles.titleText}>{'Add New Plan'}</Text>
            <View style={styles.rowView}>
              <View style={{width: '48%'}}>
                <Text style={styles.nameText}>NAME</Text>
                <TextInput
                  value={name}
                  onChangeText={text => setName(text)}
                  style={styles.textInputView}
                />
              </View>
              <View style={{width: '48%', alignItems: 'flex-end'}}>
                <Text style={styles.nameText}>ACTUAL PRICE</Text>
                <TextInput
                  value={price}
                  onChangeText={text => setPrice(text)}
                  style={styles.textInputView}
                />
              </View>
            </View>
            <View style={styles.rowView}>
              <View style={{width: '48%'}}>
                <Text style={styles.nameText}>DAYS</Text>
                <TextInput
                  value={period}
                  onChangeText={text => setPeriod(text)}
                  style={styles.textInputView}
                />
              </View>
              <View style={{width: '49%', alignItems: 'flex-end'}}>
                <Text style={styles.nameText}>DISCOUNTED PRICE</Text>
                <TextInput
                  value={discount}
                  onChangeText={text => setDiscount(text)}
                  style={styles.textInputView}
                />
              </View>
            </View>
            <View style={{width: '90%', marginTop: hp(1)}}>
              <Text style={styles.nameText}>BOT</Text>
              <TextInput
                value={bot}
                onChangeText={text => setBot(text)}
                style={[styles.textInputView, {width: '46%'}]}
              />
            </View>
            <View style={styles.buttonView}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.manualText}>{'CANCEL'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => onPress(from)}>
                {FinishOnPress ? (
                  <ActivityIndicator size={'small'} color={COLORS.white} />
                ) : (
                  <Text style={styles.nextText}>{'SUBMIT'}</Text>
                )}
              </TouchableOpacity>
            </View>
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
  nextButton: {
    width: '30%',
    height: hp(4.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginTop: hp(3),
    marginRight: wp(3),
  },
  nextText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
  },
  firstStepView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leverageView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(6),
    marginTop: hp(2),
  },
  leverageText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.titleText,
  },
  leverageTextInput: {
    fontSize: hp(2.1),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    paddingVertical: Platform.OS == 'ios' ? hp(0.5) : hp(0),
    width: wp(18),
    borderWidth: 0.5,
    borderColor: COLORS.errorColor,
    marginLeft: wp(3),
    borderRadius: 5,
    paddingHorizontal: wp(2),
    textAlign: 'center',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '96%',
    marginLeft: wp(4),
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
  errorText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.errorColor,
  },
  manualText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
  },
  cancelButton: {
    width: '30%',
    height: hp(4.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginTop: hp(3),
    marginRight: wp(3),
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '92%',
    justifyContent: 'center',
    marginTop: hp(1),
  },
  textInputView: {
    width: '92%',
    paddingVertical: hp(0.2),
    borderWidth: 0.5,
    borderColor: COLORS.black,
    paddingHorizontal: wp(2),
    borderRadius: 5,
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  nameText: {
    fontSize: hp(1.8),
    marginVertical: hp(1),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
    width: '92%',
  },
  dropdownItemTxtStyle: {
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.7),
    marginLeft: wp(2),
  },
  dropdownView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // paddingLeft: wp(1),
    height: hp(4),
    borderBottomWidth: 0,
  },
  dropdown2BtnStyle: {
    width: wp(27),
    height: hp(4),
    backgroundColor: COLORS.white,
    borderRadius: 4,
    alignSelf: 'flex-start',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    paddingLeft: 0,
    borderWidth: 0.5,
    borderColor: COLORS.black,
  },
  dropdown2BtnStyle1: {
    width: '92%',
    height: hp(4),
    backgroundColor: COLORS.white,
    borderRadius: 4,
    alignSelf: 'flex-start',
    paddingLeft: 0,
    borderWidth: 0.5,
    borderColor: COLORS.black,
  },
  dropdown2BtnTxtStyle: {
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(2),
    textAlign: 'left',
    paddingLeft: 0,
  },
  dropdown2DropdownStyle: {
    backgroundColor: COLORS.lightPrimary,
    borderRadius: 4,
    maxHeight: hp(25),
    // borderRadius: 12,
  },
  dropdown2RowTxtStyle: {
    color: '#000',
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.8),
    textAlign: 'left',
    paddingLeft: wp(1),
  },
});
