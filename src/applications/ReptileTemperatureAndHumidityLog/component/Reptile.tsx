import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';

import { Grid, Container, Typography, Card } from '@mui/material';

import PageTitleWrapper from '../../../components/PageTitleWrapper';
import ReptilesTable from '../../../layouts/ReptileTable/ReptilesTable';
import Footer from '../../../components/Footer';

import ReptileTemperatureAndHumidityLogTableModal from './ReptileTemperatureAndHumidityLogTableModal';
import { TableEditingActions } from './TableEditingActions';

import { ReptileContext } from '../../../libs/context/ReptileContext';
import { ReptileTemperatureAndHumidityLogContext } from '../context/ReptileTemperatureAndHumidityLogContext';

import { Reptile } from '../../../models';

function Reptiles() {
  const {
    loading,
    currentUserDisplayedUsername,
    reptiles,
    reptileTypes,
    reptileFeedingBoxes,
    reptileFeedingBoxIndexes,
    handleReptilesDelete
  } = useContext(ReptileContext);

  const {
    ReptileTemperatureAndHumidityLogTableModalToggle,
    handleModifyReptileTemperatureAndHumidityLogModalOpenInReptileTable,

    viewableLogReptile,
    handleViewableReptileLogModalOpen,
    handleViewableReptileLogModalClose
  } = useContext(ReptileTemperatureAndHumidityLogContext);

  if (loading) return null;

  return (
    <>
      <Helmet>
        <title>尾巴屋爬宠管理平台 - 温湿度日志</title>
      </Helmet>
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
              <ReptilesTable
                showBulkDeleting={false}
                reptiles={reptiles}
                reptileTypes={reptileTypes}
                reptileFeedingBoxes={reptileFeedingBoxes}
                reptileFeedingBoxIndexes={reptileFeedingBoxIndexes}
                onReptilesDeleting={handleReptilesDelete}
              >
                <TableEditingActions
                  onModifyReptileTemperatureAndHumidityLogEditingModalOpen={handleModifyReptileTemperatureAndHumidityLogModalOpenInReptileTable}
                  onModifyReptileTemperatureAndHumidityLogTableModalOpen={handleViewableReptileLogModalOpen}
                  reptile={{} as Reptile}
                />
              </ReptilesTable>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <ReptileTemperatureAndHumidityLogTableModal
        open={ReptileTemperatureAndHumidityLogTableModalToggle}
        onClose={handleViewableReptileLogModalClose}
        viewableLogReptile={viewableLogReptile}
      />
    </>
  );
}

export default Reptiles;
