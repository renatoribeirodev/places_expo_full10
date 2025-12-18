import React from 'react'
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native'

import { Button, Image, StyleSheet, Alert, Text, TextInput, View, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker';


import { SafeAreaView } from 'react-native-safe-area-context';

import * as placeRepo from '../services/place.repo'
import { Place } from '../models'

export default function PlacePage() {
    
    const navigation = useNavigation<NavigationProp<any>>()
    const route = useRoute()
    const param = route.params as Place

    const [imageUri, setImageUri] = React.useState(param.imageUri || null)
    const [name, setName] = React.useState(param.name || '')
    const [description, setDescription] = React.useState(param.description || '')
    const [modalVisible, setModalVisible] = React.useState(false);

    React.useEffect(() => {
        navigation.setOptions({ title: param.name ? 'Editar Local' : 'Novo Local' })
    }, [])

    const abrirCamera = async (comRecorte: boolean) => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permissão negada", "Precisamos da câmera.");
                return;
            }
            const options: ImagePicker.ImagePickerOptions = {
                quality: 0.6, 
                allowsEditing: comRecorte, 
            };
            if (comRecorte) options.aspect = [16, 9];

            const result = await ImagePicker.launchCameraAsync(options);
            if (!result.canceled) setImageUri(result.assets[0].uri);
        } catch (error) {
            console.log(error);
        }
    };

    const mostrarOpcoesDeFoto = () => {
        Alert.alert("Foto", "Escolha o formato:", [
            { text: "Cancelar", style: "cancel" },
            { text: "📸 Inteira", onPress: () => abrirCamera(false) },
            { text: "✂️ Cortada", onPress: () => abrirCamera(true) }
        ]);
    }

    function savePlace() {
        if (!name.trim()) {
            Alert.alert("Atenção", "Nome obrigatório.");
            return;
        }
        const placeToSave = { ...param, name, description, imageUri } as Place

        placeRepo.save(placeToSave)
            .then(() => {
                Alert.alert("Sucesso! ✅", "Salvo.", [{ text: "OK", onPress: () => navigation.goBack() }]);
            })
            .catch(() => Alert.alert("Erro", "Falha ao salvar."));
    }

    function removePlace() {
        Alert.alert("Remover", "Confirma?", [
            { text: "Não", style: "cancel" },
            { text: "Sim", style: 'destructive', onPress: () => {
                placeRepo.remove(param).then(() => navigation.goBack())
            }}
        ])
    }

    return (
        
        <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#fff' }}>
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                
                
                <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>✕ Fechar</Text>
                        </TouchableOpacity>
                        {imageUri && <Image source={{ uri: imageUri }} style={styles.fullImage} resizeMode="contain" />}
                    </View>
                </Modal>

                
                <View style={styles.header}>
                    <Text style={styles.coordText}>📍 {param.latitude.toFixed(4)}, {param.longitude.toFixed(4)}</Text>
                </View>

                <View style={styles.flexArea}>
                    <TouchableOpacity 
                        style={{ flex: 1 }} 
                        onPress={() => { if (imageUri) setModalVisible(true); }}
                        activeOpacity={imageUri ? 0.7 : 1} 
                        disabled={!imageUri}
                    >
                        <View style={[styles.imageContainer, { backgroundColor: imageUri ? 'transparent' : '#f0f0f0' }]}>
                            {imageUri ? (
                                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
                            ) : (
                                <Text style={styles.placeholderText}>Toque em "Adicionar" 👇</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                    
                    <View style={styles.photoButtonContainer}>
                        <Button title={imageUri ? "🔄 Trocar Foto" : "📸 Adicionar Foto"} onPress={mostrarOpcoesDeFoto} />
                    </View>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>Nome:</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nome do local" />

                    <Text style={styles.label}>Descrição:</Text>
                    <TextInput 
                        style={[styles.input, { height: 60 }]} 
                        value={description} 
                        onChangeText={setDescription} 
                        multiline={true}
                        placeholder="Breve descrição..."
                    />

                    <View style={styles.actionButtons}>
                        {param.name && (
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <Button color="#d32f2f" title="Excluir" onPress={removePlace} />
                            </View>
                        )}
                        <View style={{ flex: 1 }}>
                            <Button title="Salvar" onPress={savePlace} />
                        </View>
                    </View>
                </View>

                
                <View style={{ height: 100 }} />

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    header: {
        alignItems: 'center',
        marginBottom: 5,
    },
    coordText: {
        fontSize: 12,
        color: '#666',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 10,
    },
    flexArea: {
        flex: 1, 
        justifyContent: 'center',
        marginBottom: 10,
    },
    imageContainer: {
        flex: 1, 
        width: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderText: {
        color: '#999',
        fontSize: 14,
    },
    photoButtonContainer: {
        marginTop: 5,
    },
    formContainer: {
        marginBottom: 10, 
    },
    label: {
        fontWeight: 'bold',
        fontSize: 12, 
        color: '#333',
        marginBottom: 2,
    },
    input: {
        padding: 8, 
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 8,
        borderColor: '#ccc',
        backgroundColor: '#f9f9f9',
        fontSize: 14,
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: 5,
    },
    modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
    fullImage: { width: '100%', height: '80%' },
    closeButton: { position: 'absolute', top: 50, right: 20, padding: 10, zIndex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
    closeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
})