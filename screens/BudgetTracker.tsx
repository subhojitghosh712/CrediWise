import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const BudgetTracker = () => {
  const [records, setRecords] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("Expense");
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    updatePieData();
  }, [records]);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem("records");
      if (stored) setRecords(JSON.parse(stored));
    } catch (e) {
      console.log("Error loading data:", e);
    }
  };

  const saveData = async (data) => {
    try {
      await AsyncStorage.setItem("records", JSON.stringify(data));
    } catch (e) {
      console.log("Error saving data:", e);
    }
  };

  const addRecord = () => {
    if (!amount || !category) {
      Alert.alert("Please fill all fields!");
      return;
    }

    const newRecord = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category,
      type,
      date: new Date().toLocaleDateString(),
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    saveData(updated);
    setAmount("");
    setCategory("");
  };

  const deleteRecord = (id) => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updated = records.filter((r) => r.id !== id);
            setRecords(updated);
            saveData(updated);
          },
        },
      ]
    );
  };

  const updatePieData = () => {
    const incomeTotal = records
      .filter((r) => r.type === "Income")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const expenseTotal = records
      .filter((r) => r.type === "Expense")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const data = [];
    if (incomeTotal > 0)
      data.push({
        name: "Income",
        amount: incomeTotal,
        color: "#2a9d8f",
        legendFontColor: "#333",
        legendFontSize: 14,
      });
    if (expenseTotal > 0)
      data.push({
        name: "Expense",
        amount: expenseTotal,
        color: "#e63946",
        legendFontColor: "#333",
        legendFontSize: 14,
      });

    setPieData(data);
  };


  const totalExpense = records
    .filter((r) => r.type === "Expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalIncome = records
    .filter((r) => r.type === "Income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const renderItem = ({ item }) => (
    <View
      style={{
        backgroundColor: item.type === "Expense" ? "#ffecec" : "#eaffea",
        borderRadius: 10,
        padding: 12,
        marginVertical: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <View>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.category}</Text>
        <Text style={{ color: "#555" }}>{item.date}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text
          style={{
            color: item.type === "Expense" ? "#e63946" : "#2a9d8f",
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          {item.type === "Expense" ? "-" : "+"} £ {item.amount}
        </Text>
        <TouchableOpacity
          onPress={() => deleteRecord(item.id)}
          style={{
            marginTop: 4,
            backgroundColor: "#ddd",
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: "#333", fontSize: 12 }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f3f3f3", padding: 16 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          padding: 16,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 2,
          alignItems: "center",
        }}
      >
        {pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={screenWidth - 32}
            height={200}
            chartConfig={{
              backgroundColor: "#f3f3f3",
              backgroundGradientFrom: "#f3f3f3",
              backgroundGradientTo: "#f3f3f3",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <Text style={{ marginVertical: 20, color: "#555" }}>No data yet</Text>
        )}
      </View>

      <View
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 2,
        }}
      >
        <TextInput
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={{
            backgroundColor: "#f0f0f0",
            padding: 10,
            borderRadius: 8,
            marginBottom: 10,
          }}
        />
        <TextInput
          placeholder="Category (e.g. Food, Salary)"
          value={category}
          onChangeText={setCategory}
          style={{
            backgroundColor: "#f0f0f0",
            padding: 10,
            borderRadius: 8,
            marginBottom: 10,
          }}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => setType("Expense")}
            style={{
              flex: 1,
              backgroundColor: type === "Expense" ? "#e63946" : "#ddd",
              padding: 10,
              borderRadius: 8,
              marginRight: 5,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff" }}>Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setType("Income")}
            style={{
              flex: 1,
              backgroundColor: type === "Income" ? "#2a9d8f" : "#ddd",
              padding: 10,
              borderRadius: 8,
              marginLeft: 5,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff" }}>Income</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={addRecord}
          style={{
            backgroundColor: "#0084ff",
            padding: 12,
            borderRadius: 10,
            marginTop: 15,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Add Record</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text>Total Income:</Text>
          <Text style={{ color: "#2a9d8f", fontWeight: "bold" }}>£ {totalIncome}</Text>
        </View>
        <View>
          <Text>Total Expense:</Text>
          <Text style={{ color: "#e63946", fontWeight: "bold" }}>£ {totalExpense}</Text>
        </View>
        <View>
          <Text>Balance:</Text>
          <Text style={{ color: "#000", fontWeight: "bold" }}>£ {balance}</Text>
        </View>
      </View>

      <FlatList data={records} keyExtractor={(item) => item.id} renderItem={renderItem} />
    </KeyboardAvoidingView>
  );
};

export default BudgetTracker;
