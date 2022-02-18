import React, { useEffect } from "react"
import { StyleSheet, View, Button } from "react-native"
import * as Notifications from "expo-notifications"
import * as Permissions from "expo-permissions"

// Show notifications when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    }
  },
})

export default function App() {
  useEffect(() => {
    // Permission for iOS
    Permissions.getAsync(Permissions.NOTIFICATIONS)
      .then(statusObj => {
        // Check if we already have permission
        if (statusObj.status !== "granted") {
          // If permission is not there, ask for the same
          return Permissions.askAsync(Permissions.NOTIFICATIONS)
        }
        return statusObj
      })
      .then(statusObj => {
        // If permission is still not given throw error
        if (statusObj.status !== "granted") {
          throw new Error("Permission not granted")
        }
      })
      .catch(err => {
        return null
      })
  }, [])

  const triggerLocalNotificationHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Local Notification",
        body: "Hello this is a local notification!",
      },
      trigger: { seconds: 5 },
    })
  }

  return (
    <View style={styles.container}>
      <Button
        title="Trigger Local Notification"
        onPress={triggerLocalNotificationHandler}
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