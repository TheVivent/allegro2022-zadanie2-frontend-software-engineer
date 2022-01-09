# Allegro Spring TECH e-Xperience 2022

## zadanie 2 - Frontend Software Engineer

> Adam Kapuściński

## instrukcja uruchomienia

Aplikacja została napisana przy użyciu frameworka Next.js i do uruchomienia wymaga menadżera pakietów npm/yarn \
Instalacja zależności:

```
npm install
yarn install
```

Aplikacja udostępnia standardowe skrypty które można uruchomić za pomocą

```
npm run <skrypt>
yarn <skrypt>
```

dostępne skrypty:

- `dev` - uruchamia serwer deweloperski
- `build` - buduje aplikację
- `start` - uruchamia serwer ze zbudowaną aplikacją

## ograniczenia aplikacji

Najpoważniejszym ograniczeniem aplikacji jest to, że korzysta ona z nieautoryzowanego dostępu do API GitHuba, co ogranicza ilość zapytań, jakie może wykonać klient. W związku z tym, zbyt szybkie przejście np. na stronę piętnastą wyszukiwarki użytkowników i wybranie losowego użytkownika, może spowodować, że lista repozytoriów wczytywać będzie się 10-20 sekund (przyjęty timeout między kolejnymi zapytaniami).

## dodatkowe uwagi

Wspomniany wyżej timeout pomiędzy zapytaniami realizowany jest przez zwykły `setTimeout` przechowywany w stanie komponentu. Przy każdej próbie wykonania danego typu zapytania czyszczony jest odpowiedni timeout i w razie niepowodzenia tworzony na nowo. Zapobiega to tworzeniu się pętli tworzących coraz to więcej zapytań. Każdy timeout jest także czyszczony przy każdym usunięciu komponentu, aby zapobiec wyciekom pamięci.

Kod odpowiedzialny za listę repozytoriów został podzielony na 3 pod komponenty. Jest to pierwszy raz kiedy tworzyłem pod komponenty, dlatego nie jestem pewien, czy zrobiłem to poprawnie/optymalnie. Na pewno nie jestem zadowolony ze sposobu w jaki pod komponenty komunikują się między sobą (3 warstwy kontekstu, udostępniane przez komponent główny). Mimo, że nie jestem zadowolony co do implementacji, to uważam, że korzystanie z niego jest całkiem przyjemne. Pozwala to np, w prosty sposób przenieść paginację strony nad repozytoria.

Bardzo zadowolony jestem z komponentu `SmartPaginator`. Pozawala on na łatwe i automatyczne dopasowywanie ilości wyświetlanych stron, w zależności od obecnego breakpointu bootstrapa. Rozwiązanie nie jest idealne, bo wykorzystuje na szybko utworzony hook sprawdzający breakpoint w zależności od szerokości strony, co nie jest idealne, ponieważ breakpointy w bootstrapie można modyfikować. Niemniej jednak, sam pomysł na ten komponent bardzo mi się spodobał i rozważam stworzenie takiego komponentu (oczywiście dopracowanego) i udostępnienie go na npmjs.com, aby móc z niego łatwo korzystać w przyszłych projektach.

Aplikacja posiada zarówno motyw ciemny jak i jasny. Dobiera go automatycznie na podstawie ustawień systemu.

Działająca aplikacja dostępna jest pod adresem https://allegro-spring-tech-2022.vercel.app/
