import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useContext } from "@app/context";
import { RecoveryAccountProps } from "./index";

export default function EndStep({ formState }: RecoveryAccountProps) {
    const [_, setContext] = useContext();

    return (
        <>
            <Box marginBottom={3} textAlign="center">
                <Typography variant="h6">
                    Você recuperou a sua conta!
                </Typography>
                <Box marginY={2}>
                    <CheckCircleOutlineIcon
                        style={{ width: "6em", height: "6em" }}
                        color="primary"
                    />
                </Box>
                <Typography>
                    Foi trabalhoso mas valeu a pena! Não esqueça de que agora em
                    diante você precisa utilizar o número{" "}
                    <strong>{formState.phoneNumber}</strong> para entrar na sua
                    conta. Bem de boa! 😎
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
