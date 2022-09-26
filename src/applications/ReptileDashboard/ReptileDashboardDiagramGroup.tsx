import { TreeMap } from '../../components/TreeMap/TreeMap';
import { Reptile, ReptileGenderType, ReptileType } from '../../models';
import React, { useContext } from 'react';
import { ReptileContext } from '../../libs/context/ReptileContext';
import { generateHashNumber } from '../../libs/util';
import Grid from '@mui/material/Unstable_Grid2';
import PieMap from '../../components/PieMap';
import BarMap from '../../components/BarMap';

type RawNode = {
  [key: string]: RawNode
} & {
  $count: number
}

type ReptileGenderLabelMap = {
  [key in ReptileGenderType]: string
}

const reptileGenderLabelMap: ReptileGenderLabelMap = {
  [ReptileGenderType.MALE]: '公',
  [ReptileGenderType.FAMALE]: '母',
  [ReptileGenderType.POSSIBLE_MALE]: '公温',
  [ReptileGenderType.POSSIBLE_FAMALE]: '母温',
  [ReptileGenderType.UNKNOWN]: '未知'
};

const getReptileRawData = (reptiles: Reptile[], reptileTypes: ReptileType[]) => {
  const rawData: RawNode = {} as RawNode;

  for (const reptileType of reptileTypes) {
    const reptilesInSpecificType = reptiles.filter(
      (reptile) => reptile.reptileTypeID === reptileType.id
    );
    if (reptilesInSpecificType.length !== 0) rawData[reptileType.name ?? reptileType.id] = {} as RawNode;

    const reptileNames = Array.from(new Set(reptilesInSpecificType.map((reptile) => reptile.name)));

    for (const reptileName of reptileNames) {
      const reptilesWithSpecificName = reptilesInSpecificType.filter(
        (reptile) => reptile.name === reptileName
      );
      rawData[reptileType.name ?? reptileType.id][reptileName!] = {} as RawNode;

      const reptileGenies = Array.from(
        new Set(
          reptilesWithSpecificName.map((reptile) =>
            [
              reptile.name,
              (reptile.genies ?? [])
                .slice()
                .sort((prev, next) => generateHashNumber(prev!) - generateHashNumber(next!))
                .join('、')
            ].join(' - ')
          )
        )
      );

      for (const reptileGenie of reptileGenies) {
        const reptilesWithSpecificGenie = reptilesWithSpecificName.filter(
          (reptile) =>
            [
              reptile.name,
              (reptile.genies ?? [])
                .slice()
                .sort((prev, next) => generateHashNumber(prev!) - generateHashNumber(next!))
                .join('、')
            ].join(' - ') === reptileGenie
        );
        rawData[reptileType.name ?? reptileType.id][reptileName!][reptileGenie.split(' - ')[1]] =
          {} as RawNode;

        for (const reptileGender in ReptileGenderType) {
          const reptilesWithSpecificGender = reptilesWithSpecificGenie.filter(
            (reptile) => reptile.gender === reptileGender
          );
          const reptileWithSpecificGenderCount = reptilesWithSpecificGender.length;

          if (reptileWithSpecificGenderCount) {
            rawData[reptileType.name ?? reptileType.id][reptileName!][reptileGenie.split(' - ')[1]][
              reptileGenderLabelMap[reptileGender as ReptileGenderType]
            ] = { $count: reptileWithSpecificGenderCount } as RawNode;
          }
        }
      }
    }
  }

  return rawData;
};

const getReptilePieMapGroupData = (reptiles: Reptile[]) => {
  const pieMapGroup: {title: string, diagramRawData: {name: string, value: number}[]}[] = [];

  const reptileNames = Array.from(new Set(reptiles.map((reptile) => reptile.name)));

  for (const reptileName of reptileNames) {
    const reptilesWithSpecificName = reptiles.filter(
      (reptile) => reptile.name === reptileName
    );

    const reptileGenies = Array.from(
      new Set(
        reptilesWithSpecificName.map((reptile) =>
          [
            reptile.name,
            (reptile.genies ?? [])
              .slice()
              .sort((prev, next) => generateHashNumber(prev!) - generateHashNumber(next!))
              .join('、')
          ].join(' - ')
        )
      )
    );

    pieMapGroup.push({
      title: reptileName + '基因、性别分布',
      diagramRawData: []
    });

    for (const reptileGenie of reptileGenies) {
      const reptilesWithSpecificGenie = reptilesWithSpecificName.filter(
        (reptile) =>
          [
            reptile.name,
            (reptile.genies ?? [])
              .slice()
              .sort((prev, next) => generateHashNumber(prev!) - generateHashNumber(next!))
              .join('、')
          ].join(' - ') === reptileGenie
      );

      const index = pieMapGroup.findIndex(genderPieMap => genderPieMap.title === reptileName + '基因、性别分布');
      pieMapGroup[index].diagramRawData.push({
        name: reptileGenie,
        value: reptilesWithSpecificGenie.length
      });
    }
  }

  return pieMapGroup;
};

