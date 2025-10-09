import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

const RewardsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🏆</Text>
        <Text style={styles.text}>Tela de Conquistas</Text>
        <Text style={styles.subtitle}>Em breve...</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
  },
  text: {
    ...FONTS.h2,
    color: COLORS.text,
    marginTop: 16,
  },
  subtitle: {
    ...FONTS.body,
    color: COLORS.gray,
    marginTop: 8,
  }
});

export default RewardsScreen;