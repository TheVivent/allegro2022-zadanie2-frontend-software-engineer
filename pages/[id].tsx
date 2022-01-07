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
import UserBanner from "../components/page/home/id/userbanner";

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

  const [repoSearch, setRepoSearch] = useState("");
  const [repos, setRepos] = useState<GitHubRepo[] | null>(null);
  const [reposLoading, setReposLoading] = useState(true);
  const [sorting, setSorting] = useState<GitHubSorting>("stars");
  const perPage = 20;
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [timer, setTimer] = useState<any>(null);

  useEffect(() => {
    getUser();
  }, [user_id]);

  useEffect(() => {
    // pobranie repozytoriów zależne jest od pobrania użytkownika
    // ze względu na to, aby jak najmniej wywoływać API
    // (np jeżeli użytkownik nie istnieje)
    getRepos();
  }, [user, sorting, page]);

  const getUser = async () => {
    clearTimeout(timer);
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
      setTimer(
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

  const getRepos = async () => {
    setReposLoading(true);
    clearTimeout(timer);
    if (user === null) return;

    let data;
    try {
      data = await octokit.rest.search.repos({
        q: `user:${user.login} ${repoSearch} in:name`,
        sort: sorting as GitHubSorting,
        order: "desc",
        per_page: perPage,
        page: page,
      });
    } catch (e) {
      // w przypadku błędu (ograniczenie ilości zapytań)
      // spróbuj ponownie za 3 sekundy
      setTimer(
        setTimeout(() => {
          getRepos();
        }, 3000)
      );
      return;
    }

    if (data.status === 200) {
      setRepos(data.data.items);
      setPages(Math.ceil(data.data.total_count / perPage));
    }

    setReposLoading(false);
  };

  const handleRepoForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getRepos();
  };

  if (userLoading || user === null) return <LoadingSpinner />;

  // wyświetlanie Baneru użytkownika znajduje się w
  // components/page/home/id/userbanner.tsx
  // aby ograniczyć ilość kodu w jednym pliku

  // nie wykonałem tego dla repozytoriów,
  // ze względu na większą ilość logiki która
  // jest potrzebna do ich obsługi

  return (
    <Container>
      <UserBanner user={user} />
      <Row className="bg-light text-dark rounded-3 mt-3 p-1 pb-2">
        <Container className="position-relative">
          {reposLoading ? <LoadingSpinner /> : null}
          <Row className="p-1">
            <Col xs={12}>
              <h3 className="float-start">Repozytoria</h3>
              <div className="float-end">
                <Form className="d-flex" onSubmit={handleRepoForm}>
                  <FloatingLabel label="Szukaj">
                    <Form.Control
                      type="search"
                      name="search"
                      placeholder="Szukaj"
                      value={repoSearch}
                      onChange={(e) => setRepoSearch(e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel label="Sortuj według">
                    <Form.Select
                      size="lg"
                      value={sorting}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSorting(
                          val === "" ? undefined : (val as GitHubSorting)
                        );
                      }}
                    >
                      <option value="">Najlepsze dopasowanie</option>
                      <option value="stars">Gwiazdki</option>
                      <option value="updated">Ostatnia aktualizacja</option>
                      {/* <option value="forks">Najlepiej oceniane</option>     */}
                    </Form.Select>
                  </FloatingLabel>
                </Form>
              </div>
            </Col>
          </Row>
          <Row className="d-flex flex-wrap align-items-stretch ">
            {repos?.map((repo) => (
              <Col key={repo.id} xs={12} md={3} className="d-flex flex-column">
                <RepoCard repo={repo} />
              </Col>
            ))}
          </Row>
          <Row>
            <Col xs={12} className="">
              <Pagination className="my-2">
                <Pagination.Prev
                  className="ms-auto"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                />

                {Array.from(Array(pages), (x, i) => (
                  <Pagination.Item
                    onClick={() => setPage(i + 1)}
                    active={page === i + 1}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}

                <Pagination.Next
                  className="me-auto"
                  disabled={page === pages}
                  onClick={() => setPage(page + 1)}
                />
              </Pagination>
            </Col>
          </Row>
        </Container>
        {/* )} */}
      </Row>
    </Container>
  );
}
