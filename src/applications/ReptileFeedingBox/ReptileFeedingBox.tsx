import React, { useContext, useState } from 'react';


import PageTitleWrapper from '../../components/PageTitleWrapper';
import { Grid, Container, Typography, Button, Card } from '@mui/material';
import Footer from '../../components/Footer';
import ModifyFeedingBoxModal from './ModifyFeedingBoxModal';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { ReptileFeedingBox } from '../../models';
import ReptileFeedingBoxesTable from './ReptileFeedingBoxesTable';
import { useReptileFeeder } from '../../libs/reptile-feeder/UseReptileFeeder';
import { ModalContext } from '../../libs/context/ModalContext';

function ReptileFeedingBoxes() {

  const { toggleModal, closeModal, ModalToggle } = useContext(ModalContext);
  const [editableReptileFeedingBox, setEditableReptileFeedingBox] = useState<ReptileFeedingBox | undefined>();

  const {
    currentUser,
    reptileFeedingBoxes,
    reptileFeeder
  } = useReptileFeeder();

  const handleDeleteFeedingBoxes = async (feedingBoxIds: string[]) => {
    for await (const feedingBoxId of feedingBoxIds) {
      await reptileFeeder.removeReptileFeedingBox(feedingBoxId);
    }
    await reptileFeeder.fetchAll();
  };

  const handleCloseFeedingBoxModal = () => {
    closeModal();
  };

  const handleOpenFeedingBoxModal = (reptileFeedingBox: ReptileFeedingBox | undefined) => {
    if (reptileFeedingBox) {
      setEditableReptileFeedingBox(reptileFeedingBox);
    }
    toggleModal();
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
              你好，{
                currentUser.attributes
                  ? currentUser.attributes.email
                  : '新朋友'
              }！
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
                onFeedingBoxEditing={handleOpenFeedingBoxModal}
                onFeedingBoxesDeleting={handleDeleteFeedingBoxes}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <ModifyFeedingBoxModal
        open={ModalToggle}
        onClose={handleCloseFeedingBoxModal}
        editableReptileFeedingBox={editableReptileFeedingBox}
      />
    </>
  );
}

export default ReptileFeedingBoxes;
