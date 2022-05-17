import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import NotificationItem from './NotificationItem'
import RNProgressHud from 'progress-hud'
import APIManager from '../../controller/APIManager'
// import StorageManager from '../../controller/StorageManager'
// import Constant from '../../controller/Constant'

const NotificationList = () => {

    const [notificationList, setNotificationList] = useState([])
    
    useEffect(() => {
        const getAllNotification = () => {
            RNProgressHud.show()
            APIManager.getAllNotification()
                .then(notification => {
                    setNotificationList(notification)
                    // StorageManager.setData(Constant.keys.count, notification.length)
                })
                .catch(error => alert(error?.message))
                .finally(() => RNProgressHud.dismiss())
        }

        getAllNotification();
        
        return () => {

        }
    }, [])

    const renderItem = ({ item }) => {
        return (
            <NotificationItem item={item} />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={notificationList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.flatListContent}
            />
        </SafeAreaView>
    )
}

export default NotificationList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F6FE'
    },
    flatListContent: {
        paddingTop: 12
    }
})
