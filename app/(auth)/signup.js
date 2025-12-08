import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

// Phone mask function
const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export default function Signup() {
    const router = useRouter();
    const { signUp } = useAuth();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Error states
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }

        if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
            newErrors.phone = 'Telefone inválido';
        }

        if (!email.trim()) {
            newErrors.email = 'E-mail é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'E-mail inválido';
        }

        if (email !== confirmEmail) {
            newErrors.confirmEmail = 'Os e-mails não conferem';
        }

        if (!password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (password.length < 6) {
            newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'As senhas não conferem';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await signUp(email, password, name, phone);
        } catch (e) {
            let errorMessage = 'Erro ao cadastrar. Tente novamente.';
            if (e.code === 'auth/email-already-in-use') {
                errorMessage = 'Este e-mail já está em uso';
            } else if (e.code === 'auth/weak-password') {
                errorMessage = 'Senha muito fraca';
            } else if (e.code === 'auth/invalid-email') {
                errorMessage = 'E-mail inválido';
            }
            setErrors({ general: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneChange = (text) => {
        setPhone(formatPhone(text));
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Crie sua conta</Text>
                    <Text style={styles.subtitle}>Preencha seus dados para começar</Text>
                </View>

                {errors.general && (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorBoxText}>{errors.general}</Text>
                    </View>
                )}

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nome Completo</Text>
                        <TextInput
                            style={[styles.input, errors.name && styles.inputError]}
                            value={name}
                            onChangeText={setName}
                            placeholder="Seu nome completo"
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Telefone</Text>
                        <TextInput
                            style={[styles.input, errors.phone && styles.inputError]}
                            value={phone}
                            onChangeText={handlePhoneChange}
                            keyboardType="phone-pad"
                            placeholder="(11) 99999-9999"
                            maxLength={15}
                        />
                        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                            style={[styles.input, errors.email && styles.inputError]}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholder="seu@email.com"
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirmar E-mail</Text>
                        <TextInput
                            style={[styles.input, errors.confirmEmail && styles.inputError]}
                            value={confirmEmail}
                            onChangeText={setConfirmEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholder="Confirme seu e-mail"
                        />
                        {errors.confirmEmail && <Text style={styles.errorText}>{errors.confirmEmail}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Senha</Text>
                        <TextInput
                            style={[styles.input, errors.password && styles.inputError]}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholder="Mínimo 6 caracteres"
                        />
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirmar Senha</Text>
                        <TextInput
                            style={[styles.input, errors.confirmPassword && styles.inputError]}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            placeholder="Confirme sua senha"
                        />
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Cadastrar</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Já tem conta? </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.link}>Faça Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 24,
        paddingTop: 60,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
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
    inputError: {
        borderColor: '#ff3b30',
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 12,
        marginTop: 4,
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
        marginBottom: 24,
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
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
