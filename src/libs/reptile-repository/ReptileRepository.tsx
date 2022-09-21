import { DataStore, Predicates, SortDirection } from 'aws-amplify';
import {
  Reptile,
  ReptileFeedingBox,
  ReptileFeedingBoxIndexCollection,
  ReptileFeedingLog,
  ReptileType
} from '../../models';
import { Subject } from 'rxjs';
import {
  CognitoUserAmplify
} from '@aws-amplify/ui-react/node_modules/@aws-amplify/ui/dist/types/types/authenticator/user.d';

interface ReptileRepositoryProtocol {
  readonly currentUser: CognitoUserAmplify;
  readonly reptilesSubject: Subject<Reptile[]>;
  readonly reptileTypesSubject: Subject<ReptileType[]>;
  readonly reptileFeedingBoxesSubject: Subject<ReptileFeedingBox[]>;
  readonly reptileFeedingBoxIndexesSubject: Subject<ReptileFeedingBoxIndexCollection[]>;
  readonly reptileFeedingLogsSubject: Subject<ReptileFeedingLog[]>;

  /*methods*/
  readonly fetchAll: () => Promise<void>;
  readonly fetchReptiles: () => Promise<void>;
  readonly fetchReptileTypes: () => Promise<void>;
  readonly fetchReptileFeedingBoxes: () => Promise<void>;
  readonly fetchReptileFeedingBoxIndexes: () => Promise<void>;
  readonly fetchReptileFeedingLogs: () => Promise<void>;

  readonly createReptile: (
    reptile: Reptile
  ) => Promise<Reptile>;

  readonly createReptileFeedingBox: (
    reptileFeedingBox: ReptileFeedingBox
  ) => Promise<ReptileFeedingBox>;

  readonly createReptileFeedingBoxIndex: (
    reptileFeedingBoxIndex: ReptileFeedingBoxIndexCollection
  ) => Promise<ReptileFeedingBoxIndexCollection>;

  readonly createReptileFeedingLog: (
    reptileFeedingLog: ReptileFeedingLog
  ) => Promise<ReptileFeedingLog>;

  readonly updateReptile: (
    reptileID: string,
    reptile: Reptile
  ) => Promise<Reptile>;

  readonly updateReptileFeedingBox: (
    reptileFeedingBoxID: string,
    reptileFeedingBox: ReptileFeedingBox
  ) => Promise<ReptileFeedingBox>;

  readonly updateReptileFeedingBoxIndex: (
    reptileFeedingBoxIndexID: string,
    reptileFeedingBoxIndex: ReptileFeedingBoxIndexCollection
  ) => Promise<ReptileFeedingBoxIndexCollection>;

  readonly updateReptileFeedingLog: (
    reptileFeedingLogID: string,
    reptileFeedingLog: ReptileFeedingLog
  ) => Promise<ReptileFeedingLog>;

  readonly removeReptile: (
    reptileID: string
  ) => Promise<boolean>;

  readonly removeReptileFeedingBox: (
    reptileFeedingBoxID: string
  ) => Promise<boolean>;

  readonly removeReptileFeedingBoxIndex: (
    reptileFeedingBoxIndexID: string
  ) => Promise<boolean>;

  readonly removeReptileFeedingLog: (
    reptileFeedingLogID: string
  ) => Promise<boolean>;

  /*events*/
  readonly onReptilesFetched: (callback: (reptiles: Reptile[]) => unknown) => void;
  readonly onReptileTypesFetched: (callback: (reptileTypes: ReptileType[]) => unknown) => void;
  readonly onReptileFeedingBoxesFetched: (callback: (reptileFeedingBoxes: ReptileFeedingBox[]) => unknown) => void;
  readonly onReptileFeedingBoxIndexesFetched: (callback: (reptileFeedingBoxIndexes: ReptileFeedingBoxIndexCollection[]) => unknown) => void;
  readonly onReptileFeedingLogsFetched: (callback: (reptileFeedingLogs: ReptileFeedingLog[]) => unknown) => void;

