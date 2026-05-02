import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';
import { supabase } from '../lib/supabase';
import { useCafes } from '../context/CafeContext';
import FeedCard from '../components/FeedCard';

const CACHE_KEY = 'posts_cache';

export default function FeedScreen({ navigation }) {
  const { cafes } = useCafes();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_active', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('empty');

      setPosts(data);
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data)).catch(() => {});
    } catch (err) {
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) setPosts(JSON.parse(cached));
      } catch (_) {}
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, [fetchPosts]);

  const handlePostPress = useCallback((post) => {
    if (post.type === 'cafe' && post.cafe_id) {
      const cafe = (cafes || []).find((c) => String(c.id) === String(post.cafe_id));
      if (cafe) navigation.navigate('CafeDetail', { cafe });
    }
  }, [cafes, navigation]);

  const renderItem = useCallback(({ item }) => {
    const hasAction = item.type === 'cafe' && item.cafe_id;
    return (
      <FeedCard
        post={item}
        onPress={hasAction ? () => handlePostPress(item) : undefined}
      />
    );
  }, [handlePostPress]);

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>What's New</Text>
      <Text style={styles.headerSub}>The latest from the codex</Text>
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>☕</Text>
      <Text style={styles.emptyTitle}>Nothing new yet</Text>
      <Text style={styles.emptySub}>Check back soon for new cafes, cities, and recipes.</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.list}
        onRefresh={onRefresh}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerContainer: {
    paddingTop: 12,
    paddingBottom: 20,
  },
  headerTitle: {
    color: Colors.cream,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  headerSub: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  emptyTitle: {
    color: Colors.cream,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySub: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
