# React Native Firebase Auth Template

Template para apps React Native com autenticação Firebase (Email/Senha + Google).

## 🚀 Como usar este template

### 1. Clonar e Instalar  
```bash
git clone https://github.com/seu-usuario/login_google_email.git meu-novo-projeto
cd meu-novo-projeto
npm install
```

### 2. Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto ou selecione um existente
3. Vá em **Configurações do Projeto** → **Geral** → **Seus apps**
4. Adicione um app Web (`</>`)
5. Copie as configurações

### 3. Configurar Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Selecione o projeto do Firebase
3. Vá em **APIs e Serviços** → **Credenciais**
4. Crie um **ID do cliente OAuth 2.0** (tipo: Aplicativo da Web)
5. Adicione as URIs de redirecionamento autorizadas:
   - `https://auth.expo.io/@seu-usuario/seu-app`
   - `http://localhost:8081`

### 4. Criar arquivo `.env`

Crie o arquivo `.env` na raiz do projeto:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=sua-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Google OAuth
EXPO_PUBLIC_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
```

### 5. Configurar Firestore

1. No Firebase Console, vá em **Firestore Database**
2. Crie um banco de dados (modo produção ou teste)
3. Configure as regras de segurança:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 6. Atualizar `app.json`

Altere os seguintes campos:

```json
{
  "expo": {
    "name": "Nome do Seu App",
    "slug": "nome-do-seu-app",
    "scheme": "nomedoseuapp",
    "ios": {
      "bundleIdentifier": "com.seuusuario.nomedoapp"
    },
    "android": {
      "package": "com.seuusuario.nomedoapp"
    }
  }
}
```

## 📁 Arquivos que precisam de alteração

| Arquivo | O que alterar |
|---------|---------------|
| `.env` | Todas as variáveis de ambiente |
| `app.json` | `name`, `slug`, `scheme`, `bundleIdentifier`, `package` |
| `package.json` | `name` (opcional) |

## 🔑 Onde encontrar cada valor

| Variável | Onde encontrar |
|----------|----------------|
| `FIREBASE_API_KEY` | Firebase Console → Configurações → Geral → Seus apps |
| `FIREBASE_AUTH_DOMAIN` | Mesmo local acima |
| `FIREBASE_PROJECT_ID` | Mesmo local acima |
| `GOOGLE_CLIENT_ID` | Google Cloud Console → Credenciais → OAuth 2.0 |

## 🏃 Executar

```bash
npx expo start -c
```

## 📱 Funcionalidades incluídas

- ✅ Login com Email/Senha
- ✅ Login com Google
- ✅ Cadastro com validação
- ✅ Máscara de telefone
- ✅ Persistência de sessão
- ✅ Perfil do usuário
- ✅ CRUD com Firestore
- ✅ Proteção de rotas
