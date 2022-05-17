import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useLayoutEffect, useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import APIManager from '../../controller/APIManager'
import StaffItem from './components/StaffItem'
import RNProgressHud from 'progress-hud'

const StaffList = () => {

    const navigation = useNavigation()
    const [staffs, setStaffs] = useState([])

    const getAllUser = () => {
        RNProgressHud.show()
        APIManager.getAllUser()
            .then(staffs => setStaffs(staffs))
            .catch(error => alert(error?.message))
            .finally(() => RNProgressHud.dismiss())
    }

    useFocusEffect(
        useCallback(() => {
            getAllUser();
            return () => {

            }
        }, [])
    )

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Nhân viên'
        })
    }, [])

    const renderItem = ({ item }) => {
        return (
            <StaffItem item={item} />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={staffs}
                renderItem={renderItem}
                keyExtractor={(item) => item?.name}
            />
        </SafeAreaView>
    )
}

export default StaffList

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: '#EBF3FE',
        flex: 1,
    },
})
