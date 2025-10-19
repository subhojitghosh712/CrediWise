import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, Animated, Pressable, Linking, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = (width - 60) / 2;

type Props = NativeStackScreenProps<RootStackParamList, 'welcomescreen'>;

export default function WelcomeScreen({ navigation }: Props) {
  const [showInfo, setShowInfo] = useState(false);

  const navButtons = [
    { label: 'Learn', icon: 'book-open-variant', screen: 'learn' },
    { label: 'Credit Score', icon: 'calculator', screen: 'simulator' },
    { label: 'Fun Quiz', icon: 'lightbulb-on-outline', screen: 'quiz' },
    { label: 'Compounding', icon: 'chart-line', screen: 'compoundscreen' },
    { label: 'Budget Tracker', icon: 'chart-pie', screen: 'budgettracker' },
    { label: 'Loan & EMI Tracker', icon: 'bank', screen: 'loantracker' },
  ];

  const AnimatedButton = ({
    label,
    icon,
    screen,
    fullWidth = false,
    style,
  }: {
    label: string;
    icon: string;
    screen: string;
    fullWidth?: boolean;
    style?: any;
  }) => {
    const scale = React.useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
      Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
    };
    const onPressOut = () => {
      Animated.spring(scale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
      navigation.navigate(screen as keyof RootStackParamList);
    };

    return (
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
        <Animated.View
          style={[
            styles.cardButton,
            style,
            { width: fullWidth ? width - 40 : BUTTON_WIDTH, transform: [{ scale }] },
          ]}
        >
          <MaterialCommunityIcons name={icon} size={36} color="#1a73e8" />
          <Text style={styles.cardLabel}>{label}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <LinearGradient colors={['#eef3ff', '#dbe6ff']} style={styles.gradient}>
      {/* Top Buttons */}
      <View style={styles.topButtonsContainer}>
        {/* Info Button */}
        <Pressable onPress={() => setShowInfo(true)} style={styles.infoButton}>
          <MaterialCommunityIcons name="information-outline" size={40} color="#ffffffff" />
        </Pressable>
        {/* News Button */}
        <Pressable onPress={() => Linking.openURL('https://www.cnbc.com/')} style={styles.newsButton}>
          <MaterialCommunityIcons name="newspaper-variant-outline" size={40} color="#fff" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Logo */}
          <View style={styles.logoWrapper}>
            <Image source={require("../assets/icon.png")} style={styles.logo} />
          </View>

          <Text style={styles.title}>CrediWise</Text>
          <Text style={styles.subtitle}>Secure your financial future.</Text>

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            {navButtons.map(btn => (
              <AnimatedButton key={btn.screen} label={btn.label} icon={btn.icon} screen={btn.screen} />
            ))}

            {/* AI Advisor full-width button */}
            <Pressable onPress={() => navigation.navigate('chatbot')} style={styles.aiAdvisorButton}>
              <Text style={styles.aiAdvisorText}>
                Have any issues? Ask our AI Financial Advisor
              </Text>
            </Pressable>
          </View>

          {/* Bottom Capital One Logo */}
          <Pressable onPress={() => Linking.openURL('https://www.capitalone.co.uk/')} style={styles.capitalLogoWrapper}>
            <Image source={require('../assets/logo.png')} style={styles.capitalLogo} />
          </Pressable>
        </View>
      </ScrollView>

      {/* Info Modal */}
      <Modal visible={showInfo} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>About CrediWise</Text>
            <Text style={styles.modalText}>
              CrediWise is designed with the sole mission of promoting financial literacy among users of all ages. 
              Our app provides practical tools such as Budget Tracking, Loan & EMI Calculators, and AI Financial Advisor to help you make informed decisions and manage your finances effectively. 
              Additionally, engaging features like Fun Quizzes and Compounding calculators help reinforce learning while keeping finance interesting. 
              CrediWise empowers users to improve their credit awareness and take control of their financial future.
            </Text>
            <Text style={{fontWeight:"700", marginBottom:20}}>Developed by Subhojit Ghosh</Text>
            <Pressable style={styles.closeButton} onPress={() => setShowInfo(false)}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingVertical: 20, alignItems: 'center' },
  container: { width: '90%', alignItems: 'center' },
  logoWrapper: {
    width: 140, height: 140, borderRadius: 70, overflow: 'hidden', marginTop: 80, marginBottom: 15,
    elevation: 8, shadowColor: '#1a73e8', shadowOffset: { width:0, height:5 }, shadowOpacity: 0.3, shadowRadius: 6,
    backgroundColor: '#1a73e8', justifyContent: 'center', alignItems: 'center',
  },
  logo: { width: 100, height: 100, backgroundColor:'#1a73e8' },
  title: { fontSize: 38, fontWeight: '800', color: '#1a73e8' },
  subtitle: { fontSize: 16, color: '#000', textAlign: 'center', marginVertical: 20, lineHeight: 22, fontWeight:"700" },
  buttonContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', marginTop: 10 },
  cardButton: {
    backgroundColor: '#fff', borderRadius: 16, paddingVertical: 20, marginBottom: 10,
    alignItems: 'center', justifyContent: 'center', elevation: 6,
    shadowColor: '#1a73e8', shadowOffset: { width:0, height:4 }, shadowOpacity: 0.25, shadowRadius: 5,
  },
  cardLabel: { fontSize: 16, fontWeight: '700', color: '#1a73e8', marginTop: 10 },
  aiAdvisorButton: {
    backgroundColor: '#1a73e8', borderRadius: 18, paddingVertical: 20, width: '100%',
    marginTop: 10, marginBottom: 15, alignItems: 'center', justifyContent: 'center',
    elevation: 6, shadowColor: '#1a73e8', shadowOffset: { width:0, height:4 }, shadowOpacity: 0.25, shadowRadius: 5,
  },
  aiAdvisorText: { fontSize: 17, fontWeight: '700', color: '#fff', textAlign: 'center' },
  capitalLogoWrapper: { marginTop: 15, alignItems: 'center' },
  capitalLogo: { width: 300, height: 90, resizeMode: 'contain' },

  topButtonsContainer: { position:'absolute', top: 70, width:'100%', flexDirection:'row', justifyContent:'space-between', paddingHorizontal:20, zIndex: 20 },
  infoButton: { backgroundColor:'#a4ba5cff', borderRadius:8, padding:10, elevation:6, shadowColor:'#1a73e8', shadowOffset:{width:0,height:3}, shadowOpacity:0.3, shadowRadius:4 },
  newsButton: { backgroundColor:'#ff0000', borderRadius:8, padding:10, elevation:6, shadowColor:'#1a73e8', shadowOffset:{width:0,height:3}, shadowOpacity:0.3, shadowRadius:4 },

  modalBackground: { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center' },
  modalCard: { backgroundColor:'#fff', borderRadius:16, padding:20, width:'95%', alignItems:'center' },
  modalTitle: { fontSize:20, fontWeight:'700', marginBottom:20, color:'#1a73e8', textAlign:'center' },
  modalText: { fontSize:16, textAlign:'center', marginBottom:20, color:'#000' },
  closeButton: { backgroundColor:'#e81a1aff', paddingVertical:10, paddingHorizontal:20, borderRadius:12 },
  closeText: { color:'#fff', fontWeight:'700', fontSize:16 },
});