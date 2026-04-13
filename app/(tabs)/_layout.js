import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#E50914',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: { backgroundColor: '#1a1a2e', borderTopColor: '#16213e' },
      headerStyle: { backgroundColor: '#1a1a2e' },
      headerTintColor: '#fff',
    }}>
      <Tabs.Screen name="index" options={{
        title: 'Início',
        tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
      }} />
      <Tabs.Screen name="favoritos" options={{
        title: 'Favoritos',
        tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} />,
      }} />
      <Tabs.Screen name="reviews" options={{
        title: 'Reviews',
        tabBarIcon: ({ color, size }) => <Ionicons name="star" size={size} color={color} />,
      }} />
      <Tabs.Screen name="playlists" options={{
        title: 'Playlists',
        tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
      }} />
      <Tabs.Screen name="configuracoes" options={{
        title: 'Config',
        tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
      }} />
    </Tabs>
  );
}
