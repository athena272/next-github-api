import { FaGithub, FaPlus } from 'react-icons/fa';
import { Container, Form, SubmitButton } from "./styles";

export default function Main() {
    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus repositorios
            </h1>

            <Form>
                <input type="text" placeholder="Adicionar repositorios" />

                <SubmitButton>
                    <FaPlus color="#fff" size={14} />
                </SubmitButton>
            </Form>
        </Container>
    )
}