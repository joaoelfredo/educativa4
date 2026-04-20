import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, FONTS } from '../constants/theme'

const priorityStyles = {
  alta: {
    label: 'Alta',
    bg: '#FEE2E2',
    text: '#B91C1C',
    border: '#FCA5A5',
  },
  media: {
    label: 'Média',
    bg: '#FEF3C7',
    text: '#92400E',
    border: '#FCD34D',
  },
  baixa: {
    label: 'Baixa',
    bg: '#DCFCE7',
    text: '#166534',
    border: '#86EFAC',
  },
}

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}min`
  }
  return `${mins}min`
}

const GoalCard = ({ goal, onComplete, onDelete, isUpdating, isDeleting }) => {
  const completed = goal.status === 'completed' || goal.completedSessions >= goal.totalSessions
  const completedSessions = Number(goal.completedSessions ?? 0)
  const totalSessions = Number(goal.totalSessions ?? 1)
  const progress = Math.min(100, Math.round((completedSessions / Math.max(totalSessions, 1)) * 100))
  const priority = priorityStyles[goal.priority] ?? priorityStyles.media
  const displayTitle = goal.title || goal.text || 'Meta sem título'
  const statusLabel = completed ? 'Concluída' : goal.status === 'in-progress' ? 'Em andamento' : 'Pendente'

  return (
    <View style={[styles.card, completed && styles.cardCompleted]}>
      <View style={styles.header}>
        <View style={[styles.priorityBadge, { backgroundColor: priority.bg, borderColor: priority.border }]}> 
          <Text style={[styles.priorityText, { color: priority.text }]}>{priority.label}</Text>
        </View>
        <View style={styles.sessionBadge}>
          <MaterialIcons name="timer" size={16} color={COLORS.text} />
          <Text style={[styles.sessionText, styles.sessionTextMargin]}>{`${completedSessions}/${totalSessions}`}</Text>
        </View>
      </View>

      <Text style={[styles.title, completed && styles.titleCompleted]} numberOfLines={2}>{displayTitle}</Text>
      <Text style={styles.statusLabel}>{statusLabel}</Text>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: completed ? COLORS.success : COLORS.primary }]} />
      </View>

      <View style={styles.statusRow}>
        <View>
          <Text style={styles.statLabel}>{completed ? 'Durou' : 'Tempo'}</Text>
          <Text style={styles.statValue}>{formatTime(goal.totalTime)}</Text>
          {completed && goal.completedAt && (
            <Text style={styles.completedAtText}>Concluída em {new Date(goal.completedAt).toLocaleDateString()}</Text>
          )}
        </View>
        <View style={styles.buttonGroup}>
          {!completed && (
            <TouchableOpacity
              style={[styles.actionButton, (isUpdating || isDeleting) && styles.actionButtonDisabled]}
              onPress={() => onComplete?.(goal.id)}
              disabled={isUpdating || isDeleting}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>
                {isUpdating ? 'Atualizando' : 'Concluir'}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.deleteButton, isDeleting && styles.actionButtonDisabled]}
            onPress={() => onDelete?.(goal.id)}
            disabled={isDeleting}
            activeOpacity={0.8}
          >
            <MaterialIcons name="delete" size={16} color={isDeleting ? '#9CA3AF' : '#EF4444'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  cardCompleted: {
    opacity: 0.9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  priorityBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  priorityText: {
    ...FONTS.small,
    fontWeight: '700',
  },
  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sessionText: {
    ...FONTS.small,
    color: COLORS.text,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 16,
  },
  titleCompleted: {
    color: COLORS.gray,
  },
  progressBarBackground: {
    width: '100%',
    height: 10,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statLabel: {
    color: '#6B7280',
    ...FONTS.small,
    marginBottom: 4,
  },
  statValue: {
    color: COLORS.text,
    ...FONTS.h3,
  },
  statusLabel: {
    color: '#6B7280',
    ...FONTS.small,
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  deleteButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
  },
  actionButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  actionButtonText: {
    color: COLORS.white,
    ...FONTS.small,
    fontWeight: '700',
  },
  completedAtText: {
    color: '#6B7280',
    ...FONTS.small,
    marginTop: 4,
  },
  sessionTextMargin: {
    marginLeft: 6,
  },
})

export default GoalCard
