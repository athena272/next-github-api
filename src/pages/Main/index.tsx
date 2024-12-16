import { useCallback, useEffect, useState } from 'react';
import { FaBars, FaGithub, FaPlus, FaSpinner, FaTrash } from 'react-icons/fa';
import { Container, DeleteButton, Form, List, SubmitButton } from "./styles";
import api from '../../services/api';
import { Link } from 'react-router-dom';

type Repository = {
    name: string;
};

export default function Main() {
    const [newRepo, setNewRepo] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState<boolean | null>(null)

    //Search for repositories
    useEffect(() => {
        const repositoriesStorage = localStorage.getItem('repositories');

        try {
            if (repositoriesStorage) {
                const parsedRepositories = JSON.parse(repositoriesStorage);

                if (Array.isArray(parsedRepositories)) {
                    setRepositories(parsedRepositories);
                } else {
                    localStorage.removeItem('repositories'); // Remove valores inválidos
                }
            }
        } catch (error) {
            console.error("Erro ao recuperar repositórios do localStorage:", error);
            localStorage.removeItem('repositories');
        }
    }, []);


    //Save changes
    useEffect(() => {
        if (repositories.length > 0) { // Só salva se houver algo no estado
            localStorage.setItem('repositories', JSON.stringify(repositories));
        }
    }, [repositories]);
    

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        async function submit() {
            setLoading(true)
            setAlert(null)
            try {
                const response = await api.get(`repos/${newRepo}`)

                const repositoryAlreadyExists = repositories.find(repository => repository.name === newRepo)

                if (repositoryAlreadyExists) {
                    throw new Error('Repository already exists')
                }

                const data: Repository = {
                    name: response.data.full_name,
                };

                setRepositories([...repositories, data])
                setNewRepo('')
            } catch (error) {
                setAlert(true)
                console.error("Erro ao buscar o repositório:", error)
            }
            finally {
                setLoading(false)
            }
        }

        submit()
    }, [newRepo, repositories])

    const handleDelete = useCallback((repositoryName: string) => {
        const filterRepositories = repositories.filter(repository => repository.name !== repositoryName)
        setRepositories(filterRepositories)
    }, [repositories])

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setNewRepo(event.target.value)
        setAlert(null)
    }

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus repositorios
            </h1>

            <Form onSubmit={(event) => handleSubmit(event)} $error={!!alert}>
                <input
                    type="text"
                    placeholder="Adicionar repositorios"
                    value={newRepo}
                    onChange={(event) => handleInputChange(event)}
                    required
                />

                <SubmitButton loading={loading ? 1 : 0}>
                    {
                        loading ?
                            <FaSpinner color="#FFF" size={14} />
                            :
                            <FaPlus color="#FFF" size={14} />
                    }
                </SubmitButton>
            </Form>

            <List>
                {
                    repositories.map((repository, index) => (
                        <li key={index}>
                            <span>
                                <DeleteButton onClick={() => handleDelete(repository.name)}>
                                    <FaTrash size={14} />
                                </DeleteButton>
                                {repository.name}
                            </span>
                            <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                                <FaBars size={20} />
                            </Link>
                        </li>
                    ))
                }
            </List>
        </Container>
    )
}