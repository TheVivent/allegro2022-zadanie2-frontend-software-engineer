import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  FC,
} from "react";
import { Endpoints } from "@octokit/types";
import LoadingSpinner from "../loader";
import {
  Form,
  FloatingLabel,
  Container,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import { Octokit } from "@octokit/rest";
import RepoCard from "../repocard";
import SmartPaginator from "../smartpaginator";

type GitHubRepo =
  Endpoints["GET /search/repositories"]["response"]["data"]["items"][0];

const octokit = new Octokit();

interface PageInfo {
  currentPage: number;
  pages: number;
}

interface RepoBannerType extends FC {
  SearchBar: FC<{ userLogin: string }>;
  RepoList: FC;
  Pages: FC;
}

const RepoListContext = createContext<[GitHubRepo[], Function]>([[], () => {}]);
const RepoPageContext = createContext<[PageInfo, Function]>([
  { currentPage: 1, pages: 1 },
  () => {},
]);
const ReposLoadingContext = createContext<[boolean, Function]>([
  false,
  () => {},
]);

const RepoBanner: RepoBannerType = ({ children }) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [page, setPage] = useState({ currentPage: 1, pages: 1 });
  const [reposLoading, setReposLoading] = useState(false);

  return (
    <ReposLoadingContext.Provider value={[reposLoading, setReposLoading]}>
      <RepoPageContext.Provider value={[page, setPage]}>
        <RepoListContext.Provider value={[repos, setRepos]}>
          {reposLoading && <LoadingSpinner />}
          {children}
        </RepoListContext.Provider>
      </RepoPageContext.Provider>
    </ReposLoadingContext.Provider>
  );
};

type GitHubSorting =
  | "updated"
  | "stars"
  | "forks"
  | "help-wanted-issues"
  | undefined;
const SearchBar = ({ userLogin }: { userLogin: string }) => {
  const [repos, setRepos] = useContext(RepoListContext);
  const [repoSearch, setRepoSearch] = useState("");
  const [sorting, setSorting] = useState<GitHubSorting>("stars");
  const [page, setPage] = useContext(RepoPageContext);
  const perPage = 20;
  const [reposLoading, setReposLoading] = useContext(ReposLoadingContext);
  const [loadingTimeout, setLoadingTimeout] = useState<any>(null);

  useEffect(() => {
    return () => {
      clearTimeout(loadingTimeout);
    };
  });

  useEffect(() => {
    getRepos();
  }, [sorting, page.currentPage]);

  const getRepos = async () => {
    setReposLoading(true);
    clearTimeout(loadingTimeout);
    if (userLogin === null) return;

    let data;
    try {
      data = await octokit.rest.search.repos({
        q: `user:${userLogin} fork:true ${repoSearch} in:name`,
        sort: sorting as GitHubSorting,
        order: "desc",
        per_page: perPage,
        page: page.currentPage,
      });
    } catch (e: any) {
      if (e?.status === 422) {
        setRepos([]);
        setReposLoading(false);
        return;
      }
      // w przypadku błędu (ograniczenie ilości zapytań)
      // spróbuj ponownie za 3 sekundy
      setLoadingTimeout(
        setTimeout(() => {
          getRepos();
        }, 10000)
      );
      return;
    }

    if (data.status === 200) {
      setRepos(data.data.items);
      const pages = Math.ceil(data.data.total_count / perPage);
      setPage((prevPage: PageInfo) => ({
        ...prevPage,
        pages: Math.ceil(pages),
      }));
    }

    console.log(data);

    setReposLoading(false);
  };

  const handleRepoForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getRepos();
  };

  return (
    <div>
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
                setSorting(val === "" ? undefined : (val as GitHubSorting));
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
    </div>
  );
};
RepoBanner.SearchBar = SearchBar;

const RepoList = () => {
  const [repos, setRepos] = useContext(RepoListContext);

  return (
    <Container className="m-0">
      <Row className="d-flex flex-wrap align-items-stretch">
        {repos?.map((repo) => (
          <Col key={repo.id} xs={12} md={3} className="d-flex flex-column">
            <RepoCard repo={repo} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
RepoBanner.RepoList = RepoList;

const Pages = () => {
  const [page, setPage] = useContext(RepoPageContext);

  const handlePageChange = (x: number) => {
    setPage((prevPage: PageInfo) => ({
      ...prevPage,
      currentPage: x,
    }));
  };

  return (
    <SmartPaginator
      xs={5}
      md={20}
      currentPage={page.currentPage}
      totalPages={page.pages}
      onPageChange={handlePageChange}
    />
  );
};
RepoBanner.Pages = Pages;

export default RepoBanner;
