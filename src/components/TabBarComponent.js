import {
  Dimensions,
  Pressable,
  StyleSheet,
  Image,
  Text,
  View,
  Platform,
  Animated,
  BackHandler,
} from 'react-native';
import React, {Component} from 'react';
import chart from '../images/chart.png';
import bot from '../images/bot.png';
import sync from '../images/sync.png';
import setting from '../images/setting.png';
import {COLORS, Fonts} from '../utils';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from './Pixel';
// export const routes = {
//   HomeScreen: {name: 'HomeScreen', icon: chart},
//   BotStatusScreen: {name: 'BotStatusScreen', icon: bot},
//   PricePrediction: {name: 'PricePrediction', icon: 'Text'},
//   AnalyticsScreen: {name: 'AnalyticsScreen', icon: sync},
//   SettingScreen: {name: 'SettingScreen', icon: setting},
// };

const {height, width} = Dimensions.get('window');
let selected = 1;
let yoffset = -30;
let iconSize = 25;

let mainOffSet = Platform.OS === 'ios' ? 20 : 0;

let slider = [
  (2 * 1 - 1) * ((1 * (width / 5)) / 2) + 85,
  (2 * 5 - 1) * ((1 * (width / 5)) / 2) + 84,
];

export default class TabBarComponent extends Component {
  state = {
    iconColor: 'black', //default color black
    primColor: '#eb8153',
    selectedIconColor: 'white',
    mainOffSetIos: 20,
    mainOffSetAndroid: 0,
    fadeValue: new Animated.Value(1),
    id1: new Animated.Value(1),
    id2: new Animated.Value(1),
    id3: new Animated.Value(1),
    id4: new Animated.Value(1),
    id5: new Animated.Value(1),

    i1: new Animated.Value(0),
    i2: new Animated.Value(0),
    i3: new Animated.Value(0),
    i4: new Animated.Value(0),
    i5: new Animated.Value(0),

    h1: new Animated.Value(0),
    h2: new Animated.Value(0),
    h3: new Animated.Value(0),
    h4: new Animated.Value(0),
    h5: new Animated.Value(0),

    hh1: new Animated.Value(300),
    hh2: new Animated.Value(20),
    hh3: new Animated.Value(20),
    hh4: new Animated.Value(20),
    hh5: new Animated.Value(20),
  };

  animatedValue = new Animated.Value(
    this.props.selected ? this.props.selected : 1,
  );

  componentDidMount() {
    this.setState({
      iconColor: this.props.iconColor ? this.props.iconColor : 'black',
      primColor: this.props.navColor ? this.props.navColor : '#eb8153',
      selectedIconColor: this.props.selectedIconColor
        ? this.props.selectedIconColor
        : 'white',
    });
    this._start(this.props.selected ? this.props.selected : 1); //select the tab else 1
    const backAction = () => {
      // Return true to prevent the default back functionality
      return true;
    };

    // Add event listener for hardware back button
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    // Clean up event listener
    return () => backHandler.remove();
  }

