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
  Select, SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

import Label from '../../components/Label';

import BulkActions from '../../components/BulkActions';

import {
  Reptile,
  ReptileFeedingBox,
  ReptileFeedingBoxIndexCollection,
  ReptileFeedingBoxType,
  ReptileType
} from '../../models';
import Stack from '@mui/material/Stack';
import { deduplicateJSONStringList, generateHashNumber, generateHashNumberInRange } from '../../libs/util';

interface ReptilesTableProps {
  className?: string;
  reptiles: Reptile[],
  reptileTypes: ReptileType[],
  reptileFeedingBoxes: ReptileFeedingBox[],
  reptileFeedingBoxIndexes: ReptileFeedingBoxIndexCollection[],
  showBulkDeleting: boolean,
  onReptilesDeleting: (reptileIds: string[]) => any;
  children?:
    | React.ReactElement<{ reptile: Reptile }>
    | React.ReactElement<{ reptile: Reptile }>[],
}

interface Filters {
  value?: string;
}

type AnyFilterOption = { id: string, name: string };

const labelColorList = ['primary', 'black', 'secondary', 'error', 'warning', 'success', 'info'];

const getReptileFeedingBoxTypeLabel = (feedingBoxType: ReptileFeedingBoxType | undefined | null | 'BOX' | 'CABINET'): JSX.Element => {
  const map = {
    [ReptileFeedingBoxType.BOX]: {
      text: '饲育盒',
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
      reptileFeedingBox => reptile.reptileFeedingBoxID === reptileFeedingBox.id
    );

    const reptileFeedingBoxIndex = reptileFeedingBoxIndexes.find(
      reptileFeedingBoxIndex => reptileFeedingBoxIndex.id === reptile.reptileFeedingBoxIndexCollectionID
    );

    if (reptileFeedingBox?.type === ReptileFeedingBoxType.BOX) return reptileFeedingBox?.name ?? '';

    return reptileFeedingBox?.name + '第' + reptileFeedingBoxIndex?.horizontalIndex + '层';
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
    deduplicateJSONStringList(
      reptiles
        .sort(
          (prevReptile, nextReptile) => {
            if (generateHashNumber(prevReptile.reptileFeedingBoxID) > generateHashNumber(nextReptile.reptileFeedingBoxID)) return 1;
            if (generateHashNumber(prevReptile.reptileFeedingBoxID) < generateHashNumber(nextReptile.reptileFeedingBoxID)) return -1;

            const prevReptileFeedingBoxIndex = reptileFeedingBoxIndexes.find(reptileFeedingBoxIndex => reptileFeedingBoxIndex.id === prevReptile.reptileFeedingBoxIndexCollectionID);
            const nextReptileFeedingBoxIndex = reptileFeedingBoxIndexes.find(reptileFeedingBoxIndex => reptileFeedingBoxIndex.id === nextReptile.reptileFeedingBoxIndexCollectionID);

            if (prevReptileFeedingBoxIndex!.horizontalIndex! > nextReptileFeedingBoxIndex!.horizontalIndex!) return 1;
            if (prevReptileFeedingBoxIndex!.horizontalIndex! < nextReptileFeedingBoxIndex!.horizontalIndex!) return -1;
            return 0;
          }
        )
        .map(reptile => ({
          id: getReptileFeedingBoxLayerName(reptile),
          name: getReptileFeedingBoxLayerName(reptile)
        })
        )
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

  const reptileFeedingBoxIndexSortedReptiles = reptiles.sort(
    (prevReptile, nextReptile) => {
      const prevReptileFeedingBoxIndex = reptileFeedingBoxIndexes.find(reptileFeedingBoxIndex => reptileFeedingBoxIndex.id === prevReptile.reptileFeedingBoxIndexCollectionID);
      const nextReptileFeedingBoxIndex = reptileFeedingBoxIndexes.find(reptileFeedingBoxIndex => reptileFeedingBoxIndex.id === nextReptile.reptileFeedingBoxIndexCollectionID);

      if (generateHashNumber(prevReptile.reptileFeedingBoxID) > generateHashNumber(nextReptile.reptileFeedingBoxID)) return 1;
      if (generateHashNumber(prevReptile.reptileFeedingBoxID) < generateHashNumber(nextReptile.reptileFeedingBoxID)) return -1;

      if (prevReptileFeedingBoxIndex!.horizontalIndex! > nextReptileFeedingBoxIndex!.horizontalIndex!) return 1;
      if (prevReptileFeedingBoxIndex!.horizontalIndex! < nextReptileFeedingBoxIndex!.horizontalIndex!) return -1;

      if (prevReptileFeedingBoxIndex!.verticalIndex! > nextReptileFeedingBoxIndex!.verticalIndex!) return 1;
      if (prevReptileFeedingBoxIndex!.verticalIndex! < nextReptileFeedingBoxIndex!.verticalIndex!) return -1;
      return 0;
    }
  );

  const filteredReptileTypeReptiles = applyFilters(reptileFeedingBoxIndexSortedReptiles, reptileTypeFilters, 'reptileTypeID');
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
                {
                  showBulkDeleting
                    ? <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={selectedAllReptiles}
                        indeterminate={selectedSomeReptiles}
                        onChange={handleSelectAllReptiles}
                      />
                    </TableCell>
                    : null
                }
                <TableCell>品系名</TableCell>
                <TableCell>性别</TableCell>
                <TableCell>基因</TableCell>
                <TableCell>体重(g)</TableCell>
                <TableCell>出生日期</TableCell>
                <TableCell>所属科</TableCell>
                <TableCell>所在爬柜/饲育盒</TableCell>
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
                    {
                      showBulkDeleting
                        ? <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isReptileSelected}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              handleSelectOneReptile(event, reptile.id)
                            }
                            value={isReptileSelected}
                          />
                        </TableCell>
                        : null
                    }
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
                              }层${
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
                    <TableCell align="right">
                      {
                        React.Children.map(children,
                          child => {
                            {
                              if (React.isValidElement(child)) {
                                return React.cloneElement(child, {
                                  reptile
                                });
                              }
                              return child;
                            }
                          }
                        )
                      }
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