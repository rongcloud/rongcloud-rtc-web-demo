import PageLayout from '../components/PageLayout.vue';
import CreateConnection from '../views/CreateConnection/index.vue';
import ChooseScene from '../views/ChooseScene/index.vue';
import Audience from '../views/Scene/Living/audience.vue';
import Anchor from '../views/Scene/Living/anchor.vue';
import Meeting from '../views/Scene/Meeting/index.vue';
import MeetingStep from '../views/Step/Meeting/index.vue';
import AnchorStep from '../views/Step/Anchor/index.vue';
import AudienceStep from '../views/Step/Audience/index.vue';
// import Wrap from '../views/upgrade/wrap.vue'
// import SetBitrate from '../views/upgrade/setBitrate.vue';
// import RoomAttributes from '../views/upgrade/roomAttributes.vue';

const routes = [
  {
    path: '/',
    label: '开始',
    redirect: '/create-connection'
  },
  {
    path: '/create-connection',
    hide: true,
    component: CreateConnection
  },
  {
    path: '/choose-scene',
    hide: true,
    component: ChooseScene
  },
  {
    path: '/scene',
    label: '场景',
    component: PageLayout,
    children: [
      {
        path: 'meeting',
        label: '音视频会议',
        component: Meeting
      },
      {
        path: 'living-anchor',
        label: '音视频直播-主播',
        component: Anchor
      },
      {
        path: 'living-audience',
        label: '音视频直播-观众',
        component: Audience
      },
    ]
  },
  {
    path: '/step',
    label: '接入步骤',
    component: PageLayout,
    children: [
      {
        path: 'meeting',
        label: '音视频会议',
        component: MeetingStep
      },
      {
        path: 'anchor',
        label: '音视频直播(主播)',
        component: AnchorStep
      },
      {
        path: 'audience',
        label: '音视频直播(观众)',
        component: AudienceStep
      },
    ]
  },
  // {
  //   path: '/upgrade',
  //   redirect: '/upgrade/set-bitrate',
  //   label: '进阶应用',
  //   component: Wrap,
  //   children: [
  //     {
  //       path: 'set-bitrate',
  //       label: '设置视频属性',
  //       component: SetBitrate
  //     },
  //     {
  //       path: 'room-attributes',
  //       label: '房间属性',
  //       component: RoomAttributes
  //     },
  //   ]
  // }
];

export default routes;
