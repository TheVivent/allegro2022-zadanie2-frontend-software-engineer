import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Endpoints } from "@octokit/types";

import { Octokit } from "@octokit/rest";
// import { GitHubUser } from "../types";

const octokit = new Octokit();
type GitHubUser = Endpoints["GET /users/{username}"]["response"]["data"];

export default function Page() {
  const user_id = useRouter().query.id;
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // alert(user_id);
    getUser();
  }, []);

  const getUser = async () => {
    if (typeof user_id !== "string") return;
    const data = await octokit.rest.users.getByUsername({
      username: user_id,
    });

    if (data.status === 200) {
      setUser(data.data);
      setLoading(false);
    }
    console.log(data);
  };

  return <div>{user_id}</div>;
}
