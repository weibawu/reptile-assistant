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
    reptileFeedingBoxes: ReptileFeedingBox[];
    onFeedingBoxEditing: (reptileFeedingBox: ReptileFeedingBox) => any;
    onFeedingBoxesDeleting: (reptileFeedingBoxIds: string[]) => any;
}

interface Filters {
    type?: ReptileFeedingBoxType;
}

const getTypeLabel = (reptileFeedingBoxType: ReptileFeedingBoxType): JSX.Element => {
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

  const {text, color}: any = map[reptileFeedingBoxType];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (
  reptileFeedingBoxes: ReptileFeedingBox[],
  filters: Filters,
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

const ReptileFeedingBoxesTable: FC<ReptileFeedingBoxesTableProps> = ({reptileFeedingBoxes, onFeedingBoxEditing, onFeedingBoxesDeleting}) => {
  const [selectedFeedingBoxes, setSelectedFeedingBoxes] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedFeedingBoxes.length > 0;
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

  const handleSelectAllFeedingBoxes = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedFeedingBoxes(
      event.target.checked
        ? reptileFeedingBoxes.map((reptileFeedingBoxes) => reptileFeedingBoxes.id)
        : []
    );
  };

  const handleSelectOneFeedingBox = (
    event: ChangeEvent<HTMLInputElement>,
    reptileFeedingBoxId: string
  ): void => {
    if (!selectedFeedingBoxes.includes(reptileFeedingBoxId)) {
      setSelectedFeedingBoxes((prevSelected) => [
        ...prevSelected,
        reptileFeedingBoxId
      ]);
    } else {
      setSelectedFeedingBoxes((prevSelected) =>
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

  const filteredFeedingBoxes = applyFilters(reptileFeedingBoxes, filters);
  const paginatedFeedingBoxes = applyPagination(
    filteredFeedingBoxes,
    page,
    limit
  );
  const selectedSomeFeedingBoxes =
        selectedFeedingBoxes.length > 0 &&
        selectedFeedingBoxes.length < reptileFeedingBoxes.length;
  const selectedAllFeedingBoxes =
        selectedFeedingBoxes.length === reptileFeedingBoxes.length;
  const theme = useTheme();

  const handleBulkDeleting = () => {
    onFeedingBoxesDeleting(selectedFeedingBoxes);
    setSelectedFeedingBoxes([]);
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
            {paginatedFeedingBoxes.map((reptileFeedingBox) => {
              const isFeedingBoxSelected = selectedFeedingBoxes.includes(
                reptileFeedingBox.id
              );
              return (
                <TableRow
                  hover
                  key={reptileFeedingBox.id}
                  selected={isFeedingBoxSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isFeedingBoxSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneFeedingBox(event, reptileFeedingBox.id)
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
                      {reptileFeedingBox.id}
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
                        onClick={onFeedingBoxEditing.bind(null, reptileFeedingBox)}
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
                        onClick={onFeedingBoxesDeleting.bind(null, [reptileFeedingBox.id])}
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

ReptileFeedingBoxesTable.propTypes = {
  reptileFeedingBoxes: PropTypes.array.isRequired
};

ReptileFeedingBoxesTable.defaultProps = {
  reptileFeedingBoxes: []
};

export default ReptileFeedingBoxesTable;
