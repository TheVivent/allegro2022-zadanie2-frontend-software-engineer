import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { Octokit } from "@octokit/rest";
import { SearchContext } from "../components/navigation";
// import type { GitHubUser } from "../types";
import UserCard from "../components/usercard";
import { Container, Row } from "react-bootstrap";
import { Endpoints } from "@octokit/types";
import LoadingSpinner from "../components/loader";

const octokit = new Octokit();
type GitHubUser =
  Endpoints["GET /search/users"]["response"]["data"]["items"][0];

const Home: NextPage = () => {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [searchQuerry, setSearchQuerry] = useContext(SearchContext);
  const [page, setPage] = useState(1);
  const [loadingTimeout, setLoadingTimeout] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      clearTimeout(loadingTimeout);
    };
  });

  useEffect(() => {
    getUsers(searchQuerry);
  }, [searchQuerry, page]);

  const getUsers = async (username: string) => {
    setIsLoading(true);
    clearTimeout(loadingTimeout);

    let res;

    try {
      res = await octokit.rest.search.users({
        q: `${username} in:login`,
        per_page: 8,
        page: page,
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
    }
    setIsLoading(false);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <Head>
        <title>Spring Tech zadanie 2</title>
        <meta
          name="description"
          content="Aplikacja zbudowana na potrzeby rekrutacji Spring Tech E-xperience"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className="mt-2">
        <Row xs={1} md={4}>
          {users?.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
