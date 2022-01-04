import type { GitHubUser } from "../types";
import Image from "next/image";
import { Col } from "react-bootstrap";

interface Props {
  user: GitHubUser;
}

export default function UserCard({ user }: Props) {
  return (
    <Col className="d-inline-block text-center p-1">
      <div className="bg-info p-1">
        <Image
          src={user.avatar_url}
          alt={user.login + "avatar"}
          width={64}
          height={64}
          className="rounded-circle"
        />
        <div className="">
          <p>{user.login}</p>
        </div>
      </div>
    </Col>
  );
}
