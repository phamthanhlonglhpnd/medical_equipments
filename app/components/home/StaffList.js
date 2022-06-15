import { useNavigation } from '@react-navigation/core'
import React, { useLayoutEffect, useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import APIManager from '../../controller/APIManager'
import StaffItem from './components/StaffItem'
import Loading from '../customs/Loading'

const StaffList = () => {

    const navigation = useNavigation()
    const [staffs, setStaffs] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const getAllUser = async () => {        
        APIManager.getAllUser()
            .then(staffs => setStaffs(staffs))
            .catch(error => {
                alert(error?.message)
            })
            .finally(() => setIsLoading(false))
    }

    
        useEffect(() => {
            getAllUser();
            return () => {

            }
        }, [])
    

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
        isLoading ? <Loading/> :
        <View style={styles.container}>
            <FlatList
                data={staffs}
                renderItem={renderItem}
                keyExtractor={(item) => item?.name}
            />
        </View> 
    )
}

export default StaffList

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        backgroundColor: '#EBF3FE',
        flex: 1,
        paddingVertical: 20
    },
})