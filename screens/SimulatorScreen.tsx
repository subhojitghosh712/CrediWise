import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import Slider from '@react-native-community/slider';

export default function SimulatorScreen() {
  const [paymentHistory, setPaymentHistory] = useState(80);
  const [creditUtilization, setCreditUtilization] = useState(40);
  const [creditAge, setCreditAge] = useState(3);
  const [score, setScore] = useState(700);
  const [tip, setTip] = useState('');

  const animatedValue = new Animated.Value(0);

  const tips = [
    "Pay your credit card bill on time — even one missed payment can hurt your score.",
    "Keep your credit utilization below 30% to show lenders you're responsible.",
    "Avoid applying for too many credit cards in a short period.",
    "Longer credit history boosts your score — keep old accounts open.",
    "Check your credit report regularly for any errors or fraud.",
    "Don’t max out your credit card — low utilization keeps you healthy.",
    "Pay more than the minimum due — it reduces interest and builds trust.",
    "Use automatic payments to never miss a due date.",
    "Mix of credit types (loans + cards) can improve your score over time.",
    "Consistency is key — small, regular payments are better than late big ones."
  ];

  useEffect(() => {
    setTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const calculateScore = () => {
    const newScore =
      300 +
      paymentHistory * 3 +
      (100 - creditUtilization) * 2 +
      creditAge * 10;
    const boundedScore = Math.min(850, Math.max(300, Math.round(newScore)));

    Animated.timing(animatedValue, {
      toValue: boundedScore,
      duration: 1000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    setScore(boundedScore);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Credit Score Simulator 💳</Text>
      
      <Animated.View style={[styles.scoreContainer]}>
        <Text style={styles.scoreTitle}>Estimated Credit Score</Text>
        <Text style={[styles.score, { color: getScoreColor(score) }]}>
          {score}
        </Text>
        <Text style={styles.scoreNote}>{getScoreMessage(score)}</Text>
      </Animated.View>

      <Card style={styles.card}>
        <Card.Content>

          <Text style={styles.subtitle}>
            Adjust the sliders to see how your actions affect your score.
          </Text>

          <Text style={styles.label}>Payment History (%)</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={paymentHistory}
            onValueChange={setPaymentHistory}
            minimumTrackTintColor="#1a73e8"
            maximumTrackTintColor="#d3d3d3"
          />
          <Text style={styles.value}>{paymentHistory.toFixed(0)}%</Text>

          <Text style={styles.label}>Credit Utilization (%)</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={creditUtilization}
            onValueChange={setCreditUtilization}
            minimumTrackTintColor="#1a73e8"
            maximumTrackTintColor="#d3d3d3"
          />
          <Text style={styles.value}>{creditUtilization.toFixed(0)}%</Text>

          <Text style={styles.label}>Credit Age (years)</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={20}
            value={creditAge}
            onValueChange={setCreditAge}
            minimumTrackTintColor="#1a73e8"
            maximumTrackTintColor="#d3d3d3"
          />
          <Text style={styles.value}>{creditAge.toFixed(1)} yrs</Text>

          <Button
            mode="contained"
            onPress={calculateScore}
            style={styles.button}
            labelStyle={{ fontWeight: '700' }}
          >
            Recalculate Score
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.tipCard}>
        <Card.Content>
          <Text style={styles.tipTitle}>💡 Tip of the Day</Text>
          <Text style={styles.tipText}>{tip}</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

function getScoreColor(score: number) {
  if (score < 580) return '#e63946';
  if (score < 670) return '#f4a261';
  if (score < 740) return '#2a9d8f';
  return '#1a73e8';
}

function getScoreMessage(score: number) {
  if (score < 580) return 'Poor – Let’s work on your habits.';
  if (score < 670) return 'Fair – You’re getting there!';
  if (score < 740) return 'Good – Keep it up!';
  return 'Excellent – You’re a credit pro!';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef3ff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a73e8',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 4,
    marginBottom: 25,
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a73e8',
    marginTop: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  value: {
    textAlign: 'right',
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#1a73e8',
    borderRadius: 10,
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 25,
    borderRadius: 16,
    elevation: 4,
    marginBottom: 25,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
  },
  score: {
    fontSize: 60,
    fontWeight: '800',
    marginVertical: 5,
  },
  scoreNote: {
    fontSize: 16,
    color: '#333',
  },
  tipCard: {
    backgroundColor: '#1a73e8',
    borderRadius: 16,
    elevation: 4,
    paddingVertical: 15,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 15,
    color: '#f1f5ff',
    lineHeight: 22,
  },
});

