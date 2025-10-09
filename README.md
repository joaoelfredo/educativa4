# 🚀 Educativa Mobile App

Repositório do frontend para o aplicativo Educativa, desenvolvido com React Native (Expo) e JavaScript.

---

## 📋 Pré-requisitos

Antes de começar, garanta que você tem o seguinte instalado:

-   Node.js (v18+ LTS)
-   Yarn (`npm install -g yarn`)
-   Expo CLI (`npm install -g expo-cli`)
-   Git

---

## 🚀 Como Rodar o Projeto

**1. Clone o repositório:**

```bash
git clone https://github.com/joaoelfredo/educativa4.git
cd educativa4
```

**2. Instale as dependências:**

```bash
yarn install
```

**3. Configure as variáveis de ambiente:**
Crie o arquivo `.env` a partir do exemplo e adicione a URL da sua API local.

```bash
cp .env.example .env
```
> Edite o arquivo `.env` e adicione a URL da sua API local (ex: `API_BASE_URL=http://192.168.1.10:3333`).


**4. Inicie o servidor de desenvolvimento (Comando do dia a dia):**
Este é o comando que você usará sempre para trabalhar no projeto.

```bash
yarn start
```

---

### 💡 Dicas Rápidas de Visualização

-   **Navegador Web:** Pressione `w` no menu para um preview rápido da UI.
-   **QR Code (App Expo Go):** Escaneie o QR Code com seu celular (na mesma rede Wi-Fi). **Atenção:** Isso só funciona para telas que **não** usam bibliotecas com código nativo customizado (como `react-native-reanimated`).
-   **Emulador/Simulador:** O método principal (`yarn start` + `a` ou `i`) sempre funcionará para o desenvolvimento completo do app.