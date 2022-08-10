import React from 'react'
import {
  Layout, Avatar, message, Spin, Drawer, Mentions, Modal, Button,
} from 'antd'
import io from 'socket.io-client'
import { inject, observer } from 'mobx-react'
import {
  UserOutlined,
  MoreOutlined,
  CopyOutlined,
} from '@ant-design/icons'
import copy from 'copy-to-clipboard'
import moment from 'moment'
import ListItem from '@components/ListItem'
import AuthRoute from '@common/AuthRoute'
import { GetLocalStorage, RemoveLocalStorage } from '@/utils/local'

import logoImg from '@/assets/img/anonChat.png'
import './index.scss'

const socket = io('ws://localhost:9999')

const { Option } = Mentions
const {
  Header, Sider, Content, Footer,
} = Layout
let timer = null
let continueFaceDetect = true
let continueFaceAdd = 0
@AuthRoute
@inject('homeStore', 'faceStore')
@observer
class App extends React.Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
    this.videoRef = React.createRef()
    this.state = {
      mesg:'',
      chatMsg:{},
      // myNickName:'',
      // user:[],
      groupArr:[],
      roomUser:[],
      userInfo:{
        nickName:'',
        inviteCode:'',
        userId:'',
      },
      currentChat: {},
      visible:false,

      isModalVisible:false,
      accessTokenInfo:null,
      mediaStream:null,

      // continueFaceDetect:true,
    }
  }

  componentWillUnmount() {
    if (timer) clearInterval(timer)
  }

  getGroupInfos = callback => {
    const { homeStore } = this.props
    const { getGroupInfo } = homeStore
    getGroupInfo({}, callback)
  }

  handleDelAccessToken = accessTokenInfo => {
    const { faceStore } = this.props
    const { getAccessToken } = faceStore
    if (accessTokenInfo) {
      const day = moment().diff(moment(accessTokenInfo.times), 'day')
      if (day >= 20) {
        RemoveLocalStorage('accessTokenInfo')
        this.handleDelAccessToken()
        return
      }
      this.setState({
        accessTokenInfo,
      })
    } else {
      getAccessToken({
        grant_type:'client_credentials',
        client_id: 'lYn1sOce6pkcT0OE0FhxfYi6',
        client_secret: 'mVk4auR7Oe138UAKLKicFe6aQm01i3WI',
      }, accessToken => {
        this.setState({
          accessTokenInfo:{
            accessToken,
            times: new Date().getTime(),
          },
        })
      })
    }
  }

  componentDidMount() {
    const userInfo = GetLocalStorage('userInfo')
    const accessTokenInfo = GetLocalStorage('accessTokenInfo') || null
    const token = GetLocalStorage('token')
    if (!token) return
    const { nickName, userId } = userInfo
    this.getGroupInfos(groupArr => {
      this.setState({
        userInfo,
        groupArr,
        currentChat:groupArr[0],
        accessTokenInfo,
      }, () => {
        // 向服务端发送链接人
        socket.emit('client_online', {
          nickName,
          id:userId,
          groupArr,
        })

        this.handleDelAccessToken(accessTokenInfo)

        this.handleJoinRoom(groupArr)

        this.handleGetRoomUser()
      })
    })

    // 接收在线人员
    socket.on('server_online', data => {
      console.log('在线人员', data)
      // this.setState({
      //   user:data,
      // })
    })
    this.handleGetServerMsg()
  }

  handleGetRoomUser = () => {
    socket.on('roomUser', data => {
      this.setState({
        roomUser:data,
      })
    })
  }

  handleGetServerMsg = () => {
  //   // 服务器消息
    socket.on('server_msg', data => {
      console.log(data, '--收到消息-')
      const { chatMsg } = this.state
      if (!chatMsg[data.roomId]) chatMsg[data.roomId] = []
      const newChatMsg = chatMsg[data.roomId].concat(data)
      chatMsg[data.roomId] = newChatMsg
      console.log(chatMsg, '---')
      this.setState({
        chatMsg,
      })
    })
  }

  handleJoinRoom = group => {
    const { userInfo } = this.state
    const { nickName, userId } = userInfo
    // 加入不同群组
    group.forEach(item => {
      socket.emit('joinRoom', {
        nickName,
        id:userId,
        roomId:`room${ item.value }`,
      })
    })
  }

  handleChooseChat = info => {
    this.setState({
      currentChat: info,
    })
  }

  handleSendMessage = e => {
    e.preventDefault()
    const { userInfo, currentChat, mesg } = this.state
    console.log('发送消息')
    socket.emit('client_msg', {
      msg:mesg,
      nickName:userInfo.nickName,
      roomId: `room${ currentChat.value }`,
    })
    this.setState({
      mesg:'',
    })
  }

  handleChangeMesg = e => {
    this.setState({
      mesg:e,
    })
  }

  copyInviteCode = () => {
    const { userInfo } = this.state
    copy(userInfo.inviteCode)
    message.success('复制成功')
  }

  handleShowRoomInfomation = () => {
    this.setState({
      visible:true,
    })
  }

  handleOnClose = type => {
    this.setState({
      [type]:false,
    })
  }

  handleOk = () => {
    this.setState({
      isModalVisible:false,
    })
  }

  handleShowFaceLogin = () => {
    this.setState({
      isModalVisible:true,
    }, () => {
      this.initCamera(280, 400).then(video => {
        timer = setInterval(() => {
          const canvas = this.canvasRef.current
          canvas.width = video.offsetWidth
          canvas.height = video.offsetHeight
          const context = canvas.getContext('2d')
          context.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight)// 绘制视频
          const imgUrl = canvas.toDataURL('image/png', 1).replace('data:image/png;base64,', '')
          if (!continueFaceDetect) return
          this.faceDetect(imgUrl)
        }, 800)
      }).catch(error => {
        console.log(error, '0000')
      })
    })
  }

  faceDetect = image => {
    const { faceStore } = this.props
    const { accessTokenInfo  = {} } = this.state
    const { accessToken = null } = accessTokenInfo
    const { faceDetect } = faceStore
    continueFaceDetect = false
    faceDetect({
      image,
      image_type:'BASE64',
      face_field:'quality',
    }, res => {
      if (res.error_code !== 0) {
        message.warning('请将人脸移入框内', 1)
        continueFaceDetect = true
        return
      }
      const completeness = res?.result?.face_list[0]?.quality?.completeness
      if (completeness === 1) {
        continueFaceDetect = false
        continueFaceAdd += 1
        if (timer) clearInterval(timer)
        this.handleFaceAdd(image)
      }
    }, accessToken)
  }

  handleFaceAdd = image => {
    const { faceStore } = this.props
    const { accessTokenInfo  = {}, userInfo = { } } = this.state
    const { accessToken = null } = accessTokenInfo
    const { userId } = userInfo
    const { faceAdd } = faceStore
    if (continueFaceAdd > 1) return
    faceAdd({
      image,
      image_type:'BASE64',
      group_id:'savior_118425',
      user_id: `face_${ userId }`,
    }, res => {
      if (res.error_code === 0) {
        this.handleOnCloseModal('isModalVisible')
        message.success('人脸设置成功', 1)
      }
    }, accessToken)
  }

  initCamera = async (width, height) => {
    const cam = this.videoRef.current
    cam.width = width
    cam.height = height
    if (!navigator.mediaDevices.getUserMedia && !navigator.getUserMedia && !navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
      message.warning('设备不支持访问摄像头')
      return
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width,
        height,
      },
    })
    this.setState({
      mediaStream:typeof stream.stop === 'function' ? stream : stream.getTracks()[0],
    })
    cam.srcObject = stream
    return new Promise(resolve => {
      cam.onloadedmetadata = () => {
        resolve(cam)
      }
    })
  }

  handleOnCloseModal = type => {
    const { mediaStream } = this.state
    continueFaceDetect = true
    continueFaceAdd = 0
    this.setState({
      [type]:false,
    }, () => {
      const cam = this.videoRef.current
      if (mediaStream) mediaStream.stop()
      cam.srcObject = null

      if (timer) clearInterval(timer)
    })
  }

  render() {
    const {
      mesg, chatMsg, userInfo, groupArr, currentChat, visible, roomUser, isModalVisible,
    } = this.state
    return (
      <Layout className='app-layout'>
        <Sider className='app-slider'>
          <div className='app-right-slider'>
            <ul className='app-ul'>
              <div className='app-header'>
                <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size='large' gap={ 4 }>
                  { userInfo.nickName[0] }
                </Avatar>
                <h5>{ userInfo.nickName }</h5>
                <p onClick={ this.copyInviteCode }>
                  { userInfo.inviteCode }
                  <CopyOutlined className='app-more' />
                </p>
                <p><Button onClick={ this.handleShowFaceLogin }>人脸登录设置</Button></p>
                {/* <Input className='app-header-input' prefix={ <SearchOutlined /> } placeholder='搜索' /> */}
              </div>
              <Spin spinning={ !groupArr.length } className='app-spinning'>
                <div className='app-li-container'>
                  { groupArr.map(item => (
                    <ListItem key={ item.value } data={ item } text='您有一条消息' logo={ logoImg } onClick={ this.handleChooseChat } activeKey={ currentChat.value } />
                  )) }
                </div>
              </Spin>
            </ul>
          </div>
        </Sider>
        <Layout className='app-content-layout'>
          <Header className='app-content-header'>
            { currentChat.name }
            <MoreOutlined className='app-more' onClick={ this.handleShowRoomInfomation } />
          </Header>
          <Content className='app-content'>
            <div className='chatContainer'>
              <div className='chatDv'>
                <ul>
                  {chatMsg[`room${ currentChat.value }`] && chatMsg[`room${ currentChat.value }`].map(({ msg, nickName, type }, index) => {
                    return (
                      <li className='chatli' key={ index }>
                        { type === 2
                          ? (
                            <li className='rightli'>
                              <div className='leftDv'>
                                {/* <div className="nickNameDv">{ nickName }</div> */}
                                <div className='msgDv'>
                                  <span className='message1'>{ msg }</span>
                                </div>
                              </div>
                              <div className='rightDv'>
                                {/* <Avatar icon="user" size="small" /> */}
                                <Avatar className='app-avator' style={{ backgroundColor: '#87d068' }} icon={ <UserOutlined /> } />
                              </div>
                            </li>
                          ) : (
                            <li className='leftli'>
                              <div className='leftDv'>
                                {/* <Avatar icon="user" size="small" /> */}
                                <Avatar className='app-avator' style={{ backgroundColor: '#87d068' }} icon={ <UserOutlined /> } />
                              </div>
                              <div className='rightDv'>
                                <div className='nickNameDv'>{ nickName }</div>
                                <div className='msgDv'>
                                  <span className='message2'>{ msg }</span>
                                </div>
                              </div>
                            </li>
                          ) }
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </Content>
          <Footer className='app-footer'>
            <Mentions
              className='app-input'
              autoSize={{ minRows: 6, maxRows: 6 }}
              style={{ width: '100%' }}
              onPressEnter={ this.handleSendMessage }
              onChange={ this.handleChangeMesg }
              value={ mesg }
            >
              { roomUser[`room${ currentChat.value }`] && roomUser[`room${ currentChat.value }`].map(item => (
                <Option value={ item.id }>{ item.nickName }</Option>
              )) }
            </Mentions>
          </Footer>

          <Drawer
            title=''
            placement='right'
            closable
            onClose={ () => { this.handleOnClose('visible') } }
            visible={ visible }
            key='right'
          >
            <ul>
              { roomUser[`room${ currentChat.value }`] && roomUser[`room${ currentChat.value }`].map(item => (
                <li>{ item.nickName }</li>
              )) }
            </ul>
          </Drawer>
        </Layout>
        <Modal
          title='人脸设置'
          visible={ isModalVisible }
          closable
          maskClosable={ false }
          className='app-modal'
          onOk={ this.handleOk }
          onCancel={ () => { this.handleOnCloseModal('isModalVisible') } }
          footer={ null }
        >
          <div>
            <video id='video' crossOrigin='anonymous' width='280' height='400' muted autoPlay ref={ this.videoRef } playsInline />
            <canvas id='canvas' ref={ this.canvasRef } style={{ display:'none' }} />
          </div>
        </Modal>
      </Layout>
    )
  }
}

export default App