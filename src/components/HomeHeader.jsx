import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../store/AuthContext';
import { COLORS, FONTS } from '../constants/theme';

const HomeHeader = ({ userData, onProfilePress, onSettingsPress }) => {
  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Olá, {userData.name}! 👋</Text>
          <Text style={styles.subtitle}>
            Nível {userData.level} • {userData.title}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton} onPress={onSettingsPress}>
            <Text style={styles.iconText}>⚙️</Text>
          </TouchableOpacity>

          {/* Botão de Logout Instantâneo */}
          <TouchableOpacity style={styles.iconButton} onPress={logout}>
            <Text style={styles.iconText}>🚪</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
            <View style={styles.profileIcon}>
              <Text style={styles.profileIconText}>👤</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{userData.level}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra de Progresso */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${userData.xpProgress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {userData.xpToNextLevel} XP para o próximo nível!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    ...FONTS.h2,
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    ...FONTS.small,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
  },
  profileButton: {
    position: 'relative',
  },
  profileIcon: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.laranja,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  progressSection: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.laranja,
    borderRadius: 4,
  },
  progressText: {
    ...FONTS.small,
    color: COLORS.white,
    opacity: 0.8,
    fontSize: 11,
  },
});


export default HomeHeader;
