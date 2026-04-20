import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS, FONTS } from '../constants/theme'

const formatTime = (minutes) => {
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hrs > 0 ? `${hrs}h ${mins}min` : `${mins}min`
}

const GoalsDashboard = ({ totalGoals, completedGoals, pendingGoals, totalMinutes }) => {
  return (
    <View style={styles.dashboardWrapper}>
      <Text style={styles.sectionTitle}>Dashboard</Text>

      <View style={styles.cardRow}>
        <View style={[styles.statCard, styles.highlightCard]}>
          <Text style={styles.statLabel}>Total de metas</Text>
          <Text style={styles.statValue}>{totalGoals}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Concluídas</Text>
          <Text style={styles.statValue}>{completedGoals}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Pendentes</Text>
          <Text style={styles.statValue}>{pendingGoals}</Text>
        </View>
        <View style={[styles.statCard, styles.timeCard]}>
          <Text style={styles.statLabel}>Tempo total</Text>
          <Text style={styles.statValue}>{formatTime(totalMinutes)}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  dashboardWrapper: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    ...FONTS.h3,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 18,
    minHeight: 108,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  highlightCard: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  timeCard: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  statLabel: {
    color: '#6B7280',
    ...FONTS.small,
    marginBottom: 8,
  },
  statValue: {
    color: COLORS.text,
    ...FONTS.h2,
  },
})

export default GoalsDashboard
