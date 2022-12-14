import React from 'react';
import { Box, List, ListItemText, ListItem } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
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
`,
);

type ParentPath = 'feeding-box' | 'reptile'

function HeaderMenu() {
  const location = useLocation();
  const parentPath = location.pathname.split('/')[1] as ParentPath;
  const routerListMap = {
    'feeding-box': [
      { to: 'feeding-box/overview', title: '????????????' },
      // { to: '/feeding-box/management', 'title': '??????????????????' },
    ],
    reptile: [
      { to: 'reptile/overview', title: '????????????' },
      { to: 'reptile/feeding-logs', title: '????????????' },
      { to: 'reptile/temperature-and-humidity-logs', title: '???????????????' },
      { to: 'reptile/weight-logs', title: '????????????' },
    ],
    chart: [
      { to: 'chart/reptile-dashboard', title: '????????????' },
      { to: 'chart/routine-analyzing', title: '????????????' },
    ],
  };

  const routerList = routerListMap[parentPath] ?? [];

  return (
    <>
      <ListWrapper
        sx={{
          display: {
            md: 'block',
          },
        }}
      >
        <List disablePadding component={Box} display='flex'>
          {routerList.map((router) => (
            <ListItem
              button
              key={router.title}
              classes={{ root: 'MuiListItem-indicators' }}
              component={NavLink}
              to={router.to}
            >
              <ListItemText primaryTypographyProps={{ noWrap: true }} primary={router.title} />
            </ListItem>
          ))}
        </List>
      </ListWrapper>
    </>
  );
}

export default HeaderMenu;
