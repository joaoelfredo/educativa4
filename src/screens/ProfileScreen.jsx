import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import AppHeader from '../components/AppHeader';
import { COLORS, FONTS } from '../constants/theme';
import { AuthContext } from '../store/AuthContext'; 
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);

    const userGamification = {
        level: user?.level || 3, 
        title: user?.title || 'Estudante Dedicado',
        xpProgress: user?.xpProgress || 65,
        xpToNextLevel: user?.xpToNextLevel || 150,
        stats: [
            { value: user?.tasksCompleted || 23, label: 'Tarefas Concluídas', bgColor: COLORS.gelo, textColor: COLORS.secondary },
            { value: user?.streak || 5, label: 'Dias de Sequência', bgColor: '#FFF3E0', textColor: '#F57C00' },
            { value: user?.level || 1, label: 'Nível Atual', bgColor: '#E8F5E9', textColor: '#4CAF50' },
            { value: user?.medals || 3, label: 'Medalhas', bgColor: '#F3E5F5', textColor: '#9C27B0' },
        ]
    };

    const handleLogout = () => {
        Alert.alert(
            "Sair do App",
            "Tem certeza que deseja sair?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: () => logout()
                }
            ]
        );
    };


    if (!user) {
        return (
            <SafeAreaView style={styles.safeArea}>
                {/* Renderiza um AppHeader mínimo enquanto carrega */}
                <AppHeader
                    navigation={navigation}
                    showBackButton={true}
                    title="Meu Perfil"
                    userData={null} 
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            </SafeAreaView>
        );
    }


    const headerData = { ...user, ...userGamification };

    return (
        <SafeAreaView style={styles.safeArea}>
            <AppHeader
                userData={headerData}
                navigation={navigation}
                showBackButton={true}
                title="Meu Perfil"
            />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.profileCard}>
                    <View style={styles.profilePhoto}>
                        {/* 6. Usa a inicial do nome real */}
                        <Text style={styles.profilePhotoText}>{user.name ? user.name[0].toUpperCase() : '?'}</Text>
                    </View>
                    {/* 7. Usa os dados reais do 'user' */}
                    <Text style={styles.profileName}>{user.name}</Text>

                    <View style={styles.infoRow}>
                        <Ionicons name="mail-outline" size={16} color={COLORS.gray} style={styles.infoIcon} />
                        <Text style={styles.profileInfoText}>{user.email}</Text>
                    </View>
                    {/* (Opcional) Mostra se existir no objeto 'user' */}
                    {user.phone && (
                        <View style={styles.infoRow}>
                            <Ionicons name="call-outline" size={16} color={COLORS.gray} style={styles.infoIcon} />
                            <Text style={styles.profileInfoText}>{user.phone}</Text>
                        </View>
                    )}
                    {user.course && (
                        <View style={styles.infoRow}>
                            <Ionicons name="school-outline" size={16} color={COLORS.gray} style={styles.infoIcon} />
                            <Text style={styles.profileInfoText}>{user.course}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <Text style={styles.editButtonText}>✏️ Editar Perfil</Text>
                    </TouchableOpacity>
                </View>

                {/* Estatísticas */}
                <View style={styles.statsCard}>
                    <Text style={styles.sectionTitle}>📊 Minhas Estatísticas</Text>
                    <View style={styles.statsGrid}>
                        {userGamification.stats.map((stat, index) => (
                            <View key={index} style={[styles.statItemContainer]}>
                                <View style={[styles.statItem, { backgroundColor: stat.bgColor }]}>
                                    <Text style={[styles.statValue, { color: stat.textColor }]}>{stat.value}</Text>
                                    <Text style={styles.statLabel}>{stat.label}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Sair do App</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: Platform.OS === 'android' ? 25 : 0
    },
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
        padding: 16,
    },
    profileCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    profilePhoto: {
        width: 96,
        height: 96,
        backgroundColor: COLORS.laranja,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    profilePhotoText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    profileName: {
        ...FONTS.h2,
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.anil,
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoIcon: {
        marginRight: 8,
    },
    profileInfoText: {
        ...FONTS.body,
        color: COLORS.gray,
        fontSize: 14,
    },

    editButton: {
        backgroundColor: COLORS.laranja,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginTop: 16,
    },
    editButtonText: {
        ...FONTS.body,
        fontWeight: '600',
        color: COLORS.white,
    },
    statsCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        ...FONTS.h3,
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.anil,
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    statItemContainer: {
        width: '50%',
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    statItem: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        ...FONTS.small,
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
    logoutButton: {
        backgroundColor: COLORS.red, 
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        marginBottom: 32,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    logoutButtonText: {
        ...FONTS.button,
        color: COLORS.white,
        fontWeight: '700',
        textAlign: 'center',
    },
});

export default ProfileScreen;