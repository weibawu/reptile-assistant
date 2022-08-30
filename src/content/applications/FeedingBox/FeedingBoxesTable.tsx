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
import {ReptileFeedingBox, ReptileFeedingBoxType} from "../../../models";
import {DataStore} from "aws-amplify";

interface FeedingBoxesTableProps {
    className?: string;
    feedingBoxes: ReptileFeedingBox[];
    onFeedingBoxEditing: (feedingBox: ReptileFeedingBox) => any;
    onFeedingBoxesDeleting: (feedingBoxIds: string[]) => any;
}

interface Filters {
    type?: ReptileFeedingBoxType;
}

const getTypeLabel = (feedingBoxType: ReptileFeedingBoxType): JSX.Element => {
    const map = {
        [ReptileFeedingBoxType.BOX]: {
            text: "饲养盒",
            color: 'error'
        },
        [ReptileFeedingBoxType.CABINET]: {
            text: "爬柜",
            color: 'success'
        },
    };

    const {text, color}: any = map[feedingBoxType];

    return <Label color={color}>{text}</Label>;
};

const applyFilters = (
    feedingBoxes: ReptileFeedingBox[],
    filters: Filters,
): ReptileFeedingBox[] => {
    return feedingBoxes.filter((feedingBox) => {
        let matches = true;

        if (filters.type && feedingBox.type !== filters.type) {
            matches = false;
        }

        return matches;
    });
};

const applyPagination = (
    feedingBoxes: ReptileFeedingBox[],
    page: number,
    limit: number
): ReptileFeedingBox[] => {
    return feedingBoxes.slice(page * limit, page * limit + limit);
};

const FeedingBoxesTable: FC<FeedingBoxesTableProps> = ({feedingBoxes, onFeedingBoxEditing, onFeedingBoxesDeleting}) => {
    const [selectedFeedingBoxes, setSelectedFeedingBoxes] = useState<string[]>(
        []
    );
    const selectedBulkActions = selectedFeedingBoxes.length > 0;
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [filters, setFilters] = useState<Filters>({
        type: null
    });

    const typeOptions = [
        {
            id: 'all',
            name: '全部'
        },
        {
            id: ReptileFeedingBoxType.BOX,
            name: '饲养盒'
        },
        {
            id: ReptileFeedingBoxType.CABINET,
            name: '爬柜'
        },
    ];

    const handleTypeChange = (e: ChangeEvent<HTMLInputElement>): void => {
        let value = null;

        if (e.target.value !== 'all') {
            value = e.target.value;
        }

        setFilters((prevFilters) => ({
            ...prevFilters,
            type: value
        }));
    };

    const handleSelectAllFeedingBoxes = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        setSelectedFeedingBoxes(
            event.target.checked
                ? feedingBoxes.map((feedingBoxes) => feedingBoxes.id)
                : []
        );
    };

    const handleSelectOneFeedingBox = (
        event: ChangeEvent<HTMLInputElement>,
        feedingBoxId: string
    ): void => {
        if (!selectedFeedingBoxes.includes(feedingBoxId)) {
            setSelectedFeedingBoxes((prevSelected) => [
                ...prevSelected,
                feedingBoxId
            ]);
        } else {
            setSelectedFeedingBoxes((prevSelected) =>
                prevSelected.filter((id) => id !== feedingBoxId)
            );
        }
    };

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    const filteredFeedingBoxes = applyFilters(feedingBoxes, filters);
    const paginatedFeedingBoxes = applyPagination(
        filteredFeedingBoxes,
        page,
        limit
    );
    const selectedSomeFeedingBoxes =
        selectedFeedingBoxes.length > 0 &&
        selectedFeedingBoxes.length < feedingBoxes.length;
    const selectedAllFeedingBoxes =
        selectedFeedingBoxes.length === feedingBoxes.length;
    const theme = useTheme();

    const handleBulkDeleting = () => {
        onFeedingBoxesDeleting(selectedFeedingBoxes);
        setSelectedFeedingBoxes([]);
    }

    return (
        <Card>
            {selectedBulkActions && (
                <Box flex={1} p={2}>
                    <BulkActions onBulkDeleting={handleBulkDeleting}/>
                </Box>
            )}
            {!selectedBulkActions && (
                <CardHeader
                    action={
                        <Box width={150}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={filters.type || 'all'}
                                    onChange={handleTypeChange}
                                    label="Status"
                                    autoWidth
                                >
                                    {typeOptions.map((statusOption) => (
                                        <MenuItem key={statusOption.id} value={statusOption.id}>
                                            {statusOption.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    }
                    title="饲养容器管理"
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
                                    checked={selectedAllFeedingBoxes}
                                    indeterminate={selectedSomeFeedingBoxes}
                                    onChange={handleSelectAllFeedingBoxes}
                                />
                            </TableCell>
                            <TableCell>名称 / 位置</TableCell>
                            <TableCell>饲养盒类型</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedFeedingBoxes.map((feedingBox) => {
                            const isFeedingBoxSelected = selectedFeedingBoxes.includes(
                                feedingBox.id
                            );
                            return (
                                <TableRow
                                    hover
                                    key={feedingBox.id}
                                    selected={isFeedingBoxSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isFeedingBoxSelected}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                handleSelectOneFeedingBox(event, feedingBox.id)
                                            }
                                            value={isFeedingBoxSelected}
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
                                            {feedingBox.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {getTypeLabel(feedingBox.type as ReptileFeedingBoxType)}
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {feedingBox.id}
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
                                                onClick={onFeedingBoxEditing.bind(null, feedingBox)}
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
                                                onClick={onFeedingBoxesDeleting.bind(null, [feedingBox.id])}
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
                    count={filteredFeedingBoxes.length}
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

FeedingBoxesTable.propTypes = {
    feedingBoxes: PropTypes.array.isRequired
};

FeedingBoxesTable.defaultProps = {
    feedingBoxes: []
};

export default FeedingBoxesTable;
