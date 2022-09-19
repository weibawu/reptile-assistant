import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Grid, Container, Typography, Button, Card } from '@mui/material';

import { useReptileRepository } from '../../libs/reptile-repository/UseReptileRepository';
import { ModalContext } from '../../libs/context/ModalContext';

import PageTitleWrapper from '../../components/PageTitleWrapper';
import Footer from '../../components/Footer';

import { ReptileFeedingLogTableModalContext } from './ReptileFeedingLogTableModalContext';

import ModifyReptileModal from './ModifyReptileModal';
import ReptilesTable from './ReptilesTable';
import ReptileFeedingLogTableModal from './ReptileFeedingLogTableModal';

import { Reptile } from '../../models';

function Reptiles() {

  const {
    toggleModal,
    ModalToggle,
    closeModal
  } = useContext(ModalContext);
  const [editableReptile, setEditableReptile] = useState<Reptile | undefined>();

  const {
    toggleReptileFeedingLogTableModal,
    ReptileFeedingLogTableModalToggle,
    closeReptileFeedingLogTableModal
  } = useContext(ReptileFeedingLogTableModalContext);
  const [viewableLogReptile, setViewableLogReptile] = useState<Reptile | undefined>();

  const {
    currentUser,
    reptiles,
    reptileTypes,
    reptileFeedingBoxes,
    reptileFeedingBoxIndexes,
    reptileRepository
  } = useReptileRepository();

  const currentUserDisplayedUsername =
    currentUser.attributes
      ? currentUser.attributes.email
      : '新朋友';

  const handleModifyReptileModalOpen = (reptile: Reptile | undefined) => {
    if (reptile) {
      setEditableReptile(reptile);
    }
    toggleModal();
  };

  const handleViewableReptileLogModalOpen = (reptile: Reptile) => {
    setViewableLogReptile(reptile);
    toggleReptileFeedingLogTableModal();
  };

  const handleDeleteReptiles = async (reptileIds: string[]) => {
    for await (const reptileId of reptileIds) {
      await reptileRepository.removeReptile(reptileId);
    }
    await reptileRepository.fetchAll();
  };

  return (
    <>
      <Helmet>
        <title>Feeding Box Management</title>
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
                onReptilesDeleting={handleDeleteReptiles}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <ReptileFeedingLogTableModal
        open={ReptileFeedingLogTableModalToggle}
        onClose={closeReptileFeedingLogTableModal}
        viewableLogReptile={viewableLogReptile}
      />
      <ModifyReptileModal
        open={ModalToggle}
        onClose={closeModal}
        editableReptile={editableReptile}
      />
    </>
  );
}

export default Reptiles;