const getReptileBarMapGroupData = (reptiles: Reptile[]) => {
  const rawValuePreset = [
    [
      '基因',
      reptileGenderLabelMap[ReptileGenderType.MALE],
      reptileGenderLabelMap[ReptileGenderType.FAMALE],
      reptileGenderLabelMap[ReptileGenderType.POSSIBLE_MALE],
      reptileGenderLabelMap[ReptileGenderType.POSSIBLE_FAMALE],
      reptileGenderLabelMap[ReptileGenderType.UNKNOWN]
    ],
  ];

  const barMapGroup: { title: string, diagramRawData: any }[] = [];

  const reptileNames = Array.from(new Set(reptiles.map((reptile) => reptile.name)));

  for (const reptileName of reptileNames) {
    const reptilesWithSpecificName = reptiles.filter(
      (reptile) => reptile.name === reptileName
    );

    const reptileGenies = Array.from(
      new Set(
        reptilesWithSpecificName.map((reptile) =>
          [
            reptile.name,
            (reptile.genies ?? [])
              .slice()
              .sort((prev, next) => generateHashNumber(prev!) - generateHashNumber(next!))
              .join('、')
          ].join(' - ')
        )
      )
    );

    barMapGroup.push({
      title: reptileName + '基因 / 性别关系图',
      diagramRawData: rawValuePreset.slice(),
    });

    for (const reptileGenie of reptileGenies) {
      const reptilesWithSpecificGenie = reptilesWithSpecificName.filter(
        (reptile) =>
          [
            reptile.name,
            (reptile.genies ?? [])
              .slice()
              .sort((prev, next) => generateHashNumber(prev!) - generateHashNumber(next!))
              .join('、')
          ].join(' - ') === reptileGenie
      );

      const parentIndex = barMapGroup.findIndex(barMap => barMap.title === reptileName + '基因 / 性别关系图');
      barMapGroup[parentIndex].diagramRawData.push([reptileGenie]);

      for (const reptileGender in ReptileGenderType) {
        const reptilesWithSpecificGender = reptilesWithSpecificGenie.filter(
          (reptile) => reptile.gender === reptileGender
        );
        const reptileWithSpecificGenderCount = reptilesWithSpecificGender.length;
        const childIndex = barMapGroup[parentIndex].diagramRawData.findIndex((rawData: any) => rawData[0] === reptileGenie);
        barMapGroup[parentIndex].diagramRawData[childIndex].push(reptileWithSpecificGenderCount);
      }
    }
  }

  console.log(barMapGroup);

  return barMapGroup;
};

const ReptileDashboardDiagramGroup = () => {
  const { loading, reptiles, reptileTypes } = useContext(ReptileContext);

  if (loading) return null;

  const reptileTreeMapRawData =getReptileRawData(reptiles, reptileTypes);

  const pieMapGroup = getReptilePieMapGroupData(reptiles);

  const barMapGroup = getReptileBarMapGroupData(reptiles);

  return (<Grid container justifyContent={'center'} padding={2}>
    <Grid padding={4} xs={11}>
      <TreeMap rootName={'全部'} title={'种群分布'} rawData={reptileTreeMapRawData} />
    </Grid>
    {
      pieMapGroup.map(
        (pieMap, index) => (
          <>
            <Grid key={pieMapGroup[index].title} padding={4} xs={11}>
              <PieMap rawData={pieMapGroup[index].diagramRawData} title={pieMapGroup[index].title} />
            </Grid>
            <Grid key={barMapGroup[index].title} padding={4} xs={11}>
              <BarMap rawData={barMapGroup[index].diagramRawData} title={barMapGroup[index].title} />
            </Grid>
          </>
        )
      )
    }
  </Grid>);
};

export default ReptileDashboardDiagramGroup;
