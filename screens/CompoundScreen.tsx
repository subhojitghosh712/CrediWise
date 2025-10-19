import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function CompoundScreen() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [frequency, setFrequency] = useState("12");
  const [result, setResult] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);
    const n = parseFloat(frequency);

    if (isNaN(P) || isNaN(r) || isNaN(t) || isNaN(n)) return;

    const A = P * Math.pow(1 + r / n, n * t);
    setResult(A);
    setTotalInterest(A - P);
  };

  const tips = [
    "Start investing early to maximize compounding.",
    "Increase principal gradually for higher returns.",
    "Reinvest dividends and interest for exponential growth.",
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center", paddingBottom: 50 }}>
      <Text style={styles.header}>💹 Compound Interest Calculator</Text>

      {/* Calculator Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Principal Amount (£)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={principal}
          onChangeText={setPrincipal}
          placeholder="Enter principal"
        />

        <Text style={styles.label}>Annual Interest Rate (%)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={rate}
          onChangeText={setRate}
          placeholder="Enter interest rate"
        />

        <Text style={styles.label}>Time (years)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={years}
          onChangeText={setYears}
          placeholder="Enter number of years"
        />

        <Text style={styles.label}>Compounding Frequency (per year)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={frequency}
          onChangeText={setFrequency}
          placeholder="12 for monthly, 1 for yearly"
        />

        <TouchableOpacity style={styles.button} onPress={calculate}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>

        {result !== null && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Future Value: £{result.toFixed(2)}</Text>
            <Text style={styles.resultText}>Total Interest Earned: £{totalInterest?.toFixed(2)}</Text>
          </View>
        )}
      </View>

      {/* Tips Card */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsHeader}>💡 Tips to Grow Wealth</Text>
        {tips.map((tip, index) => (
          <Text key={index} style={styles.tipLine}>• {tip}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a73e8",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a73e8",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#eef3ff",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1a73e8",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginVertical: 4,
  },
  tipsCard: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginTop: 30,
  },
  tipsHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a73e8",
    marginBottom: 12,
    textAlign: "center",
  },
  tipLine: {
    fontSize: 16,
    color: "#444",
    textAlign: "left",
    marginBottom: 6,
  },
});
