import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useLayoutEffect, useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import APIManager from '../../controller/APIManager'
import RNProgressHud from 'progress-hud'
import DepartmentItem from './components/DepartmentItem'

const DepartmentList = () => {

    const navigation = useNavigation()
    const [departments, setDepartments] = useState([])

    const getAllDepartments = () => {
        RNProgressHud.show()
        APIManager.getAllDepartments()
            .then(departments => setDepartments(departments))
            .catch(error => alert(error?.message))
            .finally(() => RNProgressHud.dismiss())
    }

    useFocusEffect(
        useCallback(() => {
            getAllDepartments()
            return () => {

            }
        }, [])
    )

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Khoa phòng'
        })
    }, [])

    const renderItem = ({ item }) => {
        return (
            <DepartmentItem item={item} />
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={departments}
                renderItem={renderItem}
                keyExtractor={(item) => item?.id}
                contentContainerStyle={styles.container}
            />
        </SafeAreaView>
    )
}

export default DepartmentList

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 20, 
        backgroundColor: '#F2F6FE'
    },
})
