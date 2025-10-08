import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme'; 

const Input = ({ icon, onIconPress, ...props }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholderTextColor={props.placeholderTextColor || COLORS.placeholder}
        {...props}
      />
      {icon && (
        <TouchableOpacity onPress={onIconPress} style={styles.iconContainer}>
          {icon}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textInput: {
    flex: 1, 
    color: COLORS.text,
    paddingVertical: 16, 
    fontSize: 18,
    fontWeight: '600',
  },
  
  iconContainer: {
    paddingLeft: 10, 
  },
});

export default Input;