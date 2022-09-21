import React, { ChangeEvent, FC, useContext, useState } from 'react';
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
  Select, SelectChangeEvent,
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
import LogIcon from '@mui/icons-material/CollectionsBookmark';
import AddIcon from '@mui/icons-material/Add';

import BulkActions from '../../components/BulkActions';

import {
  Reptile,
  ReptileFeedingBox,
  ReptileFeedingBoxIndexCollection,
  ReptileFeedingBoxType, ReptileFeedingLog,
  ReptileType
} from '../../models';
import Stack from '@mui/material/Stack';
import { deduplicateJSONStringList, generateHashNumberInRange } from '../../libs/util';
import { ReptileFeedingLogContext } from '../ReptileFeedingLog/ReptileFeedingLogContext';
import ModifyFeedingLogModal from '../ReptileFeedingLog/ModifyFeedingLogModal';

interface ReptilesTableProps {
  className?: string;
  reptiles: Reptile[],
  reptileTypes: ReptileType[],
  reptileFeedingBoxes: ReptileFeedingBox[],
  reptileFeedingBoxIndexes: ReptileFeedingBoxIndexCollection[],
  onReptileEditing: (reptile: Reptile) => any;
  onLogShowing: (reptile: Reptile) => any;
  onReptilesDeleting: (reptileIds: string[]) => any;
  onModifyReptileFeedingLogModalOpen: (reptile: Reptile, reptileFeedingLog: ReptileFeedingLog) => any;
}

interface Filters {
  value?: string;
}

type AnyFilterOption = { id: string, name: string };

const labelColorList = ['primary', 'black', 'secondary', 'error', 'warning', 'success', 'info'];

const getReptileFeedingBoxTypeLabel = (feedingBoxType: ReptileFeedingBoxType | undefined | null | 'BOX' | 'CABINET'): JSX.Element => {
  const map = {
    [ReptileFeedingBoxType.BOX]: {
      text: '饲养盒',
      color: 'error'
    },
    [ReptileFeedingBoxType.CABINET]: {
      text: '爬柜',
      color: 'success'
    },
    'unknown': {
      text: '未知',
      color: 'primary'
    }
  };

  const { text, color }: any = map[feedingBoxType ?? 'unknown'];

  return <Label color={color}>{text}</Label>;
};

const getTextLabel = (text: string): JSX.Element => {
  const index = generateHashNumberInRange(text, labelColorList.length);
  const color = labelColorList[index] as 'primary' | 'black' | 'secondary' | 'error' | 'warning' | 'success' | 'info' | undefined;

  return <Label key={text} color={color}>{text}</Label>;
};

const insertDefaultOptions: (options: AnyFilterOption[]) => AnyFilterOption[] = (options) => ([
  { id: 'all', name: '全部' },
  ...options
]);

const applyFilters = (
  reptiles: Reptile[],
  filters: Filters,
  matchKey?: keyof Reptile,
  exactStringMatcher?: (reptile: Reptile) => string
): Reptile[] => {
  if (matchKey) return reptiles.filter((reptile) => {
    let matches = true;

    if (filters.value && reptile[matchKey] !== filters.value) {
      matches = false;
    }

    return matches;
  });

  if (exactStringMatcher) return reptiles.filter((reptile) => {
    let matches = true;

    if (filters.value && exactStringMatcher(reptile) !== filters.value) {
      matches = false;
    }

    return matches;
  });

  return [];
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
  reptileTypes,
  reptileFeedingBoxes,
  reptileFeedingBoxIndexes,
  onReptileEditing,
  onLogShowing,
  onReptilesDeleting,
  onModifyReptileFeedingLogModalOpen
}) => {
  const [selectedReptiles, setSelectedReptiles] = useState<string[]>([]);
  const selectedBulkActions = selectedReptiles.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  const [reptileTypeFilters, setReptileTypeFilters] = useState<Filters>({});
  const [reptileNameFilters, setReptileNameFilters] = useState<Filters>({});
  const [reptileFeedingBoxLayerFilters, setReptileFeedingBoxLayerFilters] = useState<Filters>({});

  const getReptileFeedingBoxLayerName = (reptile: Reptile): string => {
    const reptileFeedingBox = reptileFeedingBoxes.find(
      reptileFeedingBox => reptile.reptileFeedingBoxID === reptileFeedingBox.id
    );

    const reptileFeedingBoxIndex = reptileFeedingBoxIndexes.find(
      reptileFeedingBoxIndex => reptileFeedingBoxIndex.id === reptile.reptileFeedingBoxIndexCollectionID
    );

    if (reptileFeedingBox?.type === ReptileFeedingBoxType.BOX) return reptileFeedingBox?.name ?? '';

    return reptileFeedingBox?.name + '第' + reptileFeedingBoxIndex?.horizontalIndex + '排';
  };

  const reptileTypeOptions = insertDefaultOptions(
    deduplicateJSONStringList(
      reptileTypes.map(
        reptileType => ({
          id: reptileType.id,
          name: reptileType.name
        })
      ))
  );

  const reptileNameOptions = insertDefaultOptions(
    deduplicateJSONStringList(reptiles.map(
      reptile => ({
        id: reptile.name,
        name: reptile.name
      })
    ))
  );

  const reptileFeedingBoxLayerOptions = insertDefaultOptions(
    deduplicateJSONStringList(reptiles.map(
      reptile => ({
        id: getReptileFeedingBoxLayerName(reptile),
        name: getReptileFeedingBoxLayerName(reptile)
      })
    ))
  );

  const handleReptileTypeChange = (e: SelectChangeEvent): void => {
    let value: string;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setReptileTypeFilters((prevFilters) => ({
      ...prevFilters,
      value
    }));
  };

  const handleReptileNameChange = (e: SelectChangeEvent): void => {
    let value: string;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setReptileNameFilters((prevFilters) => ({
      ...prevFilters,
      value
    }));
  };

  const handleReptileFeedingBoxLayerChange = (e: SelectChangeEvent): void => {
    let value: string;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setReptileFeedingBoxLayerFilters((prevFilters) => ({
      ...prevFilters,
      value
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

  const filteredReptileTypeReptiles = applyFilters(reptiles, reptileTypeFilters, 'reptileTypeID');
  const filteredReptileNameReptiles = applyFilters(filteredReptileTypeReptiles, reptileNameFilters, 'name');

  const filteredFeedingBoxAndFeedingBoxLayerReptiles = applyFilters(
    filteredReptileNameReptiles,
    reptileFeedingBoxLayerFilters,
    undefined,
    getReptileFeedingBoxLayerName
  );

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
  };

  return (
    <>
      <Card>
        {selectedBulkActions && (
          <Box flex={1} p={2}>
            <BulkActions onBulkDeleting={handleBulkDeleting} />
          </Box>
        )}
        {!selectedBulkActions && (
          <CardHeader
            action={
              <Stack direction={'row'} justifyContent={'space-around'} width={500}>
                <FormControl variant="outlined">
                  <InputLabel>爬柜</InputLabel>
                  <Select
                    value={reptileFeedingBoxLayerFilters.value || 'all'}
                    onChange={handleReptileFeedingBoxLayerChange}
                    label="爬柜"
                    autoWidth
                  >
                    {reptileFeedingBoxLayerOptions.map((statusOption) => (
                      <MenuItem key={statusOption.id} value={statusOption.id}>
                        {statusOption.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl variant="outlined">
                  <InputLabel>种类</InputLabel>
                  <Select
                    value={reptileNameFilters.value || 'all'}
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
                    value={reptileTypeFilters.value || 'all'}
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
        <Divider />
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
                        {reptile.gender === 'MALE' ? '公' : '母'}
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
                        {(reptile.genies ?? []).map(genie => getTextLabel(genie!))}
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
                        {getReptileFeedingBoxTypeLabel(
                          reptileFeedingBoxes.find(
                            reptileFeedingBox => reptileFeedingBox.id === reptile.reptileFeedingBoxID
                          )?.type
                        )
                        }
                        &nbsp;
                        {
                          getTextLabel(
                            reptileFeedingBoxes.find(
                              reptileFeedingBox => reptileFeedingBox.id === reptile.reptileFeedingBoxID)?.name
                            ?? ''
                          )
                        }
                        &nbsp;
                        {
                          reptileFeedingBoxes.find(reptileFeedingBox => reptileFeedingBox.id === reptile.reptileFeedingBoxID)?.type === 'CABINET'
                            ? getTextLabel(
                              `第${
                                reptileFeedingBoxIndexes.find(_ => _.id === reptile.reptileFeedingBoxIndexCollectionID)?.horizontalIndex
                              }排${
                                reptileFeedingBoxIndexes.find(_ => _.id === reptile.reptileFeedingBoxIndexCollectionID)?.verticalIndex}列`
                            )
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
                        {reptile.nickname}
                      </Typography>
                    </TableCell>
                    <TableCell width={200} align="right">
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
                          onClick={onModifyReptileFeedingLogModalOpen.bind(null, reptile, new ReptileFeedingLog({ reptileID: reptile.id }))}
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
                          onClick={onLogShowing.bind(null, reptile)}
                        >
                          <LogIcon fontSize="small" />
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
                          onClick={onReptilesDeleting.bind(null, [reptile.id])}
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
            count={filteredReptileNameReptiles.length}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[10, 25, 30]}
          />
        </Box>
      </Card>
    </>
  );
};

export default ReptilesTable;
