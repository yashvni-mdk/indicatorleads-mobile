import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../../components/Pixel/index';
import {COLORS, Fonts} from '../../../utils/index';

const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  headerView: {
    flex: 0.1,
    width: '100%',
  },
  mainView: {
    flex: 0.9,
    width: '92%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  titleHeader: {
    fontSize: hp(3),
    color: COLORS.titleText,
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
  },
  boxView: {
    width: '100%',
    height: hp(18),
    borderRadius: 8,
    marginTop: hp(3),
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: hp(3.2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.goldenColor,
  },
  subViews: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundView: {
    height: wp(15),
    width: wp(15),
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  iText: {
    fontSize: hp(3.4),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.white,
  },
  iconStyle: {
    width: wp(7),
    height: hp(4),
    resizeMode: 'contain',
    tintColor: COLORS.black,
    borderRadius: 80,
  },
  iconStyle1: {
    width: wp(10),
    height: hp(10),
    resizeMode: 'contain',
    borderRadius: 80,
  },
});

export default styles;
