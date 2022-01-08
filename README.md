# Allegro Spring TECH e-Xperience 2022

## zadanie 2

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

## założenia i uproszczenia

Jednym z problemów z którym zmierzyłem się przy okazji pisania aplikacji było ograniczenie API GitHuba, co do ilości zapytań jakie mogę wywoływać. Problem ten rozwiązałem w mało elegancki sposób (mocna naruszający DRY), jakim było ustawienie Timeoutu przy każdym nieudanym zapytaniu, który będzie próbował je powtórzyć. Zabezpieczyłem ten element w każdym miejscu aplikacji tak, aby nie było możliwe ustawienie wielu Timeoutów na raz oraz, aby Timeout czyszczony był przy usuwaniu komponentu.

Innym problemem z którym się zmierzyłem był kod, odpowiedzialny za listowanie repozytoriów wraz z paginacją oraz paskiem wyszukiwania był długi i mało czytelny, dlatego postanowiłem podzielić go na kilka komponentów umieszczonych w `components/userBoard/repositoriesBanner.tsx`. Był to mój pierwszy raz kiedy projektowałem komponent z pod-komponentami i dlatego nie jestem pewień, czy moje rozwiązanie tego problemu jest "właściwe". Uważam, że głównym problemem mojego rozwiązania jest, to że do przekazywania statusu na temat strony/listy komponentów/czy odbywa się ładowanie podawane jest pod-komponentom z użyciem kontekstu podawanego przez komponent główny. Nie jestem przekonany co do czytelności kodu przy takim rozwiązaniu, jednak jest to na pewno lepsze niż stworzenie jednego komponentu odpowiedzialnego za wszystko. Dodatkową zaletą jest to, że w łatwy sposób można np. przenieść paginację nad wyniki.
