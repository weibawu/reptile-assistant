import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

import { Reptile } from '../../../models';

interface TableEditingActionsProps {
  onReptileEditing: (reptile: Reptile) => any;
  onReptilesDeleting: (reptileIds: string[]) => any;
  reptile: Reptile;
}

export const TableEditingActions: React.FC<TableEditingActionsProps> = ({
  onReptileEditing,
  onReptilesDeleting,
  reptile
}) => {

  const theme = useTheme();

  return (
    <>
      <Tooltip title="编辑" arrow>
        <IconButton
          sx={{
            '&:hover': {
              background: theme.colors.primary.lighter
            },
            color: theme.palette.primary.main
          }}
          color="inherit"
          size="small"
          onClick={onReptileEditing.bind(null, reptile)}
        >
          <EditTwoToneIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="删除" arrow>
        <IconButton
          sx={{
            '&:hover': { background: theme.colors.error.lighter },
            color: theme.palette.error.main
          }}
          color="inherit"
          size="small"
          onClick={onReptilesDeleting.bind(null, [reptile.id])}
        >
          <DeleteTwoToneIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
};
