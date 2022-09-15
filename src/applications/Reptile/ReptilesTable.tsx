import {ChangeEvent, FC, useEffect, useMemo, useState} from 'react';
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
import LogIcon from '@mui/icons-material/CollectionsBookmark';
import BulkActions from './BulkActions';
import {
    Reptile,
    ReptileFeedingBox,
    ReptileFeedingBoxIndexCollection, ReptileFeedingBoxType,
    ReptileGenderType,
    ReptileType
} from "../../../models";
import {DataStore} from "aws-amplify";
import {useAuthenticator} from "@aws-amplify/ui-react";
import Stack from "@mui/material/Stack";

interface ReptilesTableProps {
    className?: string;
    reptiles: Reptile[];
    reptileTypes: ReptileType[];
    feedingBoxes: ReptileFeedingBox[];
    feedingBoxIndexes: ReptileFeedingBoxIndexCollection[];
    onReptileEditing: (reptile: Reptile) => any;
    onLogShowing: (reptile: Reptile) => any;
    onReptilesDeleting: (reptileIds: string[]) => any;
}

interface ReptileTypeFilters {
    type?: string;
}

interface ReptileNameFilters {
    name?: string;
}

interface ReptileFeedingBoxAndFeedingBoxLayerFilters {
    nameAndLayer?: string;
}

