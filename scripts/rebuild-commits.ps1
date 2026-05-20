# Rebuild mobile git history as incremental evolution
Set-Location $PSScriptRoot\..

git reset --soft HEAD~2
git reset HEAD

function Commit-Group {
  param([string]$Message, [string[]]$Paths)
  foreach ($p in $Paths) {
    if (Test-Path $p) { git add $p }
  }
  git commit -m $Message
}

Commit-Group "chore: setup inicial expo router e dependencias" @(
  ".gitignore", ".easignore", "package.json", "package-lock.json",
  "babel.config.js", "tsconfig.json"
)

Commit-Group "feat: layout navegacao tabs login e componentes base" @(
  "app/_layout.js", "app/login.js", "app/(tabs)/_layout.js",
  "components/LoadingSpinner.js", "constants/api.ts", "constants/theme.ts"
)

Commit-Group "feat: camada services api e listagem de filmes" @(
  "services/api.js", "services/movieService.js", "services/listService.js",
  "hooks/useMovies.js", "hooks/useLists.js", "utils/movie.js",
  "app/(tabs)/index.js"
)

Commit-Group "feat: autenticacao jwt login cadastro e sessao" @(
  "services/authService.js", "contexts/AuthContext.js",
  "hooks/useAuthActions.js"
)

Commit-Group "feat: crud favoritos reviews e playlists" @(
  "services/favoriteService.js", "services/reviewService.js",
  "services/playlistService.js", "hooks/useFavorites.js",
  "hooks/useReviews.js", "hooks/usePlaylists.js",
  "components/MovieCard.js", "components/StarRating.js",
  "components/MoviePicker.js", "app/(tabs)/favoritos.js",
  "app/(tabs)/reviews.js", "app/(tabs)/playlists.js"
)

Commit-Group "feat: tela detalhe filme e stack navigation" @(
  "app/movie/_layout.js", "app/movie/[id].js"
)

Commit-Group "feat: integracao oracle apex ranking top movies" @(
  "services/apexService.js", "hooks/useTopMovies.js", "app/(tabs)/explore.js"
)

Commit-Group "feat: tema claro escuro com persistencia" @(
  "constants/themes.js", "contexts/ThemeContext.js", "app/(tabs)/configuracoes.js"
)

Commit-Group "feat: notificacoes locais favoritos e reviews sprint 4" @(
  "services/notificationService.js", "hooks/useNotificationSetup.js"
)

Commit-Group "chore: eas build assets android e scripts utilitarios" @(
  "app.json", "eas.json", "assets/icon.png", "assets/splash.png",
  "assets/adaptive-icon.png"
)

Commit-Group "docs: readme sprint 3 e 4 firebase eas video" @(
  "README.md"
)

Write-Host "`n=== Historico mobile ===" -ForegroundColor Green
git log --oneline
