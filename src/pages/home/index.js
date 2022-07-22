import React, { useEffect, useState } from 'react';
import { Layout, Input, Avatar } from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { SetLocalStorage, GetLocalStorage } from '@/utils/local'
import ListItem from '@components/ListItem'

import logoImg from '@/assets/img/anonChat.png'
import sliderImg from '@/assets/img/slider.jpeg'
import io from 'socket.io-client'

import './index.scss'

const socket = io('ws://localhost:9999')

const { TextArea } = Input
// import '@/assets/styles/common.scss'
const { Header, Sider, Content, Footer } = Layout;

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      mesg:'',
      chatMsg:[],
      myNickName:'',
      user:[]
    }
    
  }

  handleSendMessage = e => {
    e.preventDefault();
    console.log(e.target.value, '-----e-----')

    const userInfo = GetLocalStorage('userInfo') || { id: new Date().getTime(), nickName:new Date().getTime() }
    const msg = e.target.value
    //向后端发送数据
    // setMesg()
    this.setState({
      mesg:msg
    })
    
    socket.emit('client_msg', { 
      msg:msg,
      nickName:userInfo.nickName,
    })
  }

  handleChangeMesg = e => {
    // setMesg(e.target.value)
    this.setState({
      mesg:e.target.value
    })
  }

  componentDidMount(){
    if(!GetLocalStorage('userInfo')){
      SetLocalStorage('userInfo', { id: new Date().getTime(), nickName:new Date().getTime() })
    }
    const userInfo = GetLocalStorage('userInfo')
    // this.setState({
    //   myNickName:userInfo.nickName
    // })
    // setMyNickName(userInfo.nickName)
    this.setState({
      myNickName:userInfo.nickName
    })
    // 向服务端发送链接人
    socket.emit('client_online', { 
      nickName:userInfo.nickName,
      id:userInfo.id,
    });

    // 接收在线人员
    socket.on('server_online', data => {
      console.log('在线人员', data)
      this.setState({
        user:data
      })
    });

    socket.on('server_msg', (data) => {
      const { chatMsg } = this.state
      console.log(data,'----server_msg----')
      let newChatMsg = chatMsg.concat(data)
      console.log(newChatMsg, '------')
      this.setState({
        chatMsg:newChatMsg
      })
    });
  }
  render(){
    const { mesg, chatMsg } = this.state
    return (<>
      <Layout className='app-layout'>
        <Sider className='app-slider'>
          <div className='app-left-slider'>
            <img src={ sliderImg } alt='' />
          </div>
          <div className='app-right-slider'>
            {/* <ListItem name='Anon Chat' text='您有一条消息' logo={ logoImg } /> */}
            <ul className='app-ul'>
              <div className='app-header'><Input className='app-header-input' prefix={ <SearchOutlined /> } placeholder='搜索' /></div>
              <ListItem name='Anon Chat' text='您有一条消息' logo={ logoImg } />
            </ul>
          </div>
        </Sider>
        <Layout className='app-content-layout'>
          <Header className='app-content-header'>
            Anon Chat
            <MoreOutlined className='app-more' />
          </Header>
          <Content className='app-content'>
            <div className='chatContainer'>
              {/* <ChatContent chatMsg={ chatMsg } /> */}
              <div className="chatDv">
            <ul>
              {chatMsg.map(({ msg, nickName, type },index) => {
                return (<li className="chatli" key={ index }>
                { type === 2 ?
                <li className="rightli">
                  <div className="leftDv">
                    {/* <div className="nickNameDv">{ nickName }</div> */}
                    <div className="msgDv">
                      <span className="message1">{ msg }</span>
                    </div>
                  </div>
                  <div className="rightDv">
                    {/* <Avatar icon="user" size="small" /> */}
                    <Avatar className='app-avator' style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                  </div>
                </li> : <li className="leftli">
                  <div className="leftDv">
                    {/* <Avatar icon="user" size="small" /> */}
                    <Avatar className='app-avator' style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                  </div>
                  <div className="rightDv">
                    <div className="nickNameDv">{ nickName }</div>
                    <div className="msgDv">
                      <span className="message2">{ msg }</span>
                    </div>
                  </div>
                </li> }
              </li>)
              })}
            </ul>
          </div>
        </div>
      </Content>
      <Footer className='app-footer'>
        <TextArea 
          className='app-input'
          autoSize={{ minRows: 6, maxRows: 6 }}
          value={ mesg }
          onPressEnter={ this.handleSendMessage }
          onChange = { this.handleChangeMesg }
        />
      </Footer>
      </Layout>
      </Layout>
    </>)
  }
}
// const App = props => {
//   const [mesg, setMesg] = useState()
//   const [chatMsg, setChatMsg] = useState([])
//   const [users, setUsers] = useState([])
//   const [myNickName, setMyNickName] = useState()

//   useEffect(()=>{
//     if(!GetLocalStorage('userInfo')){
//       SetLocalStorage('userInfo', { id: new Date().getTime(), nickName:new Date().getTime() })
//     }
//     const userInfo = GetLocalStorage('userInfo')
//     // this.setState({
//     //   myNickName:userInfo.nickName
//     // })
//     setMyNickName(userInfo.nickName)
//     // 向服务端发送链接人
//     socket.emit('client_online', { 
//       nickName:userInfo.nickName,
//       id:userInfo.id,
//     });

