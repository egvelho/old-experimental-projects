import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useContext } from "@app/context";
import { CreateAccountProps } from "./index";

export default function EndStep({ step, setStep }: CreateAccountProps) {
    const [, setContext] = useContext();

    return (
        <>
            <Box marginBottom={3} textAlign="center">
                <Typography variant="h6">
                    Parabéns! Sua conta foi criada com sucesso.
                </Typography>
                <Box marginY={2}>
                    <CheckCircleOutlineIcon
                        style={{ width: "6em", height: "6em" }}
                        color="primary"
                    />
                </Box>
                <Typography>
                    Obrigado por finalizar o seu cadastro. Sinta-se à vontade
                    para explorar os nossos serviços, estamos prontos para
                    deixar o seu trabalho 💯!
                </Typography>
            </Box>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => setContext({ accountView: undefined })}
            >
                Continuar
            </Button>
        </>
    );
}
