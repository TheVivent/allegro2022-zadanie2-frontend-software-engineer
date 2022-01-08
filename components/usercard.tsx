import Image from "next/image";
import { Card, Col } from "react-bootstrap";
import useViewport from "../components/useViewport";
import { CSSProperties, useRef } from "react";
import { Endpoints } from "@octokit/types";
import Link from "next/link";
import style from "../styles/usercard.module.css";
import { BsGithub, BsGeoAlt } from "react-icons/bs";
import { FC } from "react";

type GitHubUser =
  Endpoints["GET /search/users"]["response"]["data"]["items"][0];

export default function UserCard({ user }: { user: GitHubUser }) {
  const viewport = useViewport();
  const isMobile = viewport === "xs" || viewport === "sm";

  const ReadyImage: FC = () => (
    <div className={`text-start text-md-center p-1 ${style.scale}`}>
      <Image
        className="rounded-circle shadow-sm"
        src={user.avatar_url}
        alt={user.login + "avatar"}
        width={isMobile ? 64 : 128}
        height={isMobile ? 64 : 128}
      />
    </div>
  );

  if (isMobile) {
    return (
      <Link href={`/${user.login}`} passHref>
        <a className="link-secondary text-decoration-none">
          <div className="bg-light rounded-3 d-flex align-content-center">
            <ReadyImage />
            <div className="flex-fill align-self-center text-end me-2">
              <h5 className="">{user.login}</h5>
            </div>
          </div>
        </a>
      </Link>
    );
  }

  return (
    <Card className="bg-light h-100">
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
}
