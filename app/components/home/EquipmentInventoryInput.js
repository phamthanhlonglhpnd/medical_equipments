import { StackActions, useNavigation, useRoute } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import APIManager from '../../controller/APIManager'
import Constant from '../../controller/Constant'
import RNProgressHud from 'progress-hud';
import PushNotification from "react-native-push-notification";

const EquipmentInventoryInput = () => {

    const route = useRoute()
    const equipmentId = route.params?.id ?? ''
    const equipmentName = route.params?.name || route.params?.title
    const equipmentModel = route.params?.model ?? ''
    const equipmentSerial = route.params?.serial ?? ''
    const [note, setNote] = useState('')
    const navigation = useNavigation()

    useEffect(() => {
        createChannels();
    }, [])

    const createChannels = () => {
        PushNotification.createChannel({
            channelId: 'test-channel',
            channelName: 'Test Channel'
        })
    }

    const handleNotification = (title, message) => {
        PushNotification.localNotification({
            channelId: 'test-channel',
            title: title,
            message: message,
            autoCancel: true,
            actions: ['Ok', 'Cancel']
        })
    }

    const onSuccessed = () => {
        RNProgressHud.dismiss();
        handleNotification(
            'Gửi ghi chú kiểm kê thiết bị thành công!',
            'Vui lòng xem chi tiết ở mục lịch sử kiểm kê của thiết bị!'
        )
        setNote("");
        navigation.navigate(Constant.nameScreen.EquipmentDetails, { equipmentId });
    }

    const onFailed = () => {
        handleNotification(
            'Gửi yêu cầu kiểm kê thiết bị thất bại!',
            'Vui lòng kiểm tra lại!'
        )
        setNote("");
    }

    const requestInventory = () => {
        if (note === '') {
            Alert.alert('Thông báo', 'Vui lòng nhập ghi chú kiểm kê!')
            return
        }
        RNProgressHud.show()
        APIManager.requestInventory(equipmentId, note)
            .then(response => {
                onSuccessed();
                
            })
            .catch(onFailed)
            .catch(() => RNProgressHud.dismiss())
    }

    return (
        <SafeAreaView style={styles.rootView}>
            <ScrollView>
                <Text style={styles.name}>
                    {equipmentName}
                </Text>
                <View 
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        marginHorizontal: 20,
                        marginTop: 10
                    }}
                >
                    <Text style={{color: Constant.color.text}}><Text style={{fontWeight: 'bold'}}>Model: </Text>{equipmentModel}</Text>
                    <Text style={{color: Constant.color.text}}><Text style={{fontWeight: 'bold'}}>Serial: </Text>{equipmentSerial}</Text>
                </View>
                <View style={styles.noteView}>
                    <TextInput
                        style={styles.noteInput}
                        value={note}
                        multiline
                        onChangeText={text => setNote(text)}
                        placeholder='Nhập ghi chú kiểm kê tại đây...'
                    />
                </View>

                <TouchableOpacity
                    onPress={requestInventory}
                    style={styles.requestTouch}>
                    <Text style={styles.requestText}>
                        Kiểm kê
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EquipmentInventoryInput

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        paddingHorizontal: 16
    },
    requestDes: {
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 6,
        textAlign: 'center'
    },
    name: {
        alignSelf: 'center',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 20,
        color: Constant.color.text
    },
    noteTitle: {
        marginTop: 10
    },
    noteView: {
        backgroundColor: 'white',
        marginTop: 16,
        borderRadius: 8,
        height: 250,
        paddingHorizontal: 10
    },
    requestText: {
        color: 'white',
        fontSize: 16
    },
    requestTouch: {
        height: 44,
        backgroundColor: Constant.color.main,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        alignSelf: 'center',
        marginTop: 30,
    },
})
