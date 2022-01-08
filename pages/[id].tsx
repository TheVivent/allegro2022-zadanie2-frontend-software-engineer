import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Endpoints } from "@octokit/types";
import { Octokit } from "@octokit/rest";
import {
  Container,
  Row,
  Col,
  Form,
  FloatingLabel,
  Pagination,
} from "react-bootstrap";
import RepoCard from "../components/repocard";
import LoadingSpinner from "../components/loader";
import UserBanner from "../components/userBoard/userbanner";
import RepoBanner from "../components/userBoard/repositoriesBanner";
import Head from "next/head";

const octokit = new Octokit();
type GitHubUser = Endpoints["GET /users/{username}"]["response"]["data"];
type GitHubRepo =
  Endpoints["GET /search/repositories"]["response"]["data"]["items"][0];

type GitHubSorting =
  | "updated"
  | "stars"
  | "forks"
  | "help-wanted-issues"
  | undefined;

export default function Page() {
  const user_id = useRouter().query.id;
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  const [userTimeout, setUserTimeout] = useState<any>(null);

  useEffect(() => {
    return () => {
      clearTimeout(userTimeout);
    };
  });

  useEffect(() => {
    getUser();
  }, [user_id]);

  const getUser = async () => {
    clearTimeout(userTimeout);
    setUserLoading(true);
    if (typeof user_id !== "string") return;
    let data;

    try {
      data = await octokit.rest.users.getByUsername({
        username: user_id,
      });
    } catch (e) {
      // w przypadku błędu (ograniczenie ilości zapytań)
      // spróbuj ponownie za 3 sekundy
      setUserTimeout(
        setTimeout(() => {
          getUser();
        }, 3000)
      );
      return;
    }

    if (data.status === 200) {
      setUser(data.data);
    }
    setUserLoading(false);
  };

  if (userLoading || user === null) return <LoadingSpinner />;

  // wyświetlanie Baneru użytkownika znajduje się w
  // components/page/home/id/userbanner.tsx
  // aby ograniczyć ilość kodu w jednym pliku

  // repozytoria natomiast obsługiwane są w
  // components/userBoard/repositoriesBanner.tsx

  return (
    <Container>
      <Head>
        <title>repozytoria - {user_id}</title>
        <meta
          name="description"
          content="Aplikacja zbudowana na potrzeby rekrutacji Spring Tech E-xperience"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Row>
        <Col xs={12}>
          <UserBanner user={user} />
        </Col>
      </Row>

      <Row className="position-relative bg-light text-dark rounded-3 mt-3 p-1 pb-2">
        <RepoBanner>
          <Col xs={12}>
            <RepoBanner.SearchBar
              userLogin={user_id ? (user_id as string) : ""}
            />
          </Col>
          <Col xs={12} className="mt-2">
            <RepoBanner.RepoList />
          </Col>
          <Col xs={12} className="mt-2">
            <RepoBanner.Pages />
          </Col>
        </RepoBanner>
      </Row>
    </Container>
  );
}
