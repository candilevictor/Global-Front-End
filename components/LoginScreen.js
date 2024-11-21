// LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',  // Certifique-se de usar POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),  // Envia os dados de login
      });

      const data = await response.json();

      if (response.ok) {
        // Se o login for bem-sucedido, navega para a tela de controle de iluminação
        navigation.navigate('LightingControl');
      } else {
        Alert.alert('Erro', data.message || 'Erro no login');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