  _start = (id = 1) => {
    console.log('Get Width:::', id);
    let idd = 'id' + id;
    let hh = 'h' + id;
    let iddd = 'i' + id;

    let h = 'hh' + id;

    let a = this.state[idd];
    let b = this.state[hh];
    let c = this.state[iddd];

    let d = this.state[h];

    // this.setState({[idd]: new Animated.Value()})
    Animated.timing(a, {
      toValue: 0,
      duration: 50,
      useNativeDriver: false,
    }).start();
    Animated.timing(b, {
      toValue: 50,
      duration: 100,
      useNativeDriver: false,
    }).start();
    Animated.timing(c, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start(); //icon circle upp
    Animated.timing(d, {
      toValue: 5,
      duration: 300,
      useNativeDriver: false,
    }).start(); //icon circle upp

    this.showall(id);
  };

  showall = id => {
    for (let i = 1; i <= 5; i++) {
      if (i != id) {
        let idd = 'id' + i;
        let iddd = 'i' + i;
        let h = 'hh' + i;
        let hh = 'h' + i;
        let d = this.state[h];
        let a = this.state[idd];
        let b = this.state[hh];
        let c = this.state[iddd];
        Animated.timing(a, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }).start(); // icon fade
        Animated.timing(b, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(); //icon lower
        Animated.timing(c, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(); //icon lower rest
        Animated.timing(d, {
          toValue: 10,
          duration: 200,
          useNativeDriver: false,
        }).start(); //icon lower rest
        Animated.timing(this.animatedValue, {
          toValue: id,
          duration: 200,
          useNativeDriver: false,
        }).start(); //navbar
      }
    }
  };

  render() {
    const navrr = this.animatedValue.interpolate({
      inputRange: [1, 5],
      outputRange: slider,
      extrapolate: 'clamp',
    });

    let off = Platform.OS === 'ios' ? height : height;
    if (this.props.mainOffSetAndroid)
      off = Platform.OS === 'ios' ? height : height;
    if (this.props.mainOffSetIos)
      off =
        Platform.OS === 'ios' ? height - this.props.mainOffSetIos : height + 20;

    return (
      <View style={{position: 'absolute', top: off, zIndex: 999}}>
        <View
          style={{
            backgroundColor: this.state.primColor,
            position: 'absolute',
            width: width,
            height: hp(9.9),
            bottom: hp(5) + yoffset,
          }}></View>
        <View
          style={{
            backgroundColor: 'white',
            position: 'absolute',
            bottom: -hp(2.5) + yoffset,
            width: width,
            height: hp(12),
          }}></View>
        <Animated.View style={{position: 'absolute', bottom: 0, left: navrr}}>
          <View
            style={{
              backgroundColor: '#eb8153',
              position: 'absolute',
              bottom: hp(8) + yoffset,
              width: wp(13),
              right: wp(15),
              height: wp(13),
              borderRadius: wp(13),
            }}></View>

          <View
            style={{
              backgroundColor: 'white',
              position: 'absolute',
              bottom: yoffset,
              right: wp(26),
              width: width,
              height: hp(12.5),
              borderRadius: wp(11.5),
            }}></View>

          <View
            style={{
              backgroundColor: 'white',
              position: 'absolute',
              bottom: yoffset,
              right: -wp(83),
              width: width,
              height: hp(12.5),
              borderRadius: wp(11.5),
            }}></View>
        </Animated.View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: width,
            height: hp(12.5),
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: hp(2.5),
            paddingLeft: width > 360 ? wp(7.3) : wp(9),
            paddingRight: width > 360 ? wp(7) : wp(5),
          }}>
          {this.props.state.routes.map((route, index) => {
            const isFocused = this.props.state.index === index;
            const onPress = () => {
              this._start(index + 1);
              const event = this.props.navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                this.props.navigation.navigate({
                  name: route.name,
                  merge: true,
                  params: {},
                });
              }
            };
            const onLongPress = () => {
              this.props.navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };
            return (
              <Pressable
                key={`route-${index}`}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.item}>
                <Animated.View
                  style={{
                    opacity: this.state[`i${index + 1}`],
                    top: this.state[`hh${index + 1}`],
                  }}>
                  {index == 2 ? (
                    <Text
                      style={{
                        fontSize: hp(2.2),
                        color: !isFocused ? COLORS.primary : COLORS.white,
                        fontFamily: Fonts.FONTS.PoppinsBold,
                      }}>
                      AI
                    </Text>
                  ) : (
                    <Image
                      style={{
                        tintColor: !isFocused ? COLORS.primary : COLORS.white,
                        width: wp(6),
                        height: hp(3),
                        resizeMode: 'contain',
                      }}
                      source={
                        index == 0
                          ? chart
                          : index == 1
                          ? bot
                          : index == 3
                          ? sync
                          : setting
                      }
                    />
                  )}
                </Animated.View>
              </Pressable>
            );
          })}
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: -20,
            width: width,
            height: hp(12.5),
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: hp(2.5),
            paddingLeft: width > 360 ? wp(7.2) : wp(9),
            paddingRight: width > 360 ? wp(7.2) : wp(5),
          }}>
          {this.props.state.routes.map((route, index) => {
            const isFocused = this.props.state.index === index;
            const onPress = () => {
              this._start(index + 1);
              const event = this.props.navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                this.props.navigation.navigate({
                  name: route.name,
                  merge: true,
                  params: {},
                });
              }
            };

            const onLongPress = () => {
              this.props.navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };
            return (
              <Pressable
                key={`route-${index}`}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.item}>
                <Animated.View
                  style={{
                    opacity: this.state[`id${index + 1}`],
                    top: this.state[`h${index + 1}`],
                  }}>
                  {index == 2 ? (
                    <Text
                      style={{
                        fontSize: hp(2.2),
                        color: !isFocused ? COLORS.primary : COLORS.white,
                        fontFamily: Fonts.FONTS.PoppinsBold,
                      }}>
                      AI
                    </Text>
                  ) : (
                    <Image
                      style={{
                        tintColor: !isFocused ? COLORS.primary : COLORS.white,
                        width: wp(6),
                        height: hp(3),
                        resizeMode: 'contain',
                      }}
                      source={
                        index == 0
                          ? chart
                          : index == 1
                          ? bot
                          : index == 3
                          ? sync
                          : setting
                      }
                    />
                  )}
                </Animated.View>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wicon: {
    alignItems: 'center',
    width: width / 6,
    paddingTop: 10,
    top: -10,
  },
  titleText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.white,
    marginLeft: wp(2),
  },
});

