import { useContext } from 'react';
// material-ui
import { Box, List, Typography } from '@mui/material';
import { SideBarContext } from '@/context/sideBar';
// project import
import NavItem from './NavItem';
import { NavGroupType } from '@/types';

// ==============================|| NAVIGATION - LIST GROUP ||============================== //
interface Props {
  item: NavGroupType
}
const NavGroup = ({ item }: Props) => {

  const { is_open } = useContext(SideBarContext);

  const navCollapse = item.children?.map((menuItem) => {
    return  <NavItem key={menuItem.id} item={menuItem} level={menuItem.level || 1} />;
  });

  return (
    <List
      subheader={
        item.title &&
        is_open && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              {item.title}
            </Typography>
            {/* only available in paid version */}
          </Box>
        )
      }
      sx={{ mb: is_open ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
};

export default NavGroup;
