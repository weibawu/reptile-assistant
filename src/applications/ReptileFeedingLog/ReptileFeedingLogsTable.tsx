import {ChangeEvent, FC, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
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

import Label from '../../components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import {
  Reptile,
  ReptileFeedingBox,
  ReptileFeedingBoxIndexCollection,
  ReptileFeedingLog,
  ReptileType
} from '../../../models';
import {DataStore} from 'aws-amplify';
import reptile from '../Reptile';

interface ReptileFeedingLogsTableProps {
    className?: string;
    reptileFeedingLogs: ReptileFeedingLog[];
    reptiles: Reptile[];
    reptileTypes: ReptileType[];
    reptileFeedingBoxes: ReptileFeedingBox[];
    reptileFeedingBoxIndexes: ReptileFeedingBoxIndexCollection[];
    onReptileFeedingLogEditing: (reptileFeedingLog: ReptileFeedingLog) => any;
    onReptileFeedingLogsDeleting: (reptileFeedingLogIds: string[]) => any;
}

const applyPagination = (
  reptileFeedingLogs: ReptileFeedingLog[],
  page: number,
  limit: number
): ReptileFeedingLog[] => {
  return reptileFeedingLogs.slice(page * limit, page * limit + limit);
};

const ReptileFeedingLogsTable: FC<ReptileFeedingLogsTableProps> =
    ({
      reptiles,
      reptileTypes,
      reptileFeedingBoxes,
      reptileFeedingBoxIndexes,
      reptileFeedingLogs,
      onReptileFeedingLogEditing,
      onReptileFeedingLogsDeleting
    }) => {
      const [selectedReptileFeedingLogs, setSelectedReptileFeedingLogs] = useState<string[]>(
        []
      );
      const selectedBulkActions = selectedReptileFeedingLogs.length > 0;
      const [page, setPage] = useState<number>(0);
      const [limit, setLimit] = useState<number>(10);

      const handleSelectAllReptileFeedingLogs = (
        event: ChangeEvent<HTMLInputElement>
      ): void => {
        setSelectedReptileFeedingLogs(
          event.target.checked
            ? reptileFeedingLogs.map((reptileFeedingLogs) => reptileFeedingLogs.id)
            : []
        );
      };

      const handleSelectOneReptileFeedingLog = (
        event: ChangeEvent<HTMLInputElement>,
        reptileFeedingLogId: string
      ): void => {
        if (!selectedReptileFeedingLogs.includes(reptileFeedingLogId)) {
          setSelectedReptileFeedingLogs((prevSelected) => [
            ...prevSelected,
            reptileFeedingLogId
          ]);
        } else {
          setSelectedReptileFeedingLogs((prevSelected) =>
            prevSelected.filter((id) => id !== reptileFeedingLogId)
          );
        }
      };

      const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
      };

      const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
      };

      const paginatedReptileFeedingLogs = applyPagination(
        reptileFeedingLogs,
        page,
        limit
      );
      const selectedSomeReptileFeedingLogs =
            selectedReptileFeedingLogs.length > 0 &&
            selectedReptileFeedingLogs.length < reptileFeedingLogs.length;
      const selectedAllReptileFeedingLogs =
            selectedReptileFeedingLogs.length === reptileFeedingLogs.length;
      const theme = useTheme();

      const handleBulkDeleting = () => {
        onReptileFeedingLogsDeleting(selectedReptileFeedingLogs);
        setSelectedReptileFeedingLogs([]);
      };

      return (
        <Card>
          {selectedBulkActions && (
            <Box flex={1} p={2}>
              <BulkActions onBulkDeleting={handleBulkDeleting}/>
            </Box>
          )}
          {!selectedBulkActions && (
            <CardHeader
              title="饲养日志管理"
            />
          )}
          <Divider/>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selectedAllReptileFeedingLogs}
                      indeterminate={selectedSomeReptileFeedingLogs}
                      onChange={handleSelectAllReptileFeedingLogs}
                    />
                  </TableCell>
                  <TableCell>爬宠</TableCell>
                  <TableCell>体重(g)</TableCell>
                  <TableCell>温度</TableCell>
                  <TableCell>湿度</TableCell>
                  <TableCell>日志详情</TableCell>
                  <TableCell>饲养时间</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedReptileFeedingLogs.map((reptileFeedingLog) => {
                  const isReptileFeedingLogSelected = selectedReptileFeedingLogs.includes(
                    reptileFeedingLog.id
                  );
                  return (
                    <TableRow
                      hover
                      key={reptileFeedingLog.id}
                      selected={isReptileFeedingLogSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isReptileFeedingLogSelected}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            handleSelectOneReptileFeedingLog(event, reptileFeedingLog.id)
                          }
                          value={isReptileFeedingLogSelected}
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
                          {reptiles.find(_ => _.id === reptileFeedingLog.reptileID)?.name} &nbsp;
                          {
                            reptileFeedingBoxes.find(_ =>
                              _.id === reptiles.find(_ => _.id === reptileFeedingLog.reptileID)?.reptileFeedingBoxID
                            )?.name} &nbsp;
                          {
                            reptileFeedingBoxIndexes.find(_ =>
                              _.id === reptiles.find(_ => _.id === reptileFeedingLog.reptileID)?.reptileFeedingBoxIndexCollectionID
                            )
                              ? '第' + reptileFeedingBoxIndexes.find(_ =>
                                _.id === reptiles.find(_ => _.id === reptileFeedingLog.reptileID)?.reptileFeedingBoxIndexCollectionID
                              ).horizontalIndex + '排' + reptileFeedingBoxIndexes.find(_ =>
                                _.id === reptiles.find(_ => _.id === reptileFeedingLog.reptileID)?.reptileFeedingBoxIndexCollectionID
                              ).verticalIndex + '列'
                              : ''
                          }
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
                          {reptileFeedingLog.weight}g
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
                          {reptileFeedingLog.environmentTemperature}℃
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
                          {reptileFeedingLog.environmentHumidity}%
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
                          {reptileFeedingLog.detail}
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
                          {reptileFeedingLog.feedingDateTime}
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
                            onClick={onReptileFeedingLogEditing.bind(null, reptileFeedingLog)}
                          >
                            <EditTwoToneIcon fontSize="small"/>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="删除" arrow>
                          <IconButton
                            sx={{
                              '&:hover': {background: theme.colors.error.lighter},
                              color: theme.palette.error.main
                            }}
                            color="inherit"
                            size="small"
                            onClick={onReptileFeedingLogsDeleting.bind(null, [reptileFeedingLog.id])}
                          >
                            <DeleteTwoToneIcon fontSize="small"/>
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
              count={reptileFeedingLogs.length}
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

ReptileFeedingLogsTable.propTypes = {
  reptileFeedingLogs: PropTypes.array.isRequired
};

ReptileFeedingLogsTable.defaultProps = {
  reptileFeedingLogs: []
};

export default ReptileFeedingLogsTable;
