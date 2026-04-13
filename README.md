# 🎬 CineFinder

## Descrição do Problema
Encontrar filmes de qualidade pode ser difícil com tantas opções disponíveis. Usuários precisam de uma forma prática de descobrir, avaliar e organizar filmes de acordo com seus gostos pessoais.

## Solução Proposta
O **CineFinder** é um aplicativo mobile desenvolvido em React Native (Expo) que permite aos usuários:
- Pesquisar e explorar filmes
- Salvar filmes favoritos
- Escrever e visualizar reviews
- Criar playlists personalizadas de filmes
- Gerenciar configurações de conta

O app se integra a um backend via API REST (Spring Boot) e utiliza funcionalidades do Oracle APEX para processamento de dados.

## Tecnologias Utilizadas

### Frontend (Mobile)
- **React Native** com **Expo** (Expo Router)
- **TypeScript / JavaScript**
- **TanStack Query (React Query)** — gerenciamento de estado e cache de requisições HTTP
- **AsyncStorage** — persistência local de sessão do usuário
- **Ionicons** — ícones da interface

### Backend
- **Spring Boot (Java)** — API REST
- **Oracle APEX** — funcionalidades integradas e processamento de dados
- **Oracle Database** — banco de dados relacional

### Arquitetura
```
├── app/                    # Telas (Expo Router)
│   ├── _layout.js          # Layout raiz + AuthGuard
│   ├── login.js            # Tela de login/cadastro
│   └── (tabs)/             # Navegação por abas
│       ├── _layout.js      # Configuração das tabs
│       ├── index.js        # Tela inicial (Explorar)
│       ├── favoritos.js    # Filmes favoritos
│       ├── reviews.js      # Reviews de filmes
│       ├── playlists.js    # Playlists personalizadas
│       └── configuracoes.js# Configurações
├── contexts/               # Context API (AuthContext)
├── services/               # Camada de acesso a dados / APIs
├── hooks/                  # Hooks customizados
└── components/             # Componentes reutilizáveis
```

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Autenticação** | Login e cadastro com email/senha via API |
| **Explorar filmes** | Busca e listagem de filmes da API |
| **Favoritos** | Adicionar/remover filmes favoritos (CRUD) |
| **Reviews** | Criar, ler, editar e deletar avaliações de filmes |
| **Playlists** | Criar e gerenciar playlists personalizadas |
| **Oracle APEX** | Integração com funcionalidades do APEX via API REST |

## Instruções para Execução

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (emulador) ou dispositivo físico com Expo Go
- Backend Spring Boot rodando na porta 8080

### Instalação e Execução

```bash
# 1. Clonar o repositório
git clone <URL_DO_REPOSITORIO>
cd cinefinder

# 2. Instalar dependências
npm install

# 3. Iniciar o app
npx expo start

# 4. Abrir no emulador ou dispositivo
# Pressione 'a' para Android ou 'i' para iOS
```

### Configuração do Backend
O backend Spring Boot deve estar rodando em `http://10.0.2.2:8080` (endereço padrão do emulador Android para localhost).

