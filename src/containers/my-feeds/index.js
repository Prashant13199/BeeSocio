import React from "react";
import "./style.css";
import { Tab, Tabs } from "react-bootstrap";
import Grid3x3OutlinedIcon from '@mui/icons-material/Grid3x3Outlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import VideoCameraBackOutlinedIcon from '@mui/icons-material/VideoCameraBackOutlined';
import DynamicFeedOutlinedIcon from '@mui/icons-material/DynamicFeedOutlined';
import PostTab from "../tabs/post";
import VideoTab from "../tabs/video";
import SavedTab from "../tabs/saved";
import FeedTab from "../tabs/feed";
import TagTab from "../tabs/tags";

export default function MyFeed() {
    return (
        <>
            <div className="userfeed">
                <Tabs defaultActiveKey="posts" fill id="uncontrolled-tab-example" className="mb-3" variant="tabs">
                    <Tab eventKey="posts"
                        title={<Grid3x3OutlinedIcon />}>
                        <PostTab />
                    </Tab>
                    <Tab eventKey="feeds"
                        title={<DynamicFeedOutlinedIcon />}>
                        <FeedTab />
                    </Tab>
                    <Tab eventKey="videos"
                        title={<VideoCameraBackOutlinedIcon />}>
                        <VideoTab />
                    </Tab>
                    <Tab eventKey="tags"
                        title={<LocalOfferOutlinedIcon />}>
                        <TagTab />
                    </Tab>
                    <Tab eventKey="saved"
                        title={<BookmarkBorderOutlinedIcon />}>
                        <SavedTab />
                    </Tab>
                </Tabs>
            </div>
        </>
    )
}
