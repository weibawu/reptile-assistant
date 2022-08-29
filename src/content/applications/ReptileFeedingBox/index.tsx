import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {Grid, Container, Dialog, DialogTitle} from '@mui/material';
import Footer from 'src/components/Footer';

import ReptileFeedingBoxes from './ReptileFeedingBoxes';
import {useState} from "react";

function ApplicationsReptileFeedingBoxes() {

  return (
    <>
      <Helmet>
        <title>Feeding Box Management</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
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
            <ReptileFeedingBoxes />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ApplicationsReptileFeedingBoxes;
