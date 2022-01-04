import { FloatingLabel, Form, Navbar, Button, Nav } from "react-bootstrap";
import Link from "next/link";
import { useCurrentTheme } from "use-theme-hook";
import { createContext, useContext, useState } from "react";

export const SearchContext = createContext<[any, any]>(["", () => {}]);
export const SearchProvider = ({ children }: any) => {
  const [search, setSearch] = useState("allegro");
  return (
    <SearchContext.Provider value={[search, setSearch]}>
      {children}
    </SearchContext.Provider>
  );
};

export default function Navigation() {
  const theme = useCurrentTheme();
  const [search, setSearch] = useContext(SearchContext);
  const [searchQuerry, setSearchQuerry] = useState(search);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    setSearch(e.target.elements.search.value);
  };

  return (
    <header>
      <Navbar bg="primary" variant={theme} className="p-1">
        <Link href="/" passHref>
          <Navbar.Brand>GitHub Search</Navbar.Brand>
        </Link>
        <div className="ms-auto">
          <Form className="d-flex text-dark" onSubmit={handleFormSubmit}>
            <FloatingLabel label="Szukaj użytkowników">
              <Form.Control
                type="search"
                name="search"
                placeholder="Szukaj użytkowników"
                value={searchQuerry}
                onChange={(e) => setSearchQuerry(e.target.value)}
              />
            </FloatingLabel>
            <Button type="submit" variant="success">
              Szukaj
            </Button>
          </Form>
        </div>
      </Navbar>
    </header>
  );
}
