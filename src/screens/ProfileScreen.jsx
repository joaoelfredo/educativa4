import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AppHeader from '../components/AppHeader';
import { COLORS, FONTS } from '../constants/theme';

const ProfileScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const userData = {
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    level: 3,
    title: 'Estudante Dedicada',
    xpProgress: 65,
    xpToNextLevel: 150,
  };

  const stats = [
    { value: 23, label: 'Tarefas Concluídas', bgColor: COLORS.gelo, textColor: COLORS.secondary },
    { value: 5, label: 'Dias de Sequência', bgColor: '#FFF3E0', textColor: '#F57C00' },
    { value: 3, label: 'Nível Atual', bgColor: '#E8F5E9', textColor: '#4CAF50' },
    { value: 6, label: 'Medalhas', bgColor: '#F3E5F5', textColor: '#9C27B0' },
  ];

  return (
    <View style={styles.container}>
      <AppHeader
        userData={userData}
        navigation={navigation}
        showBackButton={true}
        title="Meu Perfil"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Foto e Info do Perfil */}
        <View style={styles.profileCard}>
          <View style={styles.profilePhoto}>
            <Text style={styles.profilePhotoText}>A</Text>
          </View>
          <Text style={styles.profileName}>{userData.name}</Text>
          <Text style={styles.profileEmail}>{userData.email}</Text>
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
            {stats.map((stat, index) => (
              <View key={index} style={[styles.statItem, { backgroundColor: stat.bgColor }]}>
                <Text style={[styles.statValue, { color: stat.textColor }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Configurações */}
        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>⚙️ Configurações</Text>
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>🔔 Notificações</Text>
              <TouchableOpacity
                style={[styles.toggle, notificationsEnabled && styles.toggleActive]}
                onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              >
                <View style={[
                  styles.toggleCircle,
                  notificationsEnabled && styles.toggleCircleActive
                ]} />
              </TouchableOpacity>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>🌙 Modo Escuro</Text>
              <TouchableOpacity
                style={[styles.toggle, darkModeEnabled && styles.toggleActive]}
                onPress={() => setDarkModeEnabled(!darkModeEnabled)}
              >
                <View style={[
                  styles.toggleCircle,
                  darkModeEnabled && styles.toggleCircleActive
                ]} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.settingButton}>
              <Text style={styles.settingLabel}>🔒 Alterar Senha</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton}>
              <Text style={styles.settingLabel}>📱 Sobre o App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  profileEmail: {
    ...FONTS.body,
    color: '#6B7280',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: COLORS.laranja,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
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
  statItem: {
    width: '50%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
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
  settingsCard: {
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
  settingsList: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.gelo,
    padding: 12,
    borderRadius: 12,
  },
  settingButton: {
    backgroundColor: COLORS.gelo,
    padding: 12,
    borderRadius: 12,
  },
  settingLabel: {
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.anil,
  },
  toggle: {
    width: 48,
    height: 24,
    backgroundColor: '#D1D5DB',
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: COLORS.laranja,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
});

export default ProfileScreen;