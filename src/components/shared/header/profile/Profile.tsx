import { HTMLAttributes, ReactNode, useRef, useState, useContext } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  IconButton,
  Paper,
  Popper,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';

import { SettingsContext } from '@/context/settings';
// project import
import MainCard from '@/components/layouts/MainCard';
import Transitions from '@/components/@extended/Transitions';
import ProfileTab from './ProfileTab';
import SettingTab from './SettingsTab';

// assets

import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';

// tab panel wrapper
type Props = {
  children: ReactNode,
  value: number,
  index: number
} & HTMLAttributes<HTMLDivElement>
function TabPanel({ children, value, index, ...other }: Props) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`
  };
}

const Profile = () => {
  const theme = useTheme();
  const {value:SettingValue} = useContext(SettingsContext);

  const handleLogout = async () => {
    // logout
  };

  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event:React.ChangeEvent<HTMLInputElement>, newValue:any) => {
    setValue(newValue);
  };

  const iconBackColorOpen = 'grey.300';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' }
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
          <Avatar alt="profile user" src={SettingValue.image} sx={{ width: 40, height: 40 }} />
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open ? (
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: 290,
                  minWidth: 240,
                  maxWidth: 290,
                  [theme.breakpoints.down('md')]: {
                    maxWidth: 250
                  }
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard elevation={0} border={false} cardContent={false}>
                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Avatar alt="profile user" src={SettingValue.image} sx={{ width: 40, height: 40 }} />
                          </Stack>
                        </Grid>
                        <Grid item>
                          <IconButton size="large" color="secondary" onClick={handleLogout}>
                            <LogoutOutlined />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                    {open && (
                      <>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                          <Tabs variant="fullWidth" value={value} onChange={(event:any, value:any) => null} aria-label="profile tabs">
                            <Tab
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'capitalize'
                              }}
                              icon={<UserOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                              label="Profile"
                              {...a11yProps(0)}
                            />
                          </Tabs>
                        </Box>
                        <TabPanel value={value} index={0} dir={theme.direction}>
                          <ProfileTab />
                        </TabPanel>
                      </>
                    )}
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            ) : <></>
            }
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
