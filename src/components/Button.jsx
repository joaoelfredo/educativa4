import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../constants/theme';

const Button = ({ title, onPress, loading, variant = 'primary', style }) => {
  const isPrimary = variant === 'primary';
  const isBlue = variant === 'blue';

  if (isPrimary || isBlue) {
    const gradientColors = isPrimary
      ? COLORS.primaryGradient   // Laranja
      : COLORS.secondaryGradient; // Azul

    return (
      <TouchableOpacity onPress={onPress} disabled={loading} style={[styles.shadow, style]}>
        <LinearGradient colors={gradientColors} style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.lightText}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={[styles.buttonContainer, styles.shadow, styles.secondaryButton, style]}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : (
        <Text style={styles.darkText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  lightText: {
    ...FONTS.button,
    color: COLORS.white,
    fontWeight: '700',
    textAlign: 'center',
  },
  darkText: {
    ...FONTS.button,
    color: COLORS.text,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default Button;