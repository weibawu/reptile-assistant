import {ChangeEvent, FC, useEffect, useState} from 'react';
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
    ReptileGenderType,
    ReptileType
} from "../../../models";
import {DataStore} from "aws-amplify";
import {useAuthenticator} from "@aws-amplify/ui-react";

interface ReptilesTableProps {
    className?: string;
    reptiles: Reptile[];
    onReptileEditing: (reptile: Reptile) => any;
    onReptilesDeleting: (reptileIds: string[]) => any;
}

interface Filters {
    type?: ReptileType;
}

const ReptileTypeLabel: FC<{ reptileType: ReptileType }> = ({reptileType}) => {

    const [reptileTypes, setReptileTypes] = useState<ReptileType[]>([]);

    useEffect(() => {
        DataStore.query(ReptileType).then(setReptileTypes);
    }, [])

    const map = [];

    reptileTypes.forEach(
        _ => map.push({
            [_.name]: {
                text: _.name,
                color: ['primary', 'black', 'secondary', 'error', 'warning', 'success', 'info']
            }
        })
    );

    const {text, color}: any = map[reptileType.name];

    return <Label color={color}>{text}</Label>;
};

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
    const {user} = useAuthenticator(ctx => [ctx.user]);

    const [selectedReptiles, setSelectedReptiles] = useState<string[]>(
        []
    );
    const selectedBulkActions = selectedReptiles.length > 0;
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [filters, setFilters] = useState<Filters>({
        type: null
    });
    const [reptileTypes, setReptileTypes] = useState<ReptileType[]>([]);
    const [feedingBoxes, setFeedingBoxes] = useState<ReptileFeedingBox[]>([]);
    const [feedingBoxIndexes, setFeedingBoxIndexes] = useState<ReptileFeedingBoxIndexCollection[]>([]);

    useEffect(() => {
        DataStore.query(ReptileType).then(setReptileTypes);
        DataStore.query(ReptileFeedingBox, (_) => _.userID("eq", user.username)).then(setFeedingBoxes);
        DataStore.query(ReptileFeedingBoxIndexCollection, (_) => _.userID("eq", user.username)).then((data) => {
            setFeedingBoxIndexes(data);
            console.log(data);
        });
    }, [])

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
                    title="爬宠管理"
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
                            <TableCell>品系名</TableCell>
                            <TableCell>别名</TableCell>
                            <TableCell>基因</TableCell>
                            <TableCell>体重(g)</TableCell>
                            <TableCell>出生日期</TableCell>
                            <TableCell>所属科</TableCell>
                            <TableCell>所在爬柜/饲养盒</TableCell>
                            <TableCell align="right">操作</TableCell>
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
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {reptile.nickname}
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
                                            {reptile.genies.join(',')}
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
                                            {reptile.weight}g
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
                                            {reptile.birthdate}
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
                                            {reptileTypes.find(_ => _.id === reptile.reptileTypeID)?.name}
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
                                            { feedingBoxes.find(_ => _.id === reptile.reptileFeedingBoxID)?.name }
                                            {
                                                feedingBoxes.find(_ => _.id === reptile.reptileFeedingBoxID)?.type === "CABINET"
                                                ? ` 第${feedingBoxIndexes.find(_ => _.id === reptile.reptileFeedingBoxIndexCollectionID)?.horizontalIndex}排${feedingBoxIndexes.find(_ => _.id === reptile.reptileFeedingBoxIndexCollectionID)?.verticalIndex}列`
                                                : ""
                                            }
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
