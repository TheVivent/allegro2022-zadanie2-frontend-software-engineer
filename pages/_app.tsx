import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { Container } from "react-bootstrap";
import { useCurrentTheme } from "use-theme-hook";
import { useEffect } from "react";
import Navigation, { SearchProvider } from "../components/navigation";

function MyApp({ Component, pageProps }: AppProps) {
  const theme = useCurrentTheme();

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  return (
    <SearchProvider>
      <Container fluid className="m-0 p-0">
        <Navigation />
        <Component {...pageProps} />
      </Container>
    </SearchProvider>
  );
  // return <Component {...pageProps} />
}

export default MyApp;
