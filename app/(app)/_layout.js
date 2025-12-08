import { Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
    const { signOut } = useAuth();

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name="profile"
                options={{
                    presentation: 'modal',
                    title: 'Meu Perfil'
                }}
            />
        </Stack>
    );
}
