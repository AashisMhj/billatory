import {  RefAttributes, forwardRef, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import {SideBarContext} from '@/context/sideBar';
import { NavItemType } from '@/types';

interface ListItemProps{
  component: React.ForwardRefExoticComponent<RefAttributes<HTMLAnchorElement>> | string,
  href?: string,
  target?: string
}
// ==============================|| NAVIGATION - LIST ITEM ||============================== //
interface Props{
    item:NavItemType,
    level:number
}



const NavItem = ({ item, level }:Props) => {
  
  const theme = useTheme();
  const { pathname } = useLocation();
  const {openDrawer, is_open, openItems, changeOpenItems} = useContext(SideBarContext);
//   const { drawerOpen, openItem } = useSelector((state) => state.menu);

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  // TODO removed ref from bellow
  let listItemProps:ListItemProps = { component: forwardRef((props, ref) => <Link {...props} to={item.url} target={itemTarget} />) };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const itemHandler = (id:string) => {
    // TODO
    // dispatch(activeItem({ openItem: [id] }));
  };

  
  const itemIcon = item.icon ? item.icon(is_open) : <></>;

  const isSelected = openItems.findIndex((id) => id === item.id) > -1;
  // active menu item on page load
  useEffect(() => {
    if (pathname.includes(item.url)) {
      // TODO
      // dispatch(activeItem({ openItems: [item.id] }));
    }
    // eslint-disable-next-line
  }, [pathname]);

  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      onClick={() => itemHandler(item.id)}
      selected={isSelected}
      sx={{
        zIndex: 1201,
        pl: is_open ? `${level * 28}px` : 1.5,
        py: !is_open && level === 1 ? 1.25 : 1,
        ...(is_open && {
          '&:hover': {
            bgcolor: 'primary.lighter'
          },
          '&.Mui-selected': {
            bgcolor: 'primary.lighter',
            borderRight: `2px solid ${theme.palette.primary.main}`,
            color: iconSelectedColor,
            '&:hover': {
              color: iconSelectedColor,
              bgcolor: 'primary.lighter'
            }
          }
        }),
        ...(!is_open && {
          '&:hover': {
            bgcolor: 'transparent'
          },
          '&.Mui-selected': {
            '&:hover': {
              bgcolor: 'transparent'
            },
            bgcolor: 'transparent'
          }
        })
      }}
    >
      {itemIcon && (
        <ListItemIcon
          sx={{
            minWidth: 28,
            color: isSelected ? iconSelectedColor : textColor,
            ...(!is_open && {
              borderRadius: 1.5,
              width: 36,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                bgcolor: 'secondary.lighter'
              }
            }),
            ...(!is_open &&
              isSelected && {
                bgcolor: 'primary.lighter',
                '&:hover': {
                  bgcolor: 'primary.lighter'
                }
              })
          }}
        >
          {itemIcon}
        </ListItemIcon>
      )}
      {(is_open || (!is_open && level !== 1)) && (
        <ListItemText
          primary={
            <Typography variant="h6" sx={{ 
              // color: isSelected ? iconSelectedColor : textColor 
              color: 'primary'
              }}>
              {item.title}
            </Typography>
          }
        />
      )}
      {(is_open || (!is_open && level !== 1)) && item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};


export default NavItem;
