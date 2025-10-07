import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Mascot from './Mascot';
import { COLORS, FONTS } from '../constants/theme';

const MascotMessage = ({ message }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.mascotContainer}>
          <Mascot width={48} height={48} />
        </View>
        
        <View style={styles.messageContainer}>
          <View style={styles.bubble}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
          <View style={styles.bubbleTail} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gelo,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mascotContainer: {
    marginRight: 16,
  },
  messageContainer: {
    flex: 1,
    position: 'relative',
  },
  bubble: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
  },
  messageText: {
    ...FONTS.body,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  bubbleTail: {
    position: 'absolute',
    left: -8,
    top: 16,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: 'transparent',
    borderRightWidth: 8,
    borderRightColor: COLORS.white,
  },
});


export default MascotMessage;