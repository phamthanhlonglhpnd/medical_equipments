import { useNavigation, useRoute, StackActions } from '@react-navigation/core'
import React, { useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import APIManager from '../../controller/APIManager'
import RNProgressHud from 'progress-hud'
import EquipmentItem from './components/EquipmentItem'
import Constant from '../../controller/Constant'

const DepartmentList = () => {

    const navigation = useNavigation()
    const route = useRoute();
    const [equipments, setEquipments] = useState([])

    const getAllEquipments = () => {
        RNProgressHud.show()
        APIManager.getAllEquipmentsByDepartment(route.params.id)
            .then(equipments => setEquipments(equipments))
            .catch(error => alert(error?.message))
            .finally(() => RNProgressHud.dismiss())
    }

    const goToInventory = (title, id, model, serial) => {
        navigation.dispatch(
            StackActions.push(Constant.nameScreen.EquipmentInventoryInput, { title, id, model, serial })
        )
    }

    useFocusEffect(
        useCallback(() => {
            getAllEquipments()
            return () => {

            }
        }, [])
    )

    const renderItem = ({ item }) => {
        return (
            <EquipmentItem 
                item={item} 
                onPress={() => goToInventory(item.title, item.id, item.model, item.serial)} 
            />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>{route.params.title}</Text>
            <FlatList 
                data={equipments}
                renderItem={renderItem}
                keyExtractor={(item) => item?.id}
                contentContainerStyle={{
                    paddingTop: 12
                }}
            />
        </SafeAreaView>
    )
}

export default DepartmentList

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 10, 
        paddingBottom: 40,
        backgroundColor: '#F2F6FE'
    },
    title: {
        textAlign: 'center',
        color: 'black',
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold'
    }
})
