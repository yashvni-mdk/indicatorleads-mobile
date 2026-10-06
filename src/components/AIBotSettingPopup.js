import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
  TouchableWithoutFeedback,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';
// import Modal from 'react-native-modal';
import StepIndicator from 'react-native-step-indicator';
import Swiper from 'react-native-swiper';
import edit from '../images/edit.png';
import {useTranslation} from 'react-i18next';

const firstIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 5,
  separatorFinishedColor: COLORS.greenColor,
  separatorUnFinishedColor: COLORS.lightPrimary1,
  stepIndicatorFinishedColor: COLORS.greenColor,
  stepIndicatorUnFinishedColor: COLORS.lightPrimary1,
  stepIndicatorCurrentColor: COLORS.white,
  stepIndicatorLabelFontSize: 15,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: COLORS.black,
  stepIndicatorLabelFinishedColor: COLORS.white,
  stepIndicatorLabelUnFinishedColor: COLORS.white,
  labelColor: '#666666',
  labelSize: 12,
  stepStrokeCurrentColor: COLORS.primary,
  stepStrokeFinishedColor: COLORS.greenColor,
};

export function AIBotSettingPopup({
  modalVisible,
  setModalVisible,
  onPress,
  currentPage,
  setCurrentPage,
  leverage,
  setLeverage,
  amount,
  setAmount,
  profit,
  setProfit,
  loss,
  setLoss,
  sellProfit,
  setSellProfit,
  sellLoss,
  setSellLoss,
  dailyLoss,
  setDailyLoss,
  dailyProfit,
  setDailyProfit,
  botConfig,
  setBotConfig,
  onFinishStatus,
  FinishOnPress,
  setHours,
  hours,
  activeSignal,
  errorAIBot,
}) {
  const {t} = useTranslation();
  const leverageRef = useRef(null);
  const amountRef = useRef(null);
  const [errorShow, setErrorShow] = useState(false);
  const renderLabel = ({position, label, currentPosition}) => {
    return (
      <Text
        style={
          position === currentPosition
            ? styles.stepLabelSelected
            : styles.stepLabel
        }>
        {label}
      </Text>
    );
  };

  const toggleSelection = hour => {
    if (hours.includes(hour)) {
      setHours(hours.filter(h => h !== hour));
    } else {
      setHours([...hours, hour]);
    }
  };

  const renderViewPagerPage = () => {
    return (
      <View style={styles.page}>
        {currentPage === 0 ? (
          <View style={styles.firstStepView}>
            <View style={styles.leverageView}>
              <Text style={styles.leverageText}>{t('leverage')}</Text>
              <TextInput
                ref={leverageRef}
                onChangeText={setLeverage}
                value={leverage}
                style={styles.leverageTextInput}
                keyboardType={'number-pad'}
              />
            </View>
            {currentPage === 0 && errorShow && (
              <Text style={[styles.errorText, {marginTop: hp(1)}]}>
                {t('enter_a_value')}
              </Text>
            )}
            <TouchableOpacity
              style={[
                styles.nextButton,
                {marginTop: errorShow ? hp(2) : hp(2.5)},
              ]}
              onPress={() => {
                if (parseFloat(leverage) > 0 && parseFloat(leverage) < 50) {
                  setErrorShow(false);
                  setCurrentPage(currentPage + 1);
                } else {
                  setErrorShow(true);
                }
              }}>
              <Text style={styles.nextText}>{t('next')}</Text>
            </TouchableOpacity>
          </View>
        ) : currentPage === 1 ? (
          <View style={styles.firstStepView}>
            <View style={styles.leverageView}>
              <Text style={styles.leverageText}>{t('amount')}</Text>
              <TextInput
                ref={amountRef}
                onChangeText={setAmount}
                value={amount}
                style={styles.leverageTextInput}
                keyboardType={'number-pad'}
                autoFocus={false}
              />
            </View>
            {currentPage === 1 && errorShow && (
              <Text style={[styles.errorText, {marginTop: hp(1)}]}>
                {t('make_sure_it_is_at_least')}
              </Text>
            )}
            <View style={styles.buttonView}>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => {
                  setCurrentPage(currentPage - 1);
                  setErrorShow(false);
                }}>
                <Text style={styles.nextText}>{t('prev')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => {
                  if (parseFloat(amount) >= parseFloat(leverage) * 20) {
                    setErrorShow(false);
                    setCurrentPage(currentPage + 1);
                  } else {
                    setErrorShow(true);
                  }
                }}>
                <Text style={styles.nextText}>{t('next')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : currentPage === 2 ? (
          <View style={styles.firstStepView}>
            <Text style={styles.buyText}>{t('buy')}</Text>
            <View style={styles.leverageView}>
              <View style={styles.profitView}>
                <Text style={styles.leverageText1}>{t('take_profit')}</Text>
                <TextInput
                  value={profit}
                  onChangeText={text => setProfit(text)}
                  style={styles.leverageTextInput1}
                  keyboardType={'number-pad'}
                />
              </View>
              <View style={{alignItems: 'center'}}>
                <Text style={styles.leverageText1}>{t('stop_loss')}</Text>
                <TextInput
                  value={loss}
                  onChangeText={text => setLoss(text)}
                  style={styles.leverageTextInput1}
                  keyboardType={'number-pad'}
                />
              </View>
            </View>
            <Text style={styles.sellText}>{t('sell')}</Text>
            <View style={styles.leverageView}>
              <View style={styles.profitView}>
                <Text style={styles.leverageText1}>{t('take_profit')}</Text>
                <TextInput
                  value={sellProfit}
                  onChangeText={text => setSellProfit(text)}
                  style={styles.leverageTextInput1}
                  keyboardType={'number-pad'}
                />
              </View>
              <View style={{alignItems: 'center'}}>
                <Text style={styles.leverageText1}>{t('stop_loss')}</Text>
                <TextInput
                  value={sellLoss}
                  onChangeText={text => setSellLoss(text)}
                  style={styles.leverageTextInput1}
                  keyboardType={'number-pad'}
                />
              </View>
            </View>
            {currentPage === 2 && errorShow && (
              <Text style={[styles.errorText, {marginTop: hp(2)}]}>
                {t('values_should_be_greater_then_1')}
              </Text>
            )}
            <View style={[styles.buttonView, {marginTop: hp(1)}]}>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => {
                  setCurrentPage(currentPage - 1);
                  setErrorShow(false);
                }}>
                <Text style={styles.nextText}>{t('prev')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => {
                  if (
                    parseFloat(profit) > 0 &&
                    parseFloat(loss) > 0 &&
                    parseFloat(sellProfit) > 0 &&
                    parseFloat(sellLoss) > 0
                  ) {
                    setErrorShow(false);
                    setCurrentPage(currentPage + 1);
                  } else {
                    setErrorShow(true);
                  }
                }}>
                <Text style={styles.nextText}>{t('next')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : currentPage === 3 ? (
          <View style={styles.firstStepView}>
            <View style={styles.leverageView}>
              <Text style={[styles.leverageText, {width: '30%'}]}>
                {t('daily_profit')}
              </Text>
              <TextInput
                value={dailyProfit}
                onChangeText={text => setDailyProfit(text)}
                style={styles.leverageTextInput}
                keyboardType={'number-pad'}
              />
            </View>
            <View style={[styles.leverageView, {marginTop: hp(1)}]}>
              <Text style={[styles.leverageText, {width: '30%'}]}>
                {t('daily_loss')}
              </Text>
              <TextInput
                value={dailyLoss}
                onChangeText={text => setDailyLoss(text)}
                style={styles.leverageTextInput}
                keyboardType={'number-pad'}
              />
            </View>
            {currentPage === 3 && errorShow && (
              <Text style={[styles.errorText, {marginTop: hp(1)}]}>
                {t('value_should_lie_between_1_10')}
              </Text>
            )}
            <View style={styles.buttonView}>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => {
                  setCurrentPage(currentPage - 1);
                  setErrorShow(false);
                }}>
                <Text style={styles.nextText}>{t('prev')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => {
                  if (
                    parseFloat(dailyProfit) > 0 &&
                    parseFloat(dailyLoss) > 0 &&
                    parseFloat(dailyProfit) <= 10 &&
                    parseFloat(dailyLoss) <= 10
                  ) {
                    setErrorShow(false);
                    setCurrentPage(currentPage + 1);
                  } else {
                    setErrorShow(true);
                  }
                }}>
                <Text style={styles.nextText}>{t('next')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.firstStepView}>
            <View style={styles.listingView}>
              {activeSignal.One && (
                <TouchableOpacity
                  onPress={() => toggleSelection('1H')}
                  style={[
                    styles.hoursView,
                    {
                      backgroundColor: hours.includes('1H')
                        ? COLORS.greenColor
                        : COLORS.white,
                      borderWidth: hours.includes('1H') ? 0 : 1,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.hoursText,
                      {
                        color: hours.includes('1H')
                          ? COLORS.white
                          : COLORS.greenColor,
                      },
                    ]}>
                    B
                  </Text>
                </TouchableOpacity>
              )}
              {activeSignal.Four && (
                <TouchableOpacity
                  onPress={() => toggleSelection('4H')}
                  style={[
                    styles.hoursView,
                    {
                      backgroundColor: hours.includes('4H')
                        ? COLORS.greenColor
                        : COLORS.white,
                      borderWidth: hours.includes('4H') ? 0 : 1,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.hoursText,
                      {
                        color: hours.includes('4H')
                          ? COLORS.white
                          : COLORS.greenColor,
                      },
                    ]}>
                    A
                  </Text>
                </TouchableOpacity>
              )}
              {activeSignal.oneDay && (
                <TouchableOpacity
                  onPress={() => toggleSelection('1D')}
                  style={[
                    styles.hoursView,
                    {
                      backgroundColor: hours?.includes('1D')
                        ? COLORS.greenColor
                        : COLORS.white,
                      borderWidth: hours?.includes('1D') ? 0 : 1,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.hoursText,
                      {
                        color: hours.includes('1D')
                          ? COLORS.white
                          : COLORS.greenColor,
                      },
                    ]}>
                    I
                  </Text>
                </TouchableOpacity>
              )}
              {activeSignal.Custom && (
                <TouchableOpacity
                  onPress={() => toggleSelection('custom')}
                  style={[
                    styles.hoursView,
                    {
                      backgroundColor: hours?.includes('custom')
                        ? COLORS.greenColor
                        : COLORS.white,
                      borderWidth: hours?.includes('custom') ? 0 : 1,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.hoursText,
                      {
                        color: hours.includes('custom')
                          ? COLORS.white
                          : COLORS.greenColor,
                      },
                    ]}>
                    E
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {errorAIBot && (
              <Text style={[styles.errorText, {marginBottom: hp(1.5)}]}>
                {'Select atleast one option'}
              </Text>
            )}
            <View style={styles.listingView}>
              <Text style={styles.titleText}>{t('margin')}</Text>
              <Text style={styles.ansText}>{t('cross')}</Text>
            </View>
            <View style={styles.listingView}>
              <Text style={styles.titleText}>{`${t('leverage')} =`}</Text>
              <Text style={styles.ansText}>{leverage}</Text>
              <TouchableOpacity onPress={() => setCurrentPage(0)}>
                <Image style={styles.imageStyle} source={edit} />
              </TouchableOpacity>
            </View>
            <View style={styles.listingView}>
              <Text style={styles.titleText}>{`${t('amount')} =`}</Text>
              <Text style={styles.ansText}>{amount}</Text>
              <TouchableOpacity onPress={() => setCurrentPage(1)}>
                <Image style={styles.imageStyle} source={edit} />
              </TouchableOpacity>
            </View>
            <View style={styles.listingView}>
              <Text style={styles.titleText}>{`${t('daily_profit')} =`}</Text>
              <Text style={styles.ansText}>{dailyProfit}</Text>
              <TouchableOpacity onPress={() => setCurrentPage(3)}>
                <Image style={styles.imageStyle} source={edit} />
              </TouchableOpacity>
            </View>
            <View style={styles.listingView}>
              <Text style={styles.titleText}>{`${t('daily_loss')} =`}</Text>
              <Text style={styles.ansText}>{dailyLoss}</Text>
              <TouchableOpacity onPress={() => setCurrentPage(3)}>
                <Image style={styles.imageStyle} source={edit} />
              </TouchableOpacity>
            </View>
            <View style={styles.listingView}>
              <Text style={styles.buyText1}>{t('buy')}</Text>
              <TouchableOpacity onPress={() => setCurrentPage(2)}>
                <Image style={styles.imageStyle} source={edit} />
              </TouchableOpacity>
            </View>
            <View style={styles.listingView}>
              <Text style={styles.titleText}>{`${t('take_profit')} =`}</Text>
              <Text style={styles.ansText}>{profit} %</Text>
              <Text style={[styles.titleText, {marginLeft: wp(5)}]}>
                {`${t('stop_loss')} =`}
              </Text>
              <Text style={styles.ansText}>{loss} %</Text>
            </View>
            <View style={styles.listingView}>
              <Text style={styles.sellText1}>{t('sell')}</Text>
              <TouchableOpacity onPress={() => setCurrentPage(2)}>
                <Image style={styles.imageStyle} source={edit} />
              </TouchableOpacity>
            </View>
            <View style={styles.listingView}>
              <Text style={styles.titleText}>{`${t('take_profit')} =`}</Text>
              <Text style={styles.ansText}>{sellProfit} %</Text>
              <Text style={[styles.titleText, {marginLeft: wp(5)}]}>
                {`${t('stop_loss')} =`}
              </Text>
              <Text style={styles.ansText}>{sellLoss} %</Text>
            </View>
            <View style={styles.buttonView}>
              <View style={[styles.listingView, {marginTop: hp(4)}]}>
                <Text style={[styles.leverageText, {marginRight: wp(2)}]}>
                  {t('AI')}
                </Text>
                <Switch
                  trackColor={{
                    false: COLORS.errorColor,
                    true: COLORS.greenColor,
                  }}
                  thumbColor={botConfig ? '#f4f3f4' : '#f4f3f4'}
                  ios_backgroundColor={COLORS.errorColor}
                  onValueChange={() => setBotConfig(!botConfig)}
                  value={botConfig}
                />
              </View>
              <TouchableOpacity style={styles.nextButton} onPress={onPress}>
                {FinishOnPress ? (
                  <ActivityIndicator size={'small'} color={COLORS.white} />
                ) : (
                  <Text style={styles.nextText}>{t('finish')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

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
        <View
          style={[
            styles.container,
            // {
            //   height:
            //     currentPage === 1 || currentPage === 0
            //       ? errorShow
            //         ? hp(37.5)
            //         : hp(35)
            //       : currentPage === 2
            //       ? errorShow
            //         ? hp(58)
            //         : hp(53)
            //       : currentPage === 3
            //       ? errorShow
            //         ? hp(44.5)
            //         : hp(41.5)
            //       : onFinishStatus
            //       ? hp(26)
            //       : hp(69),
            // },
          ]}>
          <View style={styles.mainViewData}>
            <Text style={[styles.leverageText2]}>{t('ai_bot_setting')}</Text>
            <View style={styles.stepIndicator}>
              <StepIndicator
                customStyles={firstIndicatorStyles}
                currentPosition={currentPage}
                labels={[
                  t('leverage'),
                  t('amount'),
                  t('TP_SL'),
                  t('daily'),
                  t('bot_config'),
                ]}
                renderLabel={renderLabel}
              />
            </View>
          </View>
          <View style={styles.mainViewData}>
            {onFinishStatus ? (
              <View style={{marginTop: -hp(4)}}>
                <Text style={styles.leverageText3}>
                  {botConfig ? t('congratulations') : t('sorry')}
                </Text>
                <Text style={styles.leverageText4}>
                  {t('ai_bot_is')}
                  <Text
                    style={[
                      styles.activeText,
                      {
                        color: botConfig
                          ? COLORS.greenColor
                          : COLORS.errorColor,
                      },
                    ]}>
                    {botConfig ? ` ${t('Activated')}` : ` ${t('Deactivated')}`}
                  </Text>
                </Text>
              </View>
            ) : (
              renderViewPagerPage()
            )}
          </View>
          {/* {onFinishStatus ? (
            <View style={{marginTop: -hp(4)}}>
              <Text style={styles.leverageText3}>
                {botConfig ? 'Congratulations' : 'Sorry'}
              </Text>
              <Text style={styles.leverageText4}>
                AI Bot Is
                <Text
                  style={[
                    styles.activeText,
                    {color: botConfig ? COLORS.greenColor : COLORS.errorColor},
                  ]}>
                  {botConfig ? ' Activated!' : ' Deactivated!'}
                </Text>
              </Text>
            </View>
          ) : (
            <Swiper
              style={{flexGrow: 1, width: '100%'}}
              loop={false}
              index={currentPage}
              autoplay={false}
              showsPagination={false}
              scrollEnabled={false}
              onIndexChanged={page => {
                setCurrentPage(page);
              }}>
              {renderViewPagerPage()}
            </Swiper>
          )} */}
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
  mainViewData: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: hp(2),
    marginRight: wp(3),
  },
  leverageText2: {
    fontSize: hp(2.6),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.titleText,
  },
  leverageText3: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.apiError,
    textAlign: 'center',
  },
  leverageText4: {
    fontSize: hp(2.4),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.apiError,
    textAlign: 'center',
    marginTop: hp(1),
  },
  activeText: {
    fontSize: hp(2.4),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.apiError,
    textAlign: 'center',
  },
  page: {
    width: '100%',
  },
  nextText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
  },
  stepIndicator: {
    marginTop: 12,
    width: '100%',
  },
  stepLabel: {
    fontSize: hp(1.2),
    // textAlign: 'center',
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.white,
  },
  stepLabelSelected: {
    fontSize: hp(1.6),
    textAlign: 'center',
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.textColor,
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
  },
  leverageText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.apiError,
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
    fontStyle: 'italic',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '96%',
    marginLeft: wp(4),
  },
  buyText: {
    fontSize: hp(2.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.greenColor,
    marginBottom: hp(1.5),
  },
  sellText: {
    fontSize: hp(2.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.errorColor,
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  leverageTextInput1: {
    fontSize: hp(2.1),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    paddingVertical: Platform.OS == 'ios' ? hp(0.5) : hp(0),
    width: wp(18),
    textAlign: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.errorColor,
    borderRadius: 5,
    paddingHorizontal: wp(2),
    alignItems: 'center',
    fontStyle: 'italic',
  },
  leverageText1: {
    fontSize: hp(1.9),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.apiError,
    marginVertical: hp(0.5),
  },
  profitView: {
    alignItems: 'center',
    marginRight: wp(6),
  },
  listingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1),
  },
  titleText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.apiError,
  },
  ansText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.greenColor,
  },
  imageStyle: {
    width: wp(5),
    height: hp(3),
    resizeMode: 'contain',
    tintColor: COLORS.primary,
    marginLeft: wp(3),
  },
  buyText1: {
    fontSize: hp(2.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.greenColor,
  },
  sellText1: {
    fontSize: hp(2.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.errorColor,
  },
  errorText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.errorColor,
  },
  hoursView: {
    height: wp(9),
    width: wp(10),
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
  },
  hoursText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.greenColor,
  },
});

// import React, {useState, useRef} from 'react';
// import {
//   View,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Image,
//   Switch,
// } from 'react-native';
// import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
// import {COLORS, Fonts} from '../utils';
// import Modal from 'react-native-modal';
// import StepIndicator from 'react-native-step-indicator';
// import Swiper from 'react-native-swiper';
// import edit from '../images/edit.png';

// const firstIndicatorStyles = {
//   stepIndicatorSize: 30,
//   currentStepIndicatorSize: 40,
//   separatorStrokeWidth: 3,
//   currentStepStrokeWidth: 5,
//   separatorFinishedColor: COLORS.greenColor,
//   separatorUnFinishedColor: COLORS.lightPrimary1,
//   stepIndicatorFinishedColor: COLORS.greenColor,
//   stepIndicatorUnFinishedColor: COLORS.lightPrimary1,
//   stepIndicatorCurrentColor: COLORS.white,
//   stepIndicatorLabelFontSize: 15,
//   currentStepIndicatorLabelFontSize: 15,
//   stepIndicatorLabelCurrentColor: COLORS.black,
//   stepIndicatorLabelFinishedColor: COLORS.white,
//   stepIndicatorLabelUnFinishedColor: COLORS.white,
//   labelColor: '#666666',
//   labelSize: 12,
//   stepStrokeCurrentColor: COLORS.primary,
//   stepStrokeFinishedColor: COLORS.greenColor,
// };

// export function AIBotSettingPopup({
//   modalVisible,
//   setModalVisible,
//   onPress,
//   currentPage,
//   setCurrentPage,
//   leverage,
//   setLeverage,
//   amount,
//   setAmount,
//   profit,
//   setProfit,
//   loss,
//   setLoss,
//   sellProfit,
//   setSellProfit,
//   sellLoss,
//   setSellLoss,
//   dailyLoss,
//   setDailyLoss,
//   dailyProfit,
//   setDailyProfit,
//   botConfig,
//   setBotConfig,
//   onFinishStatus,
// }) {
//   const leverageRef = useRef(null);
//   const amountRef = useRef(null);
//   const [errorShow, setErrorShow] = useState(false);
//   const renderLabel = ({position, label, currentPosition}) => {
//     return (
//       <Text
//         style={
//           position === currentPosition
//             ? styles.stepLabelSelected
//             : styles.stepLabel
//         }>
//         {label}
//       </Text>
//     );
//   };

//   const renderViewPagerPage = () => {
//     return (
//       <View style={styles.page}>
//         {currentPage === 0 ? (
//           <View style={styles.firstStepView}>
//             <View style={styles.leverageView}>
//               <Text style={styles.leverageText}>{'Leverage:'}</Text>
//               <TextInput
//                 ref={leverageRef}
//                 onChangeText={setLeverage}
//                 value={leverage}
//                 style={styles.leverageTextInput}
//                 keyboardType={'number-pad'}
//               />
//             </View>
//             {currentPage === 0 && errorShow && (
//               <Text style={[styles.errorText, {marginTop: hp(1)}]}>
//                 {'Enter a value between 0-50'}
//               </Text>
//             )}
//             <TouchableOpacity
//               style={[
//                 styles.nextButton,
//                 {marginTop: errorShow ? hp(2) : hp(2.5)},
//               ]}
//               onPress={() => {
//                 if (parseFloat(leverage) > 0 && parseFloat(leverage) < 50) {
//                   setErrorShow(false);
//                   setCurrentPage(currentPage + 1);
//                 } else {
//                   setErrorShow(true);
//                 }
//               }}>
//               <Text style={styles.nextText}>Next</Text>
//             </TouchableOpacity>
//           </View>
//         ) : currentPage === 1 ? (
//           <View style={styles.firstStepView}>
//             <View style={styles.leverageView}>
//               <Text style={styles.leverageText}>{'Amount'}</Text>
//               <TextInput
//                 ref={amountRef}
//                 onChangeText={setAmount}
//                 value={amount}
//                 style={styles.leverageTextInput}
//                 keyboardType={'number-pad'}
//                 autoFocus={false}
//               />
//             </View>
//             {currentPage === 1 && errorShow && (
//               <Text style={[styles.errorText, {marginTop: hp(1)}]}>
//                 {`Make sure it's at least 20 times of the leverage`}
//               </Text>
//             )}
//             <View style={styles.buttonView}>
//               <TouchableOpacity
//                 style={styles.nextButton}
//                 onPress={() => {
//                   setCurrentPage(currentPage - 1);
//                   setErrorShow(false);
//                 }}>
//                 <Text style={styles.nextText}>Prev</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.nextButton}
//                 onPress={() => {
//                   if (parseFloat(amount) >= parseFloat(leverage) * 20) {
//                     setErrorShow(false);
//                     setCurrentPage(currentPage + 1);
//                   } else {
//                     setErrorShow(true);
//                   }
//                 }}>
//                 <Text style={styles.nextText}>Next</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ) : currentPage === 2 ? (
//           <View style={styles.firstStepView}>
//             <Text style={styles.buyText}>{'Buy'}</Text>
//             <View style={styles.leverageView}>
//               <View style={styles.profitView}>
//                 <Text style={styles.leverageText1}>{'Take Profit %'}</Text>
//                 <TextInput
//                   value={profit}
//                   onChangeText={text => setProfit(text)}
//                   style={styles.leverageTextInput1}
//                   keyboardType={'number-pad'}
//                 />
//               </View>
//               <View style={{alignItems: 'center'}}>
//                 <Text style={styles.leverageText1}>{'Stop Loss %'}</Text>
//                 <TextInput
//                   value={loss}
//                   onChangeText={text => setLoss(text)}
//                   style={styles.leverageTextInput1}
//                   keyboardType={'number-pad'}
//                 />
//               </View>
//             </View>
//             <Text style={styles.sellText}>{'Sell'}</Text>
//             <View style={styles.leverageView}>
//               <View style={styles.profitView}>
//                 <Text style={styles.leverageText1}>{'Take Profit %'}</Text>
//                 <TextInput
//                   value={sellProfit}
//                   onChangeText={text => setSellProfit(text)}
//                   style={styles.leverageTextInput1}
//                   keyboardType={'number-pad'}
//                 />
//               </View>
//               <View style={{alignItems: 'center'}}>
//                 <Text style={styles.leverageText1}>{'Stop Loss %'}</Text>
//                 <TextInput
//                   value={sellLoss}
//                   onChangeText={text => setSellLoss(text)}
//                   style={styles.leverageTextInput1}
//                   keyboardType={'number-pad'}
//                 />
//               </View>
//             </View>
//             {currentPage === 2 && errorShow && (
//               <Text style={[styles.errorText, {marginTop: hp(1)}]}>
//                 {`TP/SL values should be greater than 1`}
//               </Text>
//             )}
//             <View style={[styles.buttonView, {marginTop: hp(1)}]}>
//               <TouchableOpacity
//                 style={styles.nextButton}
//                 onPress={() => {
//                   setCurrentPage(currentPage - 1);
//                   setErrorShow(false);
//                 }}>
//                 <Text style={styles.nextText}>Prev</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.nextButton}
//                 onPress={() => {
//                   if (
//                     parseFloat(profit) > 0 &&
//                     parseFloat(loss) > 0 &&
//                     parseFloat(sellProfit) > 0 &&
//                     parseFloat(sellLoss) > 0
//                   ) {
//                     setErrorShow(false);
//                     setCurrentPage(currentPage + 1);
//                   } else {
//                     setErrorShow(true);
//                   }
//                 }}>
//                 <Text style={styles.nextText}>Next</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ) : currentPage === 3 ? (
//           <View style={styles.firstStepView}>
//             <View style={styles.leverageView}>
//               <Text style={[styles.leverageText, {width: '30%'}]}>{'Daily Profit %'}</Text>
//               <TextInput
//                 value={dailyProfit}
//                 onChangeText={text => setDailyProfit(text)}
//                 style={styles.leverageTextInput}
//                 keyboardType={'number-pad'}
//               />
//             </View>
//             <View style={[styles.leverageView, {marginTop: hp(1)}]}>
//               <Text style={[styles.leverageText, {width: '30%'}]}>{'Daily Loss %'}</Text>
//               <TextInput
//                 value={dailyLoss}
//                 onChangeText={text => setDailyLoss(text)}
//                 style={styles.leverageTextInput}
//                 keyboardType={'number-pad'}
//               />
//             </View>
//             {currentPage === 3 && errorShow && (
//               <Text style={[styles.errorText, {marginTop: hp(1)}]}>
//                 {`Value Should lie between 1-10`}
//               </Text>
//             )}
//             <View style={styles.buttonView}>
//               <TouchableOpacity
//                 style={styles.nextButton}
//                 onPress={() => {
//                   setCurrentPage(currentPage - 1);
//                   setErrorShow(false);
//                 }}>
//                 <Text style={styles.nextText}>Prev</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.nextButton}
//                 onPress={() => {
//                   if (
//                     parseFloat(dailyProfit) > 0 &&
//                     parseFloat(dailyLoss) > 0 &&
//                     parseFloat(dailyProfit) < 10 &&
//                     parseFloat(dailyLoss) < 10
//                   ) {
//                     setErrorShow(false);
//                     setCurrentPage(currentPage + 1);
//                   } else {
//                     setErrorShow(true);
//                   }
//                 }}>
//                 <Text style={styles.nextText}>Next</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ) : (
//           <View style={styles.firstStepView}>
//             <View style={styles.listingView}>
//               <Text style={styles.titleText}>{'Margin ='}</Text>
//               <Text style={styles.ansText}>{'Cross'}</Text>
//             </View>
//             <View style={styles.listingView}>
//               <Text style={styles.titleText}>{'Leverage ='}</Text>
//               <Text style={styles.ansText}>{leverage}</Text>
//               <TouchableOpacity onPress={() => setCurrentPage(0)}>
//                 <Image style={styles.imageStyle} source={edit} />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.listingView}>
//               <Text style={styles.titleText}>{'Amount ='}</Text>
//               <Text style={styles.ansText}>{amount}</Text>
//               <TouchableOpacity onPress={() => setCurrentPage(1)}>
//                 <Image style={styles.imageStyle} source={edit} />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.listingView}>
//               <Text style={styles.titleText}>{'Daily Profit % ='}</Text>
//               <Text style={styles.ansText}>{dailyProfit}</Text>
//               <TouchableOpacity onPress={() => setCurrentPage(3)}>
//                 <Image style={styles.imageStyle} source={edit} />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.listingView}>
//               <Text style={styles.titleText}>{'Daily Loss % ='}</Text>
//               <Text style={styles.ansText}>{dailyLoss}</Text>
//               <TouchableOpacity onPress={() => setCurrentPage(3)}>
//                 <Image style={styles.imageStyle} source={edit} />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.listingView}>
//               <Text style={styles.buyText1}>{'Buy'}</Text>
//               <TouchableOpacity onPress={() => setCurrentPage(2)}>
//                 <Image style={styles.imageStyle} source={edit} />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.listingView}>
//               <Text style={styles.titleText}>{'Take Profit ='}</Text>
//               <Text style={styles.ansText}>{profit} %</Text>
//               <Text style={[styles.titleText, {marginLeft: wp(5)}]}>
//                 {'Stop Loss ='}
//               </Text>
//               <Text style={styles.ansText}>{loss} %</Text>
//             </View>
//             <View style={styles.listingView}>
//               <Text style={styles.sellText1}>{'Sell'}</Text>
//               <TouchableOpacity onPress={() => setCurrentPage(2)}>
//                 <Image style={styles.imageStyle} source={edit} />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.listingView}>
//               <Text style={styles.titleText}>{'Take Profit ='}</Text>
//               <Text style={styles.ansText}>{sellProfit} %</Text>
//               <Text style={[styles.titleText, {marginLeft: wp(5)}]}>
//                 {'Stop Loss ='}
//               </Text>
//               <Text style={styles.ansText}>{sellLoss} %</Text>
//             </View>
//             <View style={styles.buttonView}>
//               <View style={[styles.listingView, {marginTop: hp(4)}]}>
//                 <Text style={[styles.leverageText, {marginRight: wp(2)}]}>
//                   {'AI'}
//                 </Text>
//                 <Switch
//                   trackColor={{
//                     false: COLORS.errorColor,
//                     true: COLORS.greenColor,
//                   }}
//                   thumbColor={botConfig ? '#f4f3f4' : '#f4f3f4'}
//                   ios_backgroundColor={COLORS.errorColor}
//                   onValueChange={() => setBotConfig(!botConfig)}
//                   value={botConfig}
//                 />
//               </View>
//               <TouchableOpacity style={styles.nextButton} onPress={onPress}>
//                 <Text style={styles.nextText}>Finish</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       </View>
//     );
//   };

//   return (
//     <Modal
//       isVisible={modalVisible}
//       animationIn={'bounceInUp'}
//       animationOut={'bounceOutDown'}
//       onBackdropPress={() => setModalVisible(false)}>
//       <View
//         style={[
//           styles.container,
//           {
//             height:
//               currentPage === 1 || currentPage === 0
//                 ? errorShow
//                   ? hp(37.5)
//                   : hp(35)
//                 : currentPage === 2
//                 ? errorShow
//                   ? hp(56.5)
//                   : hp(53)
//                 : currentPage === 3
//                 ? errorShow
//                   ? hp(44.5)
//                   : hp(41.5)
//                 : onFinishStatus
//                 ? hp(26)
//                 : hp(69),
//           },
//         ]}>
//         <Text
//           style={[
//             styles.leverageText2,
//             {marginTop: onFinishStatus ? 0 : hp(2)},
//           ]}>{`AI Bot Setting`}</Text>
//         <View style={styles.stepIndicator}>
//           <StepIndicator
//             customStyles={firstIndicatorStyles}
//             currentPosition={currentPage}
//             labels={[
//               'Leverage',
//               'Amount',
//               'TP(%)&\nSL(%)',
//               'Daily %',
//               'Bot Config',
//             ]}
//             renderLabel={renderLabel}
//           />
//         </View>
//         {onFinishStatus ? (
//           <View style={{marginTop: -hp(4)}}>
//             <Text style={styles.leverageText3}>
//               {botConfig ? 'Congratulations' : 'Sorry'}
//             </Text>
//             <Text style={styles.leverageText4}>
//               AI Bot Is
//               <Text
//                 style={[
//                   styles.activeText,
//                   {color: botConfig ? COLORS.greenColor : COLORS.errorColor},
//                 ]}>
//                 {botConfig ? ' Activated!' : ' Deactivated!'}
//               </Text>
//             </Text>
//           </View>
//         ) : (
//           <Swiper
//             style={{flexGrow: 1, width: '100%'}}
//             loop={false}
//             index={currentPage}
//             autoplay={false}
//             showsPagination={false}
//             scrollEnabled={false}
//             onIndexChanged={page => {
//               setCurrentPage(page);
//             }}>
//             {renderViewPagerPage()}
//           </Swiper>
//         )}
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     width: '105%',
//     minHeight: hp(25),
//     maxHeight: hp(70),
//     backgroundColor: COLORS.white,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 10,
//     marginLeft: -wp(2.5),
//   },
//   nextButton: {
//     width: '30%',
//     height: hp(5),
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: COLORS.primary,
//     borderRadius: 8,
//     alignSelf: 'flex-end',
//     marginTop: hp(2),
//     marginRight: wp(3),
//   },
//   leverageText2: {
//     fontSize: hp(2.6),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.apiError,
//   },
//   leverageText3: {
//     fontSize: hp(2.2),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.apiError,
//     textAlign: 'center',
//   },
//   leverageText4: {
//     fontSize: hp(2.4),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.apiError,
//     textAlign: 'center',
//     marginTop: hp(1),
//   },
//   activeText: {
//     fontSize: hp(2.4),
//     fontFamily: Fonts.FONTS.PoppinsMedium,
//     color: COLORS.apiError,
//     textAlign: 'center',
//   },
//   page: {
//     flex: 1,
//     width: '100%',
//   },
//   nextText: {
//     fontSize: hp(2),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.white,
//   },
//   stepIndicator: {
//     marginVertical: 12,
//     width: '100%',
//   },
//   stepLabel: {
//     fontSize: 12,
//     textAlign: 'center',
//     fontWeight: '500',
//     color: COLORS.white,
//   },
//   stepLabelSelected: {
//     fontSize: 12,
//     textAlign: 'center',
//     fontWeight: '500',
//     color: COLORS.textColor,
//   },
//   firstStepView: {
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   leverageView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: hp(6),
//   },
//   leverageText: {
//     fontSize: hp(2),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.apiError,
//   },
//   leverageTextInput: {
//     fontSize: hp(1.8),
//     fontFamily: Fonts.FONTS.PoppinsMedium,
//     color: COLORS.black,
//     height: hp(6),
//     width: wp(26),
//     borderWidth: 0.5,
//     borderColor: COLORS.errorColor,
//     marginLeft: wp(3),
//     borderRadius: 5,
//     paddingHorizontal: wp(2),
//   },
//   buttonView: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '96%',
//     marginLeft: wp(4),
//   },
//   buyText: {
//     fontSize: hp(2.8),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.greenColor,
//     marginBottom: hp(1.5),
//   },
//   sellText: {
//     fontSize: hp(2.8),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.errorColor,
//     marginTop: hp(2),
//     marginBottom: hp(1),
//   },
//   leverageTextInput1: {
//     fontSize: hp(1.8),
//     fontFamily: Fonts.FONTS.PoppinsMedium,
//     color: COLORS.black,
//     height: hp(6),
//     width: wp(22),
//     borderWidth: 0.5,
//     borderColor: COLORS.apiError,
//     borderRadius: 5,
//     paddingHorizontal: wp(2),
//   },
//   leverageText1: {
//     fontSize: hp(1.9),
//     fontFamily: Fonts.FONTS.PoppinsMedium,
//     color: COLORS.apiError,
//   },
//   profitView: {
//     alignItems: 'center',
//     marginRight: wp(6),
//   },
//   listingView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: hp(1),
//   },
//   titleText: {
//     fontSize: hp(2),
//     fontFamily: Fonts.FONTS.PoppinsMedium,
//     color: COLORS.apiError,
//   },
//   ansText: {
//     fontSize: hp(2),
//     fontFamily: Fonts.FONTS.PoppinsMedium,
//     color: COLORS.greenColor,
//   },
//   imageStyle: {
//     width: wp(5),
//     height: hp(3),
//     resizeMode: 'contain',
//     tintColor: COLORS.primary,
//     marginLeft: wp(3),
//   },
//   buyText1: {
//     fontSize: hp(2.8),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.greenColor,
//   },
//   sellText1: {
//     fontSize: hp(2.8),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.errorColor,
//   },
//   errorText: {
//     fontSize: hp(1.8),
//     fontFamily: Fonts.FONTS.PoppinsMedium,
//     color: COLORS.errorColor,
//   },
// });
