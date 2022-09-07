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
    onClose: () => void;
    editableReptile?: Reptile;
}

function ModifyReptileModal(props: ReptileModificationModalProps) {
    const {onClose, open, editableReptile} = props;

    const validationSchema = yup.object({
        name: yup.string().required().max(20),
        nickname: yup.string().required().max(20),
        verticalIndex: yup.number(),
        horizontalIndex: yup.number(),
        reptileType: yup.object().required(),
        feedingBox: yup.object().required(),
    });

    const [reptileTypeOptions, setReptileTypeOptions] = useState<{ label: string, value: ReptileType }[]>();
    const [feedingBoxOptions, setFeedingBoxOptions] = useState<{ label: string, value: ReptileFeedingBox }[]>();
    const [feedingBoxIndexCollectionOptions, setFeedingBoxIndexCollectionOptions] = useState<{ label: string, value: ReptileFeedingBoxIndexCollection }[]>();

    const reptileGenderOptions = [
        {label: '公', value: ReptileGenderType.MALE},
        {label: '母', value: ReptileGenderType.FAMALE},
        {label: '公温', value: ReptileGenderType.POSSIBLE_MALE},
        {label: '母温', value: ReptileGenderType.POSSIBLE_FAMALE},
        {label: '未知', value: ReptileGenderType.UNKNOWN},
    ];

    const {user} = useAuthenticator(ctx => [ctx.user]);

    const {control, handleSubmit, reset, watch, formState: {errors}} = useForm({
        defaultValues: {
            name: editableReptile?.name ?? '',
            nickname: editableReptile?.nickname ?? '',
            gender: editableReptile?.gender ?? reptileGenderOptions[0],
            birthdate: editableReptile?.birthdate ?? `${Date.now()}`,
            weight: editableReptile?.weight ?? undefined,
            genies: editableReptile?.genies.join('/') ?? undefined,
            feedingBox: editableReptile ? feedingBoxOptions.find((_) => _.value.id === editableReptile.reptileFeedingBoxID) : undefined,
            reptileType: editableReptile ? {
                label: editableReptile ? reptileTypeOptions.find((_) => _.value.id === editableReptile.reptileTypeID)?.label : undefined,
                value: editableReptile ? reptileTypeOptions.find((_) => _.value.id === editableReptile.reptileTypeID)?.value : undefined,
            } : undefined,
            verticalIndex: editableReptile ? feedingBoxIndexCollectionOptions.find((_) => _.value.id === editableReptile.reptileFeedingBoxIndexCollectionID)?.value.verticalIndex : undefined,
            horizontalIndex: editableReptile ? feedingBoxIndexCollectionOptions.find((_) => _.value.id === editableReptile.reptileFeedingBoxIndexCollectionID)?.value.horizontalIndex : undefined,
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

            await DataStore.save(new Reptile({
                name: form.name,
                nickname: form.nickname,
                gender: form.gender.value,
                birthdate: form.birthdate.toISOString().slice(0, 10),
                weight: Number(form.weight),
                genies: form.genies.split('/'),
                userID: user.username,
                reptileTypeID: form.reptileType.value.id,
                reptileFeedingBoxID: feedingBoxIndexExisted.reptileFeedingBoxID,
                reptileFeedingBoxIndexCollectionID: feedingBoxIndexExisted.id,
            }))

            handleClose();
        } catch (e) {
            console.error('Create Reptile Failed', e);
        }
    };

    useEffect(() => {
        DataStore.query(ReptileType).then(reptileTypeModels => {
            setReptileTypeOptions(reptileTypeModels.map(
                reptileTypeModel => ({
                    label: reptileTypeModel.name,
                    value: reptileTypeModel,
                })
            ))
        });

        DataStore.query(ReptileFeedingBox,
            (feedBoxPredicated) =>
                feedBoxPredicated.userID("eq", user.username),
        ).then(feedingBoxModels => {
            setFeedingBoxOptions(feedingBoxModels.map(
                feedingBox => ({
                    label: feedingBox.name,
                    value: feedingBox,
                })
            ))
        });

        DataStore.query(ReptileFeedingBoxIndexCollection).then(feedingBoxIndexCollectionModels => {
            setFeedingBoxIndexCollectionOptions(feedingBoxIndexCollectionModels.map(
                feedingBoxIndexCollection => ({
                    label: feedingBoxIndexCollection.id,
                    value: feedingBoxIndexCollection,
                })
            ))
        });
    }, [])

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
