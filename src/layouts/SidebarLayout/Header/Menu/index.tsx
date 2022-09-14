import {
  Box,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem
} from '@mui/material';
import React, { useRef, useState } from 'react';
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
  // const ref = useRef<any>(null);
  const location = useLocation();

  const routerListMap = {
    'reptile-feeding-box': [
      { to: '/reptile-feeding-box/overview', 'title': '饲养情况概览' },
      { to: '/reptile-feeding-box/management', 'title': '容器管理' },
    ],
    'reptile': [
      { to: '/reptile/overview', 'title': '爬宠饲养日志' },
      { to: '/reptile/management', 'title': '爬宠管理' },
    ],
  };

  return (
    <>
      <ListWrapper
        sx={{
          display: {
            md: 'block'
          }
        }}
      >
{/*        todo list the menu
        <List disablePadding component={Box} display="flex">
          {
            routerListMap[location.pathname.split('/')[1]]?.map((router) =>
              <ListItem
                classes={{ root: 'MuiListItem-indicators' }}
                button
                component={NavLink}
                to={router.to}
              >
                <ListItemText
                  primaryTypographyProps={{ noWrap: true }}
                  primary={router.title}
                />
              </ListItem>
            )
          }
        </List>*/}
      </ListWrapper>
    </>
  );
}

export default HeaderMenu;
