/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react'
import {
  Layout, message, Spin,
} from 'antd'
import { inject, observer } from 'mobx-react'
import { SmileOutlined } from '@ant-design/icons'

import './index.scss'

let timer = null
let continueFaceSearch = true

@inject('faceStore')
@observer
class Login extends React.PureComponent {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
    this.videoRef = React.createRef()
    this.state = {
      mediaStream:null,
      accessTokenInfo:{},
      replyFace:false,
      startFaceFlag:false,
      loginLoading:false,
    }
  }

  componentWillUnmount() {
    if (timer) clearInterval(timer)
  }

  componentDidMount() {
    const { faceStore } = this.props
    const { handleDelAccessToken } = faceStore
    handleDelAccessToken(null, accessToken => {
      this.setState({
        accessTokenInfo:{
          accessToken,
        },
      })
    })
  }

  handleStartFaceMatch = () => {
    this.setState({
      startFaceFlag:true,
    }, () => {
      this.initCamera(280, 400).then(video => {
        timer = setInterval(() => {
          const canvas = this.canvasRef.current
          canvas.width = video.offsetWidth
          canvas.height = video.offsetHeight
          const context = canvas.getContext('2d')
          context.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight)// 绘制视频
          const imgUrl = canvas.toDataURL('image/png', 1).replace('data:image/png;base64,', '')
          if (!continueFaceSearch) return
          this.faceMatch(imgUrl)
        }, 800)
      }).catch(error => {
        console.log(error, '0000')
      })
    })
  }

  faceMatch = image => {
    const { faceStore } = this.props
    const { accessTokenInfo  = {} } = this.state
    const { accessToken = null } = accessTokenInfo
    const { faceSearch } = faceStore
    continueFaceSearch = false
    faceSearch({
      image,
      image_type:'BASE64',
      group_id_list:'savior_118425',
      match_threshold:85,
    }, res => {
      const { error_code, result } = res
      if (error_code === 22202) {
        message.warning('请将人脸移入识别框中')
        return
      }
      this.handleReset()
      if (error_code === 0) {
        if (!result.user_list) {
          this.setState({
            replyFace:true,
          })
          message.warning('请设置人脸登录')
        }
        this.handleFaceLogin(result?.user_list[0])
      } else {
        this.setState({
          replyFace:true,
        })
        message.warning('请设置人脸登录')
      }
    }, accessToken)
  }

  successBack = () => {
    const { history } = this.props
    this.setState({
      loginLoading:false,
    })
    if (!window.electronApi) history.push('/anon/home')
    window.electronApi.ipcRenderer.send('close')
    window.electronApi.ipcRenderer.send('openMainWindow')
  }

  handleFaceLogin = async userInfo => {
    const { faceStore } = this.props
    const { faceLogin } = faceStore
    const params = {
      userId:userInfo?.user_id.replace('face_', ''),
    }
    this.setState({
      loginLoading:true,
    }, () => {
      faceLogin(params, this.successBack)
    })
  }

  handleReset = () => {
    const { mediaStream } = this.state
    if (timer) clearInterval(timer)
    continueFaceSearch = true
    if (mediaStream) mediaStream.stop()
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

  handleGoBack = () => {
    const { history } = this.props
    history.replace('/anon/login')
  }

  render() {
    const { startFaceFlag, replyFace, loginLoading } = this.state
    return (
      <Layout className='app-facelogin-layout'>
        <Spin spinning={ loginLoading }>
          <div className='login-content'>
            { !loginLoading && (
            <>
              <video id='video' crossOrigin='anonymous' width='280' height='400' muted autoPlay ref={ this.videoRef } playsInline />
              <canvas id='canvas' ref={ this.canvasRef } style={{ display:'none' }} />
            </>
            ) }

            { startFaceFlag ? '' : (
              <div className='app-face-login'>
                <SmileOutlined className='app-face-icon' onClick={ this.handleStartFaceMatch } />
                <span>{ replyFace ? '重试' : '开始登录' }</span>
                <span className='app-back-btn' onClick={ this.handleGoBack }>返回</span>
              </div>
            ) }
          </div>
        </Spin>
      </Layout>
    )
  }
}

export default Login