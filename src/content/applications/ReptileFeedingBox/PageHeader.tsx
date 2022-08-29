import {Typography, Button, Grid} from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import {useState} from "react";
import ReptileFeedingBoxModificationModal from "./ReptileFeedingBoxModificationModal";
function PageHeader() {

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    setTimeout(() => {location.reload()}, 500)
  };

  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  };
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Reptile Feeding Box
        </Typography>
        <Typography variant="subtitle2">
          Hi, {user.name}!
        </Typography>
      </Grid>
      <Grid item>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          onClick={handleClickOpen}
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Create
        </Button>
      </Grid>
      <ReptileFeedingBoxModificationModal
          open={open}
          onClose={handleClose}
      />
    </Grid>
  );
}

export default PageHeader;
