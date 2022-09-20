import React, { useContext, useState } from 'react';
import {Grid, Container, Typography, Button, Card} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

import { ModalContext } from '../../libs/context/ModalContext';
import { useReptileRepository } from '../../libs/reptile-repository/UseReptileRepository';

import PageTitleWrapper from '../../components/PageTitleWrapper';
import Footer from '../../components/Footer';

import { ReptileFeedingLog } from '../../models';
import ModifyFeedingLogModal from './ModifyFeedingLogModal';
import FeedingLogsTable from './ReptileFeedingLogsTable';

function ReptileFeedingLogs() {

  const {
    toggleModal,
    ModalToggle,
    closeModal
  } = useContext(ModalContext);
  const [editableReptileFeedingLog, setEditableReptileFeedingLog] = useState<ReptileFeedingLog | undefined>();

  const {
    currentUser,
    reptiles,
    reptileFeedingLogs,
    reptileRepository
  } = useReptileRepository();

  const currentUserDisplayedUsername =
    currentUser.attributes
      ? currentUser.attributes.email
      : '新朋友';

  const handleModifyReptileFeedingLogModalOpen = (reptileFeedingLog: ReptileFeedingLog | undefined) => {
    if (reptileFeedingLog) {
      setEditableReptileFeedingLog(reptileFeedingLog);
    }
    toggleModal();
  };

  const handleModifyReptileFeedingLogModalClose = () => {
    setEditableReptileFeedingLog(undefined);
    closeModal();
  };

  const handleReptileFeedingLogsDelete = async (reptileFeedingLogIds: string[]) => {
    for await (const reptileFeedingLogId of reptileFeedingLogIds) {
      await reptileRepository.removeReptileFeedingLog(reptileFeedingLogId);
    }
    await reptileRepository.fetchAll();
  };

  return (
    <>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              尾巴屋爬宠管理平台
            </Typography>
            <Typography variant="subtitle2">
              你好，{currentUserDisplayedUsername}！
            </Typography>
          </Grid>
          <Grid item>
            <Button
              sx={{ mt: { xs: 2, md: 0 } }}
              variant="contained"
              onClick={toggleModal}
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              创建饲养日志
            </Button>
          </Grid>
        </Grid>
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Card>
              <FeedingLogsTable
                reptiles={reptiles}
                reptileFeedingLogs={reptileFeedingLogs}
                onReptileFeedingLogEditing={handleModifyReptileFeedingLogModalOpen}
                onReptileFeedingLogsDeleting={handleReptileFeedingLogsDelete}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer/>
      <ModifyFeedingLogModal
        open={ModalToggle}
        onClose={handleModifyReptileFeedingLogModalClose}
        editableReptileFeedingLog={editableReptileFeedingLog}
      />
    </>
  );
}

export default ReptileFeedingLogs;
