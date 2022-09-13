import {Helmet} from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {Grid, Container, Typography, Button, Card} from '@mui/material';
import Footer from 'src/components/Footer';
import {useEffect, useState} from "react";
import ModifyReptileModal from "./ModifyReptileModal";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import {
    Reptile,
    ReptileFeedingBox,
    ReptileFeedingBoxIndexCollection,
    ReptileFeedingLog,
    ReptileType
} from "../../../models";
import {DataStore} from "aws-amplify";
import ReptilesTable from "./ReptilesTable";
import {useAuthenticator} from "@aws-amplify/ui-react";
import FeedingLogsViewTableModal from "./FeedingLogsViewTableModal";
import FeedingLogsTable from "../FeedingLog/FeedingLogsTable";
import FeedingLogsViewTable from "./FeedingLogsViewTable";

function ApplicationsReptiles() {

    const [reptiles, setReptiles] = useState<Reptile[]>([]);
    const [reptileTypes, setReptileTypes] = useState<ReptileType[]>([]);
    const [feedingBoxes, setFeedingBoxes] = useState<ReptileFeedingBox[]>([]);
    const [feedingBoxIndexes, setFeedingBoxIndexes] = useState<ReptileFeedingBoxIndexCollection[]>([]);
    const [feedingLogs, setFeedingLogs] = useState<ReptileFeedingLog[]>([]);

    const [modifyModalOpen, setModifyModalOpen] = useState(false);
    const [logViewTableModalOpen, setLogViewTableModalOpen] = useState(false);
    const [editableReptile, setEditableReptile] = useState<Reptile | null>();
    const [showLogReptile, setShowLogReptile] = useState<Reptile | null>();
    const {user} = useAuthenticator(ctx => [ctx.user]);

    const initializeReptiles = async () => {
        setReptiles(
            await DataStore.query(
                Reptile,
                (reptilePredicated) => reptilePredicated.userID(
                    "eq", user.username,
                )
            )
        );
        setReptileTypes(await DataStore.query(ReptileType));
        setFeedingBoxes(
            await DataStore.query(ReptileFeedingBox, (_) => _.userID("eq", user.username))
        );
        setFeedingBoxIndexes(
            await DataStore.query(ReptileFeedingBoxIndexCollection, (_) => _.userID("eq", user.username))
        );
        setFeedingLogs(
            await DataStore.query(
                ReptileFeedingLog,
                (feedingLogPredicated) => feedingLogPredicated.userID(
                    "eq", user.username,
                )
            )
        );
    }

    const handleModifyReptileModalOpen = () => {
        setModifyModalOpen(true);
    };

    const handleModifyReptileModalClose = () => {
        setModifyModalOpen(false);
    };

    const handleLogViewTableModalOpen = () => {
        setLogViewTableModalOpen(true);
    };

    const handleLogViewTableModalClose = () => {
        setLogViewTableModalOpen(false);
    };

    const handleEditSpecificReptile = (reptile: Reptile) => {
        setEditableReptile(reptile);
    };

    const handleShowLog = (reptile: Reptile) => {
        setShowLogReptile(reptile);
    }

    const handleDeleteReptiles = (reptileIds: string[]) => {
        Promise
            .all(reptileIds
                .map(
                    id => DataStore.delete(Reptile, id)
                )
            )
            .then(initializeReptiles);
    }


    useEffect(() => {
        if (modifyModalOpen === false) {
            initializeReptiles().then();
            setEditableReptile(null);
        }
    }, [modifyModalOpen]);

    useEffect(() => {
        if (!logViewTableModalOpen) {
            setShowLogReptile(null);
        }
    }, [logViewTableModalOpen]);

    useEffect(() => {
        if (!!editableReptile) handleModifyReptileModalOpen();
    }, [editableReptile]);

    useEffect(() => {
        if (!!showLogReptile) handleLogViewTableModalOpen();
    }, [showLogReptile]);

    return (
        <>
            <Helmet>
                <title>Feeding Box Management</title>
            </Helmet>
            <PageTitleWrapper>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography variant="h3" component="h3" gutterBottom>
                            尾巴屋爬宠管理平台
                        </Typography>
                        <Typography variant="subtitle2">
                            你好，{user.attributes.email}！
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            sx={{mt: {xs: 2, md: 0}}}
                            variant="contained"
                            onClick={handleModifyReptileModalOpen}
                            startIcon={<AddTwoToneIcon fontSize="small"/>}
                        >
                            创建新爬宠
                        </Button>
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <Card>
                            <ReptilesTable
                                onLogShowing={handleShowLog}
                                reptiles={reptiles}
                                reptileTypes={reptileTypes}
                                feedingBoxes={feedingBoxes}
                                feedingBoxIndexes={feedingBoxIndexes}
                                onReptileEditing={handleEditSpecificReptile}
                                onReptilesDeleting={handleDeleteReptiles}
                            />
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer/>
            <FeedingLogsViewTableModal open={logViewTableModalOpen} onClose={handleLogViewTableModalClose}>
                <FeedingLogsViewTable
                    feedingBoxIndexes={feedingBoxIndexes}
                    reptiles={reptiles}
                    reptileTypes={reptileTypes}
                    feedingBoxes={feedingBoxes}
                    reptile={showLogReptile} feedingLogs={feedingLogs}/>
            </FeedingLogsViewTableModal>
            <ModifyReptileModal
                reptileTypes={reptileTypes}
                feedingBoxes={feedingBoxes}
                feedingBoxIndexes={feedingBoxIndexes}
                open={modifyModalOpen}
                onClose={handleModifyReptileModalClose}
                editableReptile={editableReptile}
            />
        </>
    );
}

export default ApplicationsReptiles;
