import React, { useContext } from 'react';
import { Grid, Container, Typography, Button, Card } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

import PageTitleWrapper from '../../../components/PageTitleWrapper';
import Footer from '../../../components/Footer';

import ModifyWeightLogModal from './ModifyWeightLogModal';
import WeightLogsTable from './ReptileWeightLogsTable';

import { ReptileWeightLogContext } from '../context/ReptileWeightLogContext';
import { ReptileContext } from '../../../libs/context/ReptileContext';

import { Reptile } from '../../../models';

interface ReptileWeightLogsProps {
  viewableReptile?: Reptile;
}

const ReptileWeightLogs: React.FC<ReptileWeightLogsProps> = ({ viewableReptile }) => {

  const {
    loading,
    currentUserDisplayedUsername,
    reptiles,
    reptileWeightLogs,
  } = useContext(ReptileContext);

  const {
    ModalToggle,
    toggleModal,

    editableReptileWeightLog,
    handleModifyReptileWeightLogModalOpen,
    handleModifyReptileWeightLogModalClose,
    handleReptileWeightLogsDelete
  } = useContext(ReptileWeightLogContext);

  if (loading) return null;

  return (
    <>
      {
        !viewableReptile ?
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
                  创建体重日志
                </Button>
              </Grid>
            </Grid>
          </PageTitleWrapper>
          : null
      }
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
              {
                !viewableReptile
                  ? <WeightLogsTable
                    reptiles={reptiles}
                    reptileWeightLogs={reptileWeightLogs}
                    onReptileWeightLogEditing={handleModifyReptileWeightLogModalOpen}
                    onReptileWeightLogsDeleting={handleReptileWeightLogsDelete}
                  />
                  : <WeightLogsTable
                    reptiles={[viewableReptile]}
                    reptileWeightLogs={reptileWeightLogs.filter(reptileWeightLog => reptileWeightLog.reptileID === viewableReptile?.id)}
                    onReptileWeightLogEditing={handleModifyReptileWeightLogModalOpen}
                    onReptileWeightLogsDeleting={handleReptileWeightLogsDelete}
                  />
              }
            </Card>
          </Grid>
        </Grid>
      </Container>
      {
        !viewableReptile ? <Footer /> : null
      }
      <ModifyWeightLogModal
        open={ModalToggle}
        onClose={handleModifyReptileWeightLogModalClose}
        editableReptileWeightLog={editableReptileWeightLog}
      />
    </>
  );
};

export default ReptileWeightLogs;
