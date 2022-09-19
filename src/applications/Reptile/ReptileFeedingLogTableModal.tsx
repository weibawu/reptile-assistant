import React, {useEffect} from 'react';

import {Dialog, DialogContent, DialogTitle} from '@mui/material';

import { Reptile } from '../../models';
import { useReptileRepository } from '../../libs/reptile-repository/UseReptileRepository';

export interface ReptileFeedingBoxModificationModalProps {
  open: boolean;
  onClose: () => void;
  viewableLogReptile?: Reptile;
}

function FeedingLogTableModal(props: ReptileFeedingBoxModificationModalProps) {
  const {onClose, open, viewableLogReptile} = props;
  const {currentUser, reptileRepository} = useReptileRepository();

  const handleClose = () => {
    onClose();
  };

  // useEffect(() => {
  //
  // }, [viewableLogReptile]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>饲养日志</DialogTitle>
      <DialogContent>
      </DialogContent>
    </Dialog>
  );
}

FeedingLogTableModal.defaultProps = {
  editableReptileFeedingBox: undefined,
};

export default FeedingLogTableModal;
