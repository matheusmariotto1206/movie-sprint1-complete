import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'film' : 'film-outline';
          } else if (route.name === 'favoritos') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'configuracoes') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 4,
        },
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 2,
          shadowOpacity: 0.1,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#333',
          fontSize: 20,
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Sugestões',
          tabBarLabel: 'Sugestões',
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: 'Meus Favoritos',
          tabBarLabel: 'Favoritos',
        }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: 'Configurações',
          tabBarLabel: 'Configurações',
        }}
      />
    </Tabs>
  );
}