import React, { useContext } from 'react';
import { Grid, Container, Typography, Button, Card } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

import PageTitleWrapper from '../../../components/PageTitleWrapper';
import Footer from '../../../components/Footer';

import ModifyFeedingLogModal from './ModifyFeedingLogModal';
import FeedingLogsTable from './ReptileFeedingLogsTable';

import { ReptileFeedingLogContext } from '../context/ReptileFeedingLogContext';
import { ReptileContext } from '../../../libs/context/ReptileContext';

import { Reptile } from '../../../models';

interface ReptileFeedingLogsProps {
  viewableReptile?: Reptile
}

const ReptileFeedingLogs: React.FC<ReptileFeedingLogsProps> = ({ viewableReptile }) => {
  const { loading, currentUserDisplayedUsername, reptiles, reptileFeedingLogs } =
    useContext(ReptileContext);

  const {
    ModalToggle,
    toggleModal,

    editableReptileFeedingLog,
    handleModifyReptileFeedingLogModalOpen,
    handleModifyReptileFeedingLogModalClose,
    handleReptileFeedingLogsDelete,
  } = useContext(ReptileFeedingLogContext);

  if (loading) return null;

  return (
    <>
      {!viewableReptile ? (
        <PageTitleWrapper>
          <Grid container justifyContent='space-between' alignItems='center'>
            <Grid item>
              <Typography variant='h3' component='h3' gutterBottom>
                尾巴屋爬宠管理平台
              </Typography>
              <Typography variant='subtitle2'>你好，{currentUserDisplayedUsername}！</Typography>
            </Grid>
            <Grid item>
              <Button
                sx={{ mt: { xs: 2, md: 0 } }}
                variant='contained'
                onClick={toggleModal}
                startIcon={<AddTwoToneIcon fontSize='small' />}
              >
                创建饲育日志
              </Button>
            </Grid>
          </Grid>
        </PageTitleWrapper>
      ) : null}
      <Container maxWidth='lg'>
        <Grid container direction='row' justifyContent='center' alignItems='stretch' spacing={3}>
          <Grid item xs={12}>
            <Card>
              {!viewableReptile ? (
                <FeedingLogsTable
                  reptiles={reptiles}
                  reptileFeedingLogs={reptileFeedingLogs}
                  onReptileFeedingLogEditing={handleModifyReptileFeedingLogModalOpen}
                  onReptileFeedingLogsDeleting={handleReptileFeedingLogsDelete}
                />
              ) : (
                <FeedingLogsTable
                  reptiles={[viewableReptile]}
                  reptileFeedingLogs={reptileFeedingLogs.filter(
                    (reptileFeedingLog) => reptileFeedingLog.reptileID === viewableReptile?.id,
                  )}
                  onReptileFeedingLogEditing={handleModifyReptileFeedingLogModalOpen}
                  onReptileFeedingLogsDeleting={handleReptileFeedingLogsDelete}
                />
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
      {!viewableReptile ? <Footer /> : null}
      <ModifyFeedingLogModal
        open={ModalToggle}
        onClose={handleModifyReptileFeedingLogModalClose}
        editableReptileFeedingLog={editableReptileFeedingLog}
      />
    </>
  );
};

export default ReptileFeedingLogs;
