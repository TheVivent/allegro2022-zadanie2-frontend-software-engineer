import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Endpoints } from "@octokit/types";

import { Octokit } from "@octokit/rest";
import { Container, Row, Col, Form, FloatingLabel } from "react-bootstrap";
import Image from "next/image";

const octokit = new Octokit();
type GitHubUser = Endpoints["GET /users/{username}"]["response"]["data"];
type GitHubRepo =
  Endpoints["GET /users/{username}/repos"]["response"]["data"][0];

type GitHubSorting = "created" | "updated" | "pushed" | "full_name" | undefined;

// const SORTING_OPTIONS = {
//   created: "Utworzono",
//   updated: "Zaktualizowano",
//   pushed: "Ostatnio zmieniony",
//   full_name: "Nazwa",
//   undefined: "Najnowsze",

//   //   Utworzono: "created",
//   //   "Ostatnia aktualizacja": "updated",
//   //   "Ostatnia zmiana": "pushed",
//   //   Nazwa: "full_name",
//   //   Najpopularniejsze: "undefined",
// };

export default function Page() {
  const user_id = useRouter().query.id;
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[] | null>(null);
  const [sorting, setSorting] = useState<GitHubSorting>(undefined);

  useEffect(() => {
    getUser();
  }, [user_id]);

  useEffect(() => {
    // pobranie repozytoriów zależne jest od pobrania użytkownika
    // ze względu na to, aby jak najmniej wywoływać API
    // (np jeżeli użytkownik nie istnieje)
    getRepos();
  }, [user, sorting]);

  const getUser = async () => {
    if (typeof user_id !== "string") return;
    const data = await octokit.rest.users.getByUsername({
      username: user_id,
    });

    if (data.status === 200) {
      setUser(data.data);
    }
    console.log(data);
  };

  const getRepos = async () => {
    if (user === null) return;

    alert(sorting);

    const data = await octokit.rest.repos.listForUser({
      username: user.login as string,
      sort: sorting,
      order: "asc",
    });

    if (data.status === 200) {
      let repos = data.data;
      if (sorting === undefined) {
        repos = repos.sort((a, b) => {
          const a_stars = a.stargazers_count ?? 0;
          const b_stars = b.stargazers_count ?? 0;
          return b_stars - a_stars;
        });
      }
      setRepos(repos);
    }
    console.log(data);
  };

  if (user === null) return <div>Loading...</div>;

  return (
    <Container>
      <Row className="bg-warning rounded-3 mt-3 p-1 pb-2">
        <Col xs={12} md={4} className="text-center text-md-start">
          <Image
            src={user.avatar_url as string}
            alt={user.name + "avatar"}
            width={256}
            height={256}
            className="rounded-circle shadow-sm"
          />
        </Col>
        <Col xs={12} md={8}>
          <div>
            <h1>{user.login as string}</h1>
            <h6>{user.name as string}</h6>
          </div>
          <div className="d-flex">
            <div className="flex-fill">
              Obserwujących: {user.followers as number}
            </div>
            <div className="flex-fill">
              Obserwuje: {user.following as number}
            </div>
            <div className="flex-fill">
              Repozytoriów: {user.public_repos as number}
            </div>
          </div>
        </Col>
      </Row>
      <Row className="bg-light text-dark rounded-3 mt-3 p-1 pb-2">
        {repos === null ? (
          <div>Loading...</div>
        ) : (
          <Container>
            <Row className="p-1">
              <Col xs={12}>
                <h3 className="float-start">Repozytoria</h3>
                <div className="float-end">
                  <Form>
                    <Form.Group>
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
                          <option value="created">Utworzono</option>
                          <option value="updated">Zaktualizowano</option>
                          <option value="pushed">Ostatnio zmieniony</option>
                          <option value="full_name">Nazwa</option>
                          <option value="">Najpopularniejsze</option>
                        </Form.Select>
                      </FloatingLabel>
                    </Form.Group>
                  </Form>
                </div>
              </Col>
            </Row>
            <Row xs={1}>
              {repos.map((repo) => (
                <Col key={repo.id}>{repo.name}</Col>
              ))}
            </Row>
          </Container>
        )}
      </Row>
    </Container>
  );
}
