import React, { useState, useCallback, useContext } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import AppHeader from '../components/AppHeader'
import AddGoalModal from '../components/AddGoalModal'
import GoalsDashboard from '../components/GoalsDashboard'
import GoalCard from '../components/GoalCard'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, FONTS } from '../constants/theme'
import { fetchGoals, createGoal, progressGoal, completeGoal, deleteGoal } from '../services/api'
import { AuthContext } from '../store/AuthContext'

const GoalsScreen = ({ navigation }) => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [processingGoalId, setProcessingGoalId] = useState(null)
  const [deletingGoalId, setDeletingGoalId] = useState(null)
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)

  const { user, updateUser } = useContext(AuthContext)

  const loadGoals = useCallback(async () => {
    setLoading(true)
    try {
      const fetchedGoals = await fetchGoals()
      const normalizedGoals = fetchedGoals.map((goal) => ({
        ...goal,
        status: goal.status ?? (goal.completed ? 'completed' : 'pending'),
      }))
      setGoals(normalizedGoals)
    } catch (error) {
      console.error('[GoalsScreen] Falha ao carregar metas:', error)
      Alert.alert('Erro', 'Não foi possível carregar suas metas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadGoals()
    }, [loadGoals])
  )

  const handleCreateGoal = async (goalData) => {
    setSaving(true)
    try {
      const newGoal = await createGoal({
        title: goalData.text,
        text: goalData.text,
        totalSessions: goalData.totalSessions,
        priority: goalData.priority,
      })
      if (newGoal) {
        setGoals((current) => [
          {
            ...newGoal,
            status: newGoal.status ?? (newGoal.completed ? 'completed' : 'pending'),
          },
          ...current,
        ])
      } else {
        await loadGoals()
      }
      Alert.alert('Sucesso', 'Meta criada com sucesso.')
    } catch (error) {
      console.error('[GoalsScreen] Erro ao criar meta:', error)
      Alert.alert('Erro', 'Não foi possível criar a meta. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleOpenAddModal = () => {
    setIsAddModalVisible(true)
  }

  const handleCloseAddModal = () => {
    setIsAddModalVisible(false)
  }

  const handleProgress = async (goalId) => {
    setProcessingGoalId(goalId)
    try {
      const updatedGoal = await progressGoal(goalId, 25)
      setGoals((current) => current.map((goal) => (goal.id === goalId ? updatedGoal : goal)))

      // Se o progresso concluiu a meta, atualizamos o XP na interface
      if (updatedGoal?.completed && user && updateUser) {
        const newXp = (user.xp || 0) + 10
        const newLevel = Math.floor(newXp / 100) + 1
        updateUser({ ...user, xp: newXp, xpProgress: newXp % 100, level: newLevel })
        Alert.alert('Parabéns! 🎉', 'Meta concluída! Você ganhou +10 XP')
      }
    } catch (error) {
      console.error('[GoalsScreen] Erro ao atualizar progresso:', error)
      Alert.alert('Erro', 'Não foi possível registrar a sessão. Tente novamente.')
    } finally {
      setProcessingGoalId(null)
    }
  }

  const handleCompleteGoal = async (goalId) => {
    setProcessingGoalId(goalId)
    try {
      const data = await completeGoal(goalId)
      const updatedGoal = data?.completedGoal
      if (updatedGoal) {
        setGoals((current) => current.map((goal) => (goal.id === goalId ? updatedGoal : goal)))
      } else {
        await loadGoals()
      }
      
      // Lógica de adicionar +10 XP na barra instantaneamente
      if (user && updateUser) {
        const newXp = (user.xp || 0) + 10
        const newLevel = Math.floor(newXp / 100) + 1
        updateUser({ ...user, xp: newXp, xpProgress: newXp % 100, level: newLevel })
        Alert.alert('Parabéns! 🎉', 'Meta concluída! Você ganhou +10 XP')
      }
    } catch (error) {
      console.error('[GoalsScreen] Erro ao concluir meta:', error)
      Alert.alert('Erro', 'Não foi possível concluir a meta. Tente novamente.')
    } finally {
      setProcessingGoalId(null)
    }
  }

  const handleDeleteGoal = async (goalId) => {
    setDeletingGoalId(goalId)
    try {
      await deleteGoal(goalId)
      setGoals((current) => current.filter((goal) => goal.id !== goalId))
    } catch (error) {
      console.error('[GoalsScreen] Erro ao deletar meta:', error)
      Alert.alert('Erro', 'Não foi possível deletar a meta. Tente novamente.')
    } finally {
      setDeletingGoalId(null)
    }
  }

  const totalGoals = goals.length
  const completedGoals = goals.filter((goal) => goal.status === 'completed').length
  const pendingGoals = goals.filter((goal) => goal.status !== 'completed').length
  const totalMinutes = goals.reduce((acc, goal) => acc + (goal.totalTime ?? 0), 0)

  const inProgressGoals = goals.filter((goal) => goal.status === 'pending' || goal.status === 'in-progress')
  const completedGoalList = goals.filter((goal) => goal.status === 'completed')

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader navigation={navigation} title="Metas" showBackButton={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.pageHeaderRow}>
            <View style={styles.pageHeader}>
              <Text style={styles.pageTitle}>Metas</Text>
              <Text style={styles.pageSubtitle}>Organize suas sessões e acompanhe seu progresso de forma acolhedora.</Text>
            </View>
            <TouchableOpacity
              onPress={handleOpenAddModal}
              style={styles.addGoalButton}
              activeOpacity={0.8}
            >
              <MaterialIcons name="add" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <AddGoalModal
            visible={isAddModalVisible}
            onClose={handleCloseAddModal}
            onSubmit={handleCreateGoal}
            title="Nova meta"
            placeholder="Ex: Estudar para a prova de matemática"
            confirmText="Criar meta"
          />

          <GoalsDashboard
            totalGoals={totalGoals}
            completedGoals={completedGoals}
            pendingGoals={pendingGoals}
            totalMinutes={totalMinutes}
          />

          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Hoje</Text>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <>
                <Text style={styles.groupTitle}>Em andamento</Text>
                {inProgressGoals.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Nenhuma meta em andamento por enquanto.</Text>
                  </View>
                ) : (
                  inProgressGoals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onComplete={handleCompleteGoal}
                      onDelete={handleDeleteGoal}
                      isUpdating={processingGoalId === goal.id}
                      isDeleting={deletingGoalId === goal.id}
                    />
                  ))
                )}

                <Text style={styles.groupTitle}>Concluídas</Text>
                {completedGoalList.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Nenhuma meta concluída ainda.</Text>
                  </View>
                ) : (
                  completedGoalList.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onDelete={handleDeleteGoal}
                      isDeleting={deletingGoalId === goal.id}
                    />
                  ))
                )}
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FEF6F2',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  pageHeader: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  pageTitle: {
    ...FONTS.h1,
    color: COLORS.secondary,
    marginBottom: 8,
  },
  pageSubtitle: {
    color: '#6B7280',
    ...FONTS.body,
    lineHeight: 22,
  },
  pageHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  pageHeader: {
    marginRight: 12,
  },
  addGoalButton: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    color: COLORS.text,
    minHeight: 56,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  rowInput: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sessionInputContainer: {
    flex: 1,
    marginRight: 12,
  },
  sessionInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    color: COLORS.text,
  },
  inputLabel: {
    color: '#6B7280',
    ...FONTS.small,
    marginBottom: 8,
  },
  priorityContainer: {
    flex: 1.2,
  },
  priorityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityOption: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  priorityOptionActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  priorityOptionText: {
    color: COLORS.text,
    ...FONTS.small,
  },
  priorityOptionTextActive: {
    color: '#B91C1C',
    fontWeight: '700',
  },
  sectionBlock: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  groupTitle: {
    ...FONTS.h3,
    color: COLORS.secondary,
    marginVertical: 16,
  },
  emptyState: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  emptyText: {
    color: '#6B7280',
    ...FONTS.body,
  },
})

export default GoalsScreen
