import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import APIManager from '../../controller/APIManager'
import EquipmentItem from './components/EquipmentItem'
import RNProgressHud from 'progress-hud'

const SuppliesList = () => {

    const navigation = useNavigation()
    const [supplies, setSupplies] = useState([])

    const getAllEquipments = () => {
        RNProgressHud.show()
        APIManager.getAllSupplies()
            .then(supplies => setSupplies(supplies))
            .catch(error => alert(error?.message))
            .finally(() => RNProgressHud.dismiss())
    }

    useEffect(() => {
        getAllEquipments()
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Vật tư'
        })
    }, [])

    const renderItem = ({ item }) => {
        return (
            <EquipmentItem item={item} />
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={supplies}
                renderItem={renderItem}
                keyExtractor={(item) => item?.id}
                contentContainerStyle={{
                    paddingTop: 12
                }}
            />
        </SafeAreaView>
    )
}

export default SuppliesList

const styles = StyleSheet.create({

})
