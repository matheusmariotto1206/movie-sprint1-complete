import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Importar suas telas
import SuggestionsScreen from './screens/SuggestionsScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import SettingsScreen from './screens/SettingsScreen';
import DetailsScreen from './screens/DetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack para Sugestões (incluindo a tela de detalhes)
function SuggestionsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SuggestionsList" 
        component={SuggestionsScreen}
        options={{ 
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        options={{ 
          title: 'Detalhes',
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

// Stack para Favoritos (incluindo a tela de detalhes)
function FavoritesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="FavoritesList" 
        component={FavoritesScreen}
        options={{ 
          headerShown: false 
        }}
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        options={{ 
          title: 'Detalhes',
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Sugestoes') {
              iconName = focused ? 'film' : 'film-outline';
            } else if (route.name === 'Favoritos') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Configuracoes') {
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
          headerShown: true,
        })}
      >
        <Tab.Screen 
          name="Sugestoes" 
          component={SuggestionsStack}
          options={{ 
            tabBarLabel: 'Sugestões',
            title: 'Sugestões',
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
          }}
        />
        <Tab.Screen 
          name="Favoritos" 
          component={FavoritesStack}
          options={{ 
            tabBarLabel: 'Favoritos',
            title: 'Meus Favoritos',
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
          }}
        />
        <Tab.Screen 
          name="Configuracoes" 
          component={SettingsScreen}
          options={{ 
            tabBarLabel: 'Configurações',
            title: 'Configurações',
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
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}