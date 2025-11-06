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
import Input from '../components/Input'; 

const EditProfileScreen = ({ navigation }) => {
    const { user, updateUser } = useContext(AuthContext);

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [course, setCourse] = useState(user?.course || '');
    const [loadingProfile, setLoadingProfile] = useState(false);

    const [loadingPassword, setLoadingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [isCurrentVisible, setCurrentVisible] = useState(false);
    const [isNewVisible, setNewVisible] = useState(false);
    const [isConfirmVisible, setConfirmVisible] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPhone(user.phone || '');
            setCourse(user.course || '');
        }
    }, [user]);

    const handleSaveProfile = async () => {
        if (!name || !email) {
            Alert.alert('Atenção', 'Nome e E-mail são obrigatórios.');
            return;
        }
        setLoadingProfile(true);
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
            setLoadingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos de senha.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            Alert.alert('Erro', 'A nova senha e a confirmação não coincidem.');
            return;
        }
        if (newPassword.length < 6) {
             Alert.alert('Senha Fraca', 'Sua nova senha deve ter pelo menos 6 caracteres.');
            return;
        }
        
        setLoadingPassword(true);
        
        try {
            await api.patch('/user/change-password', {
                currentPassword,
                newPassword,
                confirmNewPassword
            });

            Alert.alert(
                'Sucesso!',
                'Sua senha foi alterada com sucesso.'
            );
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');

        } catch (error) {
            console.error("Erro ao alterar senha:", error.response?.data);
            const errorMessage = error.response?.data?.message || 'Não foi possível alterar a senha.';
            Alert.alert('Erro', errorMessage);
        } finally {
            setLoadingPassword(false);
        }
    };

    if (!user) {
        return (
            <SafeContextView style={styles.container}>
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
            </SafeContextView>
        );
    }

    const headerData = { ...user, level: 3, title: 'Estudante', xpProgress: 65, xpToNextLevel: 150 };

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
                    <View style={styles.photoSection}>
                        <View style={styles.profilePhoto}>
                            <Text style={styles.profilePhotoText}>{name ? name[0].toUpperCase() : '?'}</Text>
                        </View>
                    </View>
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>👤 Nome Completo</Text>
                            <TextInput style={styles.input} value={name} onChangeText={setName} editable={!loadingProfile} />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>📧 E-mail</Text>
                            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!loadingProfile} />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>📱 Telefone</Text>
                            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" editable={!loadingProfile} />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>🎓 Curso/Escola</Text>
                            <TextInput style={styles.input} value={course} onChangeText={setCourse} editable={!loadingProfile} returnKeyType="done" />
                        </View>
                        
                        {/* Botões Salvar Perfil / Cancelar */}
                        <View style={styles.buttons}>
                            <Button title="Cancelar" variant="secondary" onPress={() => navigation.goBack()} disabled={loadingProfile} style={{ flex: 1 }} />
                            <Button title={loadingProfile ? "Salvando..." : "Salvar Perfil"} variant="primary" onPress={handleSaveProfile} loading={loadingProfile} style={{ flex: 2, marginLeft: 12 }} />
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>🔒 Alterar Senha</Text>
                    </View>

                    <View style={styles.passwordSection}>
                        <Input
                            placeholder="🔒 Senha Atual"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry={!isCurrentVisible}
                            icon={<Ionicons name={isCurrentVisible ? 'eye-off' : 'eye'} size={24} color={COLORS.gray} />}
                            onIconPress={() => setCurrentVisible(!isCurrentVisible)}
                            editable={!loadingPassword}
                        />
                        <Input
                            placeholder="🔒 Nova Senha"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!isNewVisible}
                            icon={<Ionicons name={isNewVisible ? 'eye-off' : 'eye'} size={24} color={COLORS.gray} />}
                            onIconPress={() => setNewVisible(!isNewVisible)}
                            editable={!loadingPassword}
                        />
                        <Input
                            placeholder="🔒 Confirme a Nova Senha"
                            value={confirmNewPassword}
                            onChangeText={setConfirmNewPassword}
                            secureTextEntry={!isConfirmVisible}
                            icon={<Ionicons name={isConfirmVisible ? 'eye-off' : 'eye'} size={24} color={COLORS.gray} />}
                            onIconPress={() => setConfirmVisible(!isConfirmVisible)}
                            editable={!loadingPassword}
                        />
                        <Button
                            title={loadingPassword ? "Salvando Senha..." : "Salvar Nova Senha"}
                            variant="primary"
                            onPress={handleChangePassword}
                            loading={loadingPassword}
                            style={{ marginTop: 8 }}
                        />
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
        marginBottom: 20,
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
        // gap: 16, // 'gap' não é ideal
    },
    inputGroup: {
        marginBottom: 16, 
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

    passwordSection: {
        marginTop: 8, 
    }
});

export default EditProfileScreen;