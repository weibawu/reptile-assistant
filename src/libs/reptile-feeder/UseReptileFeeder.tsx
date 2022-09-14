import { useContext, useEffect, useState } from 'react';
import { ReptileFeederContext } from './ReptileFeederProvider';
import {
  Reptile,
  ReptileFeedingBox,
  ReptileFeedingBoxIndexCollection,
  ReptileFeedingLog,
  ReptileType
} from '../../models';

export const useReptileFeeder = () => {
  const reptileFeeder = useContext(ReptileFeederContext);
  if (!reptileFeeder) throw new Error('reptile feeder is not initialized');

  const [loading, setLoading] = useState<boolean>(false);
  const [reptiles, setReptiles] = useState<Reptile[]>([]);
  const [reptileTypes, setReptileTypes] = useState<ReptileType[]>([]);
  const [reptileFeedingBoxes, setReptilesFeedingBoxes] = useState<ReptileFeedingBox[]>([]);
  const [reptileFeedingBoxIndexes, setReptilesFeedingBoxIndexes] = useState<ReptileFeedingBoxIndexCollection[]>([]);
  const [reptileFeedingLogs, setReptileFeedingLogs] = useState<ReptileFeedingLog[]>([]);

  reptileFeeder.onReptilesFetched(setReptiles);
  reptileFeeder.onReptileTypesFetched(setReptileTypes);
  reptileFeeder.onReptileFeedingBoxesFetched(setReptilesFeedingBoxes);
  reptileFeeder.onReptileFeedingBoxIndexesFetched(setReptilesFeedingBoxIndexes);
  reptileFeeder.onReptileFeedingLogsFetched(setReptileFeedingLogs);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  const fetchAll = async () => {
    try {
      startLoading();
      await reptileFeeder.fetchAll();
    } catch (e) {
      console.error('Reptile Feeder Fetch Error: ', e);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchAll().then();
  }, []);

  return {
    loading,
    reptiles,
    reptileTypes,
    reptileFeedingBoxes,
    reptileFeedingBoxIndexes,
    reptileFeedingLogs,
    reptileFeeder,
  };
};
