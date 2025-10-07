import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';


const BottomTabBar = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Início' },
    { id: 'calendar', icon: '📅', label: 'Calendário' },
    { id: 'reminders', icon: '🔔', label: 'Lembretes' },
    { id: 'rewards', icon: '🏆', label: 'Conquistas' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              isActive && styles.tabActive,
            ]}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{tab.icon}</Text>
            <Text style={[
              styles.label,
              isActive ? styles.labelActive : styles.labelInactive,
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.gelo,
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    ...FONTS.small,
    fontSize: 11,
    fontWeight: '600',
  },
  labelActive: {
    color: COLORS.secondary,
  },
  labelInactive: {
    color: '#6B7280',
  },
});

export default BottomTabBar;