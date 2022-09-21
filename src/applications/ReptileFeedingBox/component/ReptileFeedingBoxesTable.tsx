import React, { ChangeEvent, FC, useState } from 'react';
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

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Label from '../../../components/Label';

import { ReptileFeedingBox, ReptileFeedingBoxIndexCollection, ReptileFeedingBoxType } from '../../../models';

import BulkActions from '../../../components/BulkActions';

interface ReptileFeedingBoxesTableProps {
  className?: string;
  reptileFeedingBoxes: ReptileFeedingBox[];
  reptileFeedingBoxIndexes: ReptileFeedingBoxIndexCollection[];
  onReptileFeedingBoxEditing: (reptileFeedingBox: ReptileFeedingBox) => any;
  onReptileFeedingBoxesDeleting: (reptileFeedingBoxIds: string[]) => any;
}

interface Filters {
  type?: ReptileFeedingBoxType;
}

const getTypeLabel = (reptileFeedingBoxType: ReptileFeedingBoxType): JSX.Element => {
  const map = {
    [ReptileFeedingBoxType.BOX]: {
      text: '饲育盒',
      color: 'error'
    },
    [ReptileFeedingBoxType.CABINET]: {
      text: '爬柜',
      color: 'success'
    }
  };

  const { text, color }: any = map[reptileFeedingBoxType];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (
  reptileFeedingBoxes: ReptileFeedingBox[],
  filters: Filters
): ReptileFeedingBox[] => {
  return reptileFeedingBoxes.filter((reptileFeedingBox) => {
    let matches = true;

    if (filters.type && reptileFeedingBox.type !== filters.type) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  reptileFeedingBoxes: ReptileFeedingBox[],
  page: number,
  limit: number
): ReptileFeedingBox[] => {
  return reptileFeedingBoxes.slice(page * limit, page * limit + limit);
};

const ReptileFeedingBoxesTable: FC<ReptileFeedingBoxesTableProps> = ({
  reptileFeedingBoxes,
  reptileFeedingBoxIndexes,
  onReptileFeedingBoxEditing,
  onReptileFeedingBoxesDeleting
}) => {
  const [selectedReptileFeedingBoxes, setSelectedReptileFeedingBoxes] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedReptileFeedingBoxes.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [filters, setFilters] = useState<Filters>({
    type: undefined
  });

  const typeOptions = [
    {
      id: 'all',
      name: '全部'
    },
    {
      id: ReptileFeedingBoxType.BOX,
      name: '饲育盒'
    },
    {
      id: ReptileFeedingBoxType.CABINET,
      name: '爬柜'
    }
  ];

  const handleTypeChange: any = (e: ChangeEvent<HTMLInputElement>): void => {
    let value: any = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      type: value
    }));
  };

  const handleSelectAllReptileFeedingBoxes = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedReptileFeedingBoxes(
      event.target.checked
        ? reptileFeedingBoxes.map((reptileFeedingBoxes) => reptileFeedingBoxes.id)
        : []
    );
  };

  const handleSelectOneReptileFeedingBox = (
    event: ChangeEvent<HTMLInputElement>,
    reptileFeedingBoxId: string
  ): void => {
    if (!selectedReptileFeedingBoxes.includes(reptileFeedingBoxId)) {
      setSelectedReptileFeedingBoxes((prevSelected) => [
        ...prevSelected,
        reptileFeedingBoxId
      ]);
    } else {
      setSelectedReptileFeedingBoxes((prevSelected) =>
        prevSelected.filter((id) => id !== reptileFeedingBoxId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const calculateIndexCountInCurrentReptileFeedingBox = (reptileFeedingBox: ReptileFeedingBox) => reptileFeedingBoxIndexes.filter(
    reptileFeedingBoxIndex => reptileFeedingBoxIndex.reptileFeedingBoxID === reptileFeedingBox.id
  ).length;

  const filteredReptileFeedingBoxes = applyFilters(reptileFeedingBoxes, filters);
  const paginatedReptileFeedingBoxes = applyPagination(
    filteredReptileFeedingBoxes,
    page,
    limit
  );
  const selectedSomeReptileFeedingBoxes =
    selectedReptileFeedingBoxes.length > 0 &&
    selectedReptileFeedingBoxes.length < reptileFeedingBoxes.length;
  const selectedAllReptileFeedingBoxes =
    selectedReptileFeedingBoxes.length === reptileFeedingBoxes.length;
  const theme = useTheme();

  const handleBulkDeleting = () => {
    onReptileFeedingBoxesDeleting(selectedReptileFeedingBoxes);
    setSelectedReptileFeedingBoxes([]);
  };

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions onBulkDeleting={handleBulkDeleting} />
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
          title="饲育容器管理"
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
                  checked={selectedAllReptileFeedingBoxes}
                  indeterminate={selectedSomeReptileFeedingBoxes}
                  onChange={handleSelectAllReptileFeedingBoxes}
                />
              </TableCell>
              <TableCell>名称 / 位置</TableCell>
              <TableCell>饲育盒类型</TableCell>
              <TableCell>在录爬宠</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedReptileFeedingBoxes.map((reptileFeedingBox) => {
              const isReptileFeedingBoxSelected = selectedReptileFeedingBoxes.includes(
                reptileFeedingBox.id
              );
              return (
                <TableRow
                  hover
                  key={reptileFeedingBox.id}
                  selected={isReptileFeedingBoxSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isReptileFeedingBoxSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneReptileFeedingBox(event, reptileFeedingBox.id)
                      }
                      value={isReptileFeedingBoxSelected}
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
                      {reptileFeedingBox.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getTypeLabel(reptileFeedingBox.type as ReptileFeedingBoxType)}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {calculateIndexCountInCurrentReptileFeedingBox(reptileFeedingBox)}
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
                        onClick={onReptileFeedingBoxEditing.bind(null, reptileFeedingBox)}
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
                        onClick={onReptileFeedingBoxesDeleting.bind(null, [reptileFeedingBox.id])}
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
          count={filteredReptileFeedingBoxes.length}
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

ReptileFeedingBoxesTable.propTypes = {
  reptileFeedingBoxes: PropTypes.array.isRequired
};

ReptileFeedingBoxesTable.defaultProps = {
  reptileFeedingBoxes: []
};

export default ReptileFeedingBoxesTable;
