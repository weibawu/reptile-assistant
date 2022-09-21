import React, { ChangeEvent, FC, useState } from 'react';
import PropTypes from 'prop-types';

import { format } from 'date-fns';
import {
  Box,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

import { generateHashNumberInRange } from '../../../libs/util';

import { Reptile, ReptileTemperatureAndHumidityLog } from '../../../models';

import BulkActions from '../../../components/BulkActions';
import Label from '../../../components/Label';

interface ReptileTemperatureAndHumidityLogsTableProps {
  className?: string
  reptileTemperatureAndHumidityLogs: ReptileTemperatureAndHumidityLog[]
  reptiles: Reptile[]
  onReptileTemperatureAndHumidityLogEditing: (
    reptileTemperatureAndHumidityLog: ReptileTemperatureAndHumidityLog,
  ) => any
  onReptileTemperatureAndHumidityLogsDeleting: (
    reptileTemperatureAndHumidityLogIds: string[],
  ) => any
}

const applyPagination = (
  reptileTemperatureAndHumidityLogs: ReptileTemperatureAndHumidityLog[],
  page: number,
  limit: number,
): ReptileTemperatureAndHumidityLog[] => {
  return reptileTemperatureAndHumidityLogs.slice(page * limit, page * limit + limit);
};

const labelColorList = ['primary', 'black', 'secondary', 'error', 'warning', 'success', 'info'];

const getTextLabel = (text: string): JSX.Element => {
  const index = generateHashNumberInRange(text, labelColorList.length);
  const color = labelColorList[index] as
    | 'primary'
    | 'black'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'success'
    | 'info'
    | undefined;

  return (
    <Label key={text} color={color}>
      {text}
    </Label>
  );
};

const ReptileTemperatureAndHumidityLogsTable: FC<ReptileTemperatureAndHumidityLogsTableProps> = ({
  reptiles,
  reptileTemperatureAndHumidityLogs,
  onReptileTemperatureAndHumidityLogEditing,
  onReptileTemperatureAndHumidityLogsDeleting,
}) => {
  const [selectedReptileTemperatureAndHumidityLogs, setSelectedReptileTemperatureAndHumidityLogs] =
    useState<string[]>([]);
  const selectedBulkActions = selectedReptileTemperatureAndHumidityLogs.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const handleSelectAllReptileTemperatureAndHumidityLogs = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    setSelectedReptileTemperatureAndHumidityLogs(
      event.target.checked
        ? reptileTemperatureAndHumidityLogs.map(
          (reptileTemperatureAndHumidityLogs) => reptileTemperatureAndHumidityLogs.id,
        )
        : [],
    );
  };

  const handleSelectOneReptileTemperatureAndHumidityLog = (
    event: ChangeEvent<HTMLInputElement>,
    reptileTemperatureAndHumidityLogId: string,
  ): void => {
    if (!selectedReptileTemperatureAndHumidityLogs.includes(reptileTemperatureAndHumidityLogId)) {
      setSelectedReptileTemperatureAndHumidityLogs((prevSelected) => [
        ...prevSelected,
        reptileTemperatureAndHumidityLogId,
      ]);
    } else {
      setSelectedReptileTemperatureAndHumidityLogs((prevSelected) =>
        prevSelected.filter((id) => id !== reptileTemperatureAndHumidityLogId),
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const paginatedReptileTemperatureAndHumidityLogs = applyPagination(
    reptileTemperatureAndHumidityLogs,
    page,
    limit,
  );
  const selectedSomeReptileTemperatureAndHumidityLogs =
    selectedReptileTemperatureAndHumidityLogs.length > 0 &&
    selectedReptileTemperatureAndHumidityLogs.length < reptileTemperatureAndHumidityLogs.length;
  const selectedAllReptileTemperatureAndHumidityLogs =
    selectedReptileTemperatureAndHumidityLogs.length === reptileTemperatureAndHumidityLogs.length;
  const theme = useTheme();

  const handleBulkDeleting = () => {
    onReptileTemperatureAndHumidityLogsDeleting(selectedReptileTemperatureAndHumidityLogs);
    setSelectedReptileTemperatureAndHumidityLogs([]);
  };

  const getReptileFromReptileTemperatureAndHumidityLog: (
    reptileTemperatureAndHumidityLog: ReptileTemperatureAndHumidityLog,
  ) => Reptile = (reptileTemperatureAndHumidityLog) =>
    reptiles.find((reptile) => reptile.id === reptileTemperatureAndHumidityLog.reptileID)!;

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions onBulkDeleting={handleBulkDeleting} />
        </Box>
      )}
      {!selectedBulkActions && <CardHeader title='温湿度日志管理' />}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'>
                <Checkbox
                  color='primary'
                  checked={selectedAllReptileTemperatureAndHumidityLogs}
                  indeterminate={selectedSomeReptileTemperatureAndHumidityLogs}
                  onChange={handleSelectAllReptileTemperatureAndHumidityLogs}
                />
              </TableCell>
              <TableCell>品系名</TableCell>
              <TableCell>性别</TableCell>
              <TableCell>基因</TableCell>
              <TableCell>温度(°c)</TableCell>
              <TableCell>湿度(%)</TableCell>
              <TableCell>记录时间</TableCell>
              <TableCell align='right'>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedReptileTemperatureAndHumidityLogs.map((reptileTemperatureAndHumidityLog) => {
              const isReptileTemperatureAndHumidityLogSelected =
                selectedReptileTemperatureAndHumidityLogs.includes(
                  reptileTemperatureAndHumidityLog.id,
                );
              return (
                <TableRow
                  hover
                  key={reptileTemperatureAndHumidityLog.id}
                  selected={isReptileTemperatureAndHumidityLogSelected}
                >
                  <TableCell padding='checkbox'>
                    <Checkbox
                      color='primary'
                      checked={isReptileTemperatureAndHumidityLogSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneReptileTemperatureAndHumidityLog(
                          event,
                          reptileTemperatureAndHumidityLog.id,
                        )
                      }
                      value={isReptileTemperatureAndHumidityLogSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant='body1'
                      fontWeight='bold'
                      color='text.primary'
                      gutterBottom
                      noWrap
                    >
                      {
                        getReptileFromReptileTemperatureAndHumidityLog(
                          reptileTemperatureAndHumidityLog,
                        ).name
                      }
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant='body1'
                      fontWeight='bold'
                      color='text.primary'
                      gutterBottom
                      noWrap
                    >
                      {getReptileFromReptileTemperatureAndHumidityLog(
                        reptileTemperatureAndHumidityLog,
                      ).gender === 'MALE'
                        ? '公'
                        : '母'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant='body1'
                      fontWeight='bold'
                      color='text.primary'
                      gutterBottom
                      noWrap
                    >
                      {(
                        getReptileFromReptileTemperatureAndHumidityLog(
                          reptileTemperatureAndHumidityLog,
                        ).genies ?? []
                      ).map((genie) => getTextLabel(genie!))}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant='body1'
                      fontWeight='bold'
                      color='text.primary'
                      gutterBottom
                      noWrap
                    >
                      {reptileTemperatureAndHumidityLog.environmentTemperature}°c
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant='body1'
                      fontWeight='bold'
                      color='text.primary'
                      gutterBottom
                      noWrap
                    >
                      {reptileTemperatureAndHumidityLog.environmentHumidity}%
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant='body1'
                      fontWeight='bold'
                      color='text.primary'
                      gutterBottom
                      noWrap
                    >
                      {format(
                        new Date(reptileTemperatureAndHumidityLog.meteringDateTime!),
                        'yyyy年MM月dd日 hh:mm:ss',
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Tooltip title='编辑' arrow>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter,
                          },
                          color: theme.palette.primary.main,
                        }}
                        color='inherit'
                        size='small'
                        onClick={onReptileTemperatureAndHumidityLogEditing.bind(
                          null,
                          reptileTemperatureAndHumidityLog,
                        )}
                      >
                        <EditTwoToneIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='删除' arrow>
                      <IconButton
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.error.main,
                        }}
                        color='inherit'
                        size='small'
                        onClick={onReptileTemperatureAndHumidityLogsDeleting.bind(null, [
                          reptileTemperatureAndHumidityLog.id,
                        ])}
                      >
                        <DeleteTwoToneIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component='div'
          count={reptileTemperatureAndHumidityLogs.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

ReptileTemperatureAndHumidityLogsTable.propTypes = {
  reptileTemperatureAndHumidityLogs: PropTypes.array.isRequired,
};

ReptileTemperatureAndHumidityLogsTable.defaultProps = {
  reptileTemperatureAndHumidityLogs: [],
};

export default ReptileTemperatureAndHumidityLogsTable;
