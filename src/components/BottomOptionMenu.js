import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';
import {useTranslation} from 'react-i18next';
// import Modal from 'react-native-modal';

export function BottomOptionMenu({
  modelVisible,
  setModelVisible,
  setTrendSelect,
  trendSelect,
}) {
  const {t} = useTranslation();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modelVisible}
      onRequestClose={() => setModelVisible(false)}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={() => setModelVisible(false)}>
        <View style={styles.modalView}>
          <TouchableOpacity activeOpacity={1}>
            <ScrollView contentContainerStyle={{paddingBottom: hp(2)}}>
              <View style={styles.checkboxView}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor:
                        trendSelect == 'None' ? COLORS.primary : COLORS.white,
                    },
                  ]}
                  onPress={() => {
                    setTrendSelect('None');
                    setModelVisible(false);
                  }}></TouchableOpacity>
                <Text style={styles.checkboxValueText}>{t('none')}</Text>
              </View>
              <View style={styles.checkboxView}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor:
                        trendSelect == 'All' ? COLORS.primary : COLORS.white,
                    },
                  ]}
                  onPress={() => {
                    setTrendSelect('All');
                    setModelVisible(false);
                  }}></TouchableOpacity>
                <Text style={styles.checkboxValueText}>{t('all')}</Text>
              </View>
              <View style={styles.checkboxView}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor:
                        trendSelect == 'Extremely Bullish'
                          ? COLORS.primary
                          : COLORS.white,
                    },
                  ]}
                  onPress={() => {
                    setTrendSelect('Extremely Bullish');
                    setModelVisible(false);
                  }}></TouchableOpacity>
                <Text style={styles.checkboxValueText}>
                  {t('extremely_bullish')}
                </Text>
              </View>
              <View style={styles.checkboxView}>
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
                    setModelVisible(false);
                  }}></TouchableOpacity>
                <Text style={styles.checkboxValueText}>
                  {t('very_bullish')}
                </Text>
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
                    setModelVisible(false);
                  }}></TouchableOpacity>
                <Text style={styles.checkboxValueText}>{t('bullish')}</Text>
              </View>
              <View style={styles.checkboxView}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor:
                        trendSelect == 'Resistance Broken'
                          ? COLORS.primary
                          : COLORS.white,
                    },
                  ]}
                  onPress={() => {
                    setTrendSelect('Resistance Broken');
                    setModelVisible(false);
                  }}></TouchableOpacity>
                <Text style={styles.checkboxValueText}>
                  {t('resistance_broken')}
                </Text>
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
                    setModelVisible(false);
                  }}></TouchableOpacity>
                <Text style={styles.checkboxValueText}>{t('neutral')}</Text>
              </View>
              <View style={styles.checkboxView}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor:
                        trendSelect == 'Support Broken'
                          ? COLORS.primary
                          : COLORS.white,
                    },
                  ]}
                  onPress={() => {
                    setTrendSelect('Support Broken');
                    setModelVisible(false);
                  }}></TouchableOpacity>
                <Text style={styles.checkboxValueText}>
                  {t('support_broken')}
                </Text>
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
                    setModelVisible(false);
                  }}></TouchableOpacity>
                <Text style={styles.checkboxValueText}>{t('bearish')}</Text>
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
                    setModelVisible(false);
                  }}></TouchableOpacity>
                <Text style={styles.checkboxValueText}>
                  {t('very_bearish')}
                </Text>
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
                    setModelVisible(false);
                  }}></TouchableOpacity>
                <Text style={styles.checkboxValueText}>
                  {t('extremely_bearish')}
                </Text>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalView: {
    width: '100%',
    height: hp(45),
    backgroundColor: COLORS.white,
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    paddingVertical: hp(1),
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