const getFeedingBoxTypeLabel = (feedingBoxType: ReptileFeedingBoxType | "BOX" | "CABINET" | undefined): JSX.Element => {
    if (!feedingBoxType) return null;
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

const getTextLabel = (feedingBoxName: string): JSX.Element => {
    if (!feedingBoxName) return null;
    const colorMap = ['primary', 'black', 'secondary', 'error', 'warning', 'success', 'info'];
    return <Label color={colorMap[Math.floor(Math.random() * colorMap.length + 1)] as any}>{feedingBoxName}</Label>;
};

const getGenieLabel = (genie: string): JSX.Element => {
    if (!genie) return null;
    const colorMap = ['primary', 'black', 'secondary', 'error', 'warning', 'success', 'info'];
    return (<>
            <Label color={colorMap[Math.floor(Math.random() * colorMap.length + 1)] as any}>{genie}</Label>
            &nbsp;
        </>
    );
};

const applyReptileTypeFilters = (
    reptiles: Reptile[],
    filters: ReptileTypeFilters,
): Reptile[] => {
    return reptiles.filter((reptile) => {
        let matches = true;

        if (filters.type && reptile.reptileTypeID !== filters.type) {
            matches = false;
        }

        return matches;
    });
};

const applyReptileNameFilters = (
    reptiles: Reptile[],
    filters: ReptileNameFilters,
): Reptile[] => {
    return reptiles.filter((reptile) => {
        let matches = true;

        if (filters.name && reptile.name !== filters.name) {
            matches = false;
        }

        return matches;
    });
};

const getFeedingBoxAndFeedingBoxLayerName = (
    reptile: Reptile,
    reptileFeedingBoxes: ReptileFeedingBox[],
    reptileFeedingBoxIndexCollections: ReptileFeedingBoxIndexCollection[],
) => {

    const box = reptileFeedingBoxes.find(box => reptile.reptileFeedingBoxID === box.id);
    const index = reptileFeedingBoxIndexCollections.find(_ => _.id === reptile.reptileFeedingBoxIndexCollectionID);

    if (box?.type === 'BOX') return box?.name;

    return box?.name + '第' + index?.horizontalIndex + '排';
}

const applyReptileFeedingBoxAndFeedingBoxLayerFilters = (
    reptiles: Reptile[],
    reptileFeedingBoxes: ReptileFeedingBox[],
    reptileFeedingBoxIndexCollections: ReptileFeedingBoxIndexCollection[],
    filters: ReptileFeedingBoxAndFeedingBoxLayerFilters,
): Reptile[] => {
    return reptiles.filter((reptile) => {
        let matches = true;

        if (filters.nameAndLayer && getFeedingBoxAndFeedingBoxLayerName(reptile, reptileFeedingBoxes, reptileFeedingBoxIndexCollections) !== filters.nameAndLayer) {
            matches = false;
        }

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

const ReptilesTable: FC<ReptilesTableProps> = ({
                                                   reptiles,
                                                   onReptileEditing,
                                                   onLogShowing,
                                                   onReptilesDeleting,
                                                   reptileTypes,
                                                   feedingBoxes,
                                                   feedingBoxIndexes
                                               }) => {
    const [selectedReptiles, setSelectedReptiles] = useState<string[]>(
        []
    );
    const selectedBulkActions = selectedReptiles.length > 0;
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [reptileTypeFilters, setReptileTypeFilters] = useState<ReptileTypeFilters>({
        type: null
    });
    const [reptileNameFilters, setReptileNameFilters] = useState<ReptileNameFilters>({
        name: null
    });
    const [reptileFeedingBoxAndFeedingBoxLayerFilters, setReptileFeedingBoxAndFeedingBoxLayerFilters] = useState<ReptileFeedingBoxAndFeedingBoxLayerFilters>({
        nameAndLayer: null
    });

    const reptileTypeOptions = [
        {
            id: 'all',
            name: '全部'
        },
        ...reptileTypes.map(reptileType => ({
            id: reptileType.id,
            name: reptileType.name,
        })),];

    const reptileNameOptions = [
        {id: 'all', name: '全部'},
        ...Array.from(new Set(reptiles.map(_ => JSON.stringify({id: _.name, name: _.name})))).map(_ => JSON.parse(_)),
    ];

    const reptileFeedingBoxAndFeedingBoxLayerOptions = [
        {id: 'all', name: '全部'},
        ...Array.from(new Set(reptiles.map(_ => JSON.stringify({
            id: getFeedingBoxAndFeedingBoxLayerName(_, feedingBoxes, feedingBoxIndexes),
            name: getFeedingBoxAndFeedingBoxLayerName(_, feedingBoxes, feedingBoxIndexes)
        })))).map(_ => JSON.parse(_)),
    ];

    const handleReptileTypeChange = (e: ChangeEvent<HTMLInputElement>): void => {
        let value = null;

        if (e.target.value !== 'all') {
            value = e.target.value;
        }

        setReptileTypeFilters((prevFilters) => ({
            ...prevFilters,
            type: value
        }));
    };

    const handleReptileNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
        let value = null;

        if (e.target.value !== 'all') {
            value = e.target.value;
        }

        setReptileNameFilters((prevFilters) => ({
            ...prevFilters,
            name: value
        }));
    };

    const handleReptileFeedingBoxAndFeedingBoxLayerChange = (e: ChangeEvent<HTMLInputElement>): void => {
        let value = null;

        if (e.target.value !== 'all') {
            value = e.target.value;
        }

        setReptileFeedingBoxAndFeedingBoxLayerFilters((prevFilters) => ({
            ...prevFilters,
            nameAndLayer: value
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

    const filteredReptileTypeReptiles = applyReptileTypeFilters(reptiles, reptileTypeFilters);
    const filteredReptileNameReptiles = applyReptileNameFilters(filteredReptileTypeReptiles, reptileNameFilters);
    const filteredFeedingBoxAndFeedingBoxLayerReptiles = applyReptileFeedingBoxAndFeedingBoxLayerFilters(filteredReptileNameReptiles, feedingBoxes, feedingBoxIndexes, reptileFeedingBoxAndFeedingBoxLayerFilters);
    const paginatedReptiles = applyPagination(
        filteredFeedingBoxAndFeedingBoxLayerReptiles,
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
                        <Stack direction={"row"} justifyContent={"space-around"} width={500}>
                            <FormControl variant="outlined">
                                <InputLabel>爬柜</InputLabel>
                                <Select
                                    value={reptileFeedingBoxAndFeedingBoxLayerFilters.nameAndLayer || 'all'}
                                    onChange={handleReptileFeedingBoxAndFeedingBoxLayerChange}
                                    label="爬柜"
                                    autoWidth
                                >
                                    {reptileFeedingBoxAndFeedingBoxLayerOptions.map((statusOption) => (
                                        <MenuItem key={statusOption.id} value={statusOption.id}>
                                            {statusOption.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined">
                                <InputLabel>种类</InputLabel>
                                <Select
                                    value={reptileNameFilters.name || 'all'}
                                    onChange={handleReptileNameChange}
                                    label="种类"
                                    autoWidth
                                >
                                    {reptileNameOptions.map((statusOption) => (
                                        <MenuItem key={statusOption.id} value={statusOption.id}>
                                            {statusOption.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined">
                                <InputLabel>所属科</InputLabel>
                                <Select
                                    value={reptileTypeFilters.type || 'all'}
                                    onChange={handleReptileTypeChange}
                                    label="所属科"
                                    autoWidth
                                >
                                    {reptileTypeOptions.map((statusOption) => (
                                        <MenuItem key={statusOption.id} value={statusOption.id}>
                                            {statusOption.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
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
                            <TableCell>性别</TableCell>
                            <TableCell>基因</TableCell>
                            <TableCell>体重(g)</TableCell>
                            <TableCell>出生日期</TableCell>
                            <TableCell>所属科</TableCell>
                            <TableCell>所在爬柜/饲养盒</TableCell>
                            <TableCell>别名</TableCell>
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
                                            {reptile.gender === "MALE" ? '公' : '母'}
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
                                            {reptile.genies.map(genie => getGenieLabel(genie))}
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
                                        {reptileTypes.find(_ => _.id === reptile.reptileTypeID)?.name}
                                        {/*{getReptileTypeLabel(reptileTypes.find(_ => _.id === reptile.reptileTypeID))}*/}
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {getFeedingBoxTypeLabel(feedingBoxes.find(_ => _.id === reptile.reptileFeedingBoxID)?.type)}
                                            &nbsp;
                                            {getTextLabel(feedingBoxes.find(_ => _.id === reptile.reptileFeedingBoxID)?.name)}
                                            &nbsp;
                                            {
                                                feedingBoxes.find(_ => _.id === reptile.reptileFeedingBoxID)?.type === "CABINET"
                                                    ? getTextLabel(`第${feedingBoxIndexes.find(_ => _.id === reptile.reptileFeedingBoxIndexCollectionID)?.horizontalIndex}排${feedingBoxIndexes.find(_ => _.id === reptile.reptileFeedingBoxIndexCollectionID)?.verticalIndex}列`)
                                                    : ""
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
                                            {reptile.nickname}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="日志" arrow>
                                            <IconButton
                                                sx={{
                                                    '&:hover': {
                                                        background: theme.colors.primary.lighter
                                                    },
                                                    color: theme.palette.success.main
                                                }}
                                                color="inherit"
                                                size="small"
                                                onClick={onLogShowing.bind(null, reptile)}
                                            >
                                                <LogIcon fontSize="small"/>
                                            </IconButton>
                                        </Tooltip>
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
                    count={filteredReptileNameReptiles.length}
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
