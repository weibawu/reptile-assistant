import {Helmet} from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {Grid, Container, Typography, Button, Card} from '@mui/material';
import Footer from 'src/components/Footer';
import {useEffect, useState} from "react";
import ModifyFeedingLogModal from "./ModifyFeedingLogModal";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import {
    Reptile,
    ReptileFeedingBox,
    ReptileFeedingBoxIndexCollection,
    ReptileFeedingLog,
    ReptileType
} from "../../../models";
import {DataStore} from "aws-amplify";
import FeedingLogsTable from "./FeedingLogsTable";
import {useAuthenticator} from "@aws-amplify/ui-react";

function ApplicationsFeedingLogs() {

    const [reptiles, setReptiles] = useState<Reptile[]>([]);
    const [reptileTypes, setReptileTypes] = useState<ReptileType[]>([]);
    const [feedingBoxes, setFeedingBoxes] = useState<ReptileFeedingBox[]>([]);
    const [feedingBoxIndexes, setFeedingBoxIndexes] = useState<ReptileFeedingBoxIndexCollection[]>([]);

    const [feedingLogs, setFeedingLogs] = useState<ReptileFeedingLog[]>([]);
    const [modifyModalOpen, setModifyModalOpen] = useState(false);
    const [editableFeedingLog, setEditableFeedingLog] = useState<ReptileFeedingLog | null>();
    const {user} = useAuthenticator(ctx => [ctx.user]);

    const initializeFeedingLogs = async () => {
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

    const handleModifyFeedingLogModalOpen = () => {
        setModifyModalOpen(true);
    };

    const handleModifyFeedingLogModalClose = () => {
        setModifyModalOpen(false);
    };

    const handleEditSpecificFeedingLog = (feedingLog: ReptileFeedingLog) => {
        setEditableFeedingLog(feedingLog);
    };

    const handleDeleteFeedingLogs = (feedingLogIds: string[]) => {
        Promise
            .all(feedingLogIds
                .map(
                    id => DataStore.delete(ReptileFeedingLog, id)
                )
            )
            .then(initializeFeedingLogs);
    }


    useEffect(() => {
        if (modifyModalOpen === false) {
            initializeFeedingLogs().then();
            setEditableFeedingLog(null);
        }
    }, [modifyModalOpen]);

    useEffect(() => {
        if (!!editableFeedingLog) handleModifyFeedingLogModalOpen();
    }, [editableFeedingLog])

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
                            你好，{ user.attributes.email }！
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            sx={{mt: {xs: 2, md: 0}}}
                            variant="contained"
                            onClick={handleModifyFeedingLogModalOpen}
                            startIcon={<AddTwoToneIcon fontSize="small"/>}
                        >
                            创建饲养日志
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
                            <FeedingLogsTable
                                reptiles={reptiles}
                                reptileTypes={reptileTypes}
                                feedingBoxes={feedingBoxes}
                                feedingBoxIndexes={feedingBoxIndexes}
                                feedingLogs={feedingLogs}
                                onFeedingLogEditing={handleEditSpecificFeedingLog}
                                onFeedingLogsDeleting={handleDeleteFeedingLogs}
                            />
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer/>
            <ModifyFeedingLogModal
                reptiles={reptiles}
                reptileTypes={reptileTypes}
                feedingBoxes={feedingBoxes}
                feedingBoxIndexes={feedingBoxIndexes}
                open={modifyModalOpen}
                onClose={handleModifyFeedingLogModalClose}
                editableFeedingLog={editableFeedingLog}
            />
        </>
    );
}

export default ApplicationsFeedingLogs;
