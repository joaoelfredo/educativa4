import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import Svg, { Circle } from 'react-native-svg'
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated'

import AppHeader from '../components/AppHeader'
import AddGoalModal from '../components/AddGoalModal'
import { createGoal, completeGoal, deleteGoal, fetchGoals } from '../services/api'
import { AuthContext } from '../store/AuthContext'

const config = {
  Pomodoro: 25 * 60,
  'Pausa curta': 5 * 60,
  'Pausa longa': 15 * 60,
}

const iconsByMode = {
  Pomodoro: 'psychology',
  'Pausa curta': 'free-breakfast',
  'Pausa longa': 'hotel',
}

const priorityStyles = {
  alta: {
    bg: '#FEE2E2',
    text: '#B91C1C',
    border: '#EF4444',
  },
  media: {
    bg: '#FEF3C7',
    text: '#B45309',
    border: '#F59E0B',
  },
  baixa: {
    bg: '#DCFCE7',
    text: '#166534',
    border: '#22C55E',
  },
}

const themeByMode = {
  Pomodoro: {
    primary: '#4F6DFF',
    ring: 'white',
    foto: require('../../assets/JuremaFocada.png'),
  },
  'Pausa curta': {
    primary: '#ff9e66',
    ring: 'white',
    foto: require('../../assets/JuremaPausaCurta.png'),
  },
  'Pausa longa': {
    primary: '#A78BFA',
    ring: 'white',
    foto: require('../../assets/JuremaPausaLonga.png'),
  },
}

