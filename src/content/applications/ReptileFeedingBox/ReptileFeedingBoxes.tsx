import { Card } from '@mui/material';
import ReptileFeedingBoxesTable from './ReptileFeedingBoxesTable';
import { subDays } from 'date-fns';
import {DataStore} from "aws-amplify";
import {useEffect, useState} from "react";
import {ReptileFeedingBox} from "../../../models";

function ReptileFeedingBoxes() {

  const [reptileFeedingBoxes, setReptileFeedingBoxes] = useState<ReptileFeedingBox[]>([]);

  useEffect( () => {
    const run = async () => {
      const data = await DataStore.query(ReptileFeedingBox);

      setReptileFeedingBoxes(data);
    }
    run();
  }, []);


  return (
    <Card>
      <ReptileFeedingBoxesTable reptileFeedingBoxes={reptileFeedingBoxes} />
    </Card>
  );
}

export default ReptileFeedingBoxes;
