import React, { useContext } from 'react';

import { Grid, Container, Card } from '@mui/material';

import ReptilesTable from '../../../layouts/ReptileTable/ReptilesTable';
import Footer from '../../../components/Footer';

import ReptileRoutineAnalyzingChartModal from './ReptileRoutineAnalyzingChartModal';
import { TableEditingActions } from './TableEditingActions';

import { ReptileRoutineAnalyzingContext } from '../context/ReptileRoutineAnalyzingContext';
import { ReptileContext } from '../../../libs/context/ReptileContext';

import { Reptile } from '../../../models';

function ReptileRoutineAnalyzing() {
  const {
    loading,

    reptiles,
    reptileTypes,
    reptileFeedingBoxes,
    reptileFeedingBoxIndexes,
    reptileWeightLogs,
  } = useContext(ReptileContext);

  const {
    ModalToggle,
    editableReptile,
    handleModifyReptileModalOpen,
    handleModifyReptileModalClose,
    handleReptilesDelete,
  } = useContext(ReptileRoutineAnalyzingContext);

  if (loading) return null;

  return (
    <>
      <Container maxWidth='lg'>
        <Grid container direction='row' justifyContent='center' alignItems='stretch' spacing={3}>
          <Grid item xs={12}>
            <Card>
              <ReptilesTable
                reptileWeightLogs={reptileWeightLogs}
                showBulkDeleting={false}
                reptiles={reptiles}
                reptileTypes={reptileTypes}
                reptileFeedingBoxes={reptileFeedingBoxes}
                reptileFeedingBoxIndexes={reptileFeedingBoxIndexes}
                onReptilesDeleting={handleReptilesDelete}
              >
                <TableEditingActions
                  onReptileRoutineAnalyzingChartModal={handleModifyReptileModalOpen}
                  reptile={{} as Reptile}
                />
              </ReptilesTable>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <ReptileRoutineAnalyzingChartModal
        open={ModalToggle}
        onClose={handleModifyReptileModalClose}
        editableReptile={editableReptile}
      />
    </>
  );
}

export default ReptileRoutineAnalyzing;
