import {ChangeEvent, FC, useState} from 'react';
import {format} from 'date-fns';
import numeral from 'numeral';
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

interface ReptileFeedingBoxesTableProps {
  className?: string;
  reptileFeedingBoxes: ReptileFeedingBox[];
}

interface Filters {
  type?: ReptileFeedingBoxType;
}

const getTypeLabel = (reptileFeedingBoxType: ReptileFeedingBoxType): JSX.Element => {
  const map = {
    [ReptileFeedingBoxType.BOX]: {
      text: "BOX",
      color: 'error'
    },
    [ReptileFeedingBoxType.CABINET]: {
      text: "CABINET",
      color: 'success'
    },
  };

  console.log(reptileFeedingBoxType);

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

const ReptileFeedingBoxesTable: FC<ReptileFeedingBoxesTableProps> = ({ reptileFeedingBoxes }) => {
  const [selectedReptileFeedingBoxes, setSelectedReptileFeedingBoxes] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedReptileFeedingBoxes.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    type: null
  });

  const typeOptions = [
    {
      id: 'all',
      name: 'All'
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
    Promise.all(selectedReptileFeedingBoxes.map(
        id => DataStore.delete(ReptileFeedingBox, id)
    ))
  }

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
          title="Reptile Feeding Boxes"
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
              <TableCell>NAME</TableCell>
              <TableCell>TYPE</TableCell>
              <TableCell>ID</TableCell>
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
                      {reptileFeedingBox.id}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Order" arrow>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Order" arrow>
                      <IconButton
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.error.main
                        }}
                        color="inherit"
                        size="small"
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
          rowsPerPageOptions={[5, 10, 25, 30]}
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
