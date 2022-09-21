import { useContext, useEffect, useState } from 'react';
import { ReptileRepositoryContext } from './ReptileRepositoryProvider';
import {
  Reptile,
  ReptileFeedingBox,
  ReptileFeedingBoxIndexCollection,
  ReptileFeedingLog, ReptileTemperatureAndHumidityLog,
  ReptileType, ReptileWeightLog
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
  const [reptileWeightLogs, setReptileWeightLogs] = useState<ReptileWeightLog[]>([]);
  const [reptileTemperatureAndHumidityLogs, setReptileTemperatureAndHumidityLogs] = useState<ReptileTemperatureAndHumidityLog[]>([]);

  reptileRepository.onReptilesFetched(setReptiles);
  reptileRepository.onReptileTypesFetched(setReptileTypes);
  reptileRepository.onReptileFeedingBoxesFetched(setReptilesFeedingBoxes);
  reptileRepository.onReptileFeedingBoxIndexesFetched(setReptilesFeedingBoxIndexes);
  reptileRepository.onReptileFeedingLogsFetched(setReptileFeedingLogs);
  reptileRepository.onReptileWeightLogsFetched(setReptileWeightLogs);
  reptileRepository.onReptileTemperatureAndHumidityLogsFetched(setReptileTemperatureAndHumidityLogs);

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
    reptileWeightLogs,
    reptileTemperatureAndHumidityLogs,
    reptileRepository: reptileRepository,
    currentUser: reptileRepository.currentUser,
  };
};
