import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Box, Stack} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {ReptileFeedingBox, ReptileFeedingBoxType} from "../../../models";
import Select from "react-select";
import {DataStore} from "aws-amplify";
import {useAuthenticator} from "@aws-amplify/ui-react";

import * as yup from 'yup';
import {styled} from "@mui/material/styles";
import {useEffect} from "react";
import {yupResolver} from "@hookform/resolvers/yup";

export interface FeedingBoxModificationModalProps {
    open: boolean;
    onClose: () => void;
    editableFeedingBox?: ReptileFeedingBox;
}

function ModifyFeedingBoxModal(props: FeedingBoxModificationModalProps) {
    const {onClose, open, editableFeedingBox} = props;

    const validationSchema = yup.object({
        name: yup.string().required().max(20),
    });

    const typeOptions = [
        {label: "饲养盒", value: ReptileFeedingBoxType.BOX},
        {label: "爬柜", value: ReptileFeedingBoxType.CABINET},
    ]

    const {user} = useAuthenticator(ctx => [ctx.user]);

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
        if (!!editableFeedingBox) {
            setValue('name', editableFeedingBox.name);
            setValue('type', typeOptions.find(_ => _.value === editableFeedingBox?.type));
        }
    }, [editableFeedingBox])

    const onSubmit = async form => {
        try {
            if (!!editableFeedingBox) {
                const originalFeedingBox = await DataStore.query(ReptileFeedingBox, editableFeedingBox.id);
                await DataStore.save(
                    ReptileFeedingBox.copyOf(
                        originalFeedingBox, updated => {
                            updated.name = form.name;
                            updated.type = form.type.value;
                        }
                    )
                )
                handleClose();
            } else {
                await DataStore.save(new ReptileFeedingBox({
                    name: form.name,
                    type: form.type.value,
                    userID: user.username,
                }))
                handleClose();
            }
        } catch (e) {
            console.error('created or updated feeding box error:', e)
        }
    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>创建新容器</DialogTitle>
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

export default ModifyFeedingBoxModal;
