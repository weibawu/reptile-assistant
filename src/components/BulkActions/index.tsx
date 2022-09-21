import React, { useState, useRef } from 'react';

import {
  Box,
  Menu,
  IconButton,
  Button,
  ListItemText,
  ListItem,
  List,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `,
);

interface BulkActionsProps {
  onBulkDeleting: () => any
}

function BulkActions({ onBulkDeleting }: BulkActionsProps) {
  const [onMenuOpen, menuOpen] = useState<boolean>(false);
  const moreRef = useRef<HTMLButtonElement | null>(null);

  const openMenu = (): void => {
    menuOpen(true);
  };

  const closeMenu = (): void => {
    menuOpen(false);
  };

  const handleBulkDeleting = () => {
    onBulkDeleting();
    closeMenu();
  };

  return (
    <>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Box display='flex' alignItems='center'>
          <Typography variant='h5' color='text.secondary'>
            批量操作：
          </Typography>
          <ButtonError
            sx={{ ml: 1 }}
            startIcon={<DeleteTwoToneIcon />}
            variant='contained'
            onClick={handleBulkDeleting}
          >
            删除
          </ButtonError>
        </Box>
        <IconButton color='primary' onClick={openMenu} ref={moreRef} sx={{ ml: 2, p: 1 }}>
          <MoreVertTwoToneIcon />
        </IconButton>
      </Box>

      <Menu
        keepMounted
        anchorEl={moreRef.current}
        open={onMenuOpen}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        <List sx={{ p: 1 }} component='nav'>
          <ListItem button onClick={handleBulkDeleting}>
            <ListItemText primary='批量删除选中' />
          </ListItem>
        </List>
      </Menu>
    </>
  );
}

export default BulkActions;
