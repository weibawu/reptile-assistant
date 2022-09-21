import React, {useEffect} from 'react';

import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Stack} from '@mui/material';

import Select from 'react-select';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

import {ReptileFeedingBox, ReptileFeedingBoxType} from '../../../models';
import { useReptileRepository } from '../../../libs/reptile-repository/UseReptileRepository';

export interface ReptileFeedingBoxModificationModalProps {
    open: boolean;
    onClose: () => void;
    editableReptileFeedingBox?: ReptileFeedingBox;
}

function ModifyReptileFeedingBoxModal(props: ReptileFeedingBoxModificationModalProps) {
  const {onClose, open, editableReptileFeedingBox} = props;
  const {currentUser, reptileRepository} = useReptileRepository();

  const validationSchema = yup.object({
    name: yup.string().required().max(20),
  });

  const typeOptions = [
    {label: '饲育盒', value: ReptileFeedingBoxType.BOX},
    {label: '爬柜', value: ReptileFeedingBoxType.CABINET},
  ];

  const {control, handleSubmit, reset, setValue, formState: {errors}} = useForm({
    defaultValues: {
      name: '',
      type: typeOptions[0],
    },
    resolver: yupResolver(validationSchema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (editableReptileFeedingBox
      && editableReptileFeedingBox.name
      && editableReptileFeedingBox.type
    ) {
      const reptileType = typeOptions.find(_ => _.value === editableReptileFeedingBox.type);
      setValue('name', editableReptileFeedingBox.name);
      if (reptileType) setValue('type',reptileType);
    }
  }, [editableReptileFeedingBox]);

  const onSubmit = async (form: any) => {
    try {
      const reptileFeedingBox = new ReptileFeedingBox({
        name: form.name,
        type: form.type.value,
        userID: currentUser.username,
      });
      if (editableReptileFeedingBox) {
        await reptileRepository.updateReptileFeedingBox(editableReptileFeedingBox.id, reptileFeedingBox);
      } else {
        await reptileRepository.createReptileFeedingBox(reptileFeedingBox);
      }
      handleClose();
    } catch (e) {
      console.error('created or updated feeding box error:', e);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{ editableReptileFeedingBox ? '修改容器信息' : '创建新容器' }</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{height: 180}}>
            <Controller
              name="name"
              control={control}
              render={
                ({field}) => <Input
                  fullWidth
                  placeholder="容器名称 / 位置"
                  error={!!errors.name}
                  {...field}
                />
              }
            />
            <Controller
              name="type"
              control={control}
              render={
                ({field}) => (
                  <Select
                    {...field}
                    options={typeOptions}
                  />
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

ModifyReptileFeedingBoxModal.defaultProps = {
  editableReptileFeedingBox: undefined,
};

export default ModifyReptileFeedingBoxModal;
