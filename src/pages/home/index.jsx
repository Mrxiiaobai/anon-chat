import React from 'react'
import {
  Layout, Input, Avatar, message, Spin, Drawer, Mentions,
} from 'antd'
import io from 'socket.io-client'
import { inject, observer } from 'mobx-react'
import {
  UserOutlined,
  MoreOutlined,
  CopyOutlined,
} from '@ant-design/icons'
import copy from 'copy-to-clipboard'
import ListItem from '@components/ListItem'
import AuthRoute from '@common/AuthRoute'
import { GetLocalStorage } from '@/utils/local'

import logoImg from '@/assets/img/anonChat.png'
import './index.scss'

const socket = io('ws://localhost:9999')

const { TextArea } = Input
const { Option } = Mentions
const {
  Header, Sider, Content, Footer,
} = Layout

@AuthRoute
@inject('homeStore')
@observer
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mesg:'',
      chatMsg:{},
      // myNickName:'',
      user:[],
      groupArr:[],
      roomUser:[],
      userInfo:{
        nickName:'',
        inviteCode:'',
      },
      currentChat: {},
      visible:false,
    }
  }

  getGroupInfos = callback => {
    const { homeStore } = this.props
    const { getGroupInfo } = homeStore
    getGroupInfo({}, callback)
  }

  componentDidMount() {
    const userInfo = GetLocalStorage('userInfo')
    const { nickName, userId } = userInfo
    this.getGroupInfos(groupArr => {
      this.setState({
        userInfo,
        groupArr,
        currentChat:groupArr[0],
      }, () => {
        // 向服务端发送链接人
        socket.emit('client_online', {
          nickName,
          id:userId,
          groupArr,
        })

        this.handleJoinRoom(groupArr)

        this.handleGetRoomUser()
      })
    })

    // 接收在线人员
    socket.on('server_online', data => {
      console.log('在线人员', data)
      this.setState({
        user:data,
      })
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

  handleOnClose = () => {
    this.setState({
      visible:false,
    })
  }

  render() {
    const {
      mesg, chatMsg, userInfo, groupArr, currentChat, visible, roomUser,
    } = this.state
    return (
      <Layout className='app-layout'>
        <Sider className='app-slider'>
          <div className='app-right-slider'>
            <ul className='app-ul'>
              <div className='app-header'>
                <div>
                  <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size='large' gap={ 4 }>
                    { userInfo.nickName[0] }
                  </Avatar>
                  <h5>{ userInfo.nickName }</h5>
                  <p onClick={ this.copyInviteCode }>
                    { userInfo.inviteCode }
                    <CopyOutlined className='app-more' />
                  </p>
                </div>
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
            onClose={ this.handleOnClose }
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
      </Layout>
    )
  }
}

export default App