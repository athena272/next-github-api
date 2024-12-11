import { FaGithub, FaPlus } from 'react-icons/fa';
import { Container, Form, SubmitButton } from "./styles";

export default function Main() {
    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus Repositorios
            </h1>
        </Container>
    )
}