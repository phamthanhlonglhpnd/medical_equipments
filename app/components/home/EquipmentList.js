import { useNavigation, useRoute, StackActions } from '@react-navigation/core'
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View, Image, Alert } from 'react-native'
import EquipmentItem from './components/EquipmentItem'
import ActionSheet from 'react-native-actionsheet'
import Constant from '../../controller/Constant'
import SearchInput from '../customs/SearchInput'
import filter from '../../assets/images/filter.png'
import Loading from '../customs/Loading'
import StorageManager from '../../controller/StorageManager'
import { getAllEquipmentsAPI } from '../../controller/APIService'


const EquipmentList = () => {

    const route = useRoute()
    const navigation = useNavigation()
    const [equipments, setEquipments] = useState([])
    const [keyword, setKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const actionSheetRef = useRef(null)
    const equipmentsRoot = useRef([])
    const screen = route.params?.screen ?? ''

    const showEquipmentDetails = (equipmentId) => {
        navigation.dispatch(
            StackActions.push(Constant.nameScreen.EquipmentDetails, { equipmentId })
        )
    }

    const showEquipmentInventory = (id, name) => {
        navigation.dispatch(
            StackActions.push(Constant.nameScreen.EquipmentInventoryInput, { name, id })
        )
    }

    const showErrorInfoInput = (id, name) => {
        navigation.dispatch(
            StackActions.push(Constant.nameScreen.ErrorInfoInput, { name, id })
        )
    }

    const onSelectEquipment = (equipmentId, equipmentName) => {
        switch (screen) {
            case Constant.nameScreen.ErrorRequest:
                showErrorInfoInput(equipmentId, equipmentName)
                return
            case Constant.nameScreen.EquipmentInventory:
                showEquipmentInventory(equipmentId, equipmentName)
                return
            default:
                showEquipmentDetails(equipmentId)
                return
        }
    }

    const getAllEquipments = async () => {
        try {
            let domain = await StorageManager.getData(Constant.keys.domain);
            let response = await getAllEquipmentsAPI(domain, keyword);
            if (!response) {
                setEquipments([]);
            }
            setEquipments(response);
            equipmentsRoot.current = response;
            setIsLoading(false);
        } catch (error) {
            Alert.alert('Thông báo', error?.message);
            setIsLoading(false);
        }
    }

    const onSelectFilter = (index) => {
        if (index === 7) {
            return
        }
        if (index === 6) {
            setEquipments(equipmentsRoot.current)
            return
        }
        const status = Constant.equipmentStatus[index]
        const list = equipmentsRoot.current.filter(e => e?.status === status?.key)
        setEquipments(list)
    }

    const onTapFilter = () => {
        actionSheetRef.current.show()
    }

    useEffect(() => {
        getAllEquipments();
        return () => {

        }
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Thiết bị',
            headerRight: () => 
            <TouchableOpacity onPress={onTapFilter}>
                <Image
                    source={filter}
                    style={styles.filter}
                />
            </TouchableOpacity>
        })
    }, [])

    return (
        isLoading ? <Loading /> :
        <View style={styles.container}>
            <View
                style={{
                    marginHorizontal: 10
                }}
            >
                <SearchInput
                    onChangeText={(keyword) => setKeyword(keyword)}
                    onPress={getAllEquipments}
                />
            </View>
            <FlatList
                data={equipments}
                renderItem={({ item }) => <EquipmentItem item={item} onPress={() => onSelectEquipment(item?.id, item?.title)} />}
                keyExtractor={(item) => item?.id}
                contentContainerStyle={{
                    paddingTop: 12
                }}
            />
            <ActionSheet
                ref={actionSheetRef}
                title={'Lọc'}
                options={[...Constant.equipmentStatus.map(e => e?.value), 'Tất cả', 'Hủy']}
                cancelButtonIndex={7}
                onPress={onSelectFilter}
            />
        </View>
    )
}

export default EquipmentList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EBF3FE',
        paddingTop: 20
    },
    filter: {
        height: 30,
        width: 30
    },
})