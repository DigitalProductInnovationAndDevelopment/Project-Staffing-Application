import {Box, CircularProgress, Container, Typography} from '@mui/material';

const FullScreenLoader = ({label}) => {
    return (
        <Container sx={{height: '95vh'}}>
            <Box
                display='flex'
                alignItems='center'
                justifyContent='center'
                sx={{height: '100%'}}
            >
                <CircularProgress/>
                {label !== '' && (
                    <Typography fontWeight={"300"} variant={"h5"}>
                        {label}
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default FullScreenLoader;