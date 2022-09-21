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
  useTheme
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

import { generateHashNumberInRange } from '../../../libs/util';

import { Reptile, ReptileWeightLog } from '../../../models';

import BulkActions from '../../../components/BulkActions';
import Label from '../../../components/Label';

interface ReptileWeightLogsTableProps {
  className?: string;
  reptileWeightLogs: ReptileWeightLog[];
  reptiles: Reptile[];
  onReptileWeightLogEditing: (reptileWeightLog: ReptileWeightLog) => any;
  onReptileWeightLogsDeleting: (reptileWeightLogIds: string[]) => any;
}

const applyPagination = (
  reptileWeightLogs: ReptileWeightLog[],
  page: number,
  limit: number
): ReptileWeightLog[] => {
  return reptileWeightLogs.slice(page * limit, page * limit + limit);
};

const labelColorList = ['primary', 'black', 'secondary', 'error', 'warning', 'success', 'info'];

const getTextLabel = (text: string): JSX.Element => {
  const index = generateHashNumberInRange(text, labelColorList.length);
  const color = labelColorList[index] as 'primary' | 'black' | 'secondary' | 'error' | 'warning' | 'success' | 'info' | undefined;

  return <Label key={text} color={color}>{text}</Label>;
};

const ReptileWeightLogsTable: FC<ReptileWeightLogsTableProps> =
  ({
    reptiles,
    reptileWeightLogs,
    onReptileWeightLogEditing,
    onReptileWeightLogsDeleting
  }) => {
    const [selectedReptileWeightLogs, setSelectedReptileWeightLogs] = useState<string[]>(
      []
    );
    const selectedBulkActions = selectedReptileWeightLogs.length > 0;
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);

    const handleSelectAllReptileWeightLogs = (
      event: ChangeEvent<HTMLInputElement>
    ): void => {
      setSelectedReptileWeightLogs(
        event.target.checked
          ? reptileWeightLogs.map((reptileWeightLogs) => reptileWeightLogs.id)
          : []
      );
    };

    const handleSelectOneReptileWeightLog = (
      event: ChangeEvent<HTMLInputElement>,
      reptileWeightLogId: string
    ): void => {
      if (!selectedReptileWeightLogs.includes(reptileWeightLogId)) {
        setSelectedReptileWeightLogs((prevSelected) => [
          ...prevSelected,
          reptileWeightLogId
        ]);
      } else {
        setSelectedReptileWeightLogs((prevSelected) =>
          prevSelected.filter((id) => id !== reptileWeightLogId)
        );
      }
    };

    const handlePageChange = (event: any, newPage: number): void => {
      setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
      setLimit(parseInt(event.target.value));
    };

    const paginatedReptileWeightLogs = applyPagination(
      reptileWeightLogs,
      page,
      limit
    );
    const selectedSomeReptileWeightLogs =
      selectedReptileWeightLogs.length > 0 &&
      selectedReptileWeightLogs.length < reptileWeightLogs.length;
    const selectedAllReptileWeightLogs =
      selectedReptileWeightLogs.length === reptileWeightLogs.length;
    const theme = useTheme();

    const handleBulkDeleting = () => {
      onReptileWeightLogsDeleting(selectedReptileWeightLogs);
      setSelectedReptileWeightLogs([]);
    };

    const getReptileFromReptileWeightLog:
      (reptileWeightLog: ReptileWeightLog) => Reptile
      = (reptileWeightLog) =>
      reptiles.find(
        reptile => reptile.id === reptileWeightLog.reptileID
      )!;

    return (
      <Card>
        {selectedBulkActions && (
          <Box flex={1} p={2}>
            <BulkActions onBulkDeleting={handleBulkDeleting} />
          </Box>
        )}
        {!selectedBulkActions && (
          <CardHeader
            title="体重日志管理"
          />
        )}
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selectedAllReptileWeightLogs}
                    indeterminate={selectedSomeReptileWeightLogs}
                    onChange={handleSelectAllReptileWeightLogs}
                  />
                </TableCell>
                <TableCell>品系名</TableCell>
                <TableCell>性别</TableCell>
                <TableCell>基因</TableCell>
                <TableCell>记录体重(g)</TableCell>
                <TableCell>记录时间</TableCell>
                <TableCell align="right">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedReptileWeightLogs.map((reptileWeightLog) => {
                const isReptileWeightLogSelected = selectedReptileWeightLogs.includes(
                  reptileWeightLog.id
                );
                return (
                  <TableRow
                    hover
                    key={reptileWeightLog.id}
                    selected={isReptileWeightLogSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isReptileWeightLogSelected}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          handleSelectOneReptileWeightLog(event, reptileWeightLog.id)
                        }
                        value={isReptileWeightLogSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {getReptileFromReptileWeightLog(reptileWeightLog).name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {getReptileFromReptileWeightLog(reptileWeightLog).gender === 'MALE' ? '公' : '母'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {(getReptileFromReptileWeightLog(reptileWeightLog).genies ?? []).map(genie => getTextLabel(genie!))}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {reptileWeightLog.weight}g
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {format(new Date(reptileWeightLog.meteringDateTime!), 'yyyy年MM月dd日 hh:mm:ss')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
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
                          onClick={onReptileWeightLogEditing.bind(null, reptileWeightLog)}
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
                          onClick={onReptileWeightLogsDeleting.bind(null, [reptileWeightLog.id])}
                        >
                          <DeleteTwoToneIcon fontSize="small" />
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
            component="div"
            count={reptileWeightLogs.length}
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

ReptileWeightLogsTable.propTypes = {
  reptileWeightLogs: PropTypes.array.isRequired
};

ReptileWeightLogsTable.defaultProps = {
  reptileWeightLogs: []
};

export default ReptileWeightLogsTable;
