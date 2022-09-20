import React, {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Box,
  Stack,
  TextField,
  InputLabel, MenuItem, FormControl, Select
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import {
  ReptileFeedingBox,
  ReptileFeedingBoxIndexCollection,
  ReptileFeedingLog,
  Reptile,
  ReptileType, ReptileGenderType
} from '../../models';
import { DataStore } from 'aws-amplify';
import { TextAreaField, useAuthenticator } from '@aws-amplify/ui-react';

import * as yup from 'yup';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import { TextArea } from '@aws-amplify/ui-react/dist/types/primitives/TextArea';
import { deduplicateJSONStringList } from '../../libs/util';
import { useReptileRepository } from '../../libs/reptile-repository/UseReptileRepository';

export interface ReptileFeedingLogModificationModalProps {
  open: boolean;
  onClose: () => void;
  editableReptileFeedingLog?: ReptileFeedingLog;
}

type AnySelectOption<T> = { label: string, value: T };

interface ReptileFeedingLogCreationFormProps {
  reptileFeedingBoxId: AnySelectOption<string>,
  reptileFeedingBoxLayerIds: AnySelectOption<string>,
  reptileId: AnySelectOption<string>,
  weight: number,
  environmentHumidity: number,
  environmentTemperature: number,
  reptileFeedingDateTime: string,
  detail: string,
}

function ModifyReptileFeedingLogModal(props: ReptileFeedingLogModificationModalProps) {
  const {
    onClose,
    open,
    editableReptileFeedingLog
  } = props;

  const {
    reptiles,
    reptileFeedingBoxes,
    reptileFeedingBoxIndexes,
    reptileRepository,
    currentUser
  } = useReptileRepository();

  const validationSchema = yup.object({});

  const {
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors }
  } = useForm<ReptileFeedingLogCreationFormProps>({
    defaultValues: {
      reptileFeedingBoxId: { value: '' } as AnySelectOption<any>,
      reptileFeedingBoxLayerIds: { value: '{}' } as AnySelectOption<any>,
      reptileId: { value: '' } as AnySelectOption<any>,
      weight: '' as unknown as number,
      environmentHumidity: '' as unknown as number,
      environmentTemperature: '' as unknown as number,
      reptileFeedingDateTime: `${new Date().toISOString()}`,
      detail: ''
    },
    resolver: yupResolver(validationSchema)
  });

  const reptileFeedingBoxOptions: AnySelectOption<string>[] = reptileFeedingBoxes.map(
    reptileFeedingBox => ({
      label: reptileFeedingBox.name!,
      value: reptileFeedingBox.id
    })
  );

  const reptileFeedingBoxLayerOptions: AnySelectOption<string>[] = deduplicateJSONStringList(
    reptileFeedingBoxIndexes
      .filter(
        reptileFeedingBoxIndex =>
          reptileFeedingBoxIndex.reptileFeedingBoxID
          === getValues('reptileFeedingBoxId.value')
      ).map(
        filteredReptileFeedingBoxIndex =>
          ({
            label: '第' + filteredReptileFeedingBoxIndex.horizontalIndex + '层',
            value: JSON.stringify({
              reptileFeedingBoxId: filteredReptileFeedingBoxIndex.reptileFeedingBoxID,
              layer: filteredReptileFeedingBoxIndex.horizontalIndex
            })
          })
      )
  );

  const reptileOptions: AnySelectOption<string>[] = reptiles
    .filter(
      reptile => reptileFeedingBoxIndexes.find(
        reptileFeedingBoxIndex =>
          reptileFeedingBoxIndex.horizontalIndex === JSON.parse(
            getValues('reptileFeedingBoxLayerIds.value')
          ).layer
          && reptile.reptileFeedingBoxID === JSON.parse(
            getValues('reptileFeedingBoxLayerIds.value')
          ).reptileFeedingBoxId
          && reptile.reptileFeedingBoxIndexCollectionID === reptileFeedingBoxIndex.id
      )
    )
    .map(filteredReptileOption => ({
      label: 'NO.'
          + reptileFeedingBoxIndexes.find(reptileFeedingBoxIndex => reptileFeedingBoxIndex.id === filteredReptileOption.reptileFeedingBoxIndexCollectionID)?.verticalIndex
          + ' '
          + filteredReptileOption.name
          + ' '
          + filteredReptileOption.genies?.join('/'),
      value: filteredReptileOption.id
    })
    );

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleEditableReptileFeedingLogPreset = () => {
    editableReptileFeedingLog?.weight && setValue('weight', editableReptileFeedingLog.weight);
    editableReptileFeedingLog?.environmentTemperature && setValue('environmentTemperature', editableReptileFeedingLog.environmentTemperature);
    editableReptileFeedingLog?.environmentHumidity && setValue('environmentHumidity', editableReptileFeedingLog.environmentHumidity);
    editableReptileFeedingLog?.feedingDateTime && setValue('reptileFeedingDateTime', editableReptileFeedingLog.feedingDateTime);
    editableReptileFeedingLog?.detail && setValue('detail', editableReptileFeedingLog.detail);

    const editableReptile = reptiles.find(reptile => reptile.id === editableReptileFeedingLog?.reptileID);
    const editableReptileBelongedReptileFeedingBox = reptileFeedingBoxes.find(reptileFeedingBox => reptileFeedingBox.id === editableReptile?.reptileFeedingBoxID);
    const editableReptileBelongedReptileFeedingBoxIndex = reptileFeedingBoxIndexes.find(reptileFeedingBoxIndex => reptileFeedingBoxIndex.id === editableReptile?.reptileFeedingBoxIndexCollectionID);

    if (
      editableReptileBelongedReptileFeedingBox
      && editableReptileBelongedReptileFeedingBox.id
      && editableReptileBelongedReptileFeedingBox.name
    ) {
      setValue('reptileFeedingBoxId', {
        label: editableReptileBelongedReptileFeedingBox.name,
        value: editableReptileBelongedReptileFeedingBox.id
      });
    }

    if (
      editableReptileBelongedReptileFeedingBoxIndex
      && editableReptileBelongedReptileFeedingBoxIndex.id
      && editableReptileBelongedReptileFeedingBoxIndex.horizontalIndex
      && editableReptileBelongedReptileFeedingBoxIndex.verticalIndex
    ) {
      setValue('reptileFeedingBoxLayerIds', {
        label: '第' + editableReptileBelongedReptileFeedingBoxIndex.horizontalIndex + '层',
        value: JSON.stringify({
          reptileFeedingBoxId: editableReptileBelongedReptileFeedingBoxIndex.reptileFeedingBoxID,
          layer: editableReptileBelongedReptileFeedingBoxIndex.horizontalIndex
        })
      });
    }

    if (
      editableReptile
      && editableReptileBelongedReptileFeedingBoxIndex
      && editableReptile.name
      && editableReptile.id
      && editableReptile.genies
      && editableReptileBelongedReptileFeedingBoxIndex.verticalIndex
    ) {
      setValue('reptileId', {
        label: 'NO.'
          + editableReptileBelongedReptileFeedingBoxIndex.verticalIndex
          + ' '
          + editableReptile.name
          + ' '
          + editableReptile.genies.join('/'),
        value: editableReptile.id
      });
    }
  };

  const onSubmit = async (form: ReptileFeedingLogCreationFormProps) => {
    try {
      const reptileFeedingLogSaved = new ReptileFeedingLog({
        reptileID: form.reptileId.value,
        userID: currentUser.username,
        weight: Number(form.weight),
        environmentHumidity: Number(form.environmentHumidity),
        environmentTemperature: Number(form.environmentTemperature),
        feedingDateTime: new Date(form.reptileFeedingDateTime).toISOString(),
        detail: form.detail
      });
      if (!editableReptileFeedingLog) await reptileRepository.createReptileFeedingLog(reptileFeedingLogSaved);
      else await reptileRepository.updateReptileFeedingLog(reptileFeedingLogSaved.id, reptileFeedingLogSaved);
      handleClose();
    } catch (e) {
      console.error('created or updated reptileFeeding box error:', e);
    }
  };

  useEffect(handleEditableReptileFeedingLogPreset, [editableReptileFeedingLog]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>创建新日志</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ height: 600, minWidth: 180 }}>
            <FormControl>
              <InputLabel id="reptileFeedingBoxId">饲养容器</InputLabel>
              <Controller
                render={
                  () => <Select
                    onChange={e => setValue('reptileFeedingBoxId', reptileFeedingBoxOptions.find(reptileFeedingBoxOption => reptileFeedingBoxOption.value === e.target.value)!, { shouldValidate: true })}
                    value={getValues('reptileFeedingBoxId.value')}
                    labelId="reptileFeedingBoxId"
                    label="饲养容器"
                    error={!!errors.reptileFeedingBoxId}
                  >
                    {
                      reptileFeedingBoxOptions.map(
                        reptileFeedingBoxOption => (
                          <MenuItem
                            key={reptileFeedingBoxOption.label}
                            value={reptileFeedingBoxOption.value}>
                            {reptileFeedingBoxOption.label}
                          </MenuItem>
                        )
                      )
                    }
                  </Select>
                }
                name={'reptileFeedingBoxId'}
                control={control}
              />
            </FormControl>
            {watch('reptileFeedingBoxId.value')
              ? <FormControl>
                <InputLabel id="reptileFeedingBoxLayerIds">层</InputLabel>
                <Controller
                  render={
                    () => <Select
                      onChange={e => setValue('reptileFeedingBoxLayerIds', reptileFeedingBoxLayerOptions.find(reptileFeedingBoxLayerOption => reptileFeedingBoxLayerOption.value === e.target.value)!, { shouldValidate: true })}
                      value={getValues('reptileFeedingBoxLayerIds.value')}
                      labelId="reptileFeedingBoxLayerIds"
                      label="层"
                      error={!!errors.reptileFeedingBoxLayerIds}
                    >
                      {
                        reptileFeedingBoxLayerOptions.map(
                          reptileFeedingBoxLayerOption => (
                            <MenuItem
                              key={reptileFeedingBoxLayerOption.label}
                              value={reptileFeedingBoxLayerOption.value}>
                              {reptileFeedingBoxLayerOption.label}
                            </MenuItem>
                          )
                        )
                      }
                    </Select>
                  }
                  name={'reptileFeedingBoxLayerIds'}
                  control={control}
                />
              </FormControl>
              : null
            }
            {watch('reptileFeedingBoxLayerIds.label')
              ? <FormControl>
                <InputLabel id="reptileId">爬宠</InputLabel>
                <Controller
                  render={
                    () => <Select
                      onChange={e => setValue('reptileId', reptileOptions.find(reptileOption => reptileOption.value === e.target.value)!, { shouldValidate: true })}
                      value={getValues('reptileId.value')}
                      labelId="reptileId"
                      label="爬宠"
                      error={!!errors.reptileFeedingBoxLayerIds}
                    >
                      {
                        reptileOptions.map(
                          reptile => (
                            <MenuItem
                              key={reptile.label}
                              value={reptile.value}>
                              {reptile.label}
                            </MenuItem>
                          )
                        )
                      }
                    </Select>
                  }
                  name={'reptileId'}
                  control={control}
                />
              </FormControl>
              : null
            }
            {watch('reptileId.value') ? <Controller
              name="weight"
              control={control}
              render={
                ({ field }) => (
                  <TextField
                    placeholder={'当前体重(g)'}
                    {...field}
                  />
                )
              }
            />
              : null
            }
            {watch('reptileId.value') ? <Controller
              name="environmentHumidity"
              control={control}
              render={
                ({ field }) => (
                  <TextField
                    placeholder={'环境湿度(%)'}
                    {...field}
                  />
                )
              }
            />
              : null
            }
            {watch('reptileId.value') ? <Controller
              name="environmentTemperature"
              control={control}
              render={
                ({ field }) => (
                  <TextField
                    placeholder={'环境温度(℃)'}
                    {...field}
                  />
                )
              }
            />
              : null
            }
            {watch('reptileId.value') ? <Controller
              name="reptileFeedingDateTime"
              control={control}
              render={
                ({ field }) => (
                  <DateTimePicker
                    {...field}
                    label={'喂食时间'}
                    renderInput={(params) => (
                      <TextField
                        sx={{ zIndex: 0 }}
                        {...params}
                        {...field}
                      />
                    )} />
                )
              }
            />
              : null
            }
            {watch('reptileId.value') ? <Controller
              name="detail"
              control={control}
              render={
                ({ field }) => (
                  <TextField
                    multiline
                    minRows={2}
                    placeholder={'喂食详情'}
                    {...field}
                  />
                )
              }
            />
              : null
            }
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="submit">完成</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ModifyReptileFeedingLogModal;
