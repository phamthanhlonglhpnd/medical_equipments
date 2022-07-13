import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import Constant from '../../controller/Constant'
import PushNotification from "react-native-push-notification";
import Loading from '../customs/Loading'

const ErrorInfoInput = () => {

    const route = useRoute()
    const [isLoading, setIsLoading] = useState(false)
    const equipmentId = route.params?.id ?? ''
    const equipmentName = route.params?.name || route.params?.title
    const equipmentModel = route.params?.model ?? ''
    const equipmentSerial = route.params?.serial ?? ''
    const [reason, setReason] = useState('')
    const navigation = useNavigation()

    useEffect(() => {
        createChannels();
        return () => {

        }
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
        setIsLoading(false)
        handleNotification(
            'Gửi yêu cầu báo hỏng thiết bị thành công!',
            'Vui lòng xem chi tiết ở mục thông báo!'
        )
        setReason("");
        navigation.navigate(Constant.nameScreen.Home);
    }

    const onFailed = () => {
        setIsLoading(false)
        handleNotification(
            'Gửi yêu cầu báo hỏng thiết bị thất bại!',
            'Vui lòng kiểm tra lại!'
        )
        setReason("");
    }

    const requestError = async () => {
        if (reason === '') {
            Alert.alert('Thông báo', 'Vui lòng nhập lý do hỏng!')
            return
        }
        setIsLoading(true)
        dispatch(asyncIncrementCount())
        try {
            let domain = await StorageManager.getData(Constant.keys.domain);
            await requestErrorAPI(domain, equipmentId, reason);
            onSuccessed();
            setIsLoading(false)
        } catch (error) {
            Alert.alert('Thông báo', error?.message);
            onFailed();
            setIsLoading(false)
        }
    }

    return (
        isLoading ? <Loading /> :
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
                <View style={styles.reasonView}>
                    <TextInput
                        style={styles.reasonInput}
                        value={reason}
                        multiline
                        onChangeText={text => setReason(text)}
                        placeholder='Nhập lý do hỏng tại đây...'
                    />
                </View>

                <TouchableOpacity
                    onPress={requestError}
                    style={styles.requestTouch}>
                    <Text style={styles.requestText}>
                        Báo hỏng
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ErrorInfoInput

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
    reasonTitle: {
        marginTop: 10
    },
    reasonView: {
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
