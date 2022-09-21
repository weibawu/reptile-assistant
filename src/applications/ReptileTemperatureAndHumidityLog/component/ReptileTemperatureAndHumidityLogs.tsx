import React, { useContext } from 'react';
import { Grid, Container, Typography, Button, Card } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

import PageTitleWrapper from '../../../components/PageTitleWrapper';
import Footer from '../../../components/Footer';

import ModifyTemperatureAndHumidityLogModal from './ModifyTemperatureAndHumidityLogModal';
import TemperatureAndHumidityLogsTable from './ReptileTemperatureAndHumidityLogsTable';

import { ReptileTemperatureAndHumidityLogContext } from '../context/ReptileTemperatureAndHumidityLogContext';
import { ReptileContext } from '../../../libs/context/ReptileContext';

import { Reptile } from '../../../models';

interface ReptileTemperatureAndHumidityLogsProps {
  viewableReptile?: Reptile;
}

const ReptileTemperatureAndHumidityLogs: React.FC<ReptileTemperatureAndHumidityLogsProps> = ({ viewableReptile }) => {

  const {
    loading,
    currentUserDisplayedUsername,
    reptiles,
    reptileTemperatureAndHumidityLogs,
  } = useContext(ReptileContext);

  const {
    ModalToggle,
    toggleModal,

    editableReptileTemperatureAndHumidityLog,
    handleModifyReptileTemperatureAndHumidityLogModalOpen,
    handleModifyReptileTemperatureAndHumidityLogModalClose,
    handleReptileTemperatureAndHumidityLogsDelete
  } = useContext(ReptileTemperatureAndHumidityLogContext);

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
                  创建温湿度日志
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
                  ? <TemperatureAndHumidityLogsTable
                    reptiles={reptiles}
                    reptileTemperatureAndHumidityLogs={reptileTemperatureAndHumidityLogs}
                    onReptileTemperatureAndHumidityLogEditing={handleModifyReptileTemperatureAndHumidityLogModalOpen}
                    onReptileTemperatureAndHumidityLogsDeleting={handleReptileTemperatureAndHumidityLogsDelete}
                  />
                  : <TemperatureAndHumidityLogsTable
                    reptiles={[viewableReptile]}
                    reptileTemperatureAndHumidityLogs={reptileTemperatureAndHumidityLogs.filter(reptileTemperatureAndHumidityLog => reptileTemperatureAndHumidityLog.reptileID === viewableReptile?.id)}
                    onReptileTemperatureAndHumidityLogEditing={handleModifyReptileTemperatureAndHumidityLogModalOpen}
                    onReptileTemperatureAndHumidityLogsDeleting={handleReptileTemperatureAndHumidityLogsDelete}
                  />
              }
            </Card>
          </Grid>
        </Grid>
      </Container>
      {
        !viewableReptile ? <Footer /> : null
      }
      <ModifyTemperatureAndHumidityLogModal
        open={ModalToggle}
        onClose={handleModifyReptileTemperatureAndHumidityLogModalClose}
        editableReptileTemperatureAndHumidityLog={editableReptileTemperatureAndHumidityLog}
      />
    </>
  );
};

export default ReptileTemperatureAndHumidityLogs;
