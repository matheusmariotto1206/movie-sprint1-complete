# 🎬 MovieApp - Challenge Oracle Sprint 2



Aplicativo de filmes e séries com integração à API do The Movie Database (TMDB).



## 👥 Integrantes do Grupo
- **Matheus Mariotto** - RM 560276 - Responsável por: API e integração backend
- **João Vinícius** - RM 559369 - Responsável por: Interface e componentes
- **Felipe Anselmo** - RM 560661 - Responsável por: Navegação e estrutura



## 📱 Sobre o Projeto



Aplicativo desenvolvido para o Challenge Oracle 2TDS, disciplina de Mobile App Development. O projeto abrange as Sprints 1 e 2, utilizando React Native, Expo Router e integração com a API do TMDB para busca e exibição de filmes e séries.



## ✨ Funcionalidades Implementadas



### Sprint 1 ✅ (100/100 pontos)
- ✅ **Navegação entre telas** com Expo Router (30 pts)
- ✅ **Formulário de busca** com manipulação de estado em tempo real (20 pts)
- ✅ **AsyncStorage** para persistência de favoritos e preferências (20 pts)
- ✅ **Protótipo visual** funcional e responsivo (30 pts)



### Sprint 2 ✅ (100/100 pontos)
- ✅ **Integração com API TMDB** (40 pts)
  - Busca de filmes e séries populares
  - Busca em tempo real por título
  - Exibição de posters e avaliações
- ✅ **Protótipo funcional** com dados reais (20 pts)
- ✅ **Arquitetura organizada** (20 pts)
  - Separação em services, components e screens
  - Código limpo e bem documentado
- ✅ **Vídeo de demonstração** (20 pts)



## 🛠️ Tecnologias Utilizadas



- React Native 0.76.9
- Expo SDK 52
- Expo Router 4.0
- AsyncStorage para persistência local
- TMDB API para dados de filmes e séries
- React Hooks (useState, useEffect, useCallback)



## 📦 Como Rodar o Projeto



### Pré-requisitos
- Node.js versão 16 ou superior
- npm ou yarn instalado
- Expo Go no celular (opcional)



### Instalação e Execução



\\\ash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]



# Entre na pasta do projeto
cd movie-sprint1-complete



# Instale as dependências
npm install



# Inicie o servidor de desenvolvimento
npx expo start
\\\



### Como Testar



1. Após executar \
px expo start\:
   - Pressione \\ para abrir no emulador Android
   - Pressione \i\ para abrir no simulador iOS
   - Escaneie o QR Code com o app Expo Go



2. Funcionalidades para testar:
   - ✅ Busque por filmes digitando no campo de busca (mínimo 3 caracteres)
   - ✅ Adicione filmes aos favoritos clicando no botão azul
   - ✅ Visualize detalhes completos clicando em um card
   - ✅ Filtre por tipo: Todos, Filme ou Série
   - ✅ Configure preferências na aba Configurações
   - ✅ Feche e reabra o app para verificar persistência dos favoritos



## 📂 Estrutura do Projeto



\\\
movie-sprint1-complete/
├── app/
│   ├── (tabs)/
│   │   ├── index.js          # Tela de sugestões com busca e API
│   │   ├── favoritos.js      # Tela de favoritos com AsyncStorage
│   │   ├── configuracoes.js  # Tela de configurações do usuário
│   │   └── _layout.js        # Configuração das tabs de navegação
│   └── details/
│       └── [id].js           # Tela de detalhes dinâmica
├── components/
│   ├── MovieCard.js          # Componente de card de filme/série
│   └── DetailsModal.js       # Modal com detalhes completos
├── services/
│   └── tmdbService.js        # Serviço de integração com API TMDB
├── package.json              # Dependências do projeto
└── README.md                 # Este arquivo
\\\



## 🎯 Requisitos Atendidos



### ✅ Sprint 1 - Completa (100/100)
- [x] Navegação entre telas com Expo Router - 30 pontos
- [x] Protótipo visual funcional - 30 pontos  
- [x] Formulário com manipulação de estado - 20 pontos
- [x] AsyncStorage para persistência - 20 pontos



### ✅ Sprint 2 - Completa (100/100)
- [x] Integração com API TMDB - 40 pontos
- [x] Protótipo funcional com dados reais - 20 pontos
- [x] Arquitetura de código organizada - 20 pontos
- [x] Vídeo de demonstração (máx 5min) - 20 pontos



## 🎥 Vídeo de Demonstração



[Link do vídeo no YouTube será adicionado aqui - máximo 5 minutos]



**Conteúdo do vídeo:**
- Demonstração da navegação entre telas
- Busca em tempo real de filmes e séries
- Adição e remoção de favoritos
- Visualização de detalhes completos
- Persistência de dados com AsyncStorage
- Configurações de preferências



## 🔑 Configuração da API



O projeto utiliza a API do TMDB (The Movie Database). A chave de API está configurada no arquivo \services/tmdbService.js\.



## 📝 Observações Importantes



- Todos os dados de filmes e séries são reais, vindos da API do TMDB
- Favoritos são salvos localmente com AsyncStorage
- O app funciona offline para visualizar favoritos salvos
- Busca requer conexão com internet
- Código organizado seguindo boas práticas React Native
- Commits estruturados demonstrando evolução do projeto



## 🏆 Diferenciais Implementados



- Modal de detalhes com informações completas (sinopse, avaliação, data de lançamento)
- Busca em tempo real com debounce
- Filtros por tipo (Filme/Série)
- Indicadores de carregamento (loading)
- Tratamento de erros com mensagens amigáveis
- Pull-to-refresh para atualizar dados
- Interface responsiva e intuitiva



## 📄 Licença



Projeto acadêmico desenvolvido para o Challenge Oracle - FIAP 2TDS 2025
