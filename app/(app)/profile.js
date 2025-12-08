import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';

export default function Profile() {
    const { user, signOut } = useAuth();
    const [name, setName] = useState(user?.displayName || '');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            loadUserData();
        }
    }, [user]);

    const loadUserData = async () => {
        try {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setPhone(data.phone || '');
            }
        } catch (e) {
            console.log("Error loading user data", e);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Update Auth Profile
            if (name !== user.displayName) {
                await updateProfile(user, { displayName: name });
            }

            // Update Firestore for extra fields
            await setDoc(doc(db, 'users', user.uid), {
                name,
                phone,
                email: user.email,
                photoURL: user.photoURL
            }, { merge: true });

            Alert.alert('Sucesso', 'Perfil atualizado!');
        } catch (e) {
            Alert.alert('Erro', e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (e) {
            Alert.alert('Erro', e.message);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                {user?.photoURL ? (
                    <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
                ) : (
                    <View style={styles.profileImagePlaceholder}>
                        <Text style={styles.placeholderText}>{name?.[0] || 'U'}</Text>
                    </View>
                )}
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nome Completo</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Telefone</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholder="(11) 99999-9999"
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Salvar Alterações'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.signOutButton]} onPress={handleSignOut}>
                    <Text style={[styles.buttonText, styles.signOutText]}>Sair da Conta</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        padding: 32,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    profileImagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e1e1e1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    placeholderText: {
        fontSize: 40,
        color: '#666',
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    form: {
        padding: 24,
    },
    inputContainer: {
        marginBottom: 20,
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
    button: {
        height: 50,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signOutButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ff3b30',
    },
    signOutText: {
        color: '#ff3b30',
    }
});
