import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const router = useRouter();
    const { signIn, googleSignIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = async () => {
        setError('');

        if (!email.trim()) {
            setError('Digite seu e-mail');
            return;
        }
        if (!password) {
            setError('Digite sua senha');
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
        } catch (e) {
            let errorMessage = 'Erro ao fazer login. Tente novamente.';
            if (e.code === 'auth/user-not-found') {
                errorMessage = 'Usuário não encontrado. Verifique o e-mail ou cadastre-se.';
            } else if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
                errorMessage = 'E-mail ou senha incorretos.';
            } else if (e.code === 'auth/invalid-email') {
                errorMessage = 'E-mail inválido.';
            } else if (e.code === 'auth/too-many-requests') {
                errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        try {
            await googleSignIn();
        } catch (e) {
            setError('Erro ao fazer login com Google.');
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <Text style={styles.title}>Bem-vindo</Text>
                <Text style={styles.subtitle}>Faça login para continuar</Text>
            </View>

            {error !== '' && (
                <View style={styles.errorBox}>
                    <Text style={styles.errorBoxText}>{error}</Text>
                </View>
            )}

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="seu@email.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="********"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Entrar</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>ou</Text>
                    <View style={styles.line} />
                </View>

                <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
                    <Text style={styles.googleButtonText}>Entrar com Google</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Não tem conta? </Text>
                    <TouchableOpacity onPress={() => router.push('/signup')}>
                        <Text style={styles.link}>Cadastre-se</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 8,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    errorBox: {
        backgroundColor: '#ffebee',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorBoxText: {
        color: '#c62828',
        fontSize: 14,
        textAlign: 'center',
    },
    button: {
        height: 50,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#eee',
    },
    orText: {
        marginHorizontal: 16,
        color: '#999',
    },
    googleButton: {
        height: 50,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    googleButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        color: '#666',
        fontSize: 14,
    },
    link: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