//   return (
//     <>
//       <Animated.View style={[styles.container, rnStyle]} />
//       {state.routes.map((route, index) => {
//         const {options} = descriptors[route.key];
//         const label =
//           options.tabBarLabel !== undefined
//             ? options.tabBarLabel
//             : options.title !== undefined
//             ? options.title
//             : route.name;

//         const isFocused = state.index === index;

//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true,
//           });

//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate({
//               name: route.name,
//               merge: true,
//               params: {},
//             });
//           }
//         };

//         const onLongPress = () => {
//           navigation.emit({
//             type: 'tabLongPress',
//             target: route.key,
//           });
//         };
//         return (
//           <Pressable
//             key={`route-${index}`}
//             accessibilityRole="button"
//             accessibilityState={isFocused ? {selected: true} : {}}
//             accessibilityLabel={options.tabBarAccessibilityLabel}
//             testID={options.tabBarTestID}
//             onPress={onPress}
//             onLongPress={onLongPress}
//             style={styles.item}>
//             {routes[route.name].icon == 'Text' ? (
//               <Text
//                 style={{
//                   fontSize: hp(2.4),
//                   color: !isFocused ? COLORS.primary : COLORS.white,
//                   fontFamily: Fonts.FONTS.PoppinsBold,
//                 }}>
//                 AI
//               </Text>
//             ) : (
//               <View style={styles.viewStyle}>
//                 <Image
//                   style={{
//                     tintColor: !isFocused ? COLORS.primary : COLORS.white,
//                     width: wp(6),
//                     height: hp(3),
//                     resizeMode: 'contain',
//                   }}
//                   source={routes[route.name].icon}
//                 />
//                 {isFocused && <Text style={styles.titleText}>Cypto</Text>}
//               </View>
//             )}
//           </Pressable>
//         );
//       })}
//     </>
//   );
// };

// export default TabBarComponent;

// const styles = StyleSheet.create({
//   container: {
//     width: TAB_WIDTH,
//     height: hp(4.5),
//     backgroundColor: COLORS.primary,
//     zIndex: 0,
//     position: 'absolute',
//     marginHorizontal: 20,
//     borderRadius: 20,
//   },
//   item: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   viewStyle: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   titleText: {
//     fontSize: hp(1.8),
//     fontFamily: Fonts.FONTS.PoppinsMedium,
//     color: COLORS.white,
//     marginLeft: wp(2),
//   },
// });
