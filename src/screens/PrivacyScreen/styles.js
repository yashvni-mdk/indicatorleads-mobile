import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import {COLORS, Fonts} from '../../utils/index';

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
    width: '100%',
    // backgroundColor: COLORS.white,
    paddingHorizontal: wp(3),
  },
  titleView: {
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.black,
  },
  titleHeader: {
    fontSize: hp(3),
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    textAlign: 'center',
    paddingVertical: hp(2),
  },
  desText: {
    fontSize: hp(2),
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsRegular,
    textAlign: 'left',
    lineHeight: hp(3.5),
    paddingVertical: hp(2),
  },
  linkText: {
    fontSize: hp(2),
    color: COLORS.blueColor,
    fontFamily: Fonts.FONTS.PoppinsRegular,
    textAlign: 'left',
    lineHeight: hp(3.5),
    paddingVertical: hp(2),
  },
});

export default styles;