//     // 接收在线人员
//     socket.on('server_online', data => {
//       console.log('在线人员', data)
//       // this.setState({
//       //   users:data,
//       // })
//       setUsers(data)
//     });

//     socket.on('server_msg', (data) => {
//       console.log(data,'----server_msg----')
//       // const { chatMsg } = this.state
//       let newChatMsg = chatMsg.concat(data)
//       console.log(newChatMsg, '------')
//       setChatMsg(newChatMsg)
//       // this.setState({
//       //   chatMsg:newChatMsg,
//       // })
//     });
//   },[])

//   const handleSendMessage = e => {
//     e.preventDefault();
//     console.log(e.target.value, '-----e-----')

//     const userInfo = GetLocalStorage('userInfo') || { id: new Date().getTime(), nickName:new Date().getTime() }
//     const msg = e.target.value
//     //向后端发送数据
//     setMesg()
    
//     socket.emit('client_msg', { 
//       msg:msg,
//       nickName:userInfo.nickName,
//     })
//   }

//   const handleChangeMesg = e => {
//     setMesg(e.target.value)
//   }

//   return (<>
//     <Layout className='app-layout'>
//       <Sider className='app-slider'>
//         <div className='app-left-slider'>
//         </div>
//         <div className='app-right-slider'>
//           {/* <ListItem name='Anon Chat' text='您有一条消息' logo={ logoImg } /> */}
//           <ul className='app-ul'>
//             <div className='app-header'><Input className='app-header-input' prefix={ <SearchOutlined /> } placeholder='搜索' /></div>
//             <ListItem name='Anon Chat' text='您有一条消息' logo={ logoImg } />
//           </ul>
//         </div>
//       </Sider>
//       <Layout className='app-content-layout'>
//         <Header className='app-content-header'>Anon Chat</Header>
//         <Content className='app-content'>
//           <div className='chatContainer'>
//             {/* <ChatContent chatMsg={ chatMsg } /> */}
//             <div className="chatDv">
//           <ul>
//             {chatMsg.map(({ msg, nickName, type },index) => {
//               return (<li className="chatli" key={ index }>
//               { type === 2 ?
//               <li className="rightli">
//                 <div className="leftDv">
//                   {/* <div className="nickNameDv">{ nickName }</div> */}
//                   <div className="msgDv">
//                     <span className="message1">{ msg }</span>
//                   </div>
//                 </div>
//                 <div className="rightDv">
//                   {/* <Avatar icon="user" size="small" /> */}
//                   <Avatar className='app-avator' style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
//                 </div>
//               </li> : <li className="leftli">
//                 <div className="leftDv">
//                   {/* <Avatar icon="user" size="small" /> */}
//                   <Avatar className='app-avator' style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
//                 </div>
//                 <div className="rightDv">
//                   <div className="nickNameDv">{ nickName }</div>
//                   <div className="msgDv">
//                     <span className="message2">{ msg }</span>
//                   </div>
//                 </div>
//               </li> }
//             </li>)
//             })}
//           </ul>
//           {/* <div className="showChatDv">
//             <ul>
//               <li>在线人员：</li>
//               {users.map(item => (
//                 <li>{item.nickName}</li>
//               ))}
//             </ul>
//           </div> */}
//     </div>
//           </div>
//         </Content>
//         <Footer className='app-footer'>
//           <TextArea 
//             className='app-input'
//             autoSize={{ minRows: 6, maxRows: 6 }}
//             value={ mesg }
//             onPressEnter={ handleSendMessage }
//             onChange = { handleChangeMesg }
//           />
//         </Footer>
//       </Layout>
//     </Layout>
//   </>)
// }


const ChatContent = props => {
  const { chatMsg } = props
  return (
    <div className="chatDv">
          <ul>
            {chatMsg.map(({ msg, nickName, type },index) => {
              return (<li className="chatli" key={ index }>
              { type === 2 ?
              <li className="rightli">
                <div className="leftDv">
                  {/* <div className="nickNameDv">{ nickName }</div> */}
                  <div className="msgDv">
                    <span className="message1">{ msg }</span>
                  </div>
                </div>
                <div className="rightDv">
                  {/* <Avatar icon="user" size="small" /> */}
                  <Avatar className='app-avator' style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                </div>
              </li> : <li className="leftli">
                <div className="leftDv">
                  {/* <Avatar icon="user" size="small" /> */}
                  <Avatar className='app-avator' style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                </div>
                <div className="rightDv">
                  <div className="nickNameDv">{ nickName }</div>
                  <div className="msgDv">
                    <span className="message2">{ msg }</span>
                  </div>
                </div>
              </li> }
            </li>)
            })}
          </ul>
          {/* <div className="showChatDv">
            <ul>
              <li>在线人员：</li>
              {users.map(item => (
                <li>{item.nickName}</li>
              ))}
            </ul>
          </div> */}
    </div>
  )
}
  


export default App;