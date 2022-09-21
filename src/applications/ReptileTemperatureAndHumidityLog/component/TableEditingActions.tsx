import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';

import LogIcon from '@mui/icons-material/CollectionsBookmark';
import AddIcon from '@mui/icons-material/Add';

import { Reptile, ReptileTemperatureAndHumidityLog } from '../../../models';

interface TableEditingActionsProps {
  onModifyReptileTemperatureAndHumidityLogTableModalOpen: (reptile: Reptile) => any,
  onModifyReptileTemperatureAndHumidityLogEditingModalOpen: (reptile: Reptile, reptileTemperatureAndHumidityLog: ReptileTemperatureAndHumidityLog) => void;
  reptile: Reptile;
}

export const TableEditingActions: React.FC<TableEditingActionsProps> = ({
  onModifyReptileTemperatureAndHumidityLogEditingModalOpen,
  onModifyReptileTemperatureAndHumidityLogTableModalOpen,
  reptile
}) => {

  const theme = useTheme();

  return (
    <>
      <Tooltip title="添加温湿度日志" arrow>
        <IconButton
          sx={{
            '&:hover': {
              background: theme.colors.primary.lighter
            },
            color: theme.colors.warning.main
          }}
          color="inherit"
          size="small"
          onClick={onModifyReptileTemperatureAndHumidityLogEditingModalOpen.bind(null,reptile, new ReptileTemperatureAndHumidityLog({ reptileID: reptile.id }))}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="查看温湿度日志" arrow>
        <IconButton
          sx={{
            '&:hover': {
              background: theme.colors.primary.lighter
            },
            color: theme.colors.warning.main
          }}
          color="inherit"
          size="small"
          onClick={onModifyReptileTemperatureAndHumidityLogTableModalOpen.bind(null, reptile)}
        >
          <LogIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
};
