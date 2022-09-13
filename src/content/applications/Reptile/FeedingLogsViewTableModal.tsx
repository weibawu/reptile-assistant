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

export interface FeedingLogsViewTableModalProps {
    open: boolean;
    onClose: () => void;
    children: any;
}

function FeedingLogsViewTableModal(props: FeedingLogsViewTableModalProps) {
    const {onClose, open, children} = props;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                > <Typography>
                    饲养日志
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
                {children}
            </DialogContent>
        </Dialog>
    );
}

export default FeedingLogsViewTableModal;
