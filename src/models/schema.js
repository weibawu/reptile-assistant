export const schema = {
  models: {
    ReptileTemperatureAndHumidityLog: {
      name: 'ReptileTemperatureAndHumidityLog',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        environmentHumidity: {
          name: 'environmentHumidity',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        environmentTemperature: {
          name: 'environmentTemperature',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        meteringDateTime: {
          name: 'meteringDateTime',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
        },
        userID: {
          name: 'userID',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        reptileID: {
          name: 'reptileID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'ReptileTemperatureAndHumidityLogs',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byReptile',
            fields: ['reptileID'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    ReptileWeightLog: {
      name: 'ReptileWeightLog',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        weight: {
          name: 'weight',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        meteringDateTime: {
          name: 'meteringDateTime',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
        },
        userID: {
          name: 'userID',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        reptileID: {
          name: 'reptileID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'ReptileWeightLogs',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byReptile',
            fields: ['reptileID'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    ReptileFeedingLog: {
      name: 'ReptileFeedingLog',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        weight: {
          name: 'weight',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        detail: {
          name: 'detail',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        environmentHumidity: {
          name: 'environmentHumidity',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        environmentTemperature: {
          name: 'environmentTemperature',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        feedingDateTime: {
          name: 'feedingDateTime',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
        },
        userID: {
          name: 'userID',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        reptileID: {
          name: 'reptileID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'ReptileFeedingLogs',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byReptile',
            fields: ['reptileID'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    ReptileFeedingBoxIndexCollection: {
      name: 'ReptileFeedingBoxIndexCollection',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        verticalIndex: {
          name: 'verticalIndex',
          isArray: false,
          type: 'Int',
          isRequired: false,
          attributes: [],
        },
        horizontalIndex: {
          name: 'horizontalIndex',
          isArray: false,
          type: 'Int',
          isRequired: false,
          attributes: [],
        },
        userID: {
          name: 'userID',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        reptileFeedingBoxID: {
          name: 'reptileFeedingBoxID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        Reptiles: {
          name: 'Reptiles',
          isArray: true,
          type: {
            model: 'Reptile',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'reptileFeedingBoxIndexCollectionID',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'ReptileFeedingBoxIndexCollections',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byReptileFeedingBox',
            fields: ['reptileFeedingBoxID'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Reptile: {
      name: 'Reptile',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        nickname: {
          name: 'nickname',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        gender: {
          name: 'gender',
          isArray: false,
          type: {
            enum: 'ReptileGenderType',
          },
          isRequired: false,
          attributes: [],
        },
        weight: {
          name: 'weight',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        birthdate: {
          name: 'birthdate',
          isArray: false,
          type: 'AWSDate',
          isRequired: false,
          attributes: [],
        },
        userID: {
          name: 'userID',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        reptileTypeID: {
          name: 'reptileTypeID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        ReptileFeedingLogs: {
          name: 'ReptileFeedingLogs',
          isArray: true,
          type: {
            model: 'ReptileFeedingLog',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'reptileID',
          },
        },
        reptileFeedingBoxIndexCollectionID: {
          name: 'reptileFeedingBoxIndexCollectionID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        reptileFeedingBoxID: {
          name: 'reptileFeedingBoxID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        genies: {
          name: 'genies',
          isArray: true,
          type: 'String',
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
        },
        ReptileTemperatureAndHumidityLogs: {
          name: 'ReptileTemperatureAndHumidityLogs',
          isArray: true,
          type: {
            model: 'ReptileTemperatureAndHumidityLog',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'reptileID',
          },
        },
        ReptileWeightLogs: {
          name: 'ReptileWeightLogs',
          isArray: true,
          type: {
            model: 'ReptileWeightLog',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'reptileID',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Reptiles',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byReptileType',
            fields: ['reptileTypeID'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byReptileFeedingBoxIndexCollection',
            fields: ['reptileFeedingBoxIndexCollectionID'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byReptileFeedingBox',
            fields: ['reptileFeedingBoxID'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    ReptileFeedingBox: {
      name: 'ReptileFeedingBox',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        type: {
          name: 'type',
          isArray: false,
          type: {
            enum: 'ReptileFeedingBoxType',
          },
          isRequired: false,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        userID: {
          name: 'userID',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        ReptileFeedingBoxIndexCollections: {
          name: 'ReptileFeedingBoxIndexCollections',
          isArray: true,
          type: {
            model: 'ReptileFeedingBoxIndexCollection',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'reptileFeedingBoxID',
          },
        },
        Reptiles: {
          name: 'Reptiles',
          isArray: true,
          type: {
            model: 'Reptile',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'reptileFeedingBoxID',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'ReptileFeedingBoxes',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    ReptileType: {
      name: 'ReptileType',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        Reptiles: {
          name: 'Reptiles',
          isArray: true,
          type: {
            model: 'Reptile',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'reptileTypeID',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'ReptileTypes',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
  },
  enums: {
    ReptileGenderType: {
      name: 'ReptileGenderType',
      values: ['MALE', 'FAMALE', 'POSSIBLE_MALE', 'POSSIBLE_FAMALE', 'UNKNOWN'],
    },
    ReptileFeedingBoxType: {
      name: 'ReptileFeedingBoxType',
      values: ['BOX', 'CABINET'],
    },
  },
  nonModels: {},
  version: '2b88297a0efb5719588031b87c9dbedb',
}