const messages = {
  Pomodoro: 'Mantenha o foco e siga determinado!',
  'Pausa curta': 'Respire e relaxe por um momento',
  'Pausa longa': 'Você merece esse descanso',
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const TimerScreen = ({ navigation }) => {
  const { user, updateUser } = useContext(AuthContext);

  const [mode, setMode] = useState('Pomodoro')
  const [time, setTime] = useState(config.Pomodoro)
  const [isActive, setIsActive] = useState(false)
  const [goal, setGoal] = useState({
    text: '',
    priority: 'media',
    completed: false,
  })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [pendingGoals, setPendingGoals] = useState([])
  const [xp, setXp] = useState(user?.xp ?? 0)
  const [showReward, setShowReward] = useState(false)

  const totalTime = config[mode]

  useEffect(() => {
    if (user?.xp != null) {
      setXp(user.xp)
    }
  }, [user?.xp])

  const loadPendingGoals = async () => {
    try {
      const goals = await fetchGoals()
      const pending = goals.filter(
        (item) => item.status === 'pending' || item.status === 'in-progress' || item.completed === false
      )
      setPendingGoals(pending)
    } catch (error) {
      console.warn('[TimerScreen] falha ao carregar metas pendentes:', error)
      setPendingGoals([])
    }
  }

  useEffect(() => {
    if (isModalVisible) {
      loadPendingGoals()
    }
  }, [isModalVisible])

  // função para salvar a meta
  const handleAddGoal = async (goalData) => {
    if (goalData?.selectedGoalId) {
      const selected = pendingGoals.find((item) => item.id === goalData.selectedGoalId)
      if (!selected) {
        Alert.alert('Erro', 'Não foi possível selecionar a meta. Tente novamente.')
        return
      }

      setGoal({
        id: selected.id,
        text: selected.title || selected.text,
        priority: selected.priority ?? 'media',
        completed: selected.completed ?? false,
        totalSessions: selected.totalSessions ?? 1,
      })
      setIsModalVisible(false)
      return
    }
    const text = typeof goalData === 'string' ? goalData : goalData?.text
    const priority = typeof goalData === 'string' ? 'media' : goalData?.priority ?? 'media'

    try {
      const newGoal = await createGoal({ text, priority, totalSessions: goalData?.totalSessions ?? 1 })
      if (!newGoal?.id) {
        Alert.alert('Erro', 'Não foi possível criar a meta corretamente. Tente novamente.')
        return
      }

      setGoal({
        id: newGoal.id,
        text: newGoal.text ?? text,
        priority,
        completed: newGoal.completed ?? false,
        totalSessions: newGoal.totalSessions ?? (goalData?.totalSessions ?? 1),
      })
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a meta. Tente novamente.')
      return
    } finally {
      setIsModalVisible(false)
    }
  }

  const handleMarkGoalComplete = async () => {
    if (mode !== 'Pomodoro') return
    if (!goal?.text || goal.completed) return
    if (!goal?.id) {
      Alert.alert('Erro', 'Meta inválida. Defina uma nova meta antes de concluir.')
      return
    }

    try {
      const data = await completeGoal(goal.id)
      const updatedXp = data?.xp ?? xp + 10
      setGoal((prev) => prev && ({ ...prev, completed: true }))
      setXp(updatedXp)

      if (updateUser && user) {
        updateUser({
          ...user,
          xp: updatedXp,
          xpToNextLevel: 100,
          xpProgress: updatedXp % 100,
          level: Math.floor(updatedXp / 100) + 1,
        })
      }

      setShowReward(true)
      setTimeout(() => {
        setShowReward(false)
      }, 2000)
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível marcar a meta como concluída.')
    }
  }

  const handleDeleteGoal = async () => {
    if (!goal?.id) {
      setGoal(null)
      return
    }

    try {
      await deleteGoal(goal.id)
      setGoal({ text: '', priority: 'media', completed: false })
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a meta.')
    }
  }
  // 🔥 RING CONFIG
  const radius = 110
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius

  const progress = useSharedValue(1)

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }))

  // 🔥 reset quando troca modo
  useEffect(() => {
    progress.value = 1
  }, [mode])

  // 🔥 animação fluida
  useEffect(() => {
    if (!isActive) return

    progress.value = withTiming(0, {
      duration: time * 1000,
      easing: Easing.linear,
    })
  }, [isActive, mode])

  // ⏱ timer real
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTime((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive])

  useEffect(() => {
    if (time === 0 && isActive) {
      setIsActive(false)

      handleMarkGoalComplete()
    }
  }, [time])

  const formatTime = (t) => {
    const m = Math.floor(t / 60)
    const s = t % 60
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setTime(config[newMode])
    setIsActive(false)
  }

  const handleReset = () => {
    setIsActive(false)
    setTime(config[mode])
    progress.value = 1
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader navigation={navigation} title="Timer" showBackButton />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* MODOS */}
        <View style={styles.Modecontainer}>
        {Object.keys(config).map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => handleModeChange(key)}
            style={[
              styles.btnMode,
              mode === key && { backgroundColor: themeByMode[key].primary },
            ]}
          >
            <MaterialIcons
              name={iconsByMode[key]}
              size={20}
              color={mode === key ? '#FFF' : '#6B7280'}
            />
            <Text style={[styles.textMode, mode === key && styles.textModeActive]}>
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      
{!goal?.text ? (
  <TouchableOpacity
    style={styles.goalEmpty}
    onPress={() => setIsModalVisible(true)}
  >
    <MaterialIcons name="add" size={20} color="#4F6DFF" />
    <Text style={styles.goalEmptyText}>
      Definir meta da sessão
    </Text>
  </TouchableOpacity>
) : (
  <View style={styles.goalContainer}>
    <View style={styles.goalCardHeader}>
      <View style={styles.goalTitleSection}>
        <Text style={styles.goalLabel}>Meta da sessão</Text>
        <Text
          style={[
            styles.goalText,
            goal.completed && {
              textDecorationLine: 'line-through',
              color: '#9CA3AF',
            },
          ]}
        >
          {goal.text}
        </Text>
      </View>
      <View
        style={[
          styles.goalPriorityBadge,
          {
            backgroundColor: priorityStyles[goal.priority]?.bg,
            borderColor: priorityStyles[goal.priority]?.border,
          },
        ]}
      >
        <Text
          style={[
            styles.goalPriorityText,
            { color: priorityStyles[goal.priority]?.text },
          ]}
        >
          {goal.priority === 'alta' ? 'Alta' : goal.priority === 'baixa' ? 'Baixa' : 'Média'}
        </Text>
      </View>
    </View>
    {goal.completed && <Text style={styles.goalStatus}>Concluída</Text>}
    <View style={styles.goalActionsRow}>
      <TouchableOpacity
        style={styles.addMetaButton}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={20} color="#4F6DFF" />
        
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleMarkGoalComplete}
        style={[
          styles.actionButton,
          goal.completed && styles.actionButtonDisabled,
        ]}
        disabled={goal.completed}
      >
        <MaterialIcons
          name="check-circle"
          size={22}
          color={goal.completed ? '#A3A3A3' : '#10B981'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDeleteGoal} style={styles.actionButton}>
        <MaterialIcons name="delete" size={22} color="#EF4444" />
      </TouchableOpacity>
      
    </View>
  </View>
)}
    <TouchableOpacity
  onPress={() => navigation.navigate('Goals')}
  style={styles.goalsCardButton}
  activeOpacity={0.8}
