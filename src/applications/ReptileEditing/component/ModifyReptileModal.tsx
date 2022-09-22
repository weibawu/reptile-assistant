import React, { useContext, useEffect } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { Controller, useForm } from 'react-hook-form';
import {
  Reptile,
  ReptileFeedingBoxIndexCollection,
  ReptileFeedingBoxType,
  ReptileGenderType,
} from '../../../models';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers';
import { ReptileContext } from '../../../libs/context/ReptileContext';

export interface ReptileModificationModalProps {
  open: boolean
  onClose: () => void
  editableReptile?: Reptile
}

type AnySelectOption<T> = { label: string; value: T }

interface ReptileCreationFormProps {
  name: string
  nickname: string
  gender: AnySelectOption<ReptileGenderType>
  birthdate: string
  // weight: number
  genies: string
  reptileFeedingBoxId: AnySelectOption<string>
  reptileTypeId: AnySelectOption<string>
  verticalIndex: number
  horizontalIndex: number
}

function ModifyReptileModal(props: ReptileModificationModalProps) {
  const { onClose, open, editableReptile } = props;

  const {
    reptileTypes,
    reptileFeedingBoxes,
    reptileFeedingBoxIndexes,
    reptileRepository,
    currentUser,
  } = useContext(ReptileContext);

  const reptileTypeOptions: AnySelectOption<string>[] = reptileTypes.map((reptileTypeModel) => ({
    label: reptileTypeModel.name!,
    value: reptileTypeModel.id,
  }));

  const reptileFeedingBoxOptions: AnySelectOption<string>[] = reptileFeedingBoxes.map(
    (reptileFeedingBox) => ({
      label: reptileFeedingBox.name!,
      value: reptileFeedingBox.id,
    }),
  );

  const reptileGenderOptions: AnySelectOption<ReptileGenderType>[] = [
    { label: '公', value: ReptileGenderType.MALE },
    { label: '母', value: ReptileGenderType.FAMALE },
    { label: '公温', value: ReptileGenderType.POSSIBLE_MALE },
    { label: '母温', value: ReptileGenderType.POSSIBLE_FAMALE },
    { label: '未知', value: ReptileGenderType.UNKNOWN },
  ];

  const validationSchema = yup.object({
    name: yup.string().required().max(40),
    nickname: yup.string().max(40),
    verticalIndex: yup.number(),
    horizontalIndex: yup.number(),
    // weight: yup.number(),
    gender: yup.object({ value: yup.string().required() }),
    reptileTypeId: yup.object({ value: yup.string().required() }),
    reptileFeedingBoxId: yup.object({ value: yup.string().required() }),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<ReptileCreationFormProps>({
    defaultValues: {
      name: '',
      nickname: '',
      gender: { value: '' } as AnySelectOption<any>,
      birthdate: `${new Date().toISOString().slice(0, 10)}`,
      // weight: '' as unknown as number,
      genies: '',
      reptileFeedingBoxId: { value: '' } as AnySelectOption<string>,
      reptileTypeId: { value: '' } as AnySelectOption<string>,
      verticalIndex: '' as unknown as number,
      horizontalIndex: '' as unknown as number,
    },
    resolver: yupResolver(validationSchema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleEditableReptilePreset = () => {
    editableReptile?.name && setValue('name', editableReptile.name);
    editableReptile?.nickname && setValue('nickname', editableReptile.nickname);
    editableReptile?.birthdate && setValue('birthdate', editableReptile.birthdate);
    // editableReptile?.weight && setValue('weight', editableReptile.weight);
    editableReptile?.genies?.join('/') && setValue('genies', editableReptile.genies.join('/'));

    const genderPreset = reptileGenderOptions.find((_) => _.value === editableReptile?.gender);
    genderPreset && setValue('gender', genderPreset);

    const reptileFeedingBoxPreset = reptileFeedingBoxOptions.find(
      (_) => _.value === editableReptile?.reptileFeedingBoxID,
    );
    reptileFeedingBoxPreset && setValue('reptileFeedingBoxId', reptileFeedingBoxPreset);

    const reptileTypePreset = reptileTypeOptions.find(
      (_) => _.value === editableReptile?.reptileTypeID,
    );
    reptileTypePreset && setValue('reptileTypeId', reptileTypePreset);

    const verticalIndexPreset = reptileFeedingBoxIndexes.find(
      (_) => _.id === editableReptile?.reptileFeedingBoxIndexCollectionID,
    )?.verticalIndex;
    verticalIndexPreset && setValue('verticalIndex', verticalIndexPreset);

    const horizontalIndexPreset = reptileFeedingBoxIndexes.find(
      (_) => _.id === editableReptile?.reptileFeedingBoxIndexCollectionID,
    )?.horizontalIndex;
    horizontalIndexPreset && setValue('horizontalIndex', horizontalIndexPreset);
  };

  const handleReptileFeedingBoxSelectionChange: () => void = () => {
    const selectedReptileFeedingBoxId = watch('reptileFeedingBoxId.value');
    const reptileFeedingBoxType = reptileFeedingBoxes.find(
      (reptileFeedingBox) => reptileFeedingBox.id === selectedReptileFeedingBoxId,
    );
    if (reptileFeedingBoxType && reptileFeedingBoxType.type === ReptileFeedingBoxType.BOX) {
      setValue('horizontalIndex', 0);
      setValue('verticalIndex', 0);
    } else {
      !getValues('horizontalIndex') && setValue('horizontalIndex', '' as unknown as number);
      !getValues('verticalIndex') && setValue('verticalIndex', '' as unknown as number);
    }
  };

  const onSubmit = async (form: ReptileCreationFormProps) => {
    try {
      let reptileFeedingBoxIndexExisted =
        await reptileRepository.findExactFeedingBoxIndexByHorizontalIndexAndVerticalIndex(
          form.reptileFeedingBoxId.value,
          Number(form.verticalIndex),
          Number(form.horizontalIndex),
        );

      if (!reptileFeedingBoxIndexExisted) {
        reptileFeedingBoxIndexExisted = await reptileRepository.createReptileFeedingBoxIndex(
          new ReptileFeedingBoxIndexCollection({
            verticalIndex: Number(form.verticalIndex),
            horizontalIndex: Number(form.horizontalIndex),
            reptileFeedingBoxID: form.reptileFeedingBoxId.value,
            userID: currentUser.username,
          }),
        );
      }

      const reptileSaved = new Reptile({
        name: form.name,
        nickname: form.nickname,
        gender: form.gender.value,
        birthdate: new Date(form.birthdate).toISOString().slice(0, 10),
        // weight: Number(form.weight),
        genies: form.genies.split('/'),
        userID: currentUser.username,
        reptileTypeID: form.reptileTypeId.value,
        reptileFeedingBoxID: reptileFeedingBoxIndexExisted.reptileFeedingBoxID,
        reptileFeedingBoxIndexCollectionID: reptileFeedingBoxIndexExisted.id,
      });

      if (editableReptile) await reptileRepository.updateReptile(editableReptile.id, reptileSaved);
      else await reptileRepository.createReptile(reptileSaved);

      handleClose();
    } catch (e) {
      console.error('Create Reptile Failed', e);
    }
  };

  useEffect(handleEditableReptilePreset, [editableReptile]);

  useEffect(handleReptileFeedingBoxSelectionChange, [watch('reptileFeedingBoxId.value')]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Stack direction='row' alignItems='center' justifyContent='space-between'>
            {' '}
            <Typography>{editableReptile ? '修改爬宠信息' : '创建新爬宠'}</Typography>
            <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ height: 600 }}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  autoComplete='off'
                  fullWidth
                  placeholder='品种(例: 玉米蛇、肥尾守宫)'
                  error={!!errors.name}
                  {...field}
                />
              )}
            />
            <Controller
              name='nickname'
              control={control}
              render={({ field }) => (
                <TextField
                  autoComplete='off'
                  fullWidth
                  placeholder='别名'
                  error={!!errors.nickname}
                  {...field}
                />
              )}
            />
            <FormControl>
              <InputLabel id='gender'>性别</InputLabel>
              <Controller
                render={() => (
                  <Select
                    onChange={(e) =>
                      setValue(
                        'gender',
                        reptileGenderOptions.find(
                          (reptileTypeOption) => reptileTypeOption.value === e.target.value,
                        )!,
                        { shouldValidate: true },
                      )
                    }
                    value={getValues('gender.value')}
                    labelId='gender'
                    label='性别'
                    error={!!errors.gender}
                  >
                    {reptileGenderOptions.map((reptileGenderOption) => (
                      <MenuItem key={reptileGenderOption.label} value={reptileGenderOption.value}>
                        {reptileGenderOption.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                name={'gender'}
                control={control}
              />
            </FormControl>
            <Controller
              name='genies'
              control={control}
              render={({ field }) => (
                <TextField
                  autoComplete='off'
                  fullWidth
                  placeholder='基因(请使用"/"分隔开)'
                  error={!!errors.genies}
                  {...field}
                />
              )}
            />
            {/*<Controller*/}
            {/*  name='weight'*/}
            {/*  control={control}*/}
            {/*  render={({ field }) => (*/}
            {/*    <TextField*/}
            {/*      autoComplete='off'*/}
            {/*      fullWidth*/}
            {/*      placeholder='当前体重(g)'*/}
            {/*      error={!!errors.weight}*/}
            {/*      {...field}*/}
            {/*    />*/}
            {/*  )}*/}
            {/*/>*/}
            <FormControl>
              <InputLabel id='reptileType'>科/属</InputLabel>
              <Controller
                render={() => (
                  <Select
                    onChange={(e) =>
                      setValue(
                        'reptileTypeId',
                        reptileTypeOptions.find(
                          (reptileTypeOption) => reptileTypeOption.value === e.target.value,
                        )!,
                        { shouldValidate: true },
                      )
                    }
                    value={getValues('reptileTypeId.value')}
                    labelId='reptileType'
                    label='科/属'
                    error={!!errors.reptileTypeId}
                  >
                    {reptileTypeOptions.map((reptileTypeOption) => (
                      <MenuItem key={reptileTypeOption.label} value={reptileTypeOption.value}>
                        {reptileTypeOption.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                name={'reptileTypeId'}
                control={control}
              />
            </FormControl>
            <FormControl>
              <InputLabel id='reptileFeedingBox'>所属饲育容器</InputLabel>
              <Controller
                render={() => (
                  <Select
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
                    value={getValues('reptileFeedingBoxId.value')}
                    labelId='reptileFeedingBox'
                    label='所属饲育容器'
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
            {reptileFeedingBoxes.find(
              (reptileFeedingBox) => reptileFeedingBox.id === watch().reptileFeedingBoxId?.value,
            )?.type === 'CABINET' ? (
                <Controller
                  name='horizontalIndex'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      autoComplete='off'
                      fullWidth
                      placeholder='第几层'
                      error={!!errors.horizontalIndex}
                      {...field}
                    />
                  )}
                />
              ) : null}
            {reptileFeedingBoxes.find(
              (reptileFeedingBox) => reptileFeedingBox.id === watch().reptileFeedingBoxId?.value,
            )?.type === 'CABINET' ? (
                <Controller
                  name='verticalIndex'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      autoComplete='off'
                      fullWidth
                      placeholder='第几列'
                      error={!!errors.verticalIndex}
                      {...field}
                    />
                  )}
                />
              ) : null}
            <Controller
              name='birthdate'
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label={'出生日期'}
                  renderInput={(params: any) => (
                    <TextField autoComplete='off' sx={{ zIndex: 0 }} {...params} {...field} />
                  )}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type='submit'>完成</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ModifyReptileModal;
