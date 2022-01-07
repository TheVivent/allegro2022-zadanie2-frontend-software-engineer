import { Endpoints } from "@octokit/types";
import { BsFillStarFill } from "react-icons/bs";
import style from "../styles/repocard.module.css";

type GitHubRepo =
  Endpoints["GET /search/repositories"]["response"]["data"]["items"][0];

export default function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className={`h-100 text-decoration-none ${style.scale}`}
    >
      <div className="h-100 rounded-4 p-2 shadow-sm d-flex align-content-center">
        <div className="w-75 text-wrap text-break">
          <h4>{repo.name}</h4>
        </div>
        <div className="w-25 d-flex">
          <div className="flex-fill text-warning">
            <BsFillStarFill size={24} />
          </div>
          <div className="flex-fill text-end">{repo.stargazers_count}</div>
        </div>
      </div>
    </a>
  );
}
