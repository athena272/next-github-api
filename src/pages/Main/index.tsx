import { useCallback, useEffect, useState } from 'react';
import { FaBars, FaGithub, FaPlus, FaSpinner, FaTrash } from 'react-icons/fa';
import { Container, DeleteButton, Form, List, SubmitButton } from "./styles";
import api from '../../services/api';

type Repository = {
    name: string;
};

export default function Main() {
    const [newRepo, setNewRepo] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(null)

    //Search for repositories
    useEffect(() => {
        const repositoriesStorage = localStorage.getItem('repositories')

        if (repositoriesStorage) {
            setRepositories(JSON.parse(repositoriesStorage))
        }
    }, [])

    //Save changes
    useEffect(() => {
        localStorage.setItem('repositories', JSON.stringify(repositories))
    }, [repositories])

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

            <Form onSubmit={(event) => handleSubmit(event)} error={alert}>
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
                    repositories.map((repositorio, index) => (
                        <li key={index}>
                            <span>
                                <DeleteButton onClick={() => handleDelete(repositorio.name)}>
                                    <FaTrash size={14} />
                                </DeleteButton>
                                {repositorio.name}
                            </span>
                            <a href=''>
                                <FaBars size={20} />
                            </a>
                        </li>
                    ))
                }
            </List>
        </Container>
    )
}