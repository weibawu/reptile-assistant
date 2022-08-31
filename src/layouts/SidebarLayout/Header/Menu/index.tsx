import {
  Box,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem
} from '@mui/material';
import { useRef, useState } from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';

const ListWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        
        .MuiListItem-root {
            transition: ${theme.transitions.create(['color', 'fill'])};
            
            &.MuiListItem-indicators {
                padding: ${theme.spacing(1, 2)};
            
                .MuiListItemText-root {
                    .MuiTypography-root {
                        &:before {
                            height: 4px;
                            width: 22px;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: ${theme.general.borderRadiusLg};
                            content: "";
                            background: ${theme.colors.primary.main};
                        }
                    }
                }

                &.active,
                &:active,
                &:hover {
                
                    background: transparent;
                
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 1;
                                visibility: visible;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`
);

function HeaderMenu() {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const location = useLocation();

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <ListWrapper
        sx={{
          display: {
            xs: 'none',
            md: 'block'
          }
        }}
      >
        {/*todo list the menu*/}
        <List disablePadding component={Box} display="flex">
          <ListItem
              classes={{ root: 'MuiListItem-indicators' }}
              button
              component={NavLink}
              to={`${location.pathname.split('/')[0] + '/' + location.pathname.split('/')[1]}/overview`}
          >
            <ListItemText
                primaryTypographyProps={{ noWrap: true }}
                primary="饲养情况概览"
            />
          </ListItem>
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button
            component={NavLink}
            to={`${location.pathname.split('/')[0] + '/' + location.pathname.split('/')[1]}/management`}
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="容器管理"
            />
          </ListItem>
          {/*<ListItem*/}
          {/*  classes={{ root: 'MuiListItem-indicators' }}*/}
          {/*  button*/}
          {/*  component={NavLink}*/}
          {/*  to="/components/forms"*/}
          {/*>*/}
          {/*  <ListItemText*/}
          {/*    primaryTypographyProps={{ noWrap: true }}*/}
          {/*    primary="Forms"*/}
          {/*  />*/}
          {/*</ListItem>*/}
          {/*<ListItem*/}
          {/*  classes={{ root: 'MuiListItem-indicators' }}*/}
          {/*  button*/}
          {/*  ref={ref}*/}
          {/*  onClick={handleOpen}*/}
          {/*>*/}
          {/*  <ListItemText*/}
          {/*    primaryTypographyProps={{ noWrap: true }}*/}
          {/*    primary={*/}
          {/*      <Box display="flex" alignItems="center">*/}
          {/*        Others*/}
          {/*        <Box display="flex" alignItems="center" pl={0.3}>*/}
          {/*          <ExpandMoreTwoToneIcon fontSize="small" />*/}
          {/*        </Box>*/}
          {/*      </Box>*/}
          {/*    }*/}
          {/*  />*/}
          {/*</ListItem>*/}
        </List>
      </ListWrapper>
      {/*<Menu anchorEl={ref.current} onClose={handleClose} open={isOpen}>*/}
      {/*  <MenuItem sx={{ px: 3 }} component={NavLink} to="/overview">*/}
      {/*    Overview*/}
      {/*  </MenuItem>*/}
      {/*  <MenuItem sx={{ px: 3 }} component={NavLink} to="/components/tabs">*/}
      {/*    Tabs*/}
      {/*  </MenuItem>*/}
      {/*  <MenuItem sx={{ px: 3 }} component={NavLink} to="/components/cards">*/}
      {/*    Cards*/}
      {/*  </MenuItem>*/}
      {/*  <MenuItem sx={{ px: 3 }} component={NavLink} to="/components/modals">*/}
      {/*    Modals*/}
      {/*  </MenuItem>*/}
      {/*</Menu>*/}
    </>
  );
}

export default HeaderMenu;
