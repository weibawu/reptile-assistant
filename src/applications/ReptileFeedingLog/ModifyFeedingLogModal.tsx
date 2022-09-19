import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Box, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
  ReptileFeedingBox,
  ReptileFeedingBoxIndexCollection,
  ReptileFeedingLog,
  Reptile,
  ReptileType, ReptileGenderType
} from "../../models";
import Select from "react-select";
import { DataStore } from "aws-amplify";
import { TextAreaField, useAuthenticator } from "@aws-amplify/ui-react";

import * as yup from "yup";
import { styled } from "@mui/material/styles";
import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { TextArea } from "@aws-amplify/ui-react/dist/types/primitives/TextArea";
import { deduplicateJSONStringList } from "../../libs/util";

export interface ReptileFeedingLogModificationModalProps {
  open: boolean;
  onClose: () => void;
  reptiles: Reptile[];
  reptileTypes: ReptileType[];
  reptileFeedingBoxes: ReptileFeedingBox[];
  reptileFeedingBoxIndexes: ReptileFeedingBoxIndexCollection[];
  editableReptileFeedingLog?: ReptileFeedingLog;
}

type AnySelectOption<T> = { label: string, value: T };

interface ReptileFeedingLogCreationFormProps {
  reptileFeedingBoxId: AnySelectOption<string>,
  reptileFeedingBoxLayerId: AnySelectOption<string>,
  reptileId: AnySelectOption<string>,
  weight: number,
  environmentHumidity: number,
  environmentTemperature: number,
  reptileFeedingDateTime: string,
  detail: string,
}

