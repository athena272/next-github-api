import { useCallback, useState } from 'react';
import { FaGithub, FaPlus } from 'react-icons/fa';
import { Container, Form, SubmitButton } from "./styles";
import api from '../../services/api';

type Repository = {
    name: string;
};

export default function Main() {
    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState<Repository[]>([]);

    const handleSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()

            async function submit() {
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
            }

            submit()
        },
        [newRepo, repositorios]
    )

    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setNewRepo(event.target.value)
        },
        []
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
                />

                <SubmitButton>
                    <FaPlus color="#fff" size={14} />
                </SubmitButton>
            </Form>
        </Container>
    )
}