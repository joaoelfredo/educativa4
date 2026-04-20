import React, { useEffect, useState } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  Alert,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

const AddGoalModal = ({
  visible,
  onClose,
  onSubmit,
  title = 'Defina sua meta',
  placeholder = 'Ex: Estudar estruturas de dados',
  confirmText = 'Criar meta',
  cancelText = 'Cancelar',
  initialValue = '',
  pendingGoals = [],
}) => {
  const [inputValue, setInputValue] = useState(initialValue)
  const [priority, setPriority] = useState('media')
  const [totalSessions, setTotalSessions] = useState(1)
  const [selectedGoalId, setSelectedGoalId] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    setInputValue(initialValue || '')
    setPriority('media')
    setTotalSessions(1)
    setSelectedGoalId(null)
    setDropdownOpen(false)
  }, [initialValue, visible])

  const selectedGoal = pendingGoals.find((goal) => goal.id === selectedGoalId)

  const handleConfirm = () => {
    if (selectedGoalId) {
      onSubmit({ selectedGoalId })
      onClose()
      setInputValue('')
      setPriority('media')
      setTotalSessions(1)
      setSelectedGoalId(null)
      setDropdownOpen(false)
      return
    }

    const trimmedValue = inputValue.trim()

    if (!trimmedValue) {
      Alert.alert('Atenção', 'Por favor, escreva sua meta antes de criar.')
      return
    }

    if (!Number.isInteger(totalSessions) || totalSessions < 1) {
      Alert.alert('Atenção', 'Informe ao menos 1 sessão para a meta.')
      return
    }

    onSubmit({
      text: trimmedValue,
      priority,
      totalSessions,
    })

    onClose()
    setInputValue('')
    setPriority('media')
    setTotalSessions(1)
    setSelectedGoalId(null)
    setDropdownOpen(false)
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.dismissArea} activeOpacity={1} onPress={Keyboard.dismiss} />

        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>

          {pendingGoals.length > 0 && (
            <View style={styles.dropdownContainer}>
              <Text style={styles.label}>Meta pendente</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setDropdownOpen((prev) => !prev)}
              >
                <Text style={styles.dropdownButtonText}>
                  {selectedGoal ? selectedGoal.title || selectedGoal.text : 'Selecionar uma meta pendente'}
                </Text>
                <MaterialIcons
                  name={dropdownOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                  size={24}
                  color="#374151"
                />
              </TouchableOpacity>
              {dropdownOpen && (
                <View style={styles.dropdownList}>
                  {pendingGoals.map((pendingGoal) => (
                    <TouchableOpacity
                      key={pendingGoal.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedGoalId(pendingGoal.id)
                        setDropdownOpen(false)
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{pendingGoal.title || pendingGoal.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          <TextInput
            placeholder={placeholder}
            value={inputValue}
            onChangeText={setInputValue}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
            blurOnSubmit
            autoFocus
          />

          <Text style={styles.label}>Sessões</Text>
          <TextInput
            placeholder="1"
            value={String(totalSessions)}
            onChangeText={(value) => {
              const numeric = parseInt(value.replace(/[^0-9]/g, ''), 10)
              setTotalSessions(Number.isNaN(numeric) ? 0 : numeric)
            }}
            style={styles.input}
            keyboardType="numeric"
            returnKeyType="done"
          />

          {/* 🔥 PRIORIDADE */}
          <Text style={styles.label}>Prioridade</Text>

          <View style={styles.priorityContainer}>
            
            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'alta' && styles.priorityHigh,
              ]}
              onPress={() => setPriority('alta')}
            >
              <Text style={[
                styles.priorityText,
                priority === 'alta' && styles.priorityHighText
              ]}>
                Alta
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'media' && styles.priorityMedium,
              ]}
              onPress={() => setPriority('media')}
            >
              <Text style={[
                styles.priorityText,
                priority === 'media' && styles.priorityMediumText
              ]}>
                Média
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'baixa' && styles.priorityLow,
              ]}
              onPress={() => setPriority('baixa')}
            >
              <Text style={[
                styles.priorityText,
                priority === 'baixa' && styles.priorityLowText
              ]}>
                Baixa
              </Text>
            </TouchableOpacity>

          </View>

          {/* BOTÕES */}
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onClose} style={styles.btnCancel}>
              <Text>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleConfirm} style={styles.btnCreate}>
              <Text style={styles.btnCreateText}>{selectedGoal ? 'Salvar meta' : confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  dismissArea: {
    flex: 1,
    width: '100%',
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#2F3EDC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },

  // 🔥 PRIORIDADE
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },

  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },

  priorityText: {
    fontWeight: '600',
    color: '#6B7280',
  },

  // 🔴 ALTA
  priorityHigh: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  priorityHighText: {
    color: '#B91C1C',
  },

  // 🟡 MÉDIA
  priorityMedium: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  priorityMediumText: {
    color: '#B45309',
  },

  // 🟢 BAIXA
  priorityLow: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  priorityLowText: {
    color: '#166534',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  dropdownButtonText: {
    color: '#111827',
    fontSize: 15,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    color: '#111827',
    fontSize: 14,
  },
  btnCancel: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  btnCreate: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#2F3EDC',
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  btnCreateText: {
    color: 'white',
    fontWeight: '600',
  },
})

export default AddGoalModal