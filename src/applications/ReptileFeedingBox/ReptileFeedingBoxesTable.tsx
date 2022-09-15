import React, {ChangeEvent, FC, useState} from 'react';
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
import Label from '../../components/Label';

import {ReptileFeedingBox, ReptileFeedingBoxType} from '../../models';

import BulkActions from './BulkActions';

interface ReptileFeedingBoxesTableProps {
    className?: string;
    reptileReptileFeedingBoxes: ReptileFeedingBox[];
    onReptileFeedingBoxEditing: (reptileReptileFeedingBox: ReptileFeedingBox) => any;
    onReptileFeedingBoxesDeleting: (reptileReptileFeedingBoxIds: string[]) => any;
}

interface Filters {
    type?: ReptileFeedingBoxType;
}

const getTypeLabel = (reptileReptileFeedingBoxType: ReptileFeedingBoxType): JSX.Element => {
  const map = {
    [ReptileFeedingBoxType.BOX]: {
      text: '饲养盒',
      color: 'error'
    },
    [ReptileFeedingBoxType.CABINET]: {
      text: '爬柜',
      color: 'success'
    },
  };

  const {text, color}: any = map[reptileReptileFeedingBoxType];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (
  reptileReptileFeedingBoxes: ReptileFeedingBox[],
  filters: Filters,
): ReptileFeedingBox[] => {
  return reptileReptileFeedingBoxes.filter((reptileReptileFeedingBox) => {
    let matches = true;

    if (filters.type && reptileReptileFeedingBox.type !== filters.type) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  reptileReptileFeedingBoxes: ReptileFeedingBox[],
  page: number,
  limit: number
): ReptileFeedingBox[] => {
  return reptileReptileFeedingBoxes.slice(page * limit, page * limit + limit);
};

const ReptileFeedingBoxesTable: FC<ReptileFeedingBoxesTableProps> = ({reptileReptileFeedingBoxes, onReptileFeedingBoxEditing, onReptileFeedingBoxesDeleting}) => {
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
      name: '饲养盒'
    },
    {
      id: ReptileFeedingBoxType.CABINET,
      name: '爬柜'
    },
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
        ? reptileReptileFeedingBoxes.map((reptileReptileFeedingBoxes) => reptileReptileFeedingBoxes.id)
        : []
    );
  };

  const handleSelectOneReptileFeedingBox = (
    event: ChangeEvent<HTMLInputElement>,
    reptileReptileFeedingBoxId: string
  ): void => {
    if (!selectedReptileFeedingBoxes.includes(reptileReptileFeedingBoxId)) {
      setSelectedReptileFeedingBoxes((prevSelected) => [
        ...prevSelected,
        reptileReptileFeedingBoxId
      ]);
    } else {
      setSelectedReptileFeedingBoxes((prevSelected) =>
        prevSelected.filter((id) => id !== reptileReptileFeedingBoxId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredReptileFeedingBoxes = applyFilters(reptileReptileFeedingBoxes, filters);
  const paginatedReptileFeedingBoxes = applyPagination(
    filteredReptileFeedingBoxes,
    page,
    limit
  );
  const selectedSomeReptileFeedingBoxes =
        selectedReptileFeedingBoxes.length > 0 &&
        selectedReptileFeedingBoxes.length < reptileReptileFeedingBoxes.length;
  const selectedAllReptileFeedingBoxes =
        selectedReptileFeedingBoxes.length === reptileReptileFeedingBoxes.length;
  const theme = useTheme();

  const handleBulkDeleting = () => {
    onReptileFeedingBoxesDeleting(selectedReptileFeedingBoxes);
    setSelectedReptileFeedingBoxes([]);
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
                  checked={selectedAllReptileFeedingBoxes}
                  indeterminate={selectedSomeReptileFeedingBoxes}
                  onChange={handleSelectAllReptileFeedingBoxes}
                />
              </TableCell>
              <TableCell>名称 / 位置</TableCell>
              <TableCell>饲养盒类型</TableCell>
              <TableCell>ID</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedReptileFeedingBoxes.map((reptileReptileFeedingBox) => {
              const isReptileFeedingBoxSelected = selectedReptileFeedingBoxes.includes(
                reptileReptileFeedingBox.id
              );
              return (
                <TableRow
                  hover
                  key={reptileReptileFeedingBox.id}
                  selected={isReptileFeedingBoxSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isReptileFeedingBoxSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneReptileFeedingBox(event, reptileReptileFeedingBox.id)
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
                      {reptileReptileFeedingBox.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getTypeLabel(reptileReptileFeedingBox.type as ReptileFeedingBoxType)}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {reptileReptileFeedingBox.id}
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
                        onClick={onReptileFeedingBoxEditing.bind(null, reptileReptileFeedingBox)}
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
                        onClick={onReptileFeedingBoxesDeleting.bind(null, [reptileReptileFeedingBox.id])}
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
  reptileReptileFeedingBoxes: PropTypes.array.isRequired
};

ReptileFeedingBoxesTable.defaultProps = {
  reptileReptileFeedingBoxes: []
};

export default ReptileFeedingBoxesTable;
