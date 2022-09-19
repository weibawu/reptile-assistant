import React, { useContext, useState } from 'react';
import {Grid, Container, Typography, Button, Card} from '@mui/material';
import Footer from '../../components/Footer';
import ModifyFeedingLogModal from './ModifyFeedingLogModal';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import {
  Reptile,
  ReptileFeedingBox,
  ReptileFeedingBoxIndexCollection,
  ReptileFeedingLog,
  ReptileType
} from '../../models';
import FeedingLogsTable from './ReptileFeedingLogsTable';
import { ModalContext } from '../../libs/context/ModalContext';
import { useReptileRepository } from '../../libs/reptile-repository/UseReptileRepository';
import PageTitleWrapper from '../../components/PageTitleWrapper';

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
    reptileTypes,
    reptileFeedingBoxes,
    reptileFeedingBoxIndexes,
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
              创建新爬宠
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
                reptileTypes={reptileTypes}
                reptileFeedingBoxes={reptileFeedingBoxes}
                reptileFeedingBoxIndexes={reptileFeedingBoxIndexes}
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
        reptiles={reptiles}
        reptileTypes={reptileTypes}
        reptileFeedingBoxes={reptileFeedingBoxes}
        reptileFeedingBoxIndexes={reptileFeedingBoxIndexes}
        open={ModalToggle}
        onClose={handleModifyReptileFeedingLogModalClose}
        editableReptileFeedingLog={editableReptileFeedingLog}
      />
    </>
  );
}

export default ReptileFeedingLogs;
