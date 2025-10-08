import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../store/AuthContext';
import { COLORS, FONTS } from '../constants/theme';

const AppHeader = ({
  userData,
  navigation,
  onProfilePress,
  showBackButton = false,
  title: customTitle,
}) => {
  const { logout } = useContext(AuthContext);

  return (
    <LinearGradient colors={COLORS.secondaryGradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.topRow}>
            <View style={styles.leftSection}>
              {showBackButton && (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={28} color={COLORS.white} />
                </TouchableOpacity>
              )}
            </View>

            <View style={[
              styles.centerSection,
              customTitle ? { alignItems: 'center' } : { alignItems: 'flex-start' }
            ]}>
              {customTitle ? (
                <Text style={styles.greeting}>{customTitle}</Text>
              ) : (
                <>
                  <Text style={styles.greeting}>Olá, {userData.name}! 👋</Text>
                  <Text style={styles.subtitle}>Nível {userData.level} • {userData.title}</Text>
                </>
              )}
            </View>

            <View style={styles.rightSection}>
              <TouchableOpacity style={styles.iconButton} onPress={logout}>
                <Ionicons name="log-out-outline" size={22} color={COLORS.white} />
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

          {!customTitle && userData && (
            <View style={styles.progressSection}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${userData.xpProgress}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {userData.xpToNextLevel - userData.xpProgress} XP para o próximo nível!
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftSection: {
    flex: 0.5,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 4,
  },
  rightSection: {
    flex: 1.5, 
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: -8,
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
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
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
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
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

export default AppHeader;