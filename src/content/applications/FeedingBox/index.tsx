import {Helmet} from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {Grid, Container, Typography, Button, Card} from '@mui/material';
import Footer from 'src/components/Footer';
import {useEffect, useState} from "react";
import ModifyFeedingBoxModal from "./ModifyFeedingBoxModal";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import {ReptileFeedingBox} from "../../../models";
import {DataStore} from "aws-amplify";
import FeedingBoxesTable from "./FeedingBoxesTable";
import {useAuthenticator} from "@aws-amplify/ui-react";

function ApplicationsFeedingBoxes() {

    const [feedingBoxes, setFeedingBoxes] = useState<ReptileFeedingBox[]>([]);
    const [modifyModalOpen, setModifyModalOpen] = useState(false);
    const [editableFeedingBox, setEditableFeedingBox] = useState<ReptileFeedingBox | null>();
    const {user} = useAuthenticator(ctx => [ctx.user]);

    const initializeFeedingBoxes = async () => {
        setFeedingBoxes(
            await DataStore.query(
                ReptileFeedingBox,
                (feedingBoxPredicated) => feedingBoxPredicated.userID(
                    "eq", user.username,
                )
            )
        );
    }

    const handleModifyFeedingBoxModalOpen = () => {
        setModifyModalOpen(true);
    };

    const handleModifyFeedingBoxModalClose = () => {
        setModifyModalOpen(false);
    };

    const handleEditSpecificFeedingBox = (feedingBox: ReptileFeedingBox) => {
        setEditableFeedingBox(feedingBox);
    };

    const handleDeleteFeedingBoxes = (feedingBoxIds: string[]) => {
        Promise
            .all(feedingBoxIds
                .map(
                    id => DataStore.delete(ReptileFeedingBox, id)
                )
            )
            .then(initializeFeedingBoxes);
    }


    useEffect(() => {
        if (modifyModalOpen === false) {
            initializeFeedingBoxes().then();
            setEditableFeedingBox(null);
        }
    }, [modifyModalOpen]);

    useEffect(() => {
        if (!!editableFeedingBox) handleModifyFeedingBoxModalOpen();
    }, [editableFeedingBox])

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
                            onClick={handleModifyFeedingBoxModalOpen}
                            startIcon={<AddTwoToneIcon fontSize="small"/>}
                        >
                            创建饲养容器
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
                            <FeedingBoxesTable
                                feedingBoxes={feedingBoxes}
                                onFeedingBoxEditing={handleEditSpecificFeedingBox}
                                onFeedingBoxesDeleting={handleDeleteFeedingBoxes}
                            />
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer/>
            <ModifyFeedingBoxModal
                open={modifyModalOpen}
                onClose={handleModifyFeedingBoxModalClose}
                editableFeedingBox={editableFeedingBox}
            />
        </>
    );
}

export default ApplicationsFeedingBoxes;
