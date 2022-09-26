import { TreeMap } from '../../components/TreeMap/TreeMap';
import { Reptile, ReptileGenderType, ReptileType } from '../../models';
import React, { useContext } from 'react';
import { ReptileContext } from '../../libs/context/ReptileContext';
import { generateHashNumber } from '../../libs/util';

type RawNode = {
  [key: string]: RawNode;
} & {
  $count: number;
};

type ReptileGenderLabelMap = {
  [key in ReptileGenderType]: string;
};

const reptileGenderLabelMap: ReptileGenderLabelMap = {
  [ReptileGenderType.MALE]: '公',
  [ReptileGenderType.FAMALE]: '母',
  [ReptileGenderType.POSSIBLE_MALE]: '公温',
  [ReptileGenderType.POSSIBLE_FAMALE]: '母温',
  [ReptileGenderType.UNKNOWN]: '未知',
};

const getReptileRawData = (
  reptiles: Reptile[],
  reptileTypes: ReptileType[],
) => {
  const rawData: RawNode = {} as RawNode;

  for (const reptileType of reptileTypes) {
    const reptilesInSpecificType = reptiles.filter(reptile => reptile.reptileTypeID === reptileType.id);
    rawData[reptileType.name ?? reptileType.id] = {} as RawNode;

    const reptileNames = Array.from(new Set(reptilesInSpecificType.map(reptile => reptile.name)));

    for (const reptileName of reptileNames) {
      const reptilesWithSpecificName = reptilesInSpecificType.filter(reptile => reptile.name === reptileName);
      rawData[reptileType.name ?? reptileType.id][reptileName!] = {} as RawNode;

      const reptileGenies = Array.from(
        new Set(
          reptilesWithSpecificName.map(
            reptile => [reptile.name, (reptile.genies ?? [])
              .slice()
              .sort((prev, next) => generateHashNumber(prev!) - generateHashNumber(next!))
              .join('、')].join(' - ')
          )
        )
      );

      for (const reptileGenie of reptileGenies) {
        const reptilesWithSpecificGenie = reptilesWithSpecificName.filter(
          reptile => [reptile.name, (reptile.genies ?? [])
            .slice()
            .sort((prev, next) => generateHashNumber(prev!) - generateHashNumber(next!))
            .join('、')].join(' - ') === reptileGenie
        );
        rawData[reptileType.name ?? reptileType.id][reptileName!][reptileGenie.split(' - ')[1]] = {} as RawNode;

        for (const reptileGender in ReptileGenderType) {
          const reptilesWithSpecificGender = reptilesWithSpecificGenie.filter(
            reptile => reptile.gender === reptileGender
          );
          const reptileWithSpecificGenderCount = reptilesWithSpecificGender.length;

          if (reptileWithSpecificGenderCount) {
            rawData
              [reptileType.name ?? reptileType.id]
              [reptileName!]
              [reptileGenie.split(' - ')[1]]
              [reptileGenderLabelMap[reptileGender as ReptileGenderType]]
              = { $count: reptileWithSpecificGenderCount } as RawNode;
          }

        }
      }
    }
  }

  return rawData;
};


const TreeMapAnalyzing = () => {
  const {
    loading,
    reptiles,
    reptileTypes,
  } = useContext(ReptileContext);

  if (loading) return null;

  return <TreeMap title={'种群分析'} rawData={getReptileRawData(reptiles, reptileTypes)}/>;
};

export default TreeMapAnalyzing;
