import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { Octokit } from "@octokit/rest";
import { SearchContext } from "../components/navigation";
import UserCard from "../components/usercard";
import { Container, Row, Col, Pagination } from "react-bootstrap";
import { Endpoints } from "@octokit/types";
import LoadingSpinner from "../components/loader";
import SmartPaginator from "../components/smartpaginator";

const octokit = new Octokit();
type GitHubUser =
  Endpoints["GET /search/users"]["response"]["data"]["items"][0];

interface PageInfo {
  currentPage: number;
  pages: number;
}

const Home: NextPage = () => {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [searchQuerry, setSearchQuerry] = useContext(SearchContext);
  const [lastUsername, setLastUsername] = useState<string>("");
  const [loadingTimeout, setLoadingTimeout] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<PageInfo>({
    currentPage: 1,
    pages: 1,
  });
  const perPage = 12;

  useEffect(() => {
    return () => {
      clearTimeout(loadingTimeout);
    };
  }, []);

  useEffect(() => {
    getUsers(searchQuerry);
  }, [searchQuerry, page.currentPage]);

  const getUsers = async (username: string) => {
    setIsLoading(true);
    clearTimeout(loadingTimeout);

    let res;

    try {
      res = await octokit.rest.search.users({
        q: `${username} in:login`,
        per_page: perPage,
        page: page.currentPage,
      });
    } catch (e) {
      setLoadingTimeout(
        setTimeout(() => {
          getUsers(username);
        }, 3000)
      );
      return;
    }

    if (res.status === 200) {
      setUsers(res.data.items as GitHubUser[]);
      const pages = Math.min(
        Math.ceil(res.data.total_count / perPage),
        Math.ceil(1000 / perPage)
      );

      setPage((prevPage) => ({
        currentPage: username === lastUsername ? prevPage.currentPage : 1,
        pages: pages,
      }));
    }

    setLastUsername(username);
    setIsLoading(false);
  };

  const handlePageChange = (page: number) => {
    setPage((prevPage) => ({
      ...prevPage,
      currentPage: page,
    }));
  };

  return (
    <Container className="mt-2">
      {isLoading && <LoadingSpinner />}
      <Head>
        <title>Spring Tech zadanie 2</title>
        <meta
          name="description"
          content="Aplikacja zbudowana na potrzeby rekrutacji Spring Tech E-xperience"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Row xs={1} md={4}>
        {users?.map((user) => (
          <Col key={user.id} className="mt-2">
            <UserCard user={user} />
          </Col>
        ))}
      </Row>
      <Row>
        <Col className="py-2">
          <SmartPaginator
            xs={5}
            md={15}
            currentPage={page.currentPage}
            totalPages={page.pages}
            onPageChange={handlePageChange}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