>
  <View style={styles.goalsCardLeft}>
    <MaterialIcons name="track-changes" size={22} color="#4F6DFF" />
    <View>
      <Text style={styles.goalsCardTitle}>Minhas metas</Text>
      <Text style={styles.goalsCardSubtitle}>
        Acompanhe seu progresso
      </Text>
    </View>
  </View>

  <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
</TouchableOpacity>
      

      {/* CARD */}
      <View style={[styles.card, { backgroundColor: themeByMode[mode].primary }]}>
        
        {/* 🐻 Mascote */}
        <Image source={themeByMode[mode].foto} style={styles.mascot} />

        {/* ⏱️ TIMER + RING */}
        <View style={styles.timerWrapper}>
          <Svg width={260} height={260}>
            
            {/* fundo */}
            <Circle
              stroke="rgba(255,255,255,0.2)"
              fill="none"
              cx="130"
              cy="130"
              r={radius}
              strokeWidth={strokeWidth}
            />

            {/* progresso */}
            <AnimatedCircle
              stroke={themeByMode[mode].ring}
              fill="none"
              cx="130"
              cy="130"
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              animatedProps={animatedProps}
              strokeLinecap="round"
              rotation="-90"
              origin="130,130"
            />
          </Svg>

          <Text style={styles.textTime}>{formatTime(time)}</Text>
        </View>

        {/* 💬 mensagem */}
        <Text style={styles.messagesContainer}>{messages[mode]}</Text>

        {/* 🎮 botões */}
        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={handleReset} style={styles.controlButtonSecondary}>
            <MaterialIcons name="refresh" size={22} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsActive(!isActive)}
            style={styles.controlButtonPrimary}
          >
            <MaterialIcons
              name={isActive ? 'pause' : 'play-arrow'}
              size={34}
              color={themeByMode[mode].primary}
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <AddGoalModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddGoal}
        pendingGoals={pendingGoals}
      />
{showReward && (
  <View style={styles.rewardOverlay}>
    <Text style={styles.rewardText}>+10 XP 🎉</Text>
    <Text style={styles.rewardSubText}>Meta concluída!</Text>
  </View>
)}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },

  Modecontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 100,
    padding: 4,
    alignSelf: 'center',
  },

  btnMode: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6,
  },

  textMode: {
    color: '#6B7280',
  },

  textModeActive: {
    color: '#FFF',
  },

  card: {
    flex: 1,
    margin: 16,
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-evenly',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },

  mascot: {
    width: 100,
    height: 100,
  },

  timerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  textTime: {
    position: 'absolute',
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFF',
  },

  messagesContainer: {
    textAlign: 'center',
    color: '#FFF',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 12,
  },

  btnContainer: {
    flexDirection: 'row',
    gap: 20,
  },

  controlButtonPrimary: {
  width: 82,
  height: 82,
  borderRadius: 50,

  backgroundColor: '#FFFFFF',

  alignItems: 'center',
  justifyContent: 'center',

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.2,
  shadowRadius: 10,
  elevation: 8,
},

  controlButtonSecondary: {
  width: 56,
  height: 56,
  borderRadius: 28,

  backgroundColor: 'rgba(255,255,255,0.25)',

  alignItems: 'center',
  justifyContent: 'center',
},
goalEmpty: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,

  marginHorizontal: 16,
  marginTop: 16,
  paddingVertical: 14,

  borderRadius: 14,
  borderWidth: 1.5,
  borderStyle: 'dashed',
  borderColor: '#4F6DFF',

  backgroundColor: '#EEF2FF',
},

