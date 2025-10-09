import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

const BottomTabBar2 = ({ state, navigation }) => {

  const tabInfo = {
    'Home': { icon: '🏠', label: 'Início' },
    'Calendar': { icon: '📅', label: 'Calendário' },
    'Reminders': { icon: '🔔', label: 'Lembretes' },
    'Rewards': { icon: '🏆', label: 'Conquistas' },
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { icon, label } = tabInfo[route.name] || {};

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={[styles.tab, isFocused && styles.tabActive]}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{icon}</Text>
            <Text style={[styles.label, isFocused ? styles.labelActive : styles.labelInactive]}>
              {label}
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
    paddingTop: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.gelo,
    borderRadius: 12,
    margin: 4,
  },
  icon: {
    fontSize: 24,
    marginBottom: 2,
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

export default BottomTabBar2;