function ModifyReptileFeedingLogModal(props: ReptileFeedingLogModificationModalProps) {
  const { onClose, open, editableReptileFeedingLog, reptileFeedingBoxes, reptileFeedingBoxIndexes, reptiles } = props;

  const validationSchema = yup.object({});

  const reptileFeedingBoxOptions = reptileFeedingBoxes.map(
    reptileFeedingBox => ({
      label: reptileFeedingBox.name,
      value: reptileFeedingBox
    })
  );

  const reptileFeedingBoxLayerOptions = deduplicateJSONStringList(
    reptileFeedingBoxIndexes
      .filter(
        reptileFeedingBoxIndex =>
          reptileFeedingBoxIndex.reptileFeedingBoxID
          === getValues("reptileFeedingBoxId.value")
      ).map(
      filteredReptileFeedingBoxIndex =>
        ({
          label: "第" + filteredReptileFeedingBoxIndex.horizontalIndex + "层",
          value: JSON.stringify({
            reptileFeedingBoxId: filteredReptileFeedingBoxIndex.reptileFeedingBoxID,
            layer: filteredReptileFeedingBoxIndex.horizontalIndex
          })
        })
    )
  );

  const reptileOptions = reptiles.filter(
    _ => reptileFeedingBoxIndexes.find(__ => __.id === _.reptileFeedingBoxIndexCollectionID)?.horizontalIndex === watch("reptileFeedingBoxLayer")?.value.layer
      && reptileFeedingBoxes.find(__ => __.id === _.reptileFeedingBoxID)?.id === watch("reptileFeedingBoxLayer")?.value.reptileFeedingBoxId
  ).map(_ =>
    ({
      label: "第" + reptileFeedingBoxIndexes.find(__ => __.id === _.reptileFeedingBoxIndexCollectionID)?.verticalIndex + "列 " + _.name,
      value: _
    })
  );

  const { user } = useAuthenticator(ctx => [ctx.user]);

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
      reptileFeedingBoxId:,
      reptileFeedingBoxLayer:,
      reptile: null,
      weight: "" as unknown as number,
      environmentHumidity: "" as unknown as number,
      environmentTemperature: "" as unknown as number,
      reptileFeedingDateTime: `${new Date().toISOString()}`,
      detail: ""
    },
    resolver: yupResolver(validationSchema)
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (editableReptileFeedingLog) {
      const foundReptile = reptiles.find(_ => _.id === editableReptileFeedingLog.reptileID);
      const foundReptileFeedingBox = reptileFeedingBoxOptions.find(_ => _.value.id === foundReptile.reptileFeedingBoxID);
      setValue("reptileFeedingBox", foundReptileFeedingBox);
      setValue("weight", editableReptileFeedingLog.weight);
      setValue("environmentTemperature", editableReptileFeedingLog.environmentTemperature);
      setValue("environmentHumidity", editableReptileFeedingLog.environmentHumidity);
      setValue("reptileFeedingDateTime", editableReptileFeedingLog.reptileFeedingDateTime);
      setValue("detail", editableReptileFeedingLog.detail);

    }
  }, [editableReptileFeedingLog]);

  useEffect(() => {
    if (!!editableReptileFeedingLog && !getValues("reptileFeedingBoxLayer")) {
      const foundReptile = reptiles.find(_ => _.id === editableReptileFeedingLog.reptileID);
      const foundReptileFeedingBoxIndex = reptileFeedingBoxIndexes.find(_ => _.id === foundReptile.reptileFeedingBoxIndexCollectionID);
      setValue("reptileFeedingBoxLayer", reptileFeedingBoxLayerOptions.find(_ => _.value.layer === foundReptileFeedingBoxIndex.horizontalIndex && _.value.reptileFeedingBoxId === foundReptile.reptileFeedingBoxID));
    }
  }, [reptileFeedingBoxLayerOptions]);

  useEffect(() => {
    if (!!editableReptileFeedingLog && !getValues("reptile")) {
      const foundReptile = reptiles.find(_ => _.id === editableReptileFeedingLog.reptileID);
      setValue("reptile", reptileOptions.find(_ => _.value.id === foundReptile.id));
    }
  }, [reptileFeedingBoxLayerOptions]);

  const onSubmit = async form => {
    try {
      if (editableReptileFeedingLog) {
        const originalReptileFeedingLog = await DataStore.query(ReptileFeedingLog, editableReptileFeedingLog.id);
        await DataStore.save(
          ReptileFeedingLog.copyOf(
            originalReptileFeedingLog, updated => {
              updated.detail = form.detail;
              updated.environmentHumidity = Number(form.environmentHumidity);
              updated.environmentTemperature = Number(form.environmentTemperature);
              updated.reptileFeedingDateTime = new Date(form.reptileFeedingDateTime).toISOString();
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
          reptileFeedingDateTime: new Date(form.reptileFeedingDateTime).toISOString(),
          reptileID: form.reptile.value.id,
          userID: user.username,
          weight: Number(form.weight)
        }));
        handleClose();
      }
    } catch (e) {
      console.error("created or updated reptileFeeding box error:", e);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>创建新日志</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ height: 600, minWidth: 180 }}>
            <Controller
              name="reptileFeedingBox"
              control={control}
              render={
                ({ field }) => (
                  <Select
                    isDisabled={!!editableReptileFeedingLog}
                    placeholder={"爬柜"}
                    {...field}
                    options={reptileFeedingBoxOptions}
                  />
                )
              }
            />
            {watch("reptileFeedingBox") ? <Controller
                name="reptileFeedingBoxLayer"
                control={control}
                render={
                  ({ field }) => (
                    <Select
                      isDisabled={!!editableReptileFeedingLog}
                      placeholder={"层"}
                      {...field}
                      options={reptileFeedingBoxLayerOptions}
                    />
                  )
                }
              />
              : null
            }
            {watch("reptileFeedingBoxLayer") ? <Controller
                name="reptile"
                control={control}
                render={
                  ({ field }) => (
                    <Select
                      isDisabled={!!editableReptileFeedingLog}
                      placeholder={"爬宠"}
                      {...field}
                      options={reptileOptions}
                    />
                  )
                }
              />
              : null
            }
            {watch("reptile") ? <Controller
                name="weight"
                control={control}
                render={
                  ({ field }) => (
                    <TextField
                      placeholder={"当前体重(g)"}
                      {...field}
                    />
                  )
                }
              />
              : null
            }
            {watch("reptile") ? <Controller
                name="environmentHumidity"
                control={control}
                render={
                  ({ field }) => (
                    <TextField
                      placeholder={"环境湿度(%)"}
                      {...field}
                    />
                  )
                }
              />
              : null
            }
            {watch("reptile") ? <Controller
                name="environmentTemperature"
                control={control}
                render={
                  ({ field }) => (
                    <TextField
                      placeholder={"环境温度(℃)"}
                      {...field}
                    />
                  )
                }
              />
              : null
            }
            {watch("reptile") ? <Controller
                name="reptileFeedingDateTime"
                control={control}
                render={
                  ({ field }) => (
                    <DateTimePicker
                      {...field}
                      label={"喂食时间"}
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
            {watch("reptile") ? <Controller
                name="detail"
                control={control}
                render={
                  ({ field }) => (
                    <TextField
                      multiline
                      minRows={2}
                      placeholder={"喂食详情"}
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
