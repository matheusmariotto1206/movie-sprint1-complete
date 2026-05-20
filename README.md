# CineFinder

Aplicativo mobile para descobrir filmes, salvar favoritos, avaliar títulos e organizar playlists, integrado à API Spring Boot do projeto Java e ao ranking calculado no Oracle APEX.

## Repositórios

- **Mobile:** este repositório
- **Backend (API):** [cinefinder-java-advanced](https://github.com/challengezinho/cinefinder-java-advanced)

## Tecnologias

| Camada | Stack |
|--------|--------|
| Mobile | React Native, Expo, Expo Router, TanStack Query, AsyncStorage |
| API | Spring Boot (JWT, filmes, reviews, listas, proxy APEX) |
| APEX | REST `top-movies` com agregação de reviews |

## Funcionalidades

- Login e cadastro (JWT)
- Tema claro e escuro
- Listagem de filmes, favoritos, reviews e playlists (CRUD)
- Ranking **Top APEX** (dados processados no Oracle)
- Notificações locais ao favoritar ou criar review (toque abre a tela correspondente)

## Oracle APEX

**Endpoint:** `https://oracleapex.com/ords/cinefinder/cinefinder/top-movies`

Regra de negócio no handler (join, média, filtro e ordenação):

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

Fluxo: APEX → Spring (`GET /api/apex/top-movies`) → app (aba Top APEX).

## Como executar

**Pré-requisitos:** Node.js 18+, backend Spring na porta 8080, emulador Android ou Expo Go.

1. Subir o backend (repositório Java do grupo):

```bash
.\gradlew.bat bootRun --args="--spring.profiles.active=dev"
```

2. Instalar dependências e iniciar o app:

```bash
npm install
npx expo start
```

No emulador Android a API usa `http://10.0.2.2:8080`. No navegador do PC: `http://localhost:8080/api/apex/top-movies`.

## Publicação (Firebase App Distribution)

| Item | Valor |
|------|--------|
| Projeto Firebase | CineFinder |
| Package Android | `com.fiap.cinefinder` |
| Versão publicada | 1.0.1 (2) |
| Tester (professor) | `proffernando.abreu@fiap.com.br` |

APK gerado com EAS (`eas build -p android --profile preview`) e distribuído pelo Firebase App Distribution.

## Vídeo de demonstração

https://youtu.be/0huEELuYzKY
