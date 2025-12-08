import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebaseConfig';

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();

    // CRUD States
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch items from Firestore
    useEffect(() => {
        if (user) {
            fetchItems();
        }
    }, [user]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const q = query(
                collection(db, 'items'),
                where('userId', '==', user.uid)
            );
            const querySnapshot = await getDocs(q);
            const itemsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setItems(itemsList);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    // CREATE
    const handleAdd = async () => {
        if (!newItem.trim()) return;

        try {
            await addDoc(collection(db, 'items'), {
                text: newItem.trim(),
                userId: user.uid,
                createdAt: serverTimestamp()
            });
            setNewItem('');
            fetchItems();
        } catch (error) {
            console.error('Error adding item:', error);
            const msg = 'Erro ao adicionar item: ' + error.message;
            Platform.OS === 'web' ? alert(msg) : Alert.alert('Erro', msg);
        }
    };

    // UPDATE
    const handleUpdate = async (id) => {
        if (!editingText.trim()) return;

        try {
            await updateDoc(doc(db, 'items', id), {
                text: editingText.trim()
            });
            setEditingId(null);
            setEditingText('');
            fetchItems();
        } catch (error) {
            console.error('Error updating item:', error);
            const msg = 'Erro ao atualizar item: ' + error.message;
            Platform.OS === 'web' ? alert(msg) : Alert.alert('Erro', msg);
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'items', id));
            fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            const msg = 'Erro ao deletar item: ' + error.message;
            Platform.OS === 'web' ? alert(msg) : Alert.alert('Erro', msg);
        }
    };

    const confirmDelete = (id) => {
        if (Platform.OS === 'web') {
            if (confirm('Deseja realmente excluir este item?')) {
                handleDelete(id);
            }
        } else {
            Alert.alert(
                'Confirmar',
                'Deseja realmente excluir este item?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Excluir', style: 'destructive', onPress: () => handleDelete(id) }
                ]
            );
        }
    };

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

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            {editingId === item.id ? (
                <View style={styles.editRow}>
                    <TextInput
                        style={styles.editInput}
                        value={editingText}
                        onChangeText={setEditingText}
                        autoFocus
                    />
                    <TouchableOpacity style={styles.saveBtn} onPress={() => handleUpdate(item.id)}>
                        <Text style={styles.btnText}>✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditingId(null)}>
                        <Text style={styles.btnText}>✕</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.itemRow}>
                    <Text style={styles.itemText}>{item.text}</Text>
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.editBtn}
                            onPress={() => { setEditingId(item.id); setEditingText(item.text); }}
                        >
                            <Text style={styles.btnText}>✎</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item.id)}>
                            <Text style={styles.btnText}>🗑</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'My App',
                    headerRight: () => <UserAvatar />,
                    headerStyle: { backgroundColor: '#fff' },
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerRightContainerStyle: { paddingRight: 16 },
                    headerLeftContainerStyle: { paddingLeft: 16 },
                }}
            />
            <StatusBar style="dark" />

            <View style={styles.content}>
                <Text style={styles.welcomeText}>Olá, {user?.displayName || 'Usuário'}!</Text>

                {/* Add Item Form */}
                <View style={styles.addForm}>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite um novo item..."
                        value={newItem}
                        onChangeText={setNewItem}
                        onSubmitEditing={handleAdd}
                    />
                    <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                        <Text style={styles.addBtnText}>+</Text>
                    </TouchableOpacity>
                </View>

                {/* Items List */}
                {loading ? (
                    <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
                ) : items.length === 0 ? (
                    <Text style={styles.emptyText}>Nenhum item cadastrado</Text>
                ) : (
                    <FlatList
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        style={styles.list}
                        showsVerticalScrollIndicator={false}
                    />
                )}
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
        padding: 20,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    addForm: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    addBtn: {
        width: 50,
        height: 50,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    addBtnText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    list: {
        flex: 1,
    },
    itemContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    editBtn: {
        width: 36,
        height: 36,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteBtn: {
        width: 36,
        height: 36,
        backgroundColor: '#ffebee',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        fontSize: 16,
    },
    editRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    saveBtn: {
        width: 36,
        height: 36,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    cancelBtn: {
        width: 36,
        height: 36,
        backgroundColor: '#f44336',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    loader: {
        marginTop: 40,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
        marginTop: 40,
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
