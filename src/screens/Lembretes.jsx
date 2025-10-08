import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import BottomTabBar from '../components/BottomTabBar2';
import { COLORS } from '../constants/theme';

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  form: { width: '100%', maxWidth: 320 },
  footer: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
  },
} 
)
