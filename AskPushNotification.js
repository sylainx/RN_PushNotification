import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, StyleSheet, } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

/*
export interface FirebaseData {
    title?: string;
    message?: string;
    subtitle?: string;
    sound?: boolean | string;
    vibrate?: boolean | number[];
    priority?: AndroidNotificationPriority;
    badge?: number;
} 
*/

/* export async function registerForPushNotificationsAsync(userId: string) {
    const expoPushToken = await Notifications.getExpoPushTokenAsync({
      experienceId: '@username/example',
    });
  
    await fetch('https://example.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        expoPushToken,
      }),
    });
  } */


            /* --------------------------- F U N C T I O N S --------------------------- */

async function schedulePushNotification() {

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Votre colis a été reçu! 📬",
            body: 'Merci d\'avoir fait le choix de Shippex',
            data: { data: 'Informations supplémentaires!!!' },
        },
        trigger: { seconds: 2 },
    });
}
            

            /* Recupère le token de l'utilisateur */
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
        console.log(token);

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

// Show notifications when the app is in the foreground
Notifications.setNotificationHandler({
  
    handleNotification: async () => ({
        shouldShowAlert: true,
        // shouldPlaySound: false,
        shouldSetBadge: false,
    }),
})

            /* M A K E   A   R E Q U E S T */
/* const makeRequest =()=>{
    a = '
        curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/send" -d '{
            "to": "ExponentPushToken[xxxxxxxxxxxxxxxx]",
            title: "Votre colis a été reçu! 📬",
            body: 'Merci d\'avoir fait le choix de Shippex',
            data: { data: 'Informations supplémentaires!!!' },
        }
        {
            "data" : {
                "status": "ok" ,
                "id" :"1823as-3383aj-2388"
            }
        }
    '
}
                        // Handle notification in the foreground

    React.useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener((notification: Notification) => {
        console.log("We received a notification ", notification);
        });

        // updateSomeData();
        // updateUi()
        return () => subscription.remove();
    }, []);


 */

export default function AskPushNotification() {
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
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };

    }, [])


            
    return (
        <View style={styles.container}>

            <Text>Your expo push token: {expoPushToken}</Text>

            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>Title: {notification && notification.request.content.title} </Text>
                <Text>Body: {notification && notification.request.content.body}</Text>
                <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
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

