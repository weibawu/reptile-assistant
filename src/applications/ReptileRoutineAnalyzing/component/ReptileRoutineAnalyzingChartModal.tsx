import React, { useContext } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material';

import {
  Reptile,
} from '../../../models';

import CloseIcon from '@mui/icons-material/Close';
import { ReptileContext } from '../../../libs/context/ReptileContext';
import LineChart from '../../../components/LineChart';
import { format } from 'date-fns';

export interface ReptileModificationModalProps {
  open: boolean
  onClose: () => void
  editableReptile?: Reptile
}

function ReptileRoutineAnalyzingChartModal(props: ReptileModificationModalProps) {
  const { onClose, open, editableReptile } = props;

  const { loading, reptileWeightLogs } = useContext(ReptileContext);

  const currentReptileWeightLogs = reptileWeightLogs.filter(
    (currentReptileWeightLog) => currentReptileWeightLog.reptileID === editableReptile?.id,
  );

  const xAxisData = currentReptileWeightLogs
    .slice()
    .sort((prevReptileWeightLog, nextReptileWeightLog) =>
      Date.parse(prevReptileWeightLog.meteringDateTime!) -
      Date.parse(nextReptileWeightLog.meteringDateTime!)
    )
    .map((currentReptileWeightLog) =>
      format(new Date(currentReptileWeightLog.meteringDateTime!), 'yyyy年MM月dd日 HH:mm:ss'),
    );
  const seriesData = currentReptileWeightLogs
    .slice()
    .sort((prevReptileWeightLog, nextReptileWeightLog) =>
      Date.parse(prevReptileWeightLog.meteringDateTime!) -
      Date.parse(nextReptileWeightLog.meteringDateTime!))
    .map(
      (currentReptileWeightLog) => currentReptileWeightLog.weight,
    );

  if (loading) return null;

  return (
    <Dialog fullScreen onClose={onClose} open={open}>
      <DialogTitle>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <IconButton edge='start' color='inherit' onClick={onClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <LineChart
          title={(editableReptile?.nickname ?? editableReptile?.name) + '的成长曲线图'}
          xAxisData={xAxisData}
          seriesData={seriesData}
        ></LineChart>
      </DialogContent>
      <DialogActions>
        <Button type='submit'>完成</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReptileRoutineAnalyzingChartModal;
