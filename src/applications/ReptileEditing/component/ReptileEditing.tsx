import React, { useContext } from 'react';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Grid, Container, Typography, Button, Card } from '@mui/material';

import PageTitleWrapper from '../../../components/PageTitleWrapper';
import ReptilesTable from '../../../layouts/ReptileTable/ReptilesTable';
import Footer from '../../../components/Footer';

import ModifyReptileModal from './ModifyReptileModal';
import { TableEditingActions } from './TableEditingActions';

import { ReptileEditingContext } from '../context/ReptileEditingContext';
import { ReptileContext } from '../../../libs/context/ReptileContext';

import { Reptile } from '../../../models';

function ReptileEditing() {
  const {
    loading,
    currentUserDisplayedUsername,

    reptiles,
    reptileTypes,
    reptileFeedingBoxes,
    reptileFeedingBoxIndexes,
    reptileWeightLogs
  } = useContext(ReptileContext);

  const {
    ModalToggle,
    toggleModal,
    editableReptile,
    handleModifyReptileModalOpen,
    handleModifyReptileModalClose,
    handleReptilesDelete,
  } = useContext(ReptileEditingContext);

  if (loading) return null;

  return (
    <>
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
              创建新爬宠
            </Button>
          </Grid>
        </Grid>
      </PageTitleWrapper>
      <Container maxWidth='lg'>
        <Grid container direction='row' justifyContent='center' alignItems='stretch' spacing={3}>
          <Grid item xs={12}>
            <Card>
              <ReptilesTable
                reptileWeightLogs={reptileWeightLogs}
                showBulkDeleting={true}
                reptiles={reptiles}
                reptileTypes={reptileTypes}
                reptileFeedingBoxes={reptileFeedingBoxes}
                reptileFeedingBoxIndexes={reptileFeedingBoxIndexes}
                onReptilesDeleting={handleReptilesDelete}
              >
                <TableEditingActions
                  onReptileEditing={handleModifyReptileModalOpen}
                  onReptilesDeleting={handleReptilesDelete}
                  reptile={{} as Reptile}
                />
              </ReptilesTable>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <ModifyReptileModal
        open={ModalToggle}
        onClose={handleModifyReptileModalClose}
        editableReptile={editableReptile}
      />
    </>
  );
}

export default ReptileEditing;
