#!/bin/bash
echo "🧹 Fixing CommunityScreen.tsx and Cleaning Up Project..."
echo "======================================================"

cd client

# Fix the CommunityScreen.tsx by creating a clean version
echo "📝 Creating clean CommunityScreen.tsx..."
cat > src/screens/community/CommunityScreen.tsx << 'EOF'
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

export const CommunityScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'leaderboard'>('chat');
  const [message, setMessage] = useState('');

  const posts = [
    {
      id: 1,
      user: "Sarah Chen",
      initials: "SC",
      time: "2m ago",
      content: "Just finished Toy Story in Spanish! The vocabulary was perfect for beginners 🎬",
      likes: 12
    },
    {
      id: 2,
      user: "Miguel Rodriguez",
      initials: "MR",
      time: "15m ago",
      content: "Does anyone know where I can watch Finding Nemo with French subtitles?",
      likes: 5
    },
    {
      id: 3,
      user: "Emma Thompson",
      initials: "ET",
      time: "1h ago",
      content: "Tip: Use the 'Export to Anki' feature after each lesson. It's been a game changer for retention! 📚",
      likes: 23
    },
    {
      id: 4,
      user: "Akira Tanaka",
      initials: "AT",
      time: "2h ago",
      content: "45-day streak achieved! This app makes learning so addictive 🔥",
      likes: 18
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <Text style={styles.subtitle}>Connect with fellow learners</Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
          onPress={() => setActiveTab('chat')}
        >
          <Ionicons name="chatbubbles-outline" size={20} color={activeTab === 'chat' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
          onPress={() => setActiveTab('leaderboard')}
        >
          <Ionicons name="trophy-outline" size={20} color={activeTab === 'leaderboard' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.activeTabText]}>Leaderboard</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'chat' ? (
        <>
          <ScrollView style={styles.chatContainer}>
            {posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userInitials}>{post.initials}</Text>
                  </View>
                  <View style={styles.postInfo}>
                    <Text style={styles.userName}>{post.user}</Text>
                    <Text style={styles.postTime}>{post.time}</Text>
                  </View>
                </View>
                <Text style={styles.postContent}>{post.content}</Text>
                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.likeButton}>
                    <Ionicons name="heart-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.likeCount}>{post.likes}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Message Input */}
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Share your progress or ask for help..."
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.leaderboardContainer}>
          <Text style={styles.comingSoon}>Leaderboard Coming Soon! 🏆</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: COLORS.background,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInitials: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  postInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  postTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  postContent: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  messageInputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoon: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
});
EOF

echo "✅ Fixed CommunityScreen.tsx"

# Clean up irrelevant shell files
echo "🧹 Cleaning up irrelevant shell files..."
cd ..
rm -f complete_project_fix.sh simple_expo_fix.sh web_only_start.sh fix_backend_setup.sh cleanup_and_stage3.sh build_authentication.sh update_app_with_auth.sh setup_auth_components.sh start-backend.sh start-frontend.sh start_frontend_test.sh test_backend_health.sh update_app_with_auth.sh setup_frontend_auth.sh fix_expo_dependencies.sh fix_expo_final.sh

echo "✅ Cleaned up shell scripts"

echo ""
echo "🎯 Project cleaned up!"
echo "📁 Now try starting Expo again:"
echo "   cd client"
echo "   npx expo start"
echo "   Press 'w' for web"