import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { createUserWithEmailAndPassword, signOut as firebaseSignOut, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { auth } from '../firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [googleLoading, setGoogleLoading] = useState(false);

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        // iosClientId: 'YOUR_IOS_CLIENT_ID',
        // androidClientId: 'YOUR_ANDROID_CLIENT_ID',
        clientId: '1017822674568-2445sc99brlilo0hjo5tbtnp94okkrbb.apps.googleusercontent.com',
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('Auth state changed:', user ? user.email : 'No user');
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const handleGoogleResponse = async () => {
            console.log('Google Response:', JSON.stringify(response, null, 2));

            if (response?.type === 'success') {
                setGoogleLoading(true);
                try {
                    // For web, the id_token comes from authentication object
                    // For native, it may come from params
                    const idToken = response.authentication?.idToken || response.params?.id_token;
                    console.log('ID Token found:', idToken ? 'Yes' : 'No');

                    if (idToken) {
                        const credential = GoogleAuthProvider.credential(idToken);
                        await signInWithCredential(auth, credential);
                        console.log('Google Sign-In successful!');
                    } else {
                        console.error('No idToken found in response');
                        if (Platform.OS === 'web') {
                            alert('Erro: Token não recebido do Google. Verifique as configurações do OAuth.');
                        } else {
                            Alert.alert('Erro', 'Token não recebido do Google.');
                        }
                    }
                } catch (error) {
                    console.error('Google Sign-In Error:', error);
                    if (Platform.OS === 'web') {
                        alert('Erro ao fazer login com Google: ' + error.message);
                    } else {
                        Alert.alert('Erro', 'Erro ao fazer login com Google: ' + error.message);
                    }
                } finally {
                    setGoogleLoading(false);
                }
            } else if (response?.type === 'error') {
                console.error('Google Auth Error:', response.error);
                if (Platform.OS === 'web') {
                    alert('Erro na autenticação Google: ' + (response.error?.message || 'Erro desconhecido'));
                } else {
                    Alert.alert('Erro', 'Erro na autenticação Google');
                }
            } else if (response?.type === 'dismiss') {
                console.log('Google Auth dismissed by user');
            }
        };

        if (response) {
            handleGoogleResponse();
        }
    }, [response]);

    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email, password, displayName, phone) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        return userCredential;
    };

    const signOut = () => {
        return firebaseSignOut(auth);
    };

    const googleSignIn = () => {
        console.log('Initiating Google Sign-In...');
        console.log('Request ready:', !!request);
        promptAsync();
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signUp, signOut, googleSignIn, loading, googleLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