  /* util functions */
  readonly findReptileFeedingBoxIndexesByVerticalIndex: (
    reptileFeedingBoxId: string,
    verticalIndex: number
  ) => Promise<ReptileFeedingBoxIndexCollection[]>;
  readonly findReptileFeedingBoxIndexesByHorizontalIndex: (
    reptileFeedingBoxId: string,
    horizontalIndex: number
  ) => Promise<ReptileFeedingBoxIndexCollection[]>;
  readonly findExactFeedingBoxIndexByHorizontalIndexAndVerticalIndex: (
    reptileFeedingBoxId: string,
    verticalIndex: number,
    horizontalIndex: number
  ) => Promise<ReptileFeedingBoxIndexCollection | null>;
}

class ReptileRepository implements ReptileRepositoryProtocol {

  constructor(currentUser: CognitoUserAmplify) {
    this.currentUser = currentUser;
  }

  readonly currentUser: CognitoUserAmplify;

  readonly reptilesSubject: Subject<Reptile[]> = new Subject();
  readonly reptileTypesSubject: Subject<ReptileType[]> = new Subject<ReptileType[]>();
  readonly reptileFeedingBoxesSubject: Subject<ReptileFeedingBox[]> = new Subject();
  readonly reptileFeedingBoxIndexesSubject: Subject<ReptileFeedingBoxIndexCollection[]> = new Subject();
  readonly reptileFeedingLogsSubject: Subject<ReptileFeedingLog[]> = new Subject();

  async fetchAll(): Promise<void> {
    await this.fetchReptiles();
    await this.fetchReptileTypes();
    await this.fetchReptileFeedingBoxes();
    await this.fetchReptileFeedingBoxIndexes();
    await this.fetchReptileFeedingLogs();
  }

  async fetchReptiles(): Promise<void> {
    if (!this.currentUser || !this.currentUser.username) return;

    const username = this.currentUser.username;

    const reptiles = await DataStore.query(
      Reptile,
      (reptilePredicted) => reptilePredicted.userID('eq', username),
      { sort: s => s.createdAt(SortDirection.DESCENDING) }
    );
    this.reptilesSubject.next(reptiles);
  }

  async fetchReptileTypes(): Promise<void> {
    const reptileTypes = await DataStore.query(
      ReptileType,
      Predicates.ALL,
      { sort: s => s.createdAt(SortDirection.DESCENDING) }
    );
    this.reptileTypesSubject.next(reptileTypes);
  }

  async fetchReptileFeedingBoxes(): Promise<void> {
    if (!this.currentUser || !this.currentUser.username) return;

    const username = this.currentUser.username;

    const reptileFeedingBoxes = await DataStore.query(
      ReptileFeedingBox,
      (reptileFeedingBoxPredicted) =>
        reptileFeedingBoxPredicted.userID('eq', username),
      { sort: s =>
        s.type(SortDirection.DESCENDING)
          .createdAt(SortDirection.DESCENDING)
      }
    );
    this.reptileFeedingBoxesSubject.next(reptileFeedingBoxes);
  }

  async fetchReptileFeedingBoxIndexes(): Promise<void> {
    if (!this.currentUser || !this.currentUser.username) return;

    const username = this.currentUser.username;

    const reptileFeedingBoxIndexes = await DataStore.query(
      ReptileFeedingBoxIndexCollection,
      (reptileFeedingBoxIndexPredicted) => reptileFeedingBoxIndexPredicted.userID('eq', username),
      { sort: s =>
        s
          .createdAt(SortDirection.DESCENDING)
          .reptileFeedingBoxID(SortDirection.ASCENDING)

      }
    );
    this.reptileFeedingBoxIndexesSubject.next(reptileFeedingBoxIndexes);
  }

  async fetchReptileFeedingLogs(): Promise<void> {
    if (!this.currentUser || !this.currentUser.username) return;

    const username = this.currentUser.username;

    const reptileFeedingLogs = await DataStore.query(
      ReptileFeedingLog,
      (reptileFeedingLogPredicted) => reptileFeedingLogPredicted.userID('eq', username),
      { sort: s => s.createdAt(SortDirection.DESCENDING) }
    );
    this.reptileFeedingLogsSubject.next(reptileFeedingLogs);
  }

  onReptilesFetched(callback: (reptiles: Reptile[]) => unknown): void {
    this.reptilesSubject.subscribe(
      reptiles => callback(reptiles)
    );
  }

