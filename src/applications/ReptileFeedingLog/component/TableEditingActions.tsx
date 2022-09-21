import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';

import LogIcon from '@mui/icons-material/CollectionsBookmark';
import AddIcon from '@mui/icons-material/Add';

import { Reptile, ReptileFeedingLog } from '../../../models';

interface TableEditingActionsProps {
  onModifyReptileFeedingLogTableModalOpen: (reptile: Reptile) => any,
  onModifyReptileFeedingLogEditingModalOpen: (reptile: Reptile, reptileFeedingLog: ReptileFeedingLog) => void;
  reptile: Reptile;
}

export const TableEditingActions: React.FC<TableEditingActionsProps> = ({
  onModifyReptileFeedingLogEditingModalOpen,
  onModifyReptileFeedingLogTableModalOpen,
  reptile
}) => {

  const theme = useTheme();

  return (
    <>
      <Tooltip title="添加饲养日志" arrow>
        <IconButton
          sx={{
            '&:hover': {
              background: theme.colors.primary.lighter
            },
            color: theme.palette.success.main
          }}
          color="inherit"
          size="small"
          onClick={onModifyReptileFeedingLogEditingModalOpen.bind(null,reptile, new ReptileFeedingLog({ reptileID: reptile.id }))}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="查看饲养日志" arrow>
        <IconButton
          sx={{
            '&:hover': {
              background: theme.colors.primary.lighter
            },
            color: theme.palette.success.main
          }}
          color="inherit"
          size="small"
          onClick={onModifyReptileFeedingLogTableModalOpen.bind(null, reptile)}
        >
          <LogIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
};
