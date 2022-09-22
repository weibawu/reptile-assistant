import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';

import LogIcon from '@mui/icons-material/Scale';
import AddIcon from '@mui/icons-material/Add';

import { Reptile, ReptileWeightLog } from '../../../models';

interface TableEditingActionsProps {
  onModifyReptileWeightLogTableModalOpen: (reptile: Reptile) => any
  onModifyReptileWeightLogEditingModalOpen: (
    reptile: Reptile,
    reptileWeightLog: ReptileWeightLog,
  ) => void
  reptile: Reptile
}

export const TableEditingActions: React.FC<TableEditingActionsProps> = ({
  onModifyReptileWeightLogEditingModalOpen,
  onModifyReptileWeightLogTableModalOpen,
  reptile,
}) => {
  const theme = useTheme();

  return (
    <>
      <Tooltip title='添加体重日志' arrow>
        <IconButton
          sx={{
            '&:hover': {
              background: theme.colors.primary.lighter,
            },
            color: theme.colors.shadows,
          }}
          color='inherit'
          size='small'
          onClick={onModifyReptileWeightLogEditingModalOpen.bind(
            null,
            reptile,
            new ReptileWeightLog({ reptileID: reptile.id }),
          )}
        >
          <AddIcon fontSize='small' />
        </IconButton>
      </Tooltip>
      <Tooltip title='查看体重日志' arrow>
        <IconButton
          sx={{
            '&:hover': {
              background: theme.colors.primary.lighter,
            },
            color: theme.colors.shadows,
          }}
          color='inherit'
          size='small'
          onClick={onModifyReptileWeightLogTableModalOpen.bind(null, reptile)}
        >
          <LogIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    </>
  );
};
