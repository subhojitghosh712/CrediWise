import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  Image,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

const { width, height } = Dimensions.get("window");

const sampleQuiz = [
  {
    question: "What is a credit score?",
    options: [
      "Bank balance",
      "Annual income",
      "A number showing creditworthiness",
      "Loans taken",
    ],
    answer: "A number showing creditworthiness",
  },
  {
    question: "How to improve credit score?",
    options: [
      "Pay bills on time",
      "Apply for many loans",
      "Close old accounts",
      "Ignore reports",
    ],
    answer: "Pay bills on time",
  },
  {
    question: "What is credit utilization?",
    options: [
      "Annual income",
      "Used credit % of total",
      "Savings in account",
      "Loan interest rate",
    ],
    answer: "Used credit % of total",
  },
  {
    question: "What lowers your score?",
    options: [
      "Late payments",
      "High savings",
      "Low income",
      "Few accounts",
    ],
    answer: "Late payments",
  },
  {
    question: "Good credit behavior?",
    options: [
      "Max out cards",
      "Open many accounts quickly",
      "Ignore statements",
      "Pay on time",
    ],
    answer: "Pay on time",
  },
  {
    question: "Credit report shows?",
    options: [
      "Salary details",
      "Savings",
      "Credit history",
      "Taxes paid",
    ],
    answer: "Credit history",
  },
  {
    question: "High utilization impact?",
    options: [
      "Lowers score",
      "Raises score",
      "No impact",
      "Increases income",
    ],
    answer: "Lowers score",
  },
  {
    question: "Best way to build credit?",
    options: [
      "Avoid cards",
      "Borrow from friends",
      "Take loans constantly",
      "Use credit responsibly",
    ],
    answer: "Use credit responsibly",
  },
];


export default function QuizScreen() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const optionScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    animateCard();
  }, [current]);

  const animateCard = () => {
    slideAnim.setValue(width);
    fadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleOptionPress = (option: string) => {
    if (selected) return;
    Animated.sequence([
      Animated.timing(optionScale, { toValue: 1.05, duration: 100, useNativeDriver: true }),
      Animated.timing(optionScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    setSelected(option);
    if (option === sampleQuiz[current].answer) setScore((prev) => prev + 1);

    setTimeout(() => {
      if (current + 1 < sampleQuiz.length) {
        setCurrent((prev) => prev + 1);
        setSelected(null);
      } else {
        setFinished(true);
        if (score + (option === sampleQuiz[current].answer ? 1 : 0) === sampleQuiz.length) {
          setShowConfetti(true);
        }
      }
    }, 1200);
  };

  const restartQuiz = () => {
    setCurrent(0);
    setScore(0);
    setFinished(false);
    setSelected(null);
    setShowConfetti(false);
  };

  const progress = ((current + (selected ? 1 : 0)) / sampleQuiz.length) * 100;

  if (finished) {
    const stars = Math.round((score / sampleQuiz.length) * 5);
    return (
      <View style={[styles.container, { justifyContent: "center", backgroundColor:"#fff" }]}>
        {showConfetti && <ConfettiCannon count={200} origin={{ x: width / 2, y: 0 }} fadeOut />}
        <Text style={styles.title}>🎉 Quiz Completed!</Text>
        <Text style={styles.text}>
          Your score: {score} / {sampleQuiz.length}
        </Text>
        <Text style={styles.text}>⭐️ {stars} / 5 Stars</Text>
        <TouchableOpacity style={styles.button} onPress={restartQuiz}>
          <Text style={styles.buttonText}>Restart Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const question = sampleQuiz[current];

  return (
    <View style={[styles.container, { justifyContent: "center" }]}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Image
          source={require('../assets/quiz.png')}
          style={styles.icon}
        />
        <Text style={styles.quizTitle}>Financial Literacy Quiz</Text>
        <Text style={styles.progressText}>
          Question {current + 1} of {sampleQuiz.length}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* Question Card */}
      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateX: slideAnim }] },
          { opacity: fadeAnim },
        ]}
      >
        <View style ={{flexDirection:'row'}}>
          <Text style={styles.questionNumber}>Q{current + 1}   </Text>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        {question.options.map((opt) => {
          let bgColor = "rgba(242, 242, 242, 1)";
          if (selected) {
            if (opt === question.answer) bgColor = "#4CAF50";
            else if (opt === selected) bgColor = "#F44336";
          }

          return (
            <Animated.View key={opt} style={{ transform: [{ scale: optionScale }] }}>
              <TouchableOpacity
                style={[styles.optionButton, { backgroundColor: bgColor }]}
                disabled={!!selected}
                onPress={() => handleOptionPress(opt)}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {selected && selected !== question.answer && (
          <Text style={styles.correctAnswer}>Correct Answer: {question.answer}</Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef3ff",
    padding: 20,
    alignItems: "center",
  },
  topSection: {
    alignItems: "center",
    marginBottom: 15,
  },
  icon: {
    width: 500,
    height: 300,
    marginBottom: 10,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a73e8",
    textAlign: "center",
    marginBottom: 20
  },
  progressText: {
    fontSize: 18,
    color: "#0b0b0bff",
    marginTop: 4,
    textAlign: "center",
    margin:10
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 4,
    marginBottom: 20,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1a73e8",
    borderRadius: 4,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    alignItems: "center",
  },
  questionNumber: {
    fontSize: 16,
    color: "#ff0000ff",
    textAlign: "center",
    fontWeight: "700",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a73e8",
    marginBottom: 10,
    textAlign: "center",
  },
  optionButton: {
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    backgroundColor:"#d5d5d5ff",
    elevation: 3,
    width: width * 0.8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a73e8",
    textAlign: "center",
  },
  correctAnswer: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#4CAF50",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a73e8",
    marginBottom: 15,
    textAlign: "center",
  },
  text: { fontSize: 18, color: "#444", marginVertical: 10, textAlign: "center" },
  button: {
    backgroundColor: "#1a73e8",
    padding: 12,
    borderRadius: 25,
    marginTop: 20,
    width: width * 0.6,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
