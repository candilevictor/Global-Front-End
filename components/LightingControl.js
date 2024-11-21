import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';

const LightingControl = () => {
  const [intensity, setIntensity] = useState('');
  const [status, setStatus] = useState(false);
  const [economy, setEconomy] = useState({ percentage: 0, value: 0 }); // Estado para armazenar a economia

  // Função para calcular a economia com base na intensidade
  const calculateEconomy = (intensityValue) => {
    const maxIntensity = 100;
    const maxCostPerUnit = 0.10; // Exemplo: 0.10 reais por unidade de consumo de energia

    // Economia em porcentagem
    const economyPercentage = ((maxIntensity - intensityValue) / maxIntensity) * 100;

    // Cálculo da economia em reais
    const energySaved = (maxIntensity - intensityValue) * maxCostPerUnit;

    setEconomy({ percentage: economyPercentage, value: energySaved });
  };

  const handleIntensityChange = (value) => {
    setIntensity(value);
    const parsedValue = parseInt(value);
    if (!isNaN(parsedValue)) {
      calculateEconomy(parsedValue); // Atualiza a economia sempre que a intensidade muda
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/lighting', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intensity: parseInt(intensity),
          status: status,
        }),
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

  return (
    <View>
      <Text>Controle de Iluminação</Text>
      <Text>Intensidade da luz (0 a 100):</Text>
      <TextInput
        value={intensity}
        onChangeText={handleIntensityChange}
        keyboardType="numeric"
        placeholder="Digite a intensidade"
      />
      <View>
        <Button title="Ligar" onPress={() => setStatus(true)} />
        <Button title="Desligar" onPress={() => setStatus(false)} />
      </View>
      <Button title="Atualizar" onPress={handleSubmit} />

      {/* Exibindo a economia de energia */}
      {intensity && (
        <View>
          <Text>
            Economia de Energia: {economy.percentage.toFixed(2)}%
          </Text>
          <Text>
            Valor Economizado: R${economy.value.toFixed(2)}
          </Text>
        </View>
      )}
    </View>
  );
};

export default LightingControl;
