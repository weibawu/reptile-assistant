import React, { useEffect } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';

import { deduplicateJSONStringList } from '../../../libs/util';
import { useReptileRepository } from '../../../libs/reptile-repository/UseReptileRepository';

import { ReptileFeedingBoxType, ReptileTemperatureAndHumidityLog } from '../../../models';

export interface ReptileTemperatureAndHumidityLogModificationModalProps {
  open: boolean
  onClose: () => void
  editableReptileTemperatureAndHumidityLog?: ReptileTemperatureAndHumidityLog
}

type AnySelectOption<T> = { label: string; value: T }

interface ReptileTemperatureAndHumidityLogCreationFormProps {
  reptileFeedingBoxId: AnySelectOption<string>
  reptileFeedingBoxLayerIds: AnySelectOption<string>
  reptileId: AnySelectOption<string>
  weight: number
  environmentHumidity: number
  environmentTemperature: number
  meteringDateTime: string
  detail: string
}

function ModifyReptileTemperatureAndHumidityLogModal(
  props: ReptileTemperatureAndHumidityLogModificationModalProps,
) {
  const { onClose, open, editableReptileTemperatureAndHumidityLog } = props;

  const {
    reptiles,
    reptileFeedingBoxes,
    reptileFeedingBoxIndexes,
    reptileRepository,
    currentUser,
  } = useReptileRepository();

  const validationSchema = yup.object({
    environmentHumidity: yup.number(),
    environmentTemperature: yup.number(),
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReptileTemperatureAndHumidityLogCreationFormProps>({
    defaultValues: {
      reptileFeedingBoxId: { value: '' } as AnySelectOption<any>,
      reptileFeedingBoxLayerIds: { value: '{}' } as AnySelectOption<any>,
      reptileId: { value: '' } as AnySelectOption<any>,
      weight: '' as unknown as number,
      environmentHumidity: '' as unknown as number,
      environmentTemperature: '' as unknown as number,
      meteringDateTime: `${new Date().toISOString()}`,
      detail: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const reptileFeedingBoxOptions: AnySelectOption<string>[] = reptileFeedingBoxes.map(
    (reptileFeedingBox) => ({
      label: reptileFeedingBox.name!,
      value: reptileFeedingBox.id,
    }),
  );

  const reptileFeedingBoxLayerOptions: AnySelectOption<string>[] = deduplicateJSONStringList(
    reptileFeedingBoxIndexes
      .filter(
        (reptileFeedingBoxIndex) =>
          reptileFeedingBoxIndex.reptileFeedingBoxID === watch('reptileFeedingBoxId').value,
      )
      .map((filteredReptileFeedingBoxIndex) => ({
        label: '第' + filteredReptileFeedingBoxIndex.horizontalIndex + '层',
        value: JSON.stringify({
          reptileFeedingBoxId: filteredReptileFeedingBoxIndex.reptileFeedingBoxID,
          layer: filteredReptileFeedingBoxIndex.horizontalIndex,
        }),
      })),
  );

  const reptileOptions: AnySelectOption<string>[] = reptiles
    .filter((reptile) =>
      reptileFeedingBoxIndexes.find(
        (reptileFeedingBoxIndex) =>
          reptileFeedingBoxIndex.horizontalIndex ===
            JSON.parse(watch('reptileFeedingBoxLayerIds').value).layer &&
          reptile.reptileFeedingBoxID ===
            JSON.parse(watch('reptileFeedingBoxLayerIds').value).reptileFeedingBoxId &&
          reptile.reptileFeedingBoxIndexCollectionID === reptileFeedingBoxIndex.id,
      ),
    )
    .map((filteredReptileOption) => ({
      label:
        'No.' +
        reptileFeedingBoxIndexes.find(
          (reptileFeedingBoxIndex) =>
            reptileFeedingBoxIndex.id === filteredReptileOption.reptileFeedingBoxIndexCollectionID,
        )?.verticalIndex +
        ' ' +
        filteredReptileOption.name +
        ' ' +
        filteredReptileOption.genies?.join('/'),
      value: filteredReptileOption.id,
    }));

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleEditableReptileTemperatureAndHumidityLogPreset = () => {
    editableReptileTemperatureAndHumidityLog?.environmentTemperature &&
      setValue(
        'environmentTemperature',
        editableReptileTemperatureAndHumidityLog.environmentTemperature,
      );
    editableReptileTemperatureAndHumidityLog?.environmentHumidity &&
      setValue('environmentHumidity', editableReptileTemperatureAndHumidityLog.environmentHumidity);
    editableReptileTemperatureAndHumidityLog?.meteringDateTime &&
      setValue('meteringDateTime', editableReptileTemperatureAndHumidityLog.meteringDateTime);

    const editableReptile = reptiles.find(
      (reptile) => reptile.id === editableReptileTemperatureAndHumidityLog?.reptileID,
    );
    const editableReptileBelongedReptileFeedingBox = reptileFeedingBoxes.find(
      (reptileFeedingBox) => reptileFeedingBox.id === editableReptile?.reptileFeedingBoxID,
    );
    const editableReptileBelongedReptileFeedingBoxIndex = reptileFeedingBoxIndexes.find(
      (reptileFeedingBoxIndex) =>
        reptileFeedingBoxIndex.id === editableReptile?.reptileFeedingBoxIndexCollectionID,
    );

    if (
      editableReptileBelongedReptileFeedingBox &&
      editableReptileBelongedReptileFeedingBox.id &&
      editableReptileBelongedReptileFeedingBox.name
    ) {
      setValue('reptileFeedingBoxId', {
        label: editableReptileBelongedReptileFeedingBox.name,
        value: editableReptileBelongedReptileFeedingBox.id,
      });
    }

    if (
      editableReptileBelongedReptileFeedingBoxIndex &&
      editableReptileBelongedReptileFeedingBoxIndex.id
    ) {
      setValue('reptileFeedingBoxLayerIds', {
        label: '第' + editableReptileBelongedReptileFeedingBoxIndex.horizontalIndex + '层',
        value: JSON.stringify({
          reptileFeedingBoxId: editableReptileBelongedReptileFeedingBoxIndex.reptileFeedingBoxID,
          layer: editableReptileBelongedReptileFeedingBoxIndex.horizontalIndex,
        }),
      });
    }

    if (
      editableReptile &&
      editableReptileBelongedReptileFeedingBoxIndex &&
      editableReptile.name &&
      editableReptile.id &&
      editableReptile.genies
    ) {
      setValue('reptileId', {
        label:
          'No.' +
          editableReptileBelongedReptileFeedingBoxIndex.verticalIndex +
          ' ' +
          editableReptile.name +
          ' ' +
          editableReptile.genies.join('/'),
        value: editableReptile.id,
      });
    }
  };

  const onSubmit = async (form: ReptileTemperatureAndHumidityLogCreationFormProps) => {
    try {
      const reptileTemperatureAndHumidityLogSaved = new ReptileTemperatureAndHumidityLog({
        reptileID: form.reptileId.value,
        userID: currentUser.username,
        environmentTemperature: Number(form.environmentTemperature),
        environmentHumidity: Number(form.environmentHumidity),
        meteringDateTime: new Date(form.meteringDateTime).toISOString(),
      });

      if (
        !editableReptileTemperatureAndHumidityLog ||
        !editableReptileTemperatureAndHumidityLog.createdAt
      )
        await reptileRepository.createReptileTemperatureAndHumidityLog(
          reptileTemperatureAndHumidityLogSaved,
        );
      else
        await reptileRepository.updateReptileTemperatureAndHumidityLog(
          editableReptileTemperatureAndHumidityLog.id,
          reptileTemperatureAndHumidityLogSaved,
        );

      handleClose();
    } catch (e) {
      console.error('created or updated reptileTemperatureAndHumidity box error:', e);
    }
  };

  useEffect(handleEditableReptileTemperatureAndHumidityLogPreset, [
    editableReptileTemperatureAndHumidityLog,
  ]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>创建新日志</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ height: 400, minWidth: 180, paddingTop: 1 }}>
            <FormControl>
              <InputLabel id='reptileFeedingBoxId'>饲育容器</InputLabel>
              <Controller
                render={() => (
                  <Select
                    disabled={!!editableReptileTemperatureAndHumidityLog}
                    onChange={(e) =>
                      setValue(
                        'reptileFeedingBoxId',
                        reptileFeedingBoxOptions.find(
                          (reptileFeedingBoxOption) =>
                            reptileFeedingBoxOption.value === e.target.value,
                        )!,
                        { shouldValidate: true },
                      )
                    }
                    value={watch('reptileFeedingBoxId.value')}
                    labelId='reptileFeedingBoxId'
                    label='饲育容器'
                    error={!!errors.reptileFeedingBoxId}
                  >
                    {reptileFeedingBoxOptions.map((reptileFeedingBoxOption) => (
                      <MenuItem
                        key={reptileFeedingBoxOption.label}
                        value={reptileFeedingBoxOption.value}
                      >
                        {reptileFeedingBoxOption.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                name={'reptileFeedingBoxId'}
                control={control}
              />
            </FormControl>
            {watch('reptileFeedingBoxId.value') &&
            reptileFeedingBoxes.find(
              (reptileFeedingBox) => reptileFeedingBox.id === watch('reptileFeedingBoxId.value'),
            )?.type === ReptileFeedingBoxType.CABINET ? (
                <FormControl>
                  <InputLabel id='reptileFeedingBoxLayerIds'>层</InputLabel>
                  <Controller
                    render={() => (
                      <Select
                        disabled={!!editableReptileTemperatureAndHumidityLog}
                        onChange={(e) =>
                          setValue(
                            'reptileFeedingBoxLayerIds',
                          reptileFeedingBoxLayerOptions.find(
                            (reptileFeedingBoxLayerOption) =>
                              reptileFeedingBoxLayerOption.value === e.target.value,
                          )!,
                          { shouldValidate: true },
                          )
                        }
                        value={watch('reptileFeedingBoxLayerIds.value')}
                        labelId='reptileFeedingBoxLayerIds'
                        label='层'
                        error={!!errors.reptileFeedingBoxLayerIds}
                      >
                        {reptileFeedingBoxLayerOptions.map((reptileFeedingBoxLayerOption) => (
                          <MenuItem
                            key={reptileFeedingBoxLayerOption.label}
                            value={reptileFeedingBoxLayerOption.value}
                          >
                            {reptileFeedingBoxLayerOption.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    name={'reptileFeedingBoxLayerIds'}
                    control={control}
                  />
                </FormControl>
              ) : null}
            {watch('reptileFeedingBoxLayerIds.label') ? (
              <FormControl>
                <InputLabel id='reptileId'>爬宠</InputLabel>
                <Controller
                  render={() => (
                    <Select
                      disabled={!!editableReptileTemperatureAndHumidityLog}
                      onChange={(e) =>
                        setValue(
                          'reptileId',
                          reptileOptions.find(
                            (reptileOption) => reptileOption.value === e.target.value,
                          )!,
                          { shouldValidate: true },
                        )
                      }
                      value={watch('reptileId.value')}
                      labelId='reptileId'
                      label='爬宠'
                      error={!!errors.reptileFeedingBoxLayerIds}
                    >
                      {reptileOptions.map((reptile) => (
                        <MenuItem key={reptile.label} value={reptile.value}>
                          {reptile.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  name={'reptileId'}
                  control={control}
                />
              </FormControl>
            ) : null}
            {watch('reptileId.value') ? (
              <Controller
                name='meteringDateTime'
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    label={'测量时间'}
                    renderInput={(params) => (
                      <TextField autoComplete='off' sx={{ zIndex: 0 }} {...params} {...field} />
                    )}
                  />
                )}
              />
            ) : null}
            {watch('reptileId.value') ? (
              <Controller
                name='environmentTemperature'
                control={control}
                render={({ field }) => (
                  <TextField
                    error={!!errors.environmentTemperature}
                    type='number'
                    autoComplete='off'
                    placeholder={'环境温度(℃)'}
                    {...field}
                  />
                )}
              />
            ) : null}
            {watch('reptileId.value') ? (
              <Controller
                name='environmentHumidity'
                control={control}
                render={({ field }) => (
                  <TextField
                    error={!!errors.environmentHumidity}
                    type='number'
                    autoComplete='off'
                    placeholder={'环境湿度(%)'}
                    {...field}
                  />
                )}
              />
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type='submit'>完成</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ModifyReptileTemperatureAndHumidityLogModal;
