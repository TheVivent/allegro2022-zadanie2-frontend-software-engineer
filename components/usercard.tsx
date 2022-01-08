import Image from "next/image";
import { Col } from "react-bootstrap";
import useViewport from "../components/useViewport";
import { CSSProperties, useRef } from "react";
import { Endpoints } from "@octokit/types";
import Link from "next/link";

type GitHubUser =
  Endpoints["GET /search/users"]["response"]["data"]["items"][0];

export default function UserCard({ user }: { user: GitHubUser }) {
  const breakpoint = useViewport();

  return (
    <Col className="d-inline-block text-center p-1">
      <div
        className="bg-warning p-1 rounded-3"
        style={
          breakpoint !== "xs" ? { height: "300px" } : ({} as CSSProperties)
        }
      >
        <div className="d-flex flex-row flex-md-column align-content-stretch align-middle">
          <Link href={`/${user.login}`}>
            <a>
              <div>
                <Image
                  className="rounded-circle border-2 align-self-center align-self-md-auto shadow-sm"
                  src={user.avatar_url}
                  alt={user.login + "avatar"}
                  width={breakpoint === "xs" ? 64 : 128}
                  height={breakpoint === "xs" ? 64 : 128}
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
    </Col>
  );
}