goalEmptyText: {
  color: '#4F6DFF',
  fontWeight: '500',
},

goalContainer: {
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',

  marginHorizontal: 16,
  marginTop: 16,
  paddingVertical: 16,
  paddingHorizontal: 18,

  borderRadius: 18,
  backgroundColor: '#FFFFFF',

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 4,
},

goalCardHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 12,
  gap: 12,
},

goalTitleSection: {
  flex: 1,
},

goalText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#111827',
  flexWrap: 'wrap',
  lineHeight: 22,
  marginTop: 4,
},

goalPriorityBadge: {
  borderRadius: 999,
  borderWidth: 1,
  paddingVertical: 4,
  paddingHorizontal: 10,
},
goalPriorityText: {
  fontSize: 11,
  fontWeight: '700',
  textTransform: 'uppercase',
},

goalLabel: {
  fontSize: 12,
  fontWeight: '600',
  color: '#6B7280',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 6,
},

goalStatus: {
  color: '#10B981',
  marginTop: 8,
  fontSize: 11,
  fontWeight: '600',
},

goalActionsRow: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 8,
  marginTop: 12,
},
addMetaButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#E0F2FE',
  borderRadius: 16,
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderWidth: 1,
  borderColor: '#BAE6FD',
},
addMetaButtonText: {
  color: '#0C4A6E',
  fontSize: 14,
  fontWeight: '700',
  marginLeft: 8,
},
goalsCardButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',

  marginHorizontal: 16,
  marginTop: 12,
  padding: 16,

  borderRadius: 16,
  backgroundColor: '#FFFFFF',

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 4,
},

goalsCardLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
},

goalsCardTitle: {
  fontSize: 14,
  fontWeight: '600',
  color: '#111827',
},

goalsCardSubtitle: {
  fontSize: 12,
  color: '#6B7280',
},
actionButton: {
  width: 42,
  height: 42,
  borderRadius: 14,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#F3F4F6',
},
actionButtonDisabled: {
  backgroundColor: '#E5E7EB',
},
historyButtonWrapper: {
  marginHorizontal: 16,
  marginBottom: 12,
  alignItems: 'flex-start',
  flexDirection: 'row',
},
historyIconButton: {
  width: 44,
  height: 44,
  borderRadius: 16,
  backgroundColor: '#FFFFFF',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '#E5E7EB',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 4,
  flexDirection: 'row',
  gap: 6,
},
rewardOverlay: {
  position: 'absolute',
  top: '40%',
  alignSelf: 'center',

  backgroundColor: '#111827',
  paddingVertical: 20,
  paddingHorizontal: 32,
  borderRadius: 20,

  alignItems: 'center',

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.3,
  shadowRadius: 20,
  elevation: 10,
},
scrollView: {
  flex: 1,
},
scrollContent: {
  paddingBottom: 36,
},

rewardText: {
  color: '#FFD166',
  fontSize: 20,
  fontWeight: '700',
},

rewardSubText: {
  color: '#FFF',
  marginTop: 4,
},
})
export default TimerScreen