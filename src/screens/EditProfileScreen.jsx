import React, { useState, useContext, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, 
    TextInput, Alert, SafeAreaView, Platform, ActivityIndicator,
    Keyboard 
} from 'react-native';
import { SafeAreaView as SafeContextView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; 
import { COLORS, FONTS } from '../constants/theme';
import { AuthContext } from '../store/AuthContext';
import api from '../services/api';
import Button from '../components/Button';
import AppHeader from '../components/AppHeader';

const EditProfileScreen = ({ navigation }) => {
    const { user, updateUser } = useContext(AuthContext);

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [course, setCourse] = useState(user?.course || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPhone(user.phone || '');
            setCourse(user.course || '');
        }
    }, [user]);

    const handleSave = async () => {
        if (!name || !email) {
            Alert.alert('Atenção', 'Nome e E-mail são obrigatórios.');
            return;
        }
        setLoading(true);
        const profileData = { name, email, phone, course };

        try {
            const response = await api.patch('/user/profile', profileData);
            const updatedUser = response.data;
            if (!updatedUser || !updatedUser.id) {
                throw new Error("Resposta da API não continha dados do usuário.");
            }
            updateUser(updatedUser);
            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || 'Não foi possível atualizar o perfil.';
            Alert.alert('Erro', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <SafeContextView style={styles.container}>
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
            </SafeContextView>
        );
    }

    const headerData = {
        name: user?.name || '...',
        email: user?.email || '...',
        level: user?.level || 3,
        title: user?.title || 'Estudante Dedicada',
        xpProgress: user?.xpProgress || 65,
        xpToNextLevel: user?.xpToNextLevel || 150,
        ...user
    };

    return (
        <SafeContextView style={styles.container} edges={['top', 'left', 'right']}>
            <AppHeader
                navigation={navigation}
                userData={headerData}
                showBackButton={true}
                title="Editar Perfil"
            />

            <KeyboardAwareScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
            >
                <View style={styles.card}>
                    {/* Foto do Perfil */}
                    <View style={styles.photoSection}>
                        <View style={styles.profilePhoto}>
                            <Text style={styles.profilePhotoText}>{name ? name[0].toUpperCase() : '?'}</Text>
                        </View>
                    </View>

                    {/* Formulário */}
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>👤 Nome Completo</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Digite seu nome"
                                editable={!loading}
                                returnKeyType="next" 
                                onSubmitEditing={() => Keyboard.dismiss()} 
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>📧 E-mail</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Digite seu e-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!loading}
                                returnKeyType="next"
                                onSubmitEditing={() => Keyboard.dismiss()}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>📱 Telefone</Text>
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="(00) 90000-0000"
                                keyboardType="phone-pad"
                                editable={!loading}
                                returnKeyType="next"
                                onSubmitEditing={() => Keyboard.dismiss()}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>🎓 Curso/Escola</Text>
                            <TextInput
                                style={styles.input}
                                value={course}
                                onChangeText={setCourse}
                                placeholder="Ex: Engenharia de Software"
                                editable={!loading}
                                returnKeyType="done" 
                                onSubmitEditing={handleSave} 
                            />
                        </View>

                        {/* Botões com proporção ajustada */}
                        <View style={styles.buttons}>
                            <Button
                                title="Cancelar"
                                variant="secondary"
                                onPress={() => navigation.goBack()}
                                disabled={loading}
                                style={{ flex: 1 }}
                            />
                            <Button
                                title={loading ? "Salvando..." : "Salvar Alterações"}
                                variant="primary"
                                onPress={handleSave}
                                loading={loading}
                                style={{ flex: 2, marginLeft: 12 }}
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeContextView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    scrollContent: { 
        padding: 16,
        paddingBottom: 40, 
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    photoSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    profilePhoto: {
        width: 96,
        height: 96,
        backgroundColor: COLORS.laranja,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    profilePhotoText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    changePhotoText: {
        ...FONTS.body,
        fontWeight: '600',
        color: COLORS.laranja,
        fontSize: 14,
    },
    form: {
        gap: 16,
    },
    inputGroup: {
        marginBottom: 8,
    },
    label: {
        ...FONTS.body,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        fontSize: 14,
    },
    input: {
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        ...FONTS.body,
        fontSize: 14,
    },
    buttons: {
        flexDirection: 'row',
        marginTop: 16,
    },
});

export default EditProfileScreen;