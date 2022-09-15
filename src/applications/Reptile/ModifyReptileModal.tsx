import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Input,
    Box,
    Stack,
    IconButton,
    Typography, TextField,
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {
    Reptile,
    ReptileFeedingBox,
    ReptileFeedingBoxIndexCollection,
    ReptileGenderType,
    ReptileType
} from "../../../models";
import Select from "react-select";
import {DataStore} from "aws-amplify";
import {useAuthenticator} from "@aws-amplify/ui-react";

import * as yup from 'yup';
import {styled} from "@mui/material/styles";
import {useCallback, useEffect, useState} from "react";
import {yupResolver} from "@hookform/resolvers/yup";

import CloseIcon from "@mui/icons-material/Close";
import {DatePicker} from "@mui/lab";

export interface ReptileModificationModalProps {
    open: boolean;
    reptileTypes: ReptileType[];
    feedingBoxes: ReptileFeedingBox[];
    feedingBoxIndexes: ReptileFeedingBoxIndexCollection[];
    onClose: () => void;
    editableReptile?: Reptile;
}

function ModifyReptileModal(props: ReptileModificationModalProps) {
    const {onClose, open, editableReptile, reptileTypes, feedingBoxes, feedingBoxIndexes} = props;

    const reptileTypeOptions = reptileTypes.map(
        reptileTypeModel => ({
            label: reptileTypeModel.name,
            value: reptileTypeModel,
        })
    )

    const feedingBoxOptions = feedingBoxes.map(
        feedingBox => ({
            label: feedingBox.name,
            value: feedingBox,
        })
    )

    const validationSchema = yup.object({
        name: yup.string().required().max(20),
        nickname: yup.string().required().max(20),
        verticalIndex: yup.number(),
        horizontalIndex: yup.number(),
        reptileType: yup.object().required(),
        feedingBox: yup.object().required(),
    });

    const reptileGenderOptions = [
        {label: '公', value: ReptileGenderType.MALE},
        {label: '母', value: ReptileGenderType.FAMALE},
        {label: '公温', value: ReptileGenderType.POSSIBLE_MALE},
        {label: '母温', value: ReptileGenderType.POSSIBLE_FAMALE},
        {label: '未知', value: ReptileGenderType.UNKNOWN},
    ];

    const {user} = useAuthenticator(ctx => [ctx.user]);

    const {control, handleSubmit, reset, setValue, watch, formState: {errors}} = useForm({
        defaultValues: {
            name: '',
            nickname: '',
            gender: reptileGenderOptions[0],
            birthdate: `${ new Date().toISOString().slice(0, 10) }`,
            weight: 0,
            genies: '',
            feedingBox: undefined,
            reptileType: undefined,
            verticalIndex: 0,
            horizontalIndex: 0,
        },
        resolver: yupResolver(validationSchema),
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = async form => {
        try {
            let feedingBoxIndexExisted;

            if (form.feedingBox) {
                const feedingBoxIndexes = await DataStore.query(
                    ReptileFeedingBoxIndexCollection,
                    (feedBoxIndexPredicated) =>
                        feedBoxIndexPredicated.reptileFeedingBoxID("eq", form.feedingBox.value.id)
                            .verticalIndex("eq", form.verticalIndex)
                            .horizontalIndex("eq", form.horizontalIndex)
                );

                if (feedingBoxIndexes.length === 0) {
                    feedingBoxIndexExisted = await DataStore.save(
                        new ReptileFeedingBoxIndexCollection(
                            {
                                userID: user.username,
                                verticalIndex: form.verticalIndex,
                                horizontalIndex: form.horizontalIndex,
                                reptileFeedingBoxID: form.feedingBox.value.id,
                            }
                        )
                    )
                } else {
                    feedingBoxIndexExisted = feedingBoxIndexes[0];
                }
            }

            if (!!editableReptile) {
                const originalReptile = await DataStore.query(Reptile, editableReptile.id);
                await DataStore.save(Reptile.copyOf(
                    originalReptile, updated => {
                        updated.name = form.name;
                        updated.nickname = form.nickname;
                        updated.gender = form.gender.value;
                        updated.birthdate = new Date(form.birthdate).toISOString().slice(0, 10);
                        updated.weight = Number(form.weight);
                        updated.genies = form.genies.split('/');
                        updated.userID = user.username;
                        updated.reptileTypeID = form.reptileType.value.id;
                        updated.reptileFeedingBoxID = feedingBoxIndexExisted.reptileFeedingBoxID;
                        updated.reptileFeedingBoxIndexCollectionID = feedingBoxIndexExisted.id;
                    }
                ))
            } else {
                const date = new Date(form.birthdate).toISOString().slice(0, 10);
                await DataStore.save(new Reptile({
                    name: form.name,
                    nickname: form.nickname,
                    gender: form.gender.value,
                    birthdate: new Date(form.birthdate).toISOString().slice(0, 10),
                    weight: Number(form.weight),
                    genies: form.genies.split('/'),
                    userID: user.username,
                    reptileTypeID: form.reptileType.value.id,
                    reptileFeedingBoxID: feedingBoxIndexExisted.reptileFeedingBoxID,
                    reptileFeedingBoxIndexCollectionID: feedingBoxIndexExisted.id,
                }))
            }

            handleClose();
        } catch (e) {
            console.error('Create Reptile Failed', e);
        }
    };

    useEffect(() => {
        if (!!editableReptile) {
            setValue('name', editableReptile.name);
            setValue('nickname', editableReptile.nickname);
            setValue('gender', reptileGenderOptions.find(_ => _.value === editableReptile.gender));
            setValue('birthdate', editableReptile.birthdate);
            setValue('weight', editableReptile.weight);
            setValue('genies', editableReptile.genies.join('/'));
            setValue('feedingBox', feedingBoxOptions.find((_) => _.value.id === editableReptile.reptileFeedingBoxID));
            setValue('reptileType', reptileTypeOptions.find((_) => _.value.id === editableReptile.reptileTypeID));
            setValue('verticalIndex', feedingBoxIndexes.find((_) => _.id === editableReptile.reptileFeedingBoxIndexCollectionID)?.verticalIndex);
            setValue('horizontalIndex', feedingBoxIndexes.find((_) => _.id === editableReptile.reptileFeedingBoxIndexCollectionID)?.horizontalIndex);
            // setValue()
        }
    }, [editableReptile])

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
                            <CloseIcon/>
                        </IconButton></Stack>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={1} sx={{height: 600}}>
                        <Controller
                            name="name"
                            control={control}
                            render={
                                ({field}) => <TextField
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
                                ({field}) => <TextField
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
                                ({field}) => (
                                    <Select
                                        {...field}
                                        placeholder={"性别"}
                                        options={reptileGenderOptions}
                                    />
                                )
                            }
                        />
                        <Controller
                            name="genies"
                            control={control}
                            render={
                                ({field}) => <TextField
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
                                ({field}) => <TextField
                                    fullWidth
                                    placeholder='当前体重(g)'
                                    error={!!errors.weight}
                                    {...field}
                                />
                            }
                        />

                        <Controller
                            name="reptileType"
                            control={control}
                            render={
                                ({field}) => (
                                    <Select
                                        placeholder={"种类"}
                                        {...field}
                                        options={reptileTypeOptions}
                                    />
                                )
                            }
                        />
                        <Controller
                            name="feedingBox"
                            control={control}
                            render={
                                ({field}) => (
                                    <Select
                                        placeholder={"爬柜"}
                                        {...field}
                                        options={feedingBoxOptions}
                                    />
                                )
                            }
                        />
                        {
                            watch().feedingBox?.value.type === "CABINET"
                                ? <Controller
                                    name="horizontalIndex"
                                    control={control}
                                    render={
                                        ({field}) => <TextField
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
                            watch().feedingBox?.value.type === "CABINET"
                                ? <Controller
                                    name="verticalIndex"
                                    control={control}
                                    render={
                                        ({field}) => <TextField
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
                                ({field}) => (
                                    <DatePicker
                                        {...field}
                                        label={"出生日期"}
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
