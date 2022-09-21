import React from 'react';
import {
  Box,
  List,
  ListItemText,
  ListItem
} from '@mui/material';
import {NavLink, useLocation} from 'react-router-dom';
import { styled } from '@mui/material/styles';

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

type ParentPath = 'feeding-box' | 'reptile'

function HeaderMenu() {
  const location = useLocation();
  const parentPath = location.pathname.split('/')[1] as ParentPath;
  const routerListMap = {
    'feeding-box': [
      { to: 'feeding-box/overview', 'title': '容器管理' },
      // { to: '/feeding-box/management', 'title': '饲育情况概览' },
    ],
    'reptile': [
      { to: 'reptile/overview', 'title': '爬宠管理' },
      { to: 'reptile/feeding-logs', 'title': '饲育日志' },
      { to: 'reptile/temperature-and-humidity-logs', 'title': '温湿度日志' },
      { to: 'reptile/weight-logs', 'title': '体重日志' },
    ],
  };

  const routerList = routerListMap[parentPath] ?? [];

  return (
    <>
      <ListWrapper
        sx={{
          display: {
            md: 'block'
          }
        }}
      >
        <List disablePadding component={Box} display="flex">
          {
            routerList.map((router) =>
              <ListItem
                button
                key={router.title}
                classes={{ root: 'MuiListItem-indicators' }}
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
        </List>
      </ListWrapper>
    </>
  );
}

export default HeaderMenu;
