import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Loan = {
  id: string;
  name: string;
  amount: number;
  rate: number;
  months: number;
  emi: number;
  paidEmis: number;
};

export default function LoanTracker() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loanName, setLoanName] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [months, setMonths] = useState('');

  useEffect(() => {
    const loadLoans = async () => {
      const data = await AsyncStorage.getItem('loans');
      if (data) setLoans(JSON.parse(data));
    };
    loadLoans();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('loans', JSON.stringify(loans));
  }, [loans]);

  const calculateEMI = (P: number, R: number, N: number) => {
    const monthlyRate = R / (12 * 100);
    const emi = (P * monthlyRate * Math.pow(1 + monthlyRate, N)) / (Math.pow(1 + monthlyRate, N) - 1);
    return Math.round(emi);
  };

  const addLoan = () => {
    if (!loanName || !loanAmount || !interestRate || !months) return;

    const amount = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const duration = parseInt(months);

    const emi = calculateEMI(amount, rate, duration);

    const newLoan: Loan = {
      id: Date.now().toString(),
      name: loanName,
      amount,
      rate,
      months: duration,
      emi,
      paidEmis: 0,
    };

    setLoans([...loans, newLoan]);
    setLoanName('');
    setLoanAmount('');
    setInterestRate('');
    setMonths('');
  };

  const markEmiPaid = (id: string) => {
    const updated = loans.map((loan) =>
      loan.id === id && loan.paidEmis < loan.months
        ? { ...loan, paidEmis: loan.paidEmis + 1 }
        : loan
    );
    setLoans(updated);
  };

  const deleteLoan = (id: string) => {
    const filtered = loans.filter((loan) => loan.id !== id);
    setLoans(filtered);
  };

  const totalEmi = loans.reduce((sum, l) => sum + l.emi, 0);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Input Card */}
      <View style={styles.card}>

        <TextInput
          placeholder="Loan Name"
          value={loanName}
          onChangeText={setLoanName}
          style={styles.input}
        />
        <TextInput
          placeholder="Loan Amount (£)"
          value={loanAmount}
          onChangeText={setLoanAmount}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Interest Rate (%)"
          value={interestRate}
          onChangeText={setInterestRate}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Duration (months)"
          value={months}
          onChangeText={setMonths}
          keyboardType="numeric"
          style={styles.input}
        />
        <View style={styles.addButton}>
          <Button title="Add Loan" onPress={addLoan} color="#1a73e8" />
        </View>
      </View>

      <Text style={styles.totalEmi}>Total Monthly EMI: £{totalEmi}</Text>

      <FlatList
        data={loans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const progress = (item.paidEmis / item.months) * 100;

          return (
            <View style={styles.loanCard}>
              <View style={styles.loanHeader}>
                <Text style={styles.loanName}>{item.name} Loan</Text>
                <Text style={styles.loanEmi}>£{item.emi}/mo</Text>
              </View>

              <View style={styles.loanDetailsRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Amount</Text>
                  <Text style={styles.detailValue}>£{item.amount}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Rate</Text>
                  <Text style={styles.detailValue}>{item.rate}%</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Tenure</Text>
                  <Text style={styles.detailValue}>{item.months} mo</Text>
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>
                EMI Progress: {item.paidEmis}/{item.months} months
              </Text>

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => markEmiPaid(item.id)}
                  style={[styles.actionButton, { backgroundColor: '#1a73e8' }]}
                >
                  <Text style={styles.actionText}>Mark Paid</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteLoan(item.id)}
                  style={[styles.actionButton, { backgroundColor: '#e63946' }]}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: 'gray', marginTop: 20 }}>
            No loans added yet.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef3ff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a73e8',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f7ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  addButton: {
    marginTop: 10,
  },
  totalEmi: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1a73e8',
    marginBottom: 10,
  },
  loanCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  loanName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a73e8',
  },
  loanEmi: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  loanDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#888',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e7ff',
    borderRadius: 5,
    marginTop: 6,
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1a73e8',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
});
