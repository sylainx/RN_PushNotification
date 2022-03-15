import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

// Show notifications when the app is in the foreground
Notifications.setNotificationHandler({

    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: true,
    }),
})

/* --------------------------- F U N C T I O N S --------------------------- */

async function schedulePushNotification() {

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Votre colis a été reçu! 📬",
            body: 'Merci d\'avoir fait le choix de Shippex',
            data: { data: 'Informations supplémentaires!!!' },
        },
        trigger: { 
            seconds: 3,
            repeats: false,
        },
    });
}
    
        // Ask the token to use Push Notifications
async function registerForPushNotificationsAsync() {

    let token;

    if (Constants.isDevice) {

        const { status: existingStatus } = await Notifications.getPermissionsAsync();

        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }

        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("Token: ",token);

    } else {

        alert('Must use physical device for Push Notifications');

    }
    
    if (Platform.OS === 'android') {

        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
    
    return token;
}
            
            
    /* 
    
    await Notifications.setNotificationChannelAsync('new-emails', {
        name: 'E-mail notifications',
        sound: 'mySoundFile.wav', // Provide ONLY the base filename
    });
    
        
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "You've got mail! 📬",
            sound: 'mySoundFile.wav', // Provide ONLY the base filename
        },
        trigger: {
            seconds: 2,
            channelId: 'new-emails',
        },
    }); 
    
    */
    


export default function AskLocalNotification() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect( () => {

        let tokenUser = registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("Response listener: ",response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };

    }, [])

           
    return (
        <View style={styles.container}>

            <Text>Your expo push token: {expoPushToken, '\n\n'}</Text>

            <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                <Text>
                    Title: {notification && notification.request.content.title, '\n\n'} 
                </Text>

                <Text>
                    Body: {notification && notification.request.content.body, '\n\n'}
                </Text>

                <Text>
                    Data: {notification && JSON.stringify(notification.request.content.data), '\n\n'}
                </Text>

            </View>

            <Button
                title="Press to schedule a notification"
                onPress={async () => {
                await schedulePushNotification();
                }}
            />

        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})

