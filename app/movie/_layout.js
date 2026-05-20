import { Stack } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

export default function MovieLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
