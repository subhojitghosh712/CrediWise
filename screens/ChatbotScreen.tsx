import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Chatbot from "./Chatbot";

// interface Message {
//   id: number;
//   text: string;
//   sender: "user" | "ai";
// }

export default function ChatbotScreen() {
  // const [messages, setMessages] = useState<Message[]>([]);
  // const [input, setInput] = useState("");
  // const scrollViewRef = useRef<ScrollView>(null);
  // const [messageId, setMessageId] = useState(0);

  // const handleSend = () => {
  //   if (!input.trim()) return;

  //   const newUserMessage: Message = {
  //     id: messageId,
  //     text: input,
  //     sender: "user",
  //   };
  //   setMessageId((prev) => prev + 1);
  //   setMessages((prev) => [...prev, newUserMessage]);
  //   setInput("");

  //   // Mock AI response
  //   setTimeout(() => {
  //     const aiResponse: Message = {
  //       id: messageId + 1,
  //       text: generateAIResponse(input),
  //       sender: "ai",
  //     };
  //     setMessageId((prev) => prev + 1);
  //     setMessages((prev) => [...prev, aiResponse]);
  //   }, 1000);
  // };

  // // Scroll to bottom whenever a new message is added
  // useEffect(() => {
  //   scrollViewRef.current?.scrollToEnd({ animated: true });
  // }, [messages]);

  // // Simple mock AI function
  // const generateAIResponse = (userInput: string) => {
  //   const lower = userInput.toLowerCase();
  //   if (lower.includes("budget")) return "Try following the 50/30/20 rule for budgeting.";
  //   if (lower.includes("invest")) return "Start early with low-cost index funds for better growth.";
  //   if (lower.includes("loan")) return "Always compare interest rates and check repayment terms before taking a loan.";
  //   if (lower.includes("credit")) return "Pay bills on time and keep credit utilization below 30%.";
  //   return "That's interesting! I suggest keeping track of your expenses and planning ahead.";
  // };

  return (
    // <KeyboardAvoidingView
    //   style={styles.container}
    //   behavior={Platform.OS === "ios" ? "padding" : undefined}
    //   keyboardVerticalOffset={90}
    // >
    //   <ScrollView
    //     style={styles.chatArea}
    //     contentContainerStyle={{ paddingVertical: 10 }}
    //     ref={scrollViewRef}
    //   >
    //     {messages.map((msg) => (
    //       <View
    //         key={msg.id}
    //         style={[
    //           styles.messageBubble,
    //           msg.sender === "user" ? styles.userBubble : styles.aiBubble,
    //         ]}
    //       >
    //         <Text
    //           style={[
    //             styles.messageText,
    //             msg.sender === "user" ? styles.userText : styles.aiText,
    //           ]}
    //         >
    //           {msg.text}
    //         </Text>
    //       </View>
    //     ))}
    //   </ScrollView>

    //   <View style={styles.inputContainer}>
    //     <TextInput
    //       style={styles.input}
    //       placeholder="Ask me a financial question..."
    //       value={input}
    //       onChangeText={setInput}
    //       onSubmitEditing={handleSend}
    //     />
    //     <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
    //       <MaterialCommunityIcons name="send" size={28} color="#fff" />
    //     </TouchableOpacity>
    //   </View>
    // </KeyboardAvoidingView>

    Chatbot()
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 15,
    marginVertical: 6,
  },
  userBubble: {
    backgroundColor: "#1a73e8",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  aiBubble: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: "#fff",
  },
  aiText: {
    color: "#1a73e8",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#eef3ff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#1a73e8",
    borderRadius: 25,
    padding: 10,
  },
});
