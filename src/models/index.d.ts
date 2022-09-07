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



type ReptileFeedingLogMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ReptileFeedingBoxIndexCollectionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ReptileMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ReptileFeedingBoxMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ReptileTypeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class ReptileFeedingLog {
  readonly id: string;
  readonly weight?: number | null;
  readonly detail?: string | null;
  readonly environmentHumidity?: number | null;
  readonly environmentTemperature?: number | null;
  readonly feedingDateTime?: string | null;
  readonly userID?: string | null;
  readonly reptileID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ReptileFeedingLog, ReptileFeedingLogMetaData>);
  static copyOf(source: ReptileFeedingLog, mutator: (draft: MutableModel<ReptileFeedingLog, ReptileFeedingLogMetaData>) => MutableModel<ReptileFeedingLog, ReptileFeedingLogMetaData> | void): ReptileFeedingLog;
}

export declare class ReptileFeedingBoxIndexCollection {
  readonly id: string;
  readonly verticalIndex?: number | null;
  readonly horizontalIndex?: number | null;
  readonly userID?: string | null;
  readonly reptileFeedingBoxID: string;
  readonly Reptiles?: (Reptile | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ReptileFeedingBoxIndexCollection, ReptileFeedingBoxIndexCollectionMetaData>);
  static copyOf(source: ReptileFeedingBoxIndexCollection, mutator: (draft: MutableModel<ReptileFeedingBoxIndexCollection, ReptileFeedingBoxIndexCollectionMetaData>) => MutableModel<ReptileFeedingBoxIndexCollection, ReptileFeedingBoxIndexCollectionMetaData> | void): ReptileFeedingBoxIndexCollection;
}

export declare class Reptile {
  readonly id: string;
  readonly name?: string | null;
  readonly nickname?: string | null;
  readonly gender?: ReptileGenderType | keyof typeof ReptileGenderType | null;
  readonly weight?: number | null;
  readonly birthdate?: string | null;
  readonly userID?: string | null;
  readonly reptileTypeID: string;
  readonly ReptileFeedingLogs?: (ReptileFeedingLog | null)[] | null;
  readonly reptileFeedingBoxIndexCollectionID: string;
  readonly reptileFeedingBoxID: string;
  readonly genies?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Reptile, ReptileMetaData>);
  static copyOf(source: Reptile, mutator: (draft: MutableModel<Reptile, ReptileMetaData>) => MutableModel<Reptile, ReptileMetaData> | void): Reptile;
}

export declare class ReptileFeedingBox {
  readonly id: string;
  readonly type?: ReptileFeedingBoxType | keyof typeof ReptileFeedingBoxType | null;
  readonly name?: string | null;
  readonly userID?: string | null;
  readonly ReptileFeedingBoxIndexCollections?: (ReptileFeedingBoxIndexCollection | null)[] | null;
  readonly Reptiles?: (Reptile | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ReptileFeedingBox, ReptileFeedingBoxMetaData>);
  static copyOf(source: ReptileFeedingBox, mutator: (draft: MutableModel<ReptileFeedingBox, ReptileFeedingBoxMetaData>) => MutableModel<ReptileFeedingBox, ReptileFeedingBoxMetaData> | void): ReptileFeedingBox;
}

export declare class ReptileType {
  readonly id: string;
  readonly name?: string | null;
  readonly Reptiles?: (Reptile | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ReptileType, ReptileTypeMetaData>);
  static copyOf(source: ReptileType, mutator: (draft: MutableModel<ReptileType, ReptileTypeMetaData>) => MutableModel<ReptileType, ReptileTypeMetaData> | void): ReptileType;
}