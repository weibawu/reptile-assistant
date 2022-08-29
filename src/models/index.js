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

const { ReptileFeedingBoxIndexCollection, ReptileFeedingLog, Reptile, ReptileType, ReptileFeedingBox } = initSchema(schema);

export {
  ReptileFeedingBoxIndexCollection,
  ReptileFeedingLog,
  Reptile,
  ReptileType,
  ReptileFeedingBox,
  ReptileGenderType,
  ReptileFeedingBoxType
};