import { useContext } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase, SxProps } from '@mui/material';

import { SideBarContext } from '@/context/sideBar';
// project import
import Logo from './Logo';
import config from '@/config';

// ==============================|| MAIN LOGO ||============================== //
interface Props{
  sx?: SxProps,
  to: string
}
const LogoSection = ({ sx, to }:Props) => {
  const {openItems, changeOpenItems} = useContext(SideBarContext)
  return (
    <ButtonBase
      disableRipple
      component={Link}
      // TODO
      // onClick={() => dispatch(activeItem({ openItem: [defaultId] }))}
      to={!to ? config.defaultPath : to}
      sx={sx}
    >
      <Logo />
    </ButtonBase>
  );
};


export default LogoSection;
