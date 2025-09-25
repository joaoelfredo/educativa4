import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

const Input = (props) => {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor={COLORS.placeholder}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#FFF',
    color: COLORS.text,
    padding: 16,
    borderRadius: 16, // Mais arredondado
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    // Sombra sutil para elevação
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Input;