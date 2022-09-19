import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Box, Stack, TextField} from '@mui/material';
import {Controller, useForm} from 'react-hook-form';
import {
  ReptileFeedingBox,
  ReptileFeedingBoxIndexCollection,
  ReptileFeedingLog,
  Reptile,
  ReptileType
} from '../../../models';
import Select from 'react-select';
import {DataStore} from 'aws-amplify';
import {TextAreaField, useAuthenticator} from '@aws-amplify/ui-react';

import * as yup from 'yup';
import {styled} from '@mui/material/styles';
import {useEffect} from 'react';
import {yupResolver} from '@hookform/resolvers/yup';
import {DatePicker, DateTimePicker} from '@mui/lab';
import {TextArea} from '@aws-amplify/ui-react/dist/types/primitives/TextArea';

export interface FeedingLogModificationModalProps {
    open: boolean;
    onClose: () => void;
    reptiles: Reptile[];
    reptileTypes: ReptileType[];
    feedingBoxes: ReptileFeedingBox[];
    feedingBoxIndexes: ReptileFeedingBoxIndexCollection[];
    editableFeedingLog?: ReptileFeedingLog;
}

function ModifyFeedingLogModal(props: FeedingLogModificationModalProps) {
  const {onClose, open, editableFeedingLog, feedingBoxes, feedingBoxIndexes, reptiles} = props;

  const validationSchema = yup.object({});

  const feedingBoxOptions = feedingBoxes.map(
    feedingBox => ({
      label: feedingBox.name,
      value: feedingBox,
    })
  );

  const {user} = useAuthenticator(ctx => [ctx.user]);

  const {control, handleSubmit, reset, watch, getValues, setValue, formState: {errors}} = useForm({
    defaultValues: {
      feedingBox: null,
      feedingBoxLayer: null,
      reptile: null,
      weight: null,
      environmentHumidity: null,
      environmentTemperature: null,
      feedingDateTime: `${ new Date().toISOString()}`,
      detail: null,
    },
    resolver: yupResolver(validationSchema),
  });

  const feedingBoxLayerOptions =
        [
          ...new Set(
            feedingBoxIndexes.filter(
              _ => _.reptileFeedingBoxID === watch('feedingBox')?.value.id
            ).map(_ => (JSON.stringify({
              label: '第' + _.horizontalIndex + '层',
              value: {feedingBoxId: _.reptileFeedingBoxID, layer: _.horizontalIndex},
            })))
          )
        ].map(_ => JSON.parse(_));

  const reptileOptions = reptiles.filter(
    _ => feedingBoxIndexes.find(__ => __.id === _.reptileFeedingBoxIndexCollectionID)?.horizontalIndex === watch('feedingBoxLayer')?.value.layer
            && feedingBoxes.find(__ => __.id === _.reptileFeedingBoxID)?.id === watch('feedingBoxLayer')?.value.feedingBoxId,
  ).map(_ =>
    ({
      label: '第' + feedingBoxIndexes.find(__ => __.id === _.reptileFeedingBoxIndexCollectionID)?.verticalIndex + '列 ' + _.name,
      value: _,
    })
  );

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (editableFeedingLog) {
      const foundReptile = reptiles.find(_ => _.id === editableFeedingLog.reptileID);
      const foundFeedingBox = feedingBoxOptions.find(_ => _.value.id === foundReptile.reptileFeedingBoxID);
      setValue('feedingBox', foundFeedingBox);
      setValue('weight', editableFeedingLog.weight);
      setValue('environmentTemperature', editableFeedingLog.environmentTemperature);
      setValue('environmentHumidity', editableFeedingLog.environmentHumidity);
      setValue('feedingDateTime', editableFeedingLog.feedingDateTime);
      setValue('detail', editableFeedingLog.detail);

    }
  }, [editableFeedingLog]);

  useEffect(() => {
    if (!!editableFeedingLog && !getValues('feedingBoxLayer')) {
      const foundReptile = reptiles.find(_ => _.id === editableFeedingLog.reptileID);
      const foundFeedingBoxIndex = feedingBoxIndexes.find(_ => _.id === foundReptile.reptileFeedingBoxIndexCollectionID);
      setValue('feedingBoxLayer', feedingBoxLayerOptions.find(_ => _.value.layer === foundFeedingBoxIndex.horizontalIndex && _.value.feedingBoxId === foundReptile.reptileFeedingBoxID));
    }
  }, [feedingBoxLayerOptions]);

  useEffect(() => {
    if (!!editableFeedingLog && !getValues('reptile')) {
      const foundReptile = reptiles.find(_ => _.id === editableFeedingLog.reptileID);
      setValue('reptile', reptileOptions.find(_ => _.value.id === foundReptile.id));
    }
  }, [feedingBoxLayerOptions]);

  const onSubmit = async form => {
    try {
      if (editableFeedingLog) {
        const originalFeedingLog = await DataStore.query(ReptileFeedingLog, editableFeedingLog.id);
        await DataStore.save(
          ReptileFeedingLog.copyOf(
            originalFeedingLog, updated => {
              updated.detail = form.detail;
              updated.environmentHumidity = Number(form.environmentHumidity);
              updated.environmentTemperature = Number(form.environmentTemperature);
              updated.feedingDateTime = new Date(form.feedingDateTime).toISOString();
              updated.reptileID = form.reptile.value.id;
              updated.userID = user.username;
              updated.weight = Number(form.weight);
            }
          )
        );
        handleClose();
      } else {
        await DataStore.save(new ReptileFeedingLog({
          detail: form.detail,
          environmentHumidity: Number(form.environmentHumidity),
          environmentTemperature: Number(form.environmentTemperature),
          feedingDateTime: new Date(form.feedingDateTime).toISOString(),
          reptileID: form.reptile.value.id,
          userID: user.username,
          weight: Number(form.weight),
        }));
        handleClose();
      }
    } catch (e) {
      console.error('created or updated feeding box error:', e);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>创建新日志</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{height: 600, minWidth: 180}}>
            <Controller
              name="feedingBox"
              control={control}
              render={
                ({field}) => (
                  <Select
                    isDisabled={!!editableFeedingLog}
                    placeholder={'爬柜'}
                    {...field}
                    options={feedingBoxOptions}
                  />
                )
              }
            />
            {watch('feedingBox') ? <Controller
              name="feedingBoxLayer"
              control={control}
              render={
                ({field}) => (
                  <Select
                    isDisabled={!!editableFeedingLog}
                    placeholder={'层'}
                    {...field}
                    options={feedingBoxLayerOptions}
                  />
                )
              }
            />
              : null
            }
            {watch('feedingBoxLayer') ? <Controller
              name="reptile"
              control={control}
              render={
                ({field}) => (
                  <Select
                    isDisabled={!!editableFeedingLog}
                    placeholder={'爬宠'}
                    {...field}
                    options={reptileOptions}
                  />
                )
              }
            />
              : null
            }
            {watch('reptile') ? <Controller
              name="weight"
              control={control}
              render={
                ({field}) => (
                  <TextField
                    placeholder={'当前体重(g)'}
                    {...field}
                  />
                )
              }
            />
              : null
            }
            {watch('reptile') ? <Controller
              name="environmentHumidity"
              control={control}
              render={
                ({field}) => (
                  <TextField
                    placeholder={'环境湿度(%)'}
                    {...field}
                  />
                )
              }
            />
              : null
            }
            {watch('reptile') ? <Controller
              name="environmentTemperature"
              control={control}
              render={
                ({field}) => (
                  <TextField
                    placeholder={'环境温度(℃)'}
                    {...field}
                  />
                )
              }
            />
              : null
            }
            {watch('reptile') ? <Controller
              name="feedingDateTime"
              control={control}
              render={
                ({field}) => (
                  <DateTimePicker
                    {...field}
                    label={'喂食时间'}
                    renderInput={(params) => (
                      <TextField
                        sx={{zIndex: 0}}
                        {...params}
                        {...field}
                      />
                    )}/>
                )
              }
            />
              : null
            }
            {watch('reptile') ? <Controller
              name="detail"
              control={control}
              render={
                ({field}) => (
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

export default ModifyFeedingLogModal;
