import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { Octokit } from "@octokit/rest";
import { SearchContext } from "../components/navigation";
// import type { GitHubUser } from "../types";
import UserCard from "../components/usercard";
import { Container, Row } from "react-bootstrap";
import { Endpoints } from "@octokit/types";

const octokit = new Octokit();
type GitHubUser =
  Endpoints["GET /search/users"]["response"]["data"]["items"][0];

const Home: NextPage = () => {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [searchQuerry, setSearchQuerry] = useContext(SearchContext);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getUsers(searchQuerry);
  }, []);

  useEffect(() => {
    getUsers(searchQuerry);
  }, [searchQuerry, page]);

  const getUsers = async (username: string) => {
    const res = await octokit.rest.search.users({
      q: `${username} in:login`,
      per_page: 8,
      page: page,
    });

    if (res.status === 200) {
      setUsers(res.data.items as GitHubUser[]);
      console.log(res.data.items);
    }
  };

  return (
    <div>
      <Head>
        <title>Allegro</title>
        <meta name="description" content="Search" />
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
