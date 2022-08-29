import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum ReptileGenderType {
  MALE = "MALE",
  FAMALE = "FAMALE",
  POSSIBLE_MALE = "POSSIBLE_MALE",
  POSSIBLE_FAMALE = "POSSIBLE_FAMALE",
  UNKNOWN = "UNKNOWN"
}

export enum ReptileFeedingBoxType {
  BOX = "BOX",
  CABINET = "CABINET"
}



type ReptileFeedingBoxIndexCollectionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ReptileFeedingLogMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ReptileMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ReptileTypeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ReptileFeedingBoxMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class ReptileFeedingBoxIndexCollection {
  readonly id: string;
  readonly verticalIndex: number;
  readonly horizontalIndex: number;
  readonly reptilefeedingboxID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ReptileFeedingBoxIndexCollection, ReptileFeedingBoxIndexCollectionMetaData>);
  static copyOf(source: ReptileFeedingBoxIndexCollection, mutator: (draft: MutableModel<ReptileFeedingBoxIndexCollection, ReptileFeedingBoxIndexCollectionMetaData>) => MutableModel<ReptileFeedingBoxIndexCollection, ReptileFeedingBoxIndexCollectionMetaData> | void): ReptileFeedingBoxIndexCollection;
}

export declare class ReptileFeedingLog {
  readonly id: string;
  readonly weight?: number | null;
  readonly detail?: string | null;
  readonly environmentHumidity?: string | null;
  readonly environmentTemperature?: string | null;
  readonly feedingDateTime: string;
  readonly reptileID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ReptileFeedingLog, ReptileFeedingLogMetaData>);
  static copyOf(source: ReptileFeedingLog, mutator: (draft: MutableModel<ReptileFeedingLog, ReptileFeedingLogMetaData>) => MutableModel<ReptileFeedingLog, ReptileFeedingLogMetaData> | void): ReptileFeedingLog;
}

export declare class Reptile {
  readonly id: string;
  readonly name: string;
  readonly nickname?: string | null;
  readonly gender: ReptileGenderType | keyof typeof ReptileGenderType;
  readonly birthdate?: string | null;
  readonly weight?: string | null;
  readonly genies?: (string | null)[] | null;
  readonly ReptileFeedingBoxIndexCollection?: ReptileFeedingBoxIndexCollection | null;
  readonly ReptileType?: ReptileType | null;
  readonly ReptileFeedingLogs?: (ReptileFeedingLog | null)[] | null;
  readonly userId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly reptileReptileFeedingBoxIndexCollectionId?: string | null;
  readonly reptileReptileTypeId?: string | null;
  constructor(init: ModelInit<Reptile, ReptileMetaData>);
  static copyOf(source: Reptile, mutator: (draft: MutableModel<Reptile, ReptileMetaData>) => MutableModel<Reptile, ReptileMetaData> | void): Reptile;
}

export declare class ReptileType {
  readonly id: string;
  readonly name: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ReptileType, ReptileTypeMetaData>);
  static copyOf(source: ReptileType, mutator: (draft: MutableModel<ReptileType, ReptileTypeMetaData>) => MutableModel<ReptileType, ReptileTypeMetaData> | void): ReptileType;
}

export declare class ReptileFeedingBox {
  readonly id: string;
  readonly type: ReptileFeedingBoxType | keyof typeof ReptileFeedingBoxType;
  readonly name: string;
  readonly ReptileFeedingBoxIndexCollections?: (ReptileFeedingBoxIndexCollection | null)[] | null;
  readonly userId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ReptileFeedingBox, ReptileFeedingBoxMetaData>);
  static copyOf(source: ReptileFeedingBox, mutator: (draft: MutableModel<ReptileFeedingBox, ReptileFeedingBoxMetaData>) => MutableModel<ReptileFeedingBox, ReptileFeedingBoxMetaData> | void): ReptileFeedingBox;
}