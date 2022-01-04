import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Octokit } from "@octokit/rest";
import { SearchContext } from "../components/navigation";
import type { GitHubUser } from "../types";
import UserCard from "../components/usercard";
import { Container, Row } from "react-bootstrap";

const octokit = new Octokit();

const Home: NextPage = () => {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [searchQuerry, setSearchQuerry] = useContext(SearchContext);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getUsers(searchQuerry);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getUsers(searchQuerry);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [searchQuerry, page]);

  const getUsers = async (username: string) => {
    const res = await octokit.rest.search.users({
      q: `type:user ${username} in:login`,
      per_page: 10,
      page: page,
    });

    if (res.status === 200) {
      setUsers(res.data.items as GitHubUser[]);
    }
  };

  return (
    <div className={styles.container}>
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
