import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();

    const UserAvatar = () => (
        <TouchableOpacity onPress={() => router.push('/profile')}>
            {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{user?.displayName?.[0] || user?.email?.[0] || 'U'}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'My App',
                    headerRight: () => <UserAvatar />,
                    headerStyle: { backgroundColor: '#fff' },
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            />
            <StatusBar style="dark" />
            <View style={styles.content}>
                <Text style={styles.placeholderText}>Template Principal</Text>
                <Text style={styles.welcomeText}>Olá, {user?.displayName || 'Usuário'}!</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    placeholderText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ccc',
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 18,
        color: '#333',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    }
});
