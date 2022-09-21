// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const ReptileGenderType = {
  "MALE": "MALE",
  "FAMALE": "FAMALE",
  "POSSIBLE_MALE": "POSSIBLE_MALE",
  "POSSIBLE_FAMALE": "POSSIBLE_FAMALE",
  "UNKNOWN": "UNKNOWN"
};

const ReptileFeedingBoxType = {
  "BOX": "BOX",
  "CABINET": "CABINET"
};

const { ReptileTemperatureAndHumidityLog, ReptileWeightLog, ReptileFeedingLog, ReptileFeedingBoxIndexCollection, Reptile, ReptileFeedingBox, ReptileType } = initSchema(schema);

export {
  ReptileTemperatureAndHumidityLog,
  ReptileWeightLog,
  ReptileFeedingLog,
  ReptileFeedingBoxIndexCollection,
  Reptile,
  ReptileFeedingBox,
  ReptileType,
  ReptileGenderType,
  ReptileFeedingBoxType
};