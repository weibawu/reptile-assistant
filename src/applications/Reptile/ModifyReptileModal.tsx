import React, { useEffect } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  IconButton,
  Typography, TextField
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import {
  Reptile,
  ReptileFeedingBox,
  ReptileFeedingBoxIndexCollection,
  ReptileGenderType,
  ReptileType
} from '../../models';
import Select from 'react-select';
import { useAuthenticator } from '@aws-amplify/ui-react';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/lab';
import { useReptileRepository } from '../../libs/reptile-repository/UseReptileRepository';

export interface ReptileModificationModalProps {
  open: boolean;
  onClose: () => void;
  editableReptile?: Reptile;
}

type AnySelectOption<T> = { label: string, value: T };

interface ReptileCreationFormProps {
  name: string,
  nickname: string,
  gender: AnySelectOption<ReptileGenderType>,
  birthdate: string,
  weight: number,
  genies: string,
  reptileFeedingBox: AnySelectOption<ReptileFeedingBox>,
  reptileType: AnySelectOption<ReptileType>,
  verticalIndex: number,
  horizontalIndex: number
}

function ModifyReptileModal(props: ReptileModificationModalProps) {
  const { onClose, open, editableReptile } = props;

  const {
    reptileTypes,
    reptileFeedingBoxes,
    reptileFeedingBoxIndexes,
    reptileRepository,
    currentUser
  } = useReptileRepository();

  const reptileTypeOptions: AnySelectOption<ReptileType>[] = reptileTypes.map(
    reptileTypeModel => ({
      label: reptileTypeModel.name!,
      value: reptileTypeModel
    })
  );

  const reptileFeedingBoxOptions: AnySelectOption<ReptileFeedingBox>[] = reptileFeedingBoxes.map(
    reptileFeedingBox => ({
      label: reptileFeedingBox.name!,
      value: reptileFeedingBox
    })
  );

  const reptileGenderOptions: AnySelectOption<ReptileGenderType>[] = [
    { label: '公', value: ReptileGenderType.MALE },
    { label: '母', value: ReptileGenderType.FAMALE },
    { label: '公温', value: ReptileGenderType.POSSIBLE_MALE },
    { label: '母温', value: ReptileGenderType.POSSIBLE_FAMALE },
    { label: '未知', value: ReptileGenderType.UNKNOWN }
  ];

  // const validationSchema = yup.object({
  //   name: yup.string().max(40),
  //   nickname: yup.string().required().max(20),
  //   verticalIndex: yup.number(),
  //   horizontalIndex: yup.number(),
  //   reptileType: yup.object().required(),
  //   reptileFeedingBox: yup.object().required()
  // });

  const { user } = useAuthenticator(ctx => [ctx.user]);

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ReptileCreationFormProps>({
    // defaultValues: {
    //   name: undefined,
    //   nickname: undefined,
    //   gender: undefined,
    //   birthdate: `${new Date().toISOString().slice(0, 10)}`,
    //   weight: 0,
    //   genies: '',
    //   reptileFeedingBox: undefined,
    //   reptileType: undefined,
    //   verticalIndex: 0,
    //   horizontalIndex: 0
    // },
    // resolver: yupResolver(validationSchema)
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (form: ReptileCreationFormProps) => {
    try {
      const reptileFeedingBoxIndexExisted = await reptileRepository
        .findExactFeedingBoxIndexByHorizontalIndexAndVerticalIndex(
          form.reptileFeedingBox.value.id,
          form.verticalIndex,
          form.horizontalIndex
        );

      if (!reptileFeedingBoxIndexExisted) {
        await reptileRepository.createReptileFeedingBoxIndex(
          new ReptileFeedingBoxIndexCollection(
            {
              verticalIndex: form.verticalIndex,
              horizontalIndex: form.horizontalIndex,
              reptileFeedingBoxID: form.reptileFeedingBox.value.id,
              userID: currentUser.username,
            })
        );
      } else {
        const reptileSaved = new Reptile({
          name: form.name,
          nickname: form.nickname,
          gender: form.gender.value,
          birthdate: new Date(form.birthdate).toISOString().slice(0, 10),
          weight: Number(form.weight),
          genies: form.genies.split('/'),
          userID: user.username,
          reptileTypeID: form.reptileType.value.id,
          reptileFeedingBoxID: reptileFeedingBoxIndexExisted.reptileFeedingBoxID,
          reptileFeedingBoxIndexCollectionID: reptileFeedingBoxIndexExisted.id
        });

        if (editableReptile) await reptileRepository.updateReptile(editableReptile.id, reptileSaved);
        else await reptileRepository.createReptile(reptileSaved);
      }
      handleClose();
    } catch (e) {
      console.error('Create Reptile Failed', e);
    }
  };

  const handleEditableReptilePreset = () => {
    editableReptile?.name && setValue('name', editableReptile.name);
    editableReptile?.nickname && setValue('nickname', editableReptile.nickname);
    editableReptile?.birthdate && setValue('birthdate', editableReptile.birthdate);
    editableReptile?.weight && setValue('weight', editableReptile.weight);
    editableReptile?.genies?.join('/') && setValue('genies', editableReptile.genies.join('/'));

    const genderPreset = reptileGenderOptions.find(_ => _.value === editableReptile?.gender);
    genderPreset && setValue('gender', genderPreset);

    const reptileFeedingBoxPreset = reptileFeedingBoxOptions.find((_) => _.value.id === editableReptile?.reptileFeedingBoxID);
    reptileFeedingBoxPreset && setValue('reptileFeedingBox', reptileFeedingBoxPreset);

    const reptileTypePreset = reptileTypeOptions.find((_) => _.value.id === editableReptile?.reptileTypeID);
    reptileTypePreset && setValue('reptileType', reptileTypePreset);

    const verticalIndexPreset = reptileFeedingBoxIndexes.find((_) => _.id === editableReptile?.reptileFeedingBoxIndexCollectionID)?.verticalIndex;
    verticalIndexPreset && setValue('verticalIndex', verticalIndexPreset);

    const horizontalIndexPreset = reptileFeedingBoxIndexes.find((_) => _.id === editableReptile?.reptileFeedingBoxIndexCollectionID)?.horizontalIndex;
    horizontalIndexPreset && setValue('horizontalIndex', horizontalIndexPreset);
  };

  useEffect(handleEditableReptilePreset, [editableReptile]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          > <Typography>
            创建新爬宠
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton></Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ height: 600 }}>
            <Controller
              name="name"
              control={control}
              render={
                ({ field }) => <TextField
                  fullWidth
                  placeholder="品系名"
                  error={!!errors.name}
                  {...field}
                />
              }
            />
            <Controller
              name="nickname"
              control={control}
              render={
                ({ field }) => <TextField
                  fullWidth
                  placeholder="别名"
                  error={!!errors.nickname}
                  {...field}
                />
              }
            />
            <Controller
              name="gender"
              control={control}
              render={
                ({ field }) => (
                  <Select
                    {...field}
                    placeholder={'性别'}
                    options={reptileGenderOptions}
                  />
                )
              }
            />
            <Controller
              name="genies"
              control={control}
              render={
                ({ field }) => <TextField
                  fullWidth
                  placeholder='基因(请使用"/"分隔开)'
                  error={!!errors.genies}
                  {...field}
                />
              }
            />
            <Controller
              name="weight"
              control={control}
              render={
                ({ field }) => <TextField
                  fullWidth
                  placeholder="当前体重(g)"
                  error={!!errors.weight}
                  {...field}
                />
              }
            />

            <Controller
              name="reptileType"
              control={control}
              render={
                ({ field }) => (
                  <Select
                    placeholder={'种类'}
                    {...field}
                    options={reptileTypeOptions}
                  />
                )
              }
            />
            <Controller
              name="reptileFeedingBox"
              control={control}
              render={
                ({ field }) => (
                  <Select
                    placeholder={'爬柜'}
                    {...field}
                    options={reptileFeedingBoxOptions}
                  />
                )
              }
            />
            {
              watch().reptileFeedingBox?.value.type === 'CABINET'
                ? <Controller
                  name="horizontalIndex"
                  control={control}
                  render={
                    ({ field }) => <TextField
                      fullWidth
                      placeholder="第几排"
                      error={!!errors.horizontalIndex}
                      {...field}
                    />
                  }
                />
                : null
            }
            {
              watch().reptileFeedingBox?.value.type === 'CABINET'
                ? <Controller
                  name="verticalIndex"
                  control={control}
                  render={
                    ({ field }) => <TextField
                      fullWidth
                      placeholder="第几列"
                      error={!!errors.verticalIndex}
                      {...field}
                    />
                  }
                />
                : null
            }
            <Controller
              name="birthdate"
              control={control}
              render={
                ({ field }) => (
                  <DatePicker
                    {...field}
                    label={'出生日期'}
                    renderInput={(params: any) => (
                      <TextField
                        sx={{ zIndex: 0 }}
                        {...params}
                        {...field}
                      />
                    )} />
                )
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="submit">完成</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ModifyReptileModal;
