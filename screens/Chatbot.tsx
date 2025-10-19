import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "";
const genAI = new GoogleGenerativeAI(API_KEY);

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I’m your AI Financial Advisor. What would you like to discuss today?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Math.random().toString(),
      text: input,
      sender: "user",
    };

    // Add user's message to the bottom
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(input);
      let aiResponse = result.response.text();

      // 🧹 Clean Markdown symbols
      aiResponse = aiResponse
        .replace(/\*\*(.*?)\*\*/g, "$1") // bold
        .replace(/\*(.*?)\*/g, "$1") // italics
        .replace(/_(.*?)_/g, "$1") // underscores
        .replace(/`{1,3}(.*?)`{1,3}/g, "$1") // inline or block code
        .replace(/^#+\s*(.*)/gm, "$1") // headings
        .replace(/^-+\s*/gm, "• ") // list items
        .replace(/\n{2,}/g, "\n") // collapse multiple line breaks
        .trim();

      const aiMessage = {
        id: Math.random().toString(),
        text: aiResponse,
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = {
        id: Math.random().toString(),
        text: "Sorry, I couldn't process that. Please try again.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={{
        alignSelf: item.sender === "user" ? "flex-end" : "flex-start",
        backgroundColor: item.sender === "user" ? "#0084ff" : "#fff",
        padding: 12,
        marginVertical: 6,
        borderRadius: 10,
        maxWidth: "80%",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      }}
    >
      <Text
        style={{
          color: item.sender === "user" ? "#fff" : "#333",
          fontSize: 15,
        }}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f3f3f3" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{
          padding: 16,
          flexGrow: 1,
          justifyContent: "flex-end",
        }}
      />

      {loading && (
        <ActivityIndicator size="small" color="#0084ff" style={{ margin: 10 }} />
      )}

      <View
        style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderColor: "#ddd",
            marginBottom: Platform.OS === "ios" ? 20 : 10, // adds space at bottom
        }}
        >
        <TextInput
            style={{
            flex: 1,
            backgroundColor: "#f0f0f0",
            borderRadius: 20,
            paddingHorizontal: 15,
            paddingVertical: 8,
            fontSize: 16,
            marginRight: 8,
            }}
            placeholder="Ask about savings, loans, or investments..."
            value={input}
            onChangeText={setInput}
            multiline
        />
        <TouchableOpacity
            onPress={sendMessage}
            style={{
            backgroundColor: "#0084ff",
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 25,
            }}
        >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  );
};

export default Chatbot;

