import {Button, Dialog, DialogContent,DialogActions, DialogTitle, Input} from "@mui/material";
import {Controller, useForm} from "react-hook-form";

import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {ReptileFeedingBox, ReptileFeedingBoxType} from "../../../models";
import Select from "react-select";
import {DataStore} from "aws-amplify";
import ReptileFeedingBoxes from "./ReptileFeedingBoxes";

export interface ReptileFeedingBoxModificationModalProps {
    open: boolean;
    onClose: () => void;
}

function ReptileFeedingBoxModificationModal(props: ReptileFeedingBoxModificationModalProps) {
    const { onClose, open } = props;

    const validationSchema = yup.object({
        name: yup.string().required(),
        userId: yup.string().required(),
    });

    const typeOptions = [
        {label: ReptileFeedingBoxType.CABINET, value: ReptileFeedingBoxType.CABINET},
        {label: ReptileFeedingBoxType.BOX, value: ReptileFeedingBoxType.BOX},
    ]

    const {control, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            name: '',
            type: typeOptions[0],
            /* todo */
            userId: 'test',
        },
        resolver: yupResolver(validationSchema),
    })

    const handleClose = () => {
        onClose();
    };

    const onSubmit = data => {
        const {name, type, userId} = data;
        DataStore.save(new ReptileFeedingBox({
            name,
            type: type.value,
            userId,
        }))
            .then(handleClose)
            .catch(console.log)
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Create New Box</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="name"
                        control={control}
                        render={
                            ({field}) => <Input
                                fullWidth
                                placeholder="Name or Position"
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
                    <DialogActions>
                        <Button type="submit">Create</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ReptileFeedingBoxModificationModal;
