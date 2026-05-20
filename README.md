# 🎬 CineFinder

## Descrição do Problema
Encontrar filmes de qualidade pode ser difícil com tantas opções disponíveis. Usuários precisam de uma forma prática de descobrir, avaliar e organizar filmes de acordo com seus gostos pessoais.

## Solução Proposta
O **CineFinder** é um aplicativo mobile desenvolvido em React Native (Expo) que permite aos usuários:
- Pesquisar e explorar filmes
- Salvar filmes favoritos
- Escrever e visualizar reviews
- Criar playlists personalizadas de filmes
- Alternar entre **tema claro e escuro**
- Gerenciar configurações de conta

O app se integra a um backend via API REST (Spring Boot) e consome funcionalidades processadas no **Oracle APEX**.

## Tecnologias Utilizadas

### Frontend (Mobile)
- **React Native** com **Expo** (Expo Router)
- **TanStack Query** — requisições HTTP e cache
- **AsyncStorage** — sessão e preferência de tema
- **Ionicons** — ícones

### Backend
- **Spring Boot (Java)** — API REST + proxy para Oracle APEX
- **Oracle APEX** — ranking de filmes (regra de negócio no REST)
- **Oracle Database** — persistência

### Arquitetura
```
├── app/                    # Telas (Expo Router)
│   ├── _layout.js          # Layout raiz + temas + auth
│   ├── login.js
│   └── (tabs)/
│       ├── index.js        # Filmes
│       ├── explore.js      # Top APEX
│       ├── favoritos.js
│       ├── reviews.js
│       ├── playlists.js
│       └── configuracoes.js# Tema + perfil
│   └── movie/[id].js
├── contexts/               # AuthContext, ThemeContext
├── services/               # API, auth, apex
├── hooks/
└── components/
```

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Autenticação** | Login e cadastro via API com JWT |
| **Tema claro/escuro** | Alternância em Configurações (salva preferência) |
| **Explorar filmes** | Listagem via Spring Boot |
| **Favoritos** | Adicionar/remover filmes |
| **Reviews** | CRUD de avaliações |
| **Playlists** | CRUD de listas + filmes |
| **Oracle APEX** | Ranking Top Filmes com lógica no APEX |
| **Notificações locais** | Após favoritar filme ou publicar review (abre a tela correspondente) |

## Oracle APEX — Regra de negócio

**URL REST:** `https://oracleapex.com/ords/cinefinder/cinefinder/top-movies`

O ranking **não é um SELECT simples**. No handler GET do APEX:

```sql
SELECT m.ID, m.TITLE, m.GENRE,
       ROUND(AVG(r.RATING), 2) AS AVERAGE_RATING,
       COUNT(r.ID) AS TOTAL_REVIEWS
FROM CF_MOVIE m
JOIN CF_REVIEW r ON r.MOVIE_ID = m.ID
GROUP BY m.ID, m.TITLE, m.GENRE
HAVING COUNT(r.ID) >= 1
ORDER BY AVG(r.RATING) DESC
```

Fluxo: **APEX (cálculo)** → **Spring Boot** (`GET /api/apex/top-movies`) → **App** (aba Top APEX).

## Instruções para Execução

### Pré-requisitos
- Node.js 18+
- Backend Spring Boot na porta **8080**
- Emulador Android ou dispositivo com Expo Go

### App mobile
```bash
cd movie-sprint1-complete-main
npm install
npx expo start
```

### Backend Java
```bash
cd cinefinder-java-advanced-main
.\gradlew.bat bootRun --args="--spring.profiles.active=dev"
```

- Emulador Android: API em `http://10.0.2.2:8080`
- Teste APEX proxy: http://localhost:8080/api/apex/top-movies

## Notificações (Sprint 4)

Notificações **locais** disparadas por eventos reais do app (não são alertas simulados):

| Evento | Quando | Ao tocar abre |
|--------|--------|----------------|
| Favorito | Após API confirmar favorito | Aba Favoritos |
| Review | Após criar avaliação na API | Aba Reviews |

Na primeira execução o Android pede permissão de notificação.

> Para gravar no vídeo: favoritar um filme ou criar uma review e mostrar a notificação + navegação ao tocar.

## Publicação — Firebase App Distribution (Sprint 4)

### 1. Pré-requisitos
- Conta [Firebase](https://console.firebase.google.com/)
- `npm install -g eas-cli`
- Login: `eas login`

### 2. Vincular projeto EAS (uma vez)
```bash
cd movie-sprint1-complete-main
eas init
```
Copie o `projectId` gerado para `app.json` → `extra.eas.projectId`.

### 3. Gerar APK
```bash
eas build -p android --profile preview
```

### 4. Publicar no Firebase App Distribution
1. Firebase Console → seu projeto → **App Distribution**
2. Crie o app Android com package `com.fiap.cinefinder`
3. Envie o **APK** baixado do EAS
4. Adicione o e-mail do professor como **tester**
5. Envie o convite de teste

**Versão publicada:** 1.0.1 (2) — inclui correção de remover favoritos e HTTP no APK.

**Testers:** `proffernando.abreu@fiap.com.br` (convite enviado via App Distribution).

## Vídeo da demonstração (Sprint 3 e 4)

**Link do vídeo:** https://youtu.be/0huEELuYzKY

Roteiro narrado (máx. 5 min):

1. Login e fluxo principal (filmes, favoritos, reviews, playlists)
2. Tema claro/escuro
3. Integração API Spring + CRUD
4. Oracle APEX (handler + URL + Top APEX)
5. **Notificação** (favoritar ou review) e toque abrindo a tela
6. **Firebase App Distribution** (instalação pelo convite)

## Commits

Faça commits frequentes (`feat: notificacoes`, `docs: firebase`, etc.).
