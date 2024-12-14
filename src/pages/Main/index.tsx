import { useCallback, useState } from 'react';
import { FaBars, FaGithub, FaPlus, FaSpinner, FaTrash } from 'react-icons/fa';
import { Container, DeleteButton, Form, List, SubmitButton } from "./styles";
import api from '../../services/api';

type Repository = {
    name: string;
};

export default function Main() {
    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState<Repository[]>([]);
    console.log("🚀 ~ Main ~ repositorios:", repositorios)
    const [loading, setLoading] = useState(false)

    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        async function submit() {
            setLoading(true)

            try {
                const response = await api.get(`repos/${newRepo}`)

                const data: Repository = {
                    name: response.data.full_name,
                };

                setRepositorios([...repositorios, data])
                setNewRepo('')
            } catch (error) {
                console.error("Erro ao buscar o repositório:", error)
            }
            finally {
                setLoading(false)
            }
        }

        submit()
    }, [newRepo, repositorios]
    )

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setNewRepo(event.target.value)
    }, []
    );

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus repositorios
            </h1>

            <Form onSubmit={(event) => handleSubmit(event)}>
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
                    repositorios.map((repositorio, index) => (
                        <li key={index}>
                            <span>
                                <DeleteButton>
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