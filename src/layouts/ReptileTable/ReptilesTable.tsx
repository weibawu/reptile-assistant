import React, { ChangeEvent, FC, useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';

import Label from '../../components/Label';

import BulkActions from '../../components/BulkActions';

import {
  Reptile,
  ReptileFeedingBox,
  ReptileFeedingBoxIndexCollection,
  ReptileFeedingBoxType, ReptileGenderType,
  ReptileType, ReptileWeightLog
} from '../../models';
import Stack from '@mui/material/Stack';
import {
  deduplicateJSONStringList,
  generateHashNumber,
  generateHashNumberInRange
} from '../../libs/util';

import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import DownIcon from '@mui/icons-material/KeyboardArrowDown';
import LevelIcon from '@mui/icons-material/Remove';

interface ReptilesTableProps {
  className?: string;
  reptiles: Reptile[];
  reptileTypes: ReptileType[];
  reptileFeedingBoxes: ReptileFeedingBox[];
  reptileFeedingBoxIndexes: ReptileFeedingBoxIndexCollection[];
  reptileWeightLogs: ReptileWeightLog[];
  showBulkDeleting: boolean;
  onReptilesDeleting: (reptileIds: string[]) => any;
  children?: React.ReactElement<{ reptile: Reptile }> | React.ReactElement<{ reptile: Reptile }>[];
}

interface Filters {
  value?: string;
}

type AnyFilterOption = { id: string; name: string }

type ReptileGenderLabelMap = {
  [key in ReptileGenderType]: string;
};

const reptileGenderLabelMap: ReptileGenderLabelMap = {
  [ReptileGenderType.MALE]: '公',
  [ReptileGenderType.FAMALE]: '母',
  [ReptileGenderType.POSSIBLE_MALE]: '公温',
  [ReptileGenderType.POSSIBLE_FAMALE]: '母温',
  [ReptileGenderType.UNKNOWN]: '未知',
};


const labelColorList = ['primary', 'black', 'secondary', 'error', 'warning', 'success', 'info'];

const getReptileFeedingBoxTypeLabel = (
  feedingBoxType: ReptileFeedingBoxType | undefined | null | 'BOX' | 'CABINET'
): JSX.Element => {
  const map = {
    [ReptileFeedingBoxType.BOX]: {
      text: '饲育盒',
      color: 'error'
    },
    [ReptileFeedingBoxType.CABINET]: {
      text: '爬柜',
      color: 'success'
    },
    unknown: {
      text: '未知',
      color: 'primary'
    }
  };

  const { text, color }: any = map[feedingBoxType ?? 'unknown'];

  return <Label color={color}>{text}</Label>;
};

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

const insertDefaultOptions: (options: AnyFilterOption[]) => AnyFilterOption[] = (options) => [
  { id: 'all', name: '全部' },
  ...options
];

const applyFilters = (
  reptiles: Reptile[],
  filters: Filters,
  matchKey?: keyof Reptile,
  exactStringMatcher?: (reptile: Reptile) => string
): Reptile[] => {
  if (matchKey)
    return reptiles.filter((reptile) => {
      let matches = true;

      if (filters.value && reptile[matchKey] !== filters.value) {
        matches = false;
      }

      return matches;
    });

  if (exactStringMatcher)
    return reptiles.filter((reptile) => {
      let matches = true;

      if (filters.value && exactStringMatcher(reptile) !== filters.value) {
        matches = false;
      }

      return matches;
    });

  return [];
};

const applyPagination = (reptiles: Reptile[], page: number, limit: number): Reptile[] => {
  return reptiles.slice(page * limit, page * limit + limit);
};

const ReptilesTable: FC<ReptilesTableProps> = ({
  reptiles,
  reptileTypes,
  reptileFeedingBoxes,
  reptileFeedingBoxIndexes,
  reptileWeightLogs,
  showBulkDeleting,
  onReptilesDeleting,
  children
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
      (reptileFeedingBox) => reptile.reptileFeedingBoxID === reptileFeedingBox.id
    );

    const reptileFeedingBoxIndex = reptileFeedingBoxIndexes.find(
      (reptileFeedingBoxIndex) =>
        reptileFeedingBoxIndex.id === reptile.reptileFeedingBoxIndexCollectionID
    );

    if (reptileFeedingBox?.type === ReptileFeedingBoxType.BOX) return reptileFeedingBox?.name ?? '';

    return reptileFeedingBox?.name + '第' + reptileFeedingBoxIndex?.horizontalIndex + '层';
  };

  const getReptileCurrentWeightAndPreviousWeightLabel = (reptile: Reptile) => {
    const sortedReptileWeightLogs = reptileWeightLogs.sort(
      (prevReptileWeightLog,nextReptileWeightLog) => {
        if (Date.parse(prevReptileWeightLog.meteringDateTime!) < Date.parse(nextReptileWeightLog.meteringDateTime!)) return 1;
        if (Date.parse(prevReptileWeightLog.meteringDateTime!) > Date.parse(nextReptileWeightLog.meteringDateTime!)) return -1;
        return 0;
      }
    );
    const currentReptileWeightLogs = sortedReptileWeightLogs.filter(reptileWeightLog => reptileWeightLog.reptileID === reptile.id);
    if (currentReptileWeightLogs.length === 0) return <Typography         variant="body1"
      fontWeight="bold"
      color="text.primary"
      gutterBottom
      noWrap>未监测</Typography>;
    if (currentReptileWeightLogs.length === 1) return <Typography         variant="body1"
      fontWeight="bold"
      color="text.primary"
      gutterBottom
      noWrap>{currentReptileWeightLogs[0].weight}g</Typography>;

    if(currentReptileWeightLogs[0].weight! > currentReptileWeightLogs[1].weight!) return (
      <Stack width={70} direction="row" justifyContent='space-around' alignItems='center'>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >{currentReptileWeightLogs[0].weight}g</Typography>
        <UpIcon  height={30} color='success'/>
      </Stack>
    );

    if(currentReptileWeightLogs[0].weight! < currentReptileWeightLogs[1].weight!) return (
      <Stack width={70} direction="row" justifyContent='space-around' alignItems='center'>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >{currentReptileWeightLogs[0].weight}g</Typography>
        <DownIcon height={30}  color='error'/>
      </Stack>
    );

    return (
      <Stack width={70} direction="row" justifyContent='space-around' alignItems='center'>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >{currentReptileWeightLogs[0].weight}g</Typography>
        <LevelIcon height={30} color='primary'/>
      </Stack>
    );
  };

  const reptileTypeOptions = insertDefaultOptions(
    deduplicateJSONStringList(
      reptileTypes.map((reptileType) => ({
        id: reptileType.id,
        name: reptileType.name
      }))
    )
  );

  const reptileNameOptions = insertDefaultOptions(
    deduplicateJSONStringList(
      reptiles.map((reptile) => ({
        id: reptile.name,
        name: reptile.name
      }))
    )
  );

  const reptileFeedingBoxLayerOptions = insertDefaultOptions(
    deduplicateJSONStringList(
      reptiles
        .sort((prevReptile, nextReptile) => {
          if (
            generateHashNumber(prevReptile.reptileFeedingBoxID) >
            generateHashNumber(nextReptile.reptileFeedingBoxID)
          )
            return 1;
          if (
            generateHashNumber(prevReptile.reptileFeedingBoxID) <
            generateHashNumber(nextReptile.reptileFeedingBoxID)
          )
            return -1;

          const prevReptileFeedingBoxIndex = reptileFeedingBoxIndexes.find(
            (reptileFeedingBoxIndex) =>
              reptileFeedingBoxIndex.id === prevReptile.reptileFeedingBoxIndexCollectionID
          );
          const nextReptileFeedingBoxIndex = reptileFeedingBoxIndexes.find(
            (reptileFeedingBoxIndex) =>
              reptileFeedingBoxIndex.id === nextReptile.reptileFeedingBoxIndexCollectionID
          );

          if (
            prevReptileFeedingBoxIndex!.horizontalIndex! >
            nextReptileFeedingBoxIndex!.horizontalIndex!
          )
            return 1;
          if (
            prevReptileFeedingBoxIndex!.horizontalIndex! <
            nextReptileFeedingBoxIndex!.horizontalIndex!
          )
            return -1;
          return 0;
        })
        .map((reptile) => ({
          id: getReptileFeedingBoxLayerName(reptile),
          name: getReptileFeedingBoxLayerName(reptile)
        }))
    )
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

  const handleSelectAllReptiles = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedReptiles(event.target.checked ? reptiles.map((reptiles) => reptiles.id) : []);
  };

  const handleSelectOneReptile = (
    event: ChangeEvent<HTMLInputElement>,
    reptileId: string
  ): void => {
    if (!selectedReptiles.includes(reptileId)) {
      setSelectedReptiles((prevSelected) => [...prevSelected, reptileId]);
    } else {
      setSelectedReptiles((prevSelected) => prevSelected.filter((id) => id !== reptileId));
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const reptileFeedingBoxIndexSortedReptiles = reptiles.sort((prevReptile, nextReptile) => {
    const prevReptileFeedingBoxIndex = reptileFeedingBoxIndexes.find(
      (reptileFeedingBoxIndex) =>
        reptileFeedingBoxIndex.id === prevReptile.reptileFeedingBoxIndexCollectionID
    );
    const nextReptileFeedingBoxIndex = reptileFeedingBoxIndexes.find(
      (reptileFeedingBoxIndex) =>
        reptileFeedingBoxIndex.id === nextReptile.reptileFeedingBoxIndexCollectionID
    );

    if (
      generateHashNumber(prevReptile.reptileFeedingBoxID) >
      generateHashNumber(nextReptile.reptileFeedingBoxID)
    )
      return 1;
    if (
      generateHashNumber(prevReptile.reptileFeedingBoxID) <
      generateHashNumber(nextReptile.reptileFeedingBoxID)
    )
      return -1;

    if (prevReptileFeedingBoxIndex!.horizontalIndex! > nextReptileFeedingBoxIndex!.horizontalIndex!)
      return 1;
    if (prevReptileFeedingBoxIndex!.horizontalIndex! < nextReptileFeedingBoxIndex!.horizontalIndex!)
      return -1;

    if (prevReptileFeedingBoxIndex!.verticalIndex! > nextReptileFeedingBoxIndex!.verticalIndex!)
      return 1;
    if (prevReptileFeedingBoxIndex!.verticalIndex! < nextReptileFeedingBoxIndex!.verticalIndex!)
      return -1;
    return 0;
  });

  const filteredReptileTypeReptiles = applyFilters(
    reptileFeedingBoxIndexSortedReptiles,
    reptileTypeFilters,
    'reptileTypeID'
  );
  const filteredReptileNameReptiles = applyFilters(
    filteredReptileTypeReptiles,
    reptileNameFilters,
    'name'
  );

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
    selectedReptiles.length > 0 && selectedReptiles.length < reptiles.length;
  const selectedAllReptiles = selectedReptiles.length === reptiles.length;

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
                  <InputLabel>饲育容器</InputLabel>
                  <Select
                    value={reptileFeedingBoxLayerFilters.value || 'all'}
                    onChange={handleReptileFeedingBoxLayerChange}
                    label="饲育容器"
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
                  <InputLabel>品种</InputLabel>
                  <Select
                    value={reptileNameFilters.value || 'all'}
                    onChange={handleReptileNameChange}
                    label="品种"
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
                {showBulkDeleting ? (
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selectedAllReptiles}
                      indeterminate={selectedSomeReptiles}
                      onChange={handleSelectAllReptiles}
                    />
                  </TableCell>
                ) : null}
                <TableCell>所属科</TableCell>
                <TableCell>品种</TableCell>
                <TableCell>性别</TableCell>
                <TableCell>基因</TableCell>
                <TableCell>体重(g)</TableCell>
                <TableCell>出生日期</TableCell>
                <TableCell>所在爬柜/饲育盒</TableCell>
                <TableCell>别名</TableCell>
                <TableCell align="right">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedReptiles.map((reptile) => {
                const isReptileSelected = selectedReptiles.includes(reptile.id);
                return (
                  <TableRow hover key={reptile.id} selected={isReptileSelected}>
                    {showBulkDeleting ? (
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
                    ) : null}
                    <TableCell>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {reptileTypes.find((_) => _.id === reptile.reptileTypeID)?.name}
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
                        {reptileGenderLabelMap[reptile.gender as ReptileGenderType]}
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
                        {
                          (reptile.genies ?? [])
                            .slice()
                            .sort((prev, next) => generateHashNumber(prev!) - generateHashNumber(next!))
                            .map((genie) => getTextLabel(genie!))
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
                        {getReptileCurrentWeightAndPreviousWeightLabel(reptile)}
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
                        {getReptileFeedingBoxTypeLabel(
                          reptileFeedingBoxes.find(
                            (reptileFeedingBox) =>
                              reptileFeedingBox.id === reptile.reptileFeedingBoxID
                          )?.type
                        )}
                        &nbsp;
                        {getTextLabel(
                          reptileFeedingBoxes.find(
                            (reptileFeedingBox) =>
                              reptileFeedingBox.id === reptile.reptileFeedingBoxID
                          )?.name ?? ''
                        )}
                        &nbsp;
                        {reptileFeedingBoxes.find(
                          (reptileFeedingBox) =>
                            reptileFeedingBox.id === reptile.reptileFeedingBoxID
                        )?.type === 'CABINET'
                          ? getTextLabel(
                            `第${
                              reptileFeedingBoxIndexes.find(
                                (_) => _.id === reptile.reptileFeedingBoxIndexCollectionID
                              )?.horizontalIndex
                            }层${
                              reptileFeedingBoxIndexes.find(
                                (_) => _.id === reptile.reptileFeedingBoxIndexCollectionID
                              )?.verticalIndex
                            }列`
                          )
                          : ''}
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
                      {React.Children.map(children, (child) => {
                        {
                          if (React.isValidElement(child)) {
                            return React.cloneElement(child, {
                              reptile
                            });
                          }
                          return child;
                        }
                      })}
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
