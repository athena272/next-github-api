import { useState, useEffect } from "react"
import { RouteComponentProps } from "react-router-dom";
import { Container, Owner, Loading, BackButton } from "./styles"
import api from "../../services/api"
import { FaArrowLeft } from "react-icons/fa";

// Definindo a estrutura dos parâmetros da rota
interface MatchParams {
    repository: string;
}

// Definindo a estrutura do repositório e das issues
interface RepositoryData {
    name: string;
    description: string;
    html_url: string;
    owner: {
        avatar_url: string,
        login: string
    }
}

interface IssueData {
    id: number;
    title: string;
    user: {
        login: string;
    };
    html_url: string;
}

// Tipando as props do componente
type RepositoryProps = RouteComponentProps<MatchParams>;

export default function Repository({ match }: RepositoryProps) {
    const [repository, setRepository] = useState<RepositoryData | null>(null)
    const [issues, setIssues] = useState<IssueData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const repoName = decodeURIComponent(match.params.repository);

            try {
                const [repositoryData, issuesData] = await Promise.all([
                    api.get<RepositoryData>(`/repos/${repoName}`),
                    api.get<IssueData[]>(`/repos/${repoName}/issues`, {
                        params: {
                            state: 'open',
                            per_page: 5,
                        },
                    }),
                ]);

                setRepository(repositoryData.data);
                setIssues(issuesData.data);
            } catch (error) {
                console.error("Erro ao carregar os dados:", error);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [match.params.repository])


    return (
        loading ?
            (
                <Loading>
                    <h1>Loading...</h1>
                </Loading>
            )
            :
            (
                <Container>
                    <BackButton to={'/'}>
                        <FaArrowLeft color="#000" size={30} />
                    </BackButton>
                    <Owner>
                        <img
                            src={repository?.owner.avatar_url}
                            alt={repository?.owner.login}
                        />
                        <h1>{repository?.name}</h1>
                        <p>{repository?.description}</p>
                    </Owner>
                </Container>
            )
    )

}