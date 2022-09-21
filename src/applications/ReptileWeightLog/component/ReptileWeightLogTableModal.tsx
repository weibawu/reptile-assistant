import React from 'react';

import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { Reptile } from '../../../models';
import ReptileWeightLogs from './ReptileWeightLogs';

export interface ReptileFeedingBoxModificationModalProps {
  open: boolean;
  onClose: () => void;
  viewableLogReptile?: Reptile;
}

function WeightLogTableModal(props: ReptileFeedingBoxModificationModalProps) {
  const {onClose, open, viewableLogReptile} = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open} fullScreen>
      <DialogTitle>
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <ReptileWeightLogs viewableReptile={viewableLogReptile} />
      </DialogContent>
    </Dialog>
  );
}

WeightLogTableModal.defaultProps = {
  editableReptileFeedingBox: undefined,
};

export default WeightLogTableModal;
