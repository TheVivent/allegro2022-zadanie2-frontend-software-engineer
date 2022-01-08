import Image from "next/image";
import { Card, Col } from "react-bootstrap";
import useViewport from "../components/useViewport";
import { CSSProperties, useRef } from "react";
import { Endpoints } from "@octokit/types";
import Link from "next/link";
import style from "../styles/usercard.module.css";
import { BsGithub, BsGeoAlt } from "react-icons/bs";

type GitHubUser =
  Endpoints["GET /search/users"]["response"]["data"]["items"][0];

export default function UserCard({ user }: { user: GitHubUser }) {
  const viewport = useViewport();

  const ReadyImage = () => (
    <div className={`text-start text-md-center p-1 ${style.scale}`}>
      <Image
        className="rounded-circle shadow-sm"
        src={user.avatar_url}
        alt={user.login + "avatar"}
        width={viewport === "xs" ? 64 : 128}
        height={viewport === "xs" ? 64 : 128}
      />
    </div>
  );

  if (viewport === "xs")
    return (
      <div>
        <ReadyImage />
      </div>
    );

  return (
    <Card>
      <Link href={`/${user.login}`} passHref>
        <a>
          <Card.Img as={ReadyImage} variant="top" />
        </a>
      </Link>
      <Card.Body>
        <Card.Title>
          {user.login}
          <a
            href={user.html_url}
            className="ms-1 align-text-top"
            target="_blank"
            rel="noreferrer"
          >
            <BsGithub />
          </a>
        </Card.Title>
        <Card.Text>
          {user.type === "User" ? "Użytkownik" : "Organizacja"}
        </Card.Text>
      </Card.Body>
    </Card>
  );

  return (
    <div
      className="bg-warning p-1 rounded-3"
      style={viewport !== "xs" ? { height: "300px" } : ({} as CSSProperties)}
    >
      <div className="d-flex flex-row flex-md-column align-content-stretch align-middle">
        <Link href={`/${user.login}`}>
          <a className="text-decoration-none link-success">
            <div>
              <Image
                className="rounded-circle border-2 align-self-center align-self-md-auto shadow-sm"
                src={user.avatar_url}
                alt={user.login + "avatar"}
                width={viewport === "xs" ? 64 : 128}
                height={viewport === "xs" ? 64 : 128}
              />
            </div>
            <div className="text-end text-md-center px-2 align-self-center align-self-md-auto flex-grow-1">
              <h5>{user.login}</h5>
            </div>
          </a>
        </Link>
        <div>
          <a href={user.html_url}>Link do GitHub</a>
        </div>
        <div>{user.id}</div>
      </div>
    </div>
  );
}