  onReptileTypesFetched(callback: (reptileTypes: ReptileType[]) => unknown): void {
    this.reptileTypesSubject.subscribe(
      reptileTypes => callback(reptileTypes)
    );
  }

  onReptileFeedingBoxesFetched(callback: (reptileFeedingBoxes: ReptileFeedingBox[]) => unknown): void {
    this.reptileFeedingBoxesSubject.subscribe(
      reptileFeedingBoxes => callback(reptileFeedingBoxes)
    );
  }

  onReptileFeedingBoxIndexesFetched(callback: (reptileFeedingBoxIndexes: ReptileFeedingBoxIndexCollection[]) => unknown): void {
    this.reptileFeedingBoxIndexesSubject.subscribe(
      reptileFeedingBoxIndexes => callback(reptileFeedingBoxIndexes)
    );
  }

  onReptileFeedingLogsFetched(callback: (reptileFeedingLogs: ReptileFeedingLog[]) => unknown): void {
    this.reptileFeedingLogsSubject.subscribe(
      reptileFeedingLogs => callback(reptileFeedingLogs)
    );
  }

  async createReptile(reptile: Reptile): Promise<Reptile> {
    await DataStore.save(reptile);
    await this.fetchAll();
    return reptile;
  }

  async createReptileFeedingBox(reptileFeedingBox: ReptileFeedingBox): Promise<ReptileFeedingBox> {
    await DataStore.save(reptileFeedingBox);
    await this.fetchAll();
    return reptileFeedingBox;
  }

  async createReptileFeedingBoxIndex(reptileFeedingBoxIndex: ReptileFeedingBoxIndexCollection): Promise<ReptileFeedingBoxIndexCollection> {
    await DataStore.save(reptileFeedingBoxIndex);
    await this.fetchAll();
    return reptileFeedingBoxIndex;
  }

  async createReptileFeedingLog(reptileFeedingLog: ReptileFeedingLog): Promise<ReptileFeedingLog> {
    await DataStore.save(reptileFeedingLog);
    await this.fetchAll();
    return reptileFeedingLog;
  }

  async updateReptile(reptileID: string, reptile: Reptile): Promise<Reptile> {
    const originalReptile = await DataStore.query(Reptile, reptileID);
    if (!originalReptile) throw new Error('update reptile failed');

    await DataStore.save(
      Reptile.copyOf(
        originalReptile,
        updated => {
          updated.name = reptile.name;
          updated.nickname = reptile.nickname;
          updated.gender = reptile.gender;
          updated.birthdate = reptile.birthdate;
          updated.weight = reptile.weight;
          updated.genies = reptile.genies;
          updated.userID = this.currentUser.username;
          updated.reptileTypeID = reptile.reptileTypeID;
          updated.reptileFeedingBoxID = reptile.reptileFeedingBoxID;
          updated.reptileFeedingBoxIndexCollectionID = reptile.reptileFeedingBoxIndexCollectionID;
        }
      )
    );

    await this.fetchAll();

    return reptile;
  }

  async updateReptileFeedingBox(reptileFeedingBoxID: string, reptileFeedingBox: ReptileFeedingBox): Promise<ReptileFeedingBox> {
    const originalReptileFeedingBox = await DataStore.query(ReptileFeedingBox, reptileFeedingBoxID);
    if (!originalReptileFeedingBox) throw new Error('update reptile feeding box failed');

    await DataStore.save(
      ReptileFeedingBox.copyOf(
        originalReptileFeedingBox,
        updated => {
          updated.name = reptileFeedingBox.name;
          updated.type = reptileFeedingBox.type;
        }
      )
    );

    await this.fetchAll();

    return reptileFeedingBox;
  }

  async updateReptileFeedingBoxIndex(reptileFeedingBoxIndexID: string, reptileFeedingBoxIndex: ReptileFeedingBoxIndexCollection): Promise<ReptileFeedingBoxIndexCollection> {
    const originalReptileFeedingBoxIndex = await DataStore.query(ReptileFeedingBoxIndexCollection, reptileFeedingBoxIndexID);
    if (!originalReptileFeedingBoxIndex) throw new Error('update reptile feeding box failed');

    await DataStore.save(
      ReptileFeedingBoxIndexCollection.copyOf(
        originalReptileFeedingBoxIndex,
        updated => {
          updated.verticalIndex = reptileFeedingBoxIndex.verticalIndex;
          updated.horizontalIndex = reptileFeedingBoxIndex.horizontalIndex;
          updated.reptileFeedingBoxID = reptileFeedingBoxIndex.reptileFeedingBoxID;
        }
      )
    );

    await this.fetchAll();

    return reptileFeedingBoxIndex;
  }

