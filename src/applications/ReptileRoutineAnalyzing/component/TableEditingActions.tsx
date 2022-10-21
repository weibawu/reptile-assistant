import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';

import AutoGraphIcon from '@mui/icons-material/AutoGraph';

import { Reptile } from '../../../models';

interface TableEditingActionsProps {
  onReptileRoutineAnalyzingChartModal: (reptile: Reptile) => any
  reptile: Reptile
}

export const TableEditingActions: React.FC<TableEditingActionsProps> = ({
  onReptileRoutineAnalyzingChartModal,
  reptile,
}) => {
  const theme = useTheme();

  return (
    <>
      <Tooltip title='查看成长曲线' arrow>
        <IconButton
          sx={{
            '&:hover': {
              background: theme.colors.primary.lighter,
            },
            color: theme.palette.primary.main,
          }}
          color='inherit'
          size='small'
          onClick={onReptileRoutineAnalyzingChartModal.bind(null, reptile)}
        >
          <AutoGraphIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    </>
  );
};
