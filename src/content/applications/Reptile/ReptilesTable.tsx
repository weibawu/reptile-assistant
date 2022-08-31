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
import {Reptile, ReptileType} from "../../../models";
import {DataStore} from "aws-amplify";

interface ReptilesTableProps {
    className?: string;
    reptiles: Reptile[];
    onReptileEditing: (reptile: Reptile) => any;
    onReptilesDeleting: (reptileIds: string[]) => any;
}

interface Filters {
    type?: ReptileType;
}

// const getTypeLabel = (reptileType: ReptileType): JSX.Element => {
//     const map = {
//         [ReptileType.BOX]: {
//             text: "饲养盒",
//             color: 'error'
//         },
//         [ReptileType.CABINET]: {
//             text: "爬柜",
//             color: 'success'
//         },
//     };
//
//     const {text, color}: any = map[reptileType];
//
//     return <Label color={color}>{text}</Label>;
// };

const applyFilters = (
    reptiles: Reptile[],
    filters: Filters,
): Reptile[] => {
    return reptiles.filter((reptile) => {
        let matches = true;
        //
        // if (filters.type && reptile.type !== filters.type) {
        //     matches = false;
        // }

        return matches;
    });
};

const applyPagination = (
    reptiles: Reptile[],
    page: number,
    limit: number
): Reptile[] => {
    return reptiles.slice(page * limit, page * limit + limit);
};

const ReptilesTable: FC<ReptilesTableProps> = ({reptiles, onReptileEditing, onReptilesDeleting}) => {
    const [selectedReptiles, setSelectedReptiles] = useState<string[]>(
        []
    );
    const selectedBulkActions = selectedReptiles.length > 0;
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
        // {
        //     id: ReptileType.BOX,
        //     name: '饲养盒'
        // },
        // {
        //     id: ReptileType.CABINET,
        //     name: '爬柜'
        // },
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

    const handleSelectAllReptiles = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        setSelectedReptiles(
            event.target.checked
                ? reptiles.map((reptiles) => reptiles.id)
                : []
        );
    };

    const handleSelectOneReptile = (
        event: ChangeEvent<HTMLInputElement>,
        reptileId: string
    ): void => {
        if (!selectedReptiles.includes(reptileId)) {
            setSelectedReptiles((prevSelected) => [
                ...prevSelected,
                reptileId
            ]);
        } else {
            setSelectedReptiles((prevSelected) =>
                prevSelected.filter((id) => id !== reptileId)
            );
        }
    };

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    const filteredReptiles = applyFilters(reptiles, filters);
    const paginatedReptiles = applyPagination(
        filteredReptiles,
        page,
        limit
    );
    const selectedSomeReptiles =
        selectedReptiles.length > 0 &&
        selectedReptiles.length < reptiles.length;
    const selectedAllReptiles =
        selectedReptiles.length === reptiles.length;
    const theme = useTheme();

    const handleBulkDeleting = () => {
        onReptilesDeleting(selectedReptiles);
        setSelectedReptiles([]);
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
                                    checked={selectedAllReptiles}
                                    indeterminate={selectedSomeReptiles}
                                    onChange={handleSelectAllReptiles}
                                />
                            </TableCell>
                            <TableCell>名称 / 位置</TableCell>
                            <TableCell>饲养盒类型</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedReptiles.map((reptile) => {
                            const isReptileSelected = selectedReptiles.includes(
                                reptile.id
                            );
                            return (
                                <TableRow
                                    hover
                                    key={reptile.id}
                                    selected={isReptileSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isReptileSelected}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                handleSelectOneReptile(event, reptile.id)
                                            }
                                            value={isReptileSelected}
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
                                            {reptile.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {/*{getTypeLabel(reptile.type as ReptileType)}*/}
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {reptile.id}
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
                                                onClick={onReptileEditing.bind(null, reptile)}
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
                                                onClick={onReptilesDeleting.bind(null, [reptile.id])}
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
                    count={filteredReptiles.length}
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

ReptilesTable.propTypes = {
    reptiles: PropTypes.array.isRequired
};

ReptilesTable.defaultProps = {
    reptiles: []
};

export default ReptilesTable;
