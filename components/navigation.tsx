import { FloatingLabel, Form, Navbar, Button, Nav } from "react-bootstrap";
import Link from "next/link";
import { useCurrentTheme } from "use-theme-hook";
import { createContext, useContext, useState } from "react";
import { useRouter } from "next/router";
import { BsSearch } from "react-icons/bs";

export const SearchContext = createContext<[string, Function]>(["", () => {}]);
export const SearchProvider = ({ children }: any) => {
  const [search, setSearch] = useState("allegro");
  return (
    <SearchContext.Provider value={[search, setSearch]}>
      {children}
    </SearchContext.Provider>
  );
};

export default function Navigation() {
  const router = useRouter();
  const theme = useCurrentTheme();
  const [search, setSearch] = useContext(SearchContext);
  const [searchQuerry, setSearchQuerry] = useState(search);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(searchQuerry);
    router.push(`/`);
  };

  return (
    <header>
      <Navbar bg="primary" variant={theme} className="p-1">
        <Link href="/" passHref>
          <Navbar.Brand>GitHub Search</Navbar.Brand>
        </Link>
        <div className="ms-auto">
          <Form className="d-flex text-dark" onSubmit={handleFormSubmit}>
            <FloatingLabel label="Szukaj">
              <Form.Control
                type="search"
                name="search"
                placeholder="Szukaj"
                value={searchQuerry}
                onChange={(e) => setSearchQuerry(e.target.value)}
              />
            </FloatingLabel>
            <Button type="submit" variant="success" className="ms-1 px-4">
              <BsSearch />
            </Button>
          </Form>
        </div>
      </Navbar>
    </header>
  );
}