  async updateReptileFeedingLog(reptileFeedingLogID: string, reptileFeedingLog: ReptileFeedingLog): Promise<ReptileFeedingLog> {
    const originalReptileFeedingLog = await DataStore.query(ReptileFeedingLog, reptileFeedingLogID);
    if (!originalReptileFeedingLog) throw new Error('update reptile feeding box failed');

    await DataStore.save(
      ReptileFeedingLog.copyOf(
        originalReptileFeedingLog,
        updated => {
          updated.detail = reptileFeedingLog.detail;
          updated.environmentHumidity = reptileFeedingLog.environmentHumidity;
          updated.environmentTemperature = reptileFeedingLog.environmentTemperature;
          updated.feedingDateTime = reptileFeedingLog.feedingDateTime;
          updated.reptileID = reptileFeedingLog.reptileID;
          updated.weight = reptileFeedingLog.weight;
        }
      )
    );

    await this.fetchAll();

    return reptileFeedingLog;
  }

  async removeReptile(reptileID: string): Promise<boolean> {
    await DataStore.delete(Reptile, reptileID);
    await this.fetchAll();
    return true;
  }

  async removeReptileFeedingBox(reptileFeedingBoxID: string): Promise<boolean> {
    await DataStore.delete(ReptileFeedingBox, reptileFeedingBoxID);
    await this.fetchAll();
    return true;
  }

  async removeReptileFeedingBoxIndex(reptileFeedingBoxIndexID: string): Promise<boolean> {
    await DataStore.delete(ReptileFeedingBoxIndexCollection, reptileFeedingBoxIndexID);
    await this.fetchAll();
    return true;
  }

  async removeReptileFeedingLog(reptileFeedingLogID: string): Promise<boolean> {
    await DataStore.delete(ReptileFeedingLog, reptileFeedingLogID);
    await this.fetchAll();
    return true;
  }

  async findExactFeedingBoxIndexByHorizontalIndexAndVerticalIndex(
    reptileFeedingBoxId: string,
    verticalIndex: number,
    horizontalIndex: number
  ): Promise<ReptileFeedingBoxIndexCollection | null> {
    const exactReptileFeedingBoxes = await DataStore.query(
      ReptileFeedingBoxIndexCollection,
      (reptileFeedBoxIndexPredicated) =>
        reptileFeedBoxIndexPredicated.reptileFeedingBoxID('eq', reptileFeedingBoxId)
          .verticalIndex('eq', verticalIndex)
          .horizontalIndex('eq', horizontalIndex)
    );
    if (exactReptileFeedingBoxes.length > 0) return exactReptileFeedingBoxes[0];
    return null;
  }

  async findReptileFeedingBoxIndexesByHorizontalIndex(
    reptileFeedingBoxId: string,
    horizontalIndex: number
  ): Promise<ReptileFeedingBoxIndexCollection[]> {
    return await DataStore.query(
      ReptileFeedingBoxIndexCollection,
      (reptileFeedBoxIndexPredicated) =>
        reptileFeedBoxIndexPredicated.reptileFeedingBoxID('eq', reptileFeedingBoxId)
          .horizontalIndex('eq', horizontalIndex)
    );
  }

  async findReptileFeedingBoxIndexesByVerticalIndex(
    reptileFeedingBoxId: string,
    verticalIndex: number
  ): Promise<ReptileFeedingBoxIndexCollection[]> {
    return await DataStore.query(
      ReptileFeedingBoxIndexCollection,
      (reptileFeedBoxIndexPredicated) =>
        reptileFeedBoxIndexPredicated.reptileFeedingBoxID('eq', reptileFeedingBoxId)
          .horizontalIndex('eq', verticalIndex)
    );
  }
}

export default ReptileRepository;
