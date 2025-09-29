# Movie Sprint - Aplicativo de Filmes e Séries

Aplicativo mobile desenvolvido em React Native com Expo para gerenciamento de sugestões de filmes e séries, permitindo aos usuários salvar favoritos e configurar preferências personalizadas.

## Integrantes do Grupo

| Nome Completo | RM | Responsabilidade |
|--------------|-----|------------------|
| [Nome do Aluno 1] | [RM] | Desenvolvimento de navegação e estrutura do projeto |
| [Nome do Aluno 2] | [RM] | Implementação de componentes e AsyncStorage |
| [Nome do Aluno 3] | [RM] | Estilização das telas e documentação |

## Sobre o Projeto

O Movie Sprint é um aplicativo que auxilia usuários na descoberta e organização de filmes e séries. Com uma interface intuitiva, permite adicionar títulos aos favoritos, realizar buscas, aplicar filtros e personalizar preferências de visualização.

## Funcionalidades Implementadas

### Sprint 1 - Requisitos Atendidos 

#### 1. Navegação entre telas 
- **Tab Navigation**: Implementada com 3 abas principais (Sugestões, Favoritos, Configurações)
- **Stack Navigation**: Navegação para tela de detalhes a partir das listas
- **Ícones**: Cada aba possui ícone próprio usando Ionicons
- **Transições**: Navegação fluida entre telas

#### 2. Protótipo visual funcional 
- **Design consistente**: Interface padronizada em todas as telas
- **Cards informativos**: Exibição clara de título, gênero, tipo e descrição
- **Layout responsivo**: Uso de Flexbox para organização dos elementos
- **Feedback visual**: Estados vazios com mensagens apropriadas
- **Busca e filtros**: Interface intuitiva para localizar conteúdo

#### 3. Formulário com manipulação de estado 
- **TextInput controlado**: Campo de nome do usuário
- **Seleção múltipla**: Chips para escolha de gêneros favoritos
- **Input numérico**: Campo para nota mínima (0-10)
- **Validação**: Verificação de dados antes de salvar
- **useState**: Gerenciamento de todos os campos do formulário
- **Feedback**: Alertas de sucesso/erro ao salvar

#### 4. Armazenamento com AsyncStorage 
- **Persistência de favoritos**: Lista mantida entre sessões
- **Preferências do usuário**: Nome, gêneros e nota mínima salvos
- **Carregamento automático**: Dados restaurados ao iniciar o app
- **Operações CRUD**: Adicionar e remover favoritos com persistência

## Estrutura do Projeto

```
movie-sprint/
├── App.js                      # Configuração de navegação principal
├── screens/
│   ├── SuggestionsScreen.js    # Lista de sugestões com busca e filtros
│   ├── FavoritesScreen.js      # Lista de favoritos do usuário
│   ├── SettingsScreen.js       # Configurações e preferências
│   └── DetailsScreen.js        # Detalhes completos do título
├── components/
│   └── MovieCard.js            # Componente reutilizável de card
├── package.json
└── README.md
```

## Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile
- **Expo**: Plataforma de desenvolvimento e build
- **React Navigation**: Biblioteca de navegação
  - `@react-navigation/native`
  - `@react-navigation/bottom-tabs`
  - `@react-navigation/stack`
- **AsyncStorage**: Armazenamento local persistente
- **Ionicons**: Biblioteca de ícones do Expo

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI
- Expo Go (no smartphone) ou emulador Android/iOS

## Instalação e Execução

### 1. Clone o repositório

```bash
git clone [URL_DO_REPOSITORIO]
cd movie-sprint
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Instale as dependências de navegação

```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
```

### 4. Instale o AsyncStorage

```bash
npx expo install @react-native-async-storage/async-storage
```

### 5. Execute o projeto

```bash
npx expo start
```

### 6. Abra o aplicativo

- Escaneie o QR Code com o Expo Go (iOS/Android)
- Pressione `a` para abrir no emulador Android
- Pressione `i` para abrir no simulador iOS

## Funcionalidades Detalhadas

### Tela de Sugestões
- Exibição de lista de filmes e séries
- Campo de busca por título, gênero ou descrição
- Filtros por tipo (Todos/Filme/Série)
- Contador de resultados filtrados
- Botão para adicionar aos favoritos
- Navegação para tela de detalhes ao clicar no card

### Tela de Favoritos
- Lista de todos os títulos favoritados
- Contador de favoritos
- Botão para visualizar detalhes
- Botão para remover dos favoritos
- Confirmação antes de remover
- Mensagem quando não há favoritos

### Tela de Configurações
- Campo para nome do usuário (validação obrigatória)
- Seleção múltipla de gêneros favoritos (9 opções)
- Campo para nota mínima (validação 0-10)
- Botão para salvar preferências
- Exibição das configurações salvas
- Persistência de dados com AsyncStorage

### Tela de Detalhes
- Visualização completa das informações do título
- Header colorido com tipo e título
- Sinopse detalhada
- Card com informações de tipo e gênero

## Conceitos Aplicados das Aulas

### JavaScript e React
- Arrow Functions
- Destructuring
- Array Methods (map, filter, find)
- Hooks (useState, useEffect, useFocusEffect)
- Componentes funcionais
- Props e Export/Import

### React Native
- StyleSheet para estilização
- Flexbox para layouts
- FlatList para listas otimizadas
- TextInput para formulários
- TouchableOpacity para interações
- Alert para feedbacks
- ScrollView para conteúdo extenso

### Navegação
- Tab Navigator para menu principal
- Stack Navigator para navegação em pilha
- Parâmetros de navegação
- Configuração de headers

### Persistência
- AsyncStorage para dados locais
- Operações assíncronas (async/await)
- JSON.stringify e JSON.parse
- Tratamento de erros

## Dados Mockados

O aplicativo utiliza um array de 10 títulos mockados contendo:
- ID único
- Título
- Tipo (Filme/Série)
- Gênero
- Descrição

Exemplos: Stranger Things, Oppenheimer, Matrix, The Crown, Breaking Bad, entre outros.

## Validações Implementadas

- Nome do usuário obrigatório
- Nota mínima entre 0 e 10
- Verificação de favoritos duplicados
- Confirmação antes de remover favoritos
- Tratamento de erros em operações de AsyncStorage

## Melhorias Futuras (Próximas Sprints)

- Integração com API externa de filmes (TMDB ou similar)
- Sistema de avaliações e comentários
- Compartilhamento de favoritos
- Modo escuro
- Notificações de lançamentos
- Filtros avançados por ano, classificação, etc.

## Critérios de Avaliação Atendidos

- [x] Navegação entre telas com Tab e Stack Navigation
- [x] Protótipo visual completo e funcional
- [x] Formulário com manipulação de estado usando useState
- [x] Armazenamento local com AsyncStorage
- [x] README.md documentado
- [x] Código organizado e comentado
- [x] Histórico Git organizado
- [x] Entrega via GitHub Classroom

## Licença

Projeto desenvolvido para fins acadêmicos como parte do Challenge FIAP - Oracle 2025.

---

**Desenvolvido por:** [Nomes dos integrantes]  
**Curso:** Análise e Desenvolvimento de Sistemas - FIAP  
**Disciplina:** Mobile Application Development  
**Professor:** Fernando Pinéo  
**Sprint:** 1/4  
**Data:** [Data da entrega]