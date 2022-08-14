import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import Constant from '../../controller/Constant'
import PushNotification from "react-native-push-notification"
import Loading from '../customs/Loading'
import StorageManager from '../../controller/StorageManager'
import { requestErrorAPI } from '../../controller/APIService'
import { useDispatch } from 'react-redux'
import { asyncIncrementCount } from '../../store/slice/appSlice'

const ErrorInfoInput = () => {

    const route = useRoute()
    const [isLoading, setIsLoading] = useState(false)
    const equipmentId = route.params?.id ?? ''
    const equipmentName = route.params?.name || route.params?.title
    const equipmentModel = route.params?.model ?? ''
    const equipmentSerial = route.params?.serial ?? ''
    const [reason, setReason] = useState('')
    const navigation = useNavigation()
    const dispatch = useDispatch()

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
        dispatch(asyncIncrementCount())
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
        try {
            let domain = await StorageManager.getData(Constant.keys.domain)
            await requestErrorAPI(domain, equipmentId, reason)
            onSuccessed()
            setIsLoading(false)
        } catch (error) {
            Alert.alert('Thông báo', error?.message)
            onFailed()
            setIsLoading(false)
        }
    }

    return (
        isLoading ? <Loading /> :
            <View style={styles.rootView}>
                <ScrollView>
                    <Text style={styles.name}>
                        {equipmentName}
                    </Text>
                    <View style={styles.number}>
                        <View style={styles.detail}>
                            <Text style={styles.title}>Model</Text>
                            <Text style={styles.value}>{equipmentModel}</Text>

                        </View>
                        <View style={styles.detail}>
                            <Text style={styles.title}>Serial</Text>
                            <Text style={styles.value}>{equipmentSerial}</Text>
                        </View>
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
            </View>
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
        color: Constant.color.text,
        fontWeight: 'bold'
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
    number: {
        backgroundColor: '#FFF4EB',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 20,
        marginVertical: 10
    },
    title: {
        marginBottom: 8,
        color: Constant.color.text
    },
    value: {
        fontSize: 16,
        color: '#323E6D',
        fontWeight: 'bold'
    },
    detail: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
})