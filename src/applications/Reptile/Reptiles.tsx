import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Grid, Container, Typography, Button, Card } from '@mui/material';

import PageTitleWrapper from '../../components/PageTitleWrapper';
import Footer from '../../components/Footer';

import ModifyReptileModal from './ModifyReptileModal';
import ReptilesTable from './ReptilesTable';
import ReptileFeedingLogTableModal from './ReptileFeedingLogTableModal';

import { ReptileContext } from './ReptileContext';

function Reptiles() {

  const {
    loading,
    currentUserDisplayedUsername,

    ModalToggle,
    toggleModal,

    ReptileFeedingLogTableModalToggle,

    reptiles,
    reptileTypes,
    reptileFeedingBoxes,
    reptileFeedingBoxIndexes,

    editableReptile,
    handleModifyReptileModalOpen,
    handleModifyReptileModalClose,
    handleReptilesDelete,

    viewableLogReptile,
    handleViewableReptileLogModalOpen,
    handleViewableReptileLogModalClose,
    handleModifyReptileFeedingLogModalOpenInReptileTable,
  } = useContext(ReptileContext);

  if (loading) return null;

  return (
    <>
      <Helmet>
        <title>尾巴屋爬宠管理平台 - 爬宠管理</title>
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
              <ReptilesTable
                reptiles={reptiles}
                reptileTypes={reptileTypes}
                reptileFeedingBoxes={reptileFeedingBoxes}
                reptileFeedingBoxIndexes={reptileFeedingBoxIndexes}
                onLogShowing={handleViewableReptileLogModalOpen}
                onReptileEditing={handleModifyReptileModalOpen}
                onReptilesDeleting={handleReptilesDelete}
                onModifyReptileFeedingLogModalOpen={handleModifyReptileFeedingLogModalOpenInReptileTable}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <ReptileFeedingLogTableModal
        open={ReptileFeedingLogTableModalToggle}
        onClose={handleViewableReptileLogModalClose}
        viewableLogReptile={viewableLogReptile}
      />
      <ModifyReptileModal
        open={ModalToggle}
        onClose={handleModifyReptileModalClose}
        editableReptile={editableReptile}
      />
    </>
  );
}

export default Reptiles;
