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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerView: {
    flex: 0.1,
    width: '100%',
  },
  mainView: {
    flex: 0.9,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleHeader: {
    fontSize: hp(3),
    color: COLORS.titleText,
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    textAlign: 'center',
  },
  wifiImage: {
    width: wp(20),
    height: hp(20),
    resizeMode: 'contain',
  },
});

export default styles;
