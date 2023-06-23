// material-ui
import { Theme } from '@mui/material';
import { useMediaQuery, Container, Link, Typography, Stack } from '@mui/material';

const FooterLinks = ({matchDownSM}:{matchDownSM:boolean}) => {
  return (
    <Stack direction={matchDownSM ? 'column' : 'row'} spacing={matchDownSM ? 1 : 3} textAlign={matchDownSM ? 'center' : 'inherit'}>
      <Typography
        variant="subtitle2"
        color="secondary"
        component={Link}
        href="https://codedthemes.support-hub.io/"
        target="_blank"
        underline="hover"
      >
        Support
      </Typography>
    </Stack>
  )
}
const BasicFooter = () => {
  const matchDownSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl">
      <Stack
        direction={matchDownSM ? 'column' : 'row'}
        justifyContent={matchDownSM ? 'center' : 'space-between'}
        spacing={2}
        textAlign={matchDownSM ? 'center' : 'inherit'}
      >
        <Typography variant="subtitle2" color="secondary" component="span">
          &copy;
          <Typography component={Link} variant="subtitle2" href="#" target="_blank" underline="hover">
            Product Name
          </Typography>
        </Typography>


      </Stack>
    </Container>
  );
};

export default BasicFooter;
