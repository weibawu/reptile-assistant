import React, { useContext, useState } from 'react';
import { Grid, Container, Typography, Button, Card } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

import PageTitleWrapper from '../../components/PageTitleWrapper';
import Footer from '../../components/Footer';

import { useReptileRepository } from '../../libs/reptile-repository/UseReptileRepository';
import { ModalContext } from './ModalContext';

import ModifyFeedingBoxModal from './ModifyReptileFeedingBoxModal';
import ReptileFeedingBoxesTable from './ReptileFeedingBoxesTable';

import { ReptileFeedingBox } from '../../models';

function ReptileFeedingBoxes() {

  const { toggleModal, closeModal, ModalToggle } = useContext(ModalContext);
  const [editableReptileFeedingBox, setEditableReptileFeedingBox] = useState<ReptileFeedingBox | undefined>();

  const {
    loading,
    currentUser,
    reptileFeedingBoxes,
    reptileRepository
  } = useReptileRepository();

  const currentUserDisplayedUsername =
    currentUser.attributes
      ? currentUser.attributes.email
      : '新朋友';

  const handleFeedingBoxesDelete = async (feedingBoxIds: string[]) => {
    for await (const feedingBoxId of feedingBoxIds) {
      await reptileRepository.removeReptileFeedingBox(feedingBoxId);
    }
    await reptileRepository.fetchAll();
  };

  const handleReptileFeedingBoxModalOpen = (reptileFeedingBox: ReptileFeedingBox | undefined) => {
    if (reptileFeedingBox) {
      setEditableReptileFeedingBox(reptileFeedingBox);
    }
    toggleModal();
  };

  const handleModifyReptileFeedingBoxModalClose = () => {
    setEditableReptileFeedingBox(undefined);
    closeModal();
  };

  if (loading) return null;

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
              创建饲养容器
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
              <ReptileFeedingBoxesTable
                reptileFeedingBoxes={reptileFeedingBoxes}
                onReptileFeedingBoxEditing={handleReptileFeedingBoxModalOpen}
                onReptileFeedingBoxesDeleting={handleFeedingBoxesDelete}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <ModifyFeedingBoxModal
        open={ModalToggle}
        onClose={handleModifyReptileFeedingBoxModalClose}
        editableReptileFeedingBox={editableReptileFeedingBox}
      />
    </>
  );
}

export default ReptileFeedingBoxes;
