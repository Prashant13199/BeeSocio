import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import Grid3x3OutlinedIcon from '@mui/icons-material/Grid3x3Outlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import VideoCameraBackOutlinedIcon from '@mui/icons-material/VideoCameraBackOutlined';
import DynamicFeedOutlinedIcon from '@mui/icons-material/DynamicFeedOutlined';
import PostTabUser from "../users-tabs/post";
import FeedTabUser from "../users-tabs/feed";
import VideoTabUser from "../users-tabs/video";
import TagTabUser from "../users-tabs/tags";

export default function UserFeed(props) {

    return (
        <div className="userfeed">
            <Tabs defaultActiveKey="posts" fill id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="posts"
                    title={<Grid3x3OutlinedIcon />}>
                    <PostTabUser props={props} />
                </Tab>
                <Tab eventKey="feeds"
                    title={<DynamicFeedOutlinedIcon />}>
                    <FeedTabUser props={props} />
                </Tab>
                <Tab eventKey="videos"
                    title={<VideoCameraBackOutlinedIcon />}>
                    <VideoTabUser props={props} />
                </Tab>
                <Tab eventKey="tags"
                    title={<LocalOfferOutlinedIcon />}>
                    <TagTabUser props={props} />
                </Tab>
            </Tabs>
        </div>
    )
}
