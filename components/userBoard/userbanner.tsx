import { Endpoints } from "@octokit/types";
import useViewport from "../useViewport";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import { BsGithub, BsLink45Deg } from "react-icons/bs";

type GitHubUser = Endpoints["GET /users/{username}"]["response"]["data"];

export default function UserBanner({ user }: { user: GitHubUser }) {
  const viewport = useViewport();
  const isMobile = viewport === "xs" || viewport === "sm";

  return (
    <Container fluid className="m-0 p-0">
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
          <Container fluid>
            <Row className="mt-1 text-center">
              <Col xs={12} md={4} className={isMobile ? "" : "border-end"}>
                Obserwujących: {user.followers as number}
              </Col>
              <Col xs={12} md={4} className={isMobile ? "" : "border-end"}>
                Obserwowanych: {user.following as number}
              </Col>
              <Col xs={12} md={4}>
                Repozytoriów: {user.public_repos as number}
              </Col>
            </Row>
            <Row
              xs={user.blog === "" ? 1 : 2}
              className="text-center text-decoration-none mt-5"
            >
              <Col>
                <a
                  href={user.html_url as string}
                  rel="noreferrer"
                  target="_blank"
                  className="link-light"
                >
                  <BsGithub size={64} />
                  <div></div>
                  <span className="d-none d-md-inline">
                    {user.html_url as string}
                  </span>
                </a>
              </Col>
              {user.blog !== "" && (
                <Col>
                  <a
                    href={user.blog as string}
                    rel="noreferrer"
                    target="_blank"
                    className="link-light"
                  >
                    <BsLink45Deg size={64} />
                    <div></div>
                    <span className="d-none d-md-inline">
                      {user.blog as string}
                    </span>
                  </a>
                </Col>
              )}
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
