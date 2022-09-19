import { useContext, useEffect, useState } from 'react';
import { ReptileRepositoryContext } from './ReptileRepositoryProvider';
import {
  Reptile,
  ReptileFeedingBox,
  ReptileFeedingBoxIndexCollection,
  ReptileFeedingLog,
  ReptileType
} from '../../models';

export const useReptileRepository = () => {
  const reptileRepository = useContext(ReptileRepositoryContext);
  if (!reptileRepository) throw new Error('reptile feeder is not initialized');

  const [loading, setLoading] = useState<boolean>(false);
  const [reptiles, setReptiles] = useState<Reptile[]>([]);
  const [reptileTypes, setReptileTypes] = useState<ReptileType[]>([]);
  const [reptileFeedingBoxes, setReptilesFeedingBoxes] = useState<ReptileFeedingBox[]>([]);
  const [reptileFeedingBoxIndexes, setReptilesFeedingBoxIndexes] = useState<ReptileFeedingBoxIndexCollection[]>([]);
  const [reptileFeedingLogs, setReptileFeedingLogs] = useState<ReptileFeedingLog[]>([]);

  reptileRepository.onReptilesFetched(setReptiles);
  reptileRepository.onReptileTypesFetched(setReptileTypes);
  reptileRepository.onReptileFeedingBoxesFetched(setReptilesFeedingBoxes);
  reptileRepository.onReptileFeedingBoxIndexesFetched(setReptilesFeedingBoxIndexes);
  reptileRepository.onReptileFeedingLogsFetched(setReptileFeedingLogs);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  const fetchAll = async () => {
    try {
      startLoading();
      await reptileRepository.fetchAll();
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
    reptileRepository: reptileRepository,
    currentUser: reptileRepository.currentUser,
  };
};
