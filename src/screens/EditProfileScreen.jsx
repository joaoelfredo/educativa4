import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import AppHeader from '../components/AppHeader';
import { COLORS, FONTS } from '../constants/theme';

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('Ana Silva');
  const [email, setEmail] = useState('ana.silva@email.com');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('');

  const userData = {
    name: 'Ana Silva',
    level: 3,
    title: 'Estudante Dedicada',
    xpProgress: 65,
    xpToNextLevel: 150,
  };

  const handleSave = () => {
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={styles.container}>
      <AppHeader
        userData={userData}
        navigation={navigation}
        showBackButton={true}
        title="Editar Perfil"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Foto do Perfil */}
          <View style={styles.photoSection}>
            <View style={styles.profilePhoto}>
              <Text style={styles.profilePhotoText}>A</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changePhotoText}>📷 Alterar Foto</Text>
            </TouchableOpacity>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>👤 Nome Completo</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Digite seu nome"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>📧 E-mail</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>📱 Telefone</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>🎓 Curso/Escola</Text>
              <TextInput
                style={styles.input}
                value={course}
                onChangeText={setCourse}
                placeholder="Ex: Engenharia - UFMG"
              />
            </View>

            {/* Botões */}
            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePhoto: {
    width: 96,
    height: 96,
    backgroundColor: COLORS.laranja,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profilePhotoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  changePhotoText: {
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.laranja,
    fontSize: 14,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 8,
  },
  label: {
    ...FONTS.body,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    ...FONTS.body,
    fontSize: 14,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  cancelButtonText: {
    ...FONTS.body,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    backgroundColor: COLORS.laranja,
  },
  saveButtonText: {
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default EditProfileScreen;