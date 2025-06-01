import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

export const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>👤 Profile</Text>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>😊</Text>
        </View>
        <Text style={styles.userName}>Demo User</Text>
        <Text style={styles.userEmail}>demo@cinefluent.app</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color={COLORS.text} />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color={COLORS.text} />
          <Text style={styles.menuText}>Help & Support</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 16,
  },
});
