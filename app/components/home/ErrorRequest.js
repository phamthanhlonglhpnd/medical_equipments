import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Constant from '../../controller/Constant'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StackActions, useNavigation } from '@react-navigation/native'
import RNProgressHud from 'progress-hud'
import APIManager from '../../controller/APIManager'
import EquipmentItem from './components/EquipmentItem'
import { format } from 'date-fns'

const ErrorRequest = () => {

    const navigation = useNavigation()
    const [equipments, setEquipments] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [isRemind, setIsRemind] = useState(true);

    const onSearch = () => {
        if (keyword === '') {
            Alert.alert('Thông báo', 'Vui lòng nhập thông tin để tìm kiếm!')
            return
        }
        RNProgressHud.show()
        APIManager.getAllEquipments(keyword)
            .then(equipments => {
                let newEquipments = [];
                equipments.map(equipment => {
                    if(equipment.status === "active") {
                        newEquipments.push(equipment);
                    }
                    return newEquipments;
                })
                if(newEquipments.length === 0) {
                    setIsRemind(true)
                }
                setEquipments(newEquipments);
                setIsRemind(false);
                setKeyword("");
            })
            .catch(error => {
                alert(error?.message);
                setKeyword("")
            })
            .finally(() => RNProgressHud.dismiss())
    }

    const showImageScanner = () => {
        navigation.dispatch(
            StackActions.push(Constant.nameScreen.Scan)
        )
    }

    const requestError = (id, title, model, serial) => {
        navigation.dispatch(
            StackActions.push(Constant.nameScreen.ErrorInfoInput, { id, title, model, serial })
        )
    }

    const renderItem = ({ item }) => {
        return (
            <EquipmentItem 
                item={item} 
                key={item.id}
                onPress={() => requestError(item?.id, item?.title, item?.model, item?.serial)} 
            />
        )
    }

    return (
        equipments.length === 0 ? 
        <SafeAreaView style={{ flex: 1 }}>
            <Text style={styles.title}>
                Nhập để tìm thiết bị cần báo hỏng
            </Text>
            <View style={styles.equipmentView}>
                <TextInput
                    placeholder='Tên thiết bị, mã thiết bị,..'
                    style={styles.equipmentInput}
                    value={keyword}
                    onChangeText={keyword => setKeyword(keyword)}
                />
            </View>
            {
                isRemind ? <View/> :
                <View style={{marginTop: 15}}>
                    <Text style={{color: 'red', textAlign: 'center'}}>Vui lòng nhập thiết bị có trạng thái đang sử dụng</Text>
                </View>
            }
            <TouchableOpacity
                onPress={onSearch}
                style={styles.searchTouch}>
                <Text style={styles.searchText}>
                    Tìm kiếm
                </Text>
            </TouchableOpacity>
            <Text style={styles.title}>
                Hoặc quét mã QR để tìm kiếm:
            </Text>
            <TouchableOpacity
                onPress={showImageScanner}
            >
                <Ionicons
                    name='qr-code'
                    size={70}
                    style={styles.qrCodeIcon}
                />
            </TouchableOpacity>
        </SafeAreaView> : 
        <SafeAreaView style={{ flex: 1}}>
            <Text 
                style={[
                    styles.title,
                    {
                        marginBottom: 10
                    }
                ]}
            >
                Chọn thiết bị cần báo hỏng
            </Text>
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

export default ErrorRequest

const styles = StyleSheet.create({
    title: {
        alignSelf: 'center',
        marginTop: 20,
        fontSize: 18,
        color: Constant.color.text
    },
    equipmentInput: {
        height: 56,
        backgroundColor: 'white',
        borderRadius: 40,
        paddingHorizontal: 20,
        marginTop: 10,
        fontSize: 16,
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2
    },
    equipmentView: {
        marginHorizontal: 20,
        marginTop: 15
    },
    searchText: {
        color: 'white',
        fontSize: 16
    },
    searchTouch: {
        height: 44,
        backgroundColor: Constant.color.main,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        alignSelf: 'center',
        marginTop: 30,
        overflow: 'hidden'
    },
    qrCodeIcon: {
        alignSelf: 'center',
        marginTop: 30,
        color: Constant.color.text
    },
    equipmentList: {
        marginVertical: 15,
        marginHorizontal: 15
    }
})
