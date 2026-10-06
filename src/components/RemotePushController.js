import React, {useEffect} from 'react';
import PushNotification from "react-native-push-notification";
import {useSelector} from 'react-redux';

const RemotePushController = () => {
  const settingData = useSelector(state => state.settingData);
  useEffect(() => {
    let tokenGet = '';

    PushNotification.configure({
      onRegister: function (msg) {
        console.log('TOKEN:', msg);
        tokenGet = msg.token;
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        if (notification.foreground) {
          PushNotification.createChannel(
            {
              channelId: notification.id, // (required)
              channelName: 'IndicatorLeads', // (required)
              channelDescription: 'Notification for special message', // (optional) default: undefined.
              importance: 4, // (optional) default: 4. Int value of the Android notification importance
              vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
          );
          PushNotification.localNotification({
            channelId: notification.id, // (required)
            channelName: 'IndicatorLeads',
            title: notification.title,
            message: notification.message,
          });
        }
      },
      senderID: tokenGet,
      permissions: {
        alert: true,
        badge: true,
        sound: false,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, [settingData]);

  return null;
};

export default RemotePushController;
