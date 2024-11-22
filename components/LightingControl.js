import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';

const LightingControl = () => {
  const [intensity, setIntensity] = useState('');
  const [status, setStatus] = useState(false); // Estado para saber se está ligado ou desligado
  const [economy, setEconomy] = useState({ percentage: 0, value: 0 });

  const [bgColor] = useState(new Animated.Value(0)); // Animar a cor de fundo

  const HIGH_CONSUMPTION_THRESHOLD = 80; // Defina o limite de intensidade alta para alterar o fundo

  const calculateEconomy = (intensityValue) => {
    const maxIntensity = 100;
    const maxCostPerUnit = 0.10;

    const economyPercentage = ((maxIntensity - intensityValue) / maxIntensity) * 100;
    const energySaved = (maxIntensity - intensityValue) * maxCostPerUnit;

    setEconomy({ percentage: economyPercentage, value: energySaved });

    // Alterar o fundo com base na intensidade
    const toValue = intensityValue >= HIGH_CONSUMPTION_THRESHOLD ? 1 : 0;
    Animated.timing(bgColor, {
      toValue,
      duration: 500, // Duração da animação
      useNativeDriver: false,
    }).start();
  };

  const handleIntensityChange = (value) => {
    setIntensity(value);
    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue)) {
      calculateEconomy(parsedValue);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/lighting', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intensity: parseInt(intensity), status: status }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert('Erro: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao atualizar a iluminação:', error);
      alert('Erro ao atualizar a iluminação');
    }
  };

  // Interpolação para transição suave entre as cores
  const backgroundColor = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e8f5e9', '#ffcccc'], // Verde suave para vermelho
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Energia Limpa para um Futuro Sustentável</Text>
      
      <Text style={styles.label}>Intensidade da luz (0 a 100):</Text>
      <TextInput
        style={styles.input}
        value={intensity}
        onChangeText={handleIntensityChange}
        keyboardType="numeric"
        placeholder="Digite a intensidade"
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.onButton, status === true && styles.activeButton]} 
          onPress={() => { setStatus(true); calculateEconomy(parseInt(intensity)); }}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, status === true && styles.activeButtonText]}>Ligar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.offButton, status === false && styles.activeButton]} 
          onPress={() => { setStatus(false); calculateEconomy(parseInt(intensity)); }}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, status === false && styles.activeButtonText]}>Desligar</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.updateButton} 
        onPress={handleSubmit}
        activeOpacity={0.7}
      >
        <Text style={styles.updateButtonText}>Atualizar</Text>
      </TouchableOpacity>

      {intensity && (
        <Animated.View style={[styles.economyContainer, { backgroundColor }]}>
          <Text style={styles.economyText}>
            Economia de Energia: {economy.percentage.toFixed(2)}%
          </Text>
          <Text style={styles.economyText}>
            Valor Economizado: R${economy.value.toFixed(2)}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4caf50', // Verde para energia limpa
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#4caf50',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '80%',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    transition: 'background-color 0.5s ease, transform 0.5s ease, border-color 0.5s ease', // Transição suave mais lenta
  },
  onButton: {
    backgroundColor: '#66bb6a', // Verde claro
  },
  offButton: {
    backgroundColor: '#e57373', // Vermelho suave
  },
  activeButton: {
    borderColor: '#4caf50', // Borda verde para o botão "Ligar"
    transform: [{ scale: 1.05 }], // Suavizar aumento do tamanho
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeButtonText: {
    fontWeight: 'bold',
    color: '#fff', // Texto em branco quando ativo
  },
  updateButton: {
    backgroundColor: '#00796b',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
    transition: 'background-color 0.3s ease', // Transição suave de cor
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  economyContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    transition: 'background-color 0.5s ease',
  },
  economyText: {
    fontSize: 16,
    color: '#388e3c', // Verde para economia
  },
});

export default LightingControl;
