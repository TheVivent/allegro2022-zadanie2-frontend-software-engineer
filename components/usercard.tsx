import type { GitHubUser } from "../types";
import Image from "next/image";
import { Col } from "react-bootstrap";
import useViewport from "../components/useViewport";
import { CSSProperties, useRef } from "react";
interface Props {
  user: GitHubUser;
}

export default function UserCard({ user }: Props) {
  const breakpoint = useViewport();

  return (
    <Col className="d-inline-block text-center p-1">
      <div className="bg-info p-1 rounded-3">
        <div className="d-flex flex-row flex-md-column align-content-stretch align-middle">
          <div
            style={
              breakpoint !== "xs" ? { height: "300px" } : ({} as CSSProperties)
            }
          >
            <Image
              className="rounded-circle border border-dark border-2 align-self-center align-self-md-auto"
              src={user.avatar_url}
              alt={user.login + "avatar"}
              width={breakpoint === "xs" ? 64 : 128}
              height={breakpoint === "xs" ? 64 : 128}
            />
          </div>
          <div className="text-end text-md-center px-2 align-self-center align-self-md-auto flex-grow-1">
            <p>{user.login}</p>
          </div>
          <div>
            <a href={user.html_url}>Link do GitHub</a>
          </div>
          <div>{user.id}</div>
        </div>
      </div>
    </Col>
  );
}
