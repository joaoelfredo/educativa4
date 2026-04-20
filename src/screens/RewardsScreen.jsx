import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Platform,
    TouchableOpacity, 
    Alert 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../constants/theme';
import { AuthContext } from '../store/AuthContext';
import { fetchMetrics } from '../services/api';
import { MaterialIcons } from '@expo/vector-icons';

import AppHeader from '../components/AppHeader';
import MascotMessage2 from '../components/MascotMessage2';

const RewardsScreen = ({ navigation }) => {
    // const { user } = useContext(AuthContext); // Pegar dados reais
    const [userData, setUserData] = useState({
        name: 'Ana',
        level: 3,
        title: 'Estudante Dedicada',
        xpProgress: 65,
        xpToNextLevel: 150,
    });

    const [metrics, setMetrics] = useState({
        weekGoals: 0,
        monthGoals: 0,
        yearGoals: 0,
        completedTasks: 0,
        streakDays: 0,
        currentLevel: 1,
    });

    const [loadingMetrics, setLoadingMetrics] = useState(false);
    const [metricsError, setMetricsError] = useState('');

    const loadMetrics = useCallback(async () => {
        setLoadingMetrics(true);
        setMetricsError('');

        try {
            const data = await fetchMetrics();
            setMetrics({
                weekGoals: data.weekGoals ?? 0,
                monthGoals: data.monthGoals ?? 0,
                yearGoals: data.yearGoals ?? 0,
                completedTasks: data.completedTasks ?? 0,
                streakDays: data.streakDays ?? 0,
                currentLevel: data.currentLevel ?? 1,
            });
        } catch (error) {
            console.error('[RewardsScreen] Falha ao carregar métricas:', error);
            setMetricsError('Não foi possível carregar as métricas. Tente novamente mais tarde.');
        } finally {
            setLoadingMetrics(false);
        }
    }, []);

    useEffect(() => {
        loadMetrics();
    }, [loadMetrics]);

    useFocusEffect(
        useCallback(() => {
            loadMetrics();
        }, [loadMetrics])
    );

    const medals = [
        {
            id: '1',
            icon: '🌟',
            name: 'Primeira Semana',
            achieved: true,
            color: COLORS.laranja,
            bgColor: COLORS.laranjaClaro,
            description: 'Você completou suas primeiras tarefas e engajou no app durante uma semana inteira. Parabéns pelo começo!'
        },
        {
            id: '2',
            icon: '📚',
            name: 'Estudante',
            achieved: true,
            color: COLORS.marinho,
            bgColor: COLORS.gelo,
            description: 'Concedida por completar suas primeiras 10 tarefas. Você está no caminho certo!'
        },
        {
            id: '3',
            icon: '⏰',
            name: 'Pontual',
            achieved: true,
            color: COLORS.green,
            bgColor: '#E8F5E9',
            description: 'Concedida por entregar 5 tarefas antes do prazo final.'
        },
        {
            id: '6',
            icon: '🏅',
            name: 'Mestre',
            achieved: false,
            color: COLORS.gray,
            bgColor: '#F3F4F6',
            description: 'Complete 50 tarefas para desbloquear a medalha de Mestre da Organização.'
        }, // Bloqueada
    ];

    const stats = [
        { label: 'Tarefas Concluídas', value: `${metrics.completedTasks}`, color: COLORS.green },
        { label: 'Sequência Atual', value: `${metrics.streakDays} dias`, color: COLORS.laranja },
        { label: 'Nível Atual', value: `${metrics.currentLevel}`, color: COLORS.marinho },
    ];

    const handleMedalPress = (medal) => {
        if (medal.achieved) {
            Alert.alert(
                `${medal.icon} ${medal.name}`, 
                medal.description, 
                [{ text: 'OK' }]
            );
        } else {
            Alert.alert(
                `🔒 ${medal.name} (Bloqueada)`, 
                medal.description, 
                [{ text: 'Entendi' }]
            );
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={COLORS.secondaryGradient}>
                <AppHeader
                    navigation={navigation}
                    userData={userData}
                    showBackButton={true}
                    title="Conquistas"
                    onProfilePress={() => navigation.navigate('Profile')}
                />
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.mascotContainer}>
                    <MascotMessage2 message={`Você tem ${medals.filter(m => m.achieved).length} medalhas! Continue assim! 🌟`} />
                </View>

                {/* Medalhas Conquistadas */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>🥇 Medalhas Conquistadas</Text>
                    <View style={styles.medalsGrid}>
                        {medals.map((medal) => (
                            <TouchableOpacity
                                key={medal.id}
                                style={styles.medalItemContainer}
                                onPress={() => handleMedalPress(medal)}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        styles.medalItem,
                                        {
                                            backgroundColor: medal.achieved ? medal.bgColor : COLORS.lightGray,
                                            borderColor: medal.achieved ? medal.color : COLORS.gray,
                                            opacity: medal.achieved ? 1 : 0.6,
                                        }
                                    ]}
                                >
                                    <Text style={styles.medalIcon}>{medal.icon}</Text>
                                    <Text
                                        style={[
                                            styles.medalName,
                                            { color: medal.achieved ? medal.color : COLORS.darkGray }
                                        ]}
                                    >
                                        {medal.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Métricas de Produtividade */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📈 Métricas de Produtividade</Text>
                    <TouchableOpacity style={styles.viewDetailsButton} onPress={() => navigation.navigate('Goals')}>
                        <MaterialIcons name="visibility" size={20} color="#4F6DFF" />
                        <Text style={styles.viewDetailsText}>Ver detalhes</Text>
                    </TouchableOpacity>
                    {loadingMetrics ? (
                        <Text style={styles.metricLoading}>Carregando métricas...</Text>
                    ) : metricsError ? (
                        <Text style={styles.metricLoading}>{metricsError}</Text>
                    ) : (
                        <View style={styles.metricsGrid}>
                            
                            <View style={styles.metricItem}>
                                <Text style={styles.metricLabel}>Semana</Text>
                                <Text style={styles.metricValue}>{metrics.weekGoals}</Text>
                                <Text style={styles.metricSub}>metas</Text>
                            </View>
                            <View style={styles.metricItem}>
                                <Text style={styles.metricLabel}>Mês</Text>
                                <Text style={styles.metricValue}>{metrics.monthGoals}</Text>
                                <Text style={styles.metricSub}>metas</Text>
                            </View>
                            <View style={styles.metricItem}>
                                <Text style={styles.metricLabel}>Ano</Text>
                                <Text style={styles.metricValue}>{metrics.yearGoals}</Text>
                                <Text style={styles.metricSub}>metas</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Estatísticas */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📊 Suas Estatísticas</Text>
                    <View style={styles.statsList}>
                        {stats.map((stat, index) => (
                            <View key={index} style={styles.statItem}>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                            </View>
                        ))}
                    </View>
                </View>

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
    scrollContent: {
        padding: 16,
        paddingBottom: 24,
    },
    mascotContainer: {
        marginBottom: 4,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    sectionTitle: {
        ...FONTS.h3,
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.anil,
        marginBottom: 16,
    },
    medalsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    medalItemContainer: {
        width: '50%', 
        paddingHorizontal: 8,
        marginBottom: 16, 
    },
    medalItem: {
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 12,
        paddingVertical: 20, 
        minHeight: 120, 
        justifyContent: 'center',
    },
    medalIcon: {
        fontSize: 36,
        marginBottom: 10,
    },
    medalName: {
        ...FONTS.small,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    statsList: {
        gap: 12,
    },
    statItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.gelo,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    statLabel: {
        ...FONTS.body,
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.anil,
    },
    statValue: {
        ...FONTS.h3,
        fontSize: 20,
        fontWeight: 'bold',
    },
    metricsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    metricItem: {
        flex: 1,
        backgroundColor: COLORS.gelo,
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    metricLabel: {
        ...FONTS.body,
        fontSize: 14,
        color: COLORS.anil,
        marginBottom: 6,
    },
    metricValue: {
        ...FONTS.h2,
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.marinho,
    },
    metricSub: {
        ...FONTS.small,
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 4,
    },
    metricLoading: {
        ...FONTS.body,
        fontSize: 14,
        color: COLORS.anil,
    },
    viewDetailsButton:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
        borderRadius: 999,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#E0E7FF',
        alignSelf: 'flex-start',
        shadowColor: '#acacac',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    viewDetailsText: {
        ...FONTS.small,
        fontSize: 12,
        fontWeight: '600',
        color: 'black',
    },
});

export default RewardsScreen;