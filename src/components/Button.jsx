import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../constants/theme';


const Button = ({ title, onPress, loading, type = 'primary' }) => {
  if (type === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={loading} style={styles.shadow}>
        <LinearGradient
          colors={COLORS.primaryGradient}
          style={styles.button}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.text}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Botão secundário (para links como "Criar Conta")
  return (
     <TouchableOpacity onPress={onPress} disabled={loading}>
        <Text style={styles.linkText}>{title}</Text>
     </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
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
    marginBottom: 16,
  },
  text: {
    ...FONTS.button,
    color: COLORS.white,
  },
  linkText: {
    ...FONTS.body,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  }
});

export default Button;