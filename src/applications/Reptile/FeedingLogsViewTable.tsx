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

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from './BulkActions';
import {
    Reptile,
    ReptileFeedingBox,
    ReptileFeedingBoxIndexCollection,
    ReptileFeedingLog,
    ReptileType
} from "../../../models";
import {DataStore} from "aws-amplify";
import reptile from "../Reptile";

interface FeedingLogsViewTableProps {
    className?: string;
    feedingLogs: ReptileFeedingLog[];
    reptiles: Reptile[];
    reptile?: Reptile;
    reptileTypes: ReptileType[];
    feedingBoxes: ReptileFeedingBox[];
    feedingBoxIndexes: ReptileFeedingBoxIndexCollection[];
}

const applyPagination = (
    feedingLogs: ReptileFeedingLog[],
    page: number,
    limit: number
): ReptileFeedingLog[] => {
    return feedingLogs.slice(page * limit, page * limit + limit);
};

const FeedingLogsViewTable: FC<FeedingLogsViewTableProps> =
    ({
         reptile,
         reptiles,
         feedingBoxes,
         feedingBoxIndexes,
         feedingLogs,
     }) => {
        const [selectedFeedingLogs, setSelectedFeedingLogs] = useState<string[]>(
            []
        );
        const selectedBulkActions = selectedFeedingLogs.length > 0;
        const [page, setPage] = useState<number>(0);
        const [limit, setLimit] = useState<number>(10);

        feedingLogs = feedingLogs.filter(_ => _.reptileID === reptile?.id);
        feedingLogs = feedingLogs.filter(_ => _.reptileID === reptile?.id);

        const handleSelectAllFeedingLogs = (
            event: ChangeEvent<HTMLInputElement>
        ): void => {
            setSelectedFeedingLogs(
                event.target.checked
                    ? feedingLogs.map((feedingLogs) => feedingLogs.id)
                    : []
            );
        };

        const handleSelectOneFeedingLog = (
            event: ChangeEvent<HTMLInputElement>,
            feedingLogId: string
        ): void => {
            if (!selectedFeedingLogs.includes(feedingLogId)) {
                setSelectedFeedingLogs((prevSelected) => [
                    ...prevSelected,
                    feedingLogId
                ]);
            } else {
                setSelectedFeedingLogs((prevSelected) =>
                    prevSelected.filter((id) => id !== feedingLogId)
                );
            }
        };

        const handlePageChange = (event: any, newPage: number): void => {
            setPage(newPage);
        };

        const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
            setLimit(parseInt(event.target.value));
        };

        const paginatedFeedingLogs = applyPagination(
            feedingLogs,
            page,
            limit
        );
        const selectedSomeFeedingLogs =
            selectedFeedingLogs.length > 0 &&
            selectedFeedingLogs.length < feedingLogs.length;
        const selectedAllFeedingLogs =
            selectedFeedingLogs.length === feedingLogs.length;
        const theme = useTheme();

        return (
            <Card>
                <CardHeader
                    title="饲养日志管理"
                />
                <Divider/>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={selectedAllFeedingLogs}
                                        indeterminate={selectedSomeFeedingLogs}
                                        onChange={handleSelectAllFeedingLogs}
                                    />
                                </TableCell>
                                <TableCell>体重(g)</TableCell>
                                <TableCell>温度</TableCell>
                                <TableCell>湿度</TableCell>
                                <TableCell>日志详情</TableCell>
                                <TableCell>饲养时间</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedFeedingLogs.map((feedingLog) => {
                                const isFeedingLogSelected = selectedFeedingLogs.includes(
                                    feedingLog.id
                                );
                                return (
                                    <TableRow
                                        hover
                                        key={feedingLog.id}
                                        selected={isFeedingLogSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isFeedingLogSelected}
                                                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                    handleSelectOneFeedingLog(event, feedingLog.id)
                                                }
                                                value={isFeedingLogSelected}
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
                                                {feedingLog.weight}g
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
                                                {feedingLog.environmentTemperature}℃
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
                                                {feedingLog.environmentHumidity}%
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
                                                {feedingLog.detail}
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
                                                {feedingLog.feedingDateTime}
                                            </Typography>
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
                        count={feedingLogs.length}
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

FeedingLogsViewTable.propTypes = {
    feedingLogs: PropTypes.array.isRequired
};

FeedingLogsViewTable.defaultProps = {
    feedingLogs: []
};

export default FeedingLogsViewTable;
