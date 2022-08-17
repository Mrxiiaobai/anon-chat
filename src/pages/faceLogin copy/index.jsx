/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react'
import {
  InputNumber, Layout, Input, Form, Button, Icon,
} from 'antd'
import { inject, observer } from 'mobx-react'

import { SmileOutlined } from '@ant-design/icons'

import './index.scss'

const MODEL_URL = '/models'

@inject('faceStore')
@observer
class Login extends React.PureComponent {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
    this.videoRef = React.createRef()
    this.image1Ref = React.createRef()
    this.image2Ref = React.createRef()
    this.state = {
      mediaStreamTrack:'',
    }
  }

  componentDidMount() {
    // if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
    //   this.getUserMedia({ video : { facingMode: 'user', width:640, height:480 }, audio:false }, this.success, this.error)// facingMode: "user" 为开启前置摄像头
    // } else {
    //   alert('您的设备不支持访问用户媒体')
    // }
    // const { faceStore } = this.props
    // const { getAccessToken } = faceStore
    const accessToken = GetLocalStorage('accessToken')
    if (!accessToken) {
      // getAccessToken({
      //   grant_type:'client_credentials',
      //   client_id: 'lYn1sOce6pkcT0OE0FhxfYi6',
      //   client_secret: 'mVk4auR7Oe138UAKLKicFe6aQm01i3WI',
      // }, res => {
      //   const { error_code, result } = res
      //   if (error_code === 0) {
      //     const { score } = result
      //     if (score >= 70) {
      //       console.log('登录成功')
      //     }
      //   }
      // })
    }
    // let timer = null
    // this.initCamera(640, 480).then(video => {
    //   timer = setInterval(() => {
    //     const canvas = this.canvasRef.current
    //     this.getImageBase64(video)
    //     canvas.width = video.offsetWidth
    //     canvas.height = video.offsetHeight
    //     const context = canvas.getContext('2d')
    //     context.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight)// 绘制视频
    //     const imgUrl = saveAsPNG(canvas);
    //     // onPlay()
    //   }, 1000).catch(error => {
    //     console.log(error, '0000')
    //   })
    // })

    let base641 = ''
    let base642 = ''
    const img = new Image()
    img.src = MyPng
    img.onload = () => {
      base641 = this.getImageBase64(img)
      this.handleMatchFace(accessToken, base641, base642)
    }

    const img2 = new Image()
    img2.src = SecPng
    img2.onload = () => {
      base642 = this.getImageBase64(img2)
      this.handleMatchFace(accessToken, base641, base642)
    }
    if (base641 && base642) {
      // base641 = this.getImageBase64(this.image1Ref.current)
      // base642 = this.getImageBase64(this.image2Ref.current)
      // this.handleMatchFace(accessToken, base641, base642)
    }

    // this.handleFaceApi()
    // this.initCamera(640, 480).then(() => {

    // })
  }

  getImageBase64 = img => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, img.width, img.height)
    const dataURL = canvas.toDataURL('image/png')
    return dataURL.replace('data:image/png;base64,', '')
    // return dataURL
  }

  handleMatchFace = (accessToken, image1, image2) => {
    // const { faceStore } = this.props
    // const { matchFace } = faceStore
    if (image1 && image2) {
      // matchFace([{
      //   image:image1,
      //   image_type:'BASE64',
      //   quality_control:'LOW',
      // }, {
      //   image:image2,
      //   image_type:'BASE64',
      //   quality_control:'LOW',
      // }], () => {

      // }, accessToken)
    }
  }

  loadRandomImage = src => {
    const image = new Image()

    image.crossOrigin = true

    return new Promise((resolve, reject) => {
      image.addEventListener('error', error => reject(error))
      image.addEventListener('load', () => resolve(image))
      image.src = src
    })
  }

  handleFaceApi = async () => {
    const minConfidence = 0.1
    // const maxResults = 1
    const picElem1 = this.image1Ref.current
    const picElem2 = this.image2Ref.current
    console.log(picElem1, picElem2, 'picElem1')
    // const options = new faceapi.MtcnnOptions(mtcnnForwardParams)
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    // setTimeout(async () => {
    console.log('开始')
    // const detections = await faceapi.detectSingleFace(picElem1, new faceapi.TinyFaceDetectorOptions())
    // const detections2 = await faceapi.detectSingleFace(picElem2, new faceapi.TinyFaceDetectorOptions())
    // console.log(detections, detections2, '----detections')
    // }, 3000)
    const optionsSSDMobileNet = new faceapi.TinyFaceDetectorOptions({
      // minConfidence,
      scoreThreshold:minConfidence,
    })
    const picture1 = await faceapi
      .detectSingleFace(picElem1, optionsSSDMobileNet)
      .withFaceLandmarks()
      .withFaceDescriptor()
    const picture2 = await faceapi
      .detectSingleFace(picElem2, optionsSSDMobileNet)
      .withFaceLandmarks()
      .withFaceDescriptor()

    const dist = faceapi.euclideanDistance(picture1.descriptor, picture2.descriptor)
    console.log(dist, '00000')
  }

  initCamera = async (width, height) => {
    // create cam reference
    const cam = this.videoRef.current
    cam.width = width
    cam.height = height
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width,
        height,
      },
    })
    cam.srcObject = stream
    return new Promise(resolve => {
      cam.onloadedmetadata = () => {
        resolve(cam)
      }
    })
  }

  // error = error => {
  //   console.log(`访问用户媒体设备失败${ error.name }, ${ error.message }`)
  // }

  // success = stream => {
  //   console.log(this.videoRef, stream)
  //   const StreamTrack = typeof stream.stop === 'function' ? stream : stream.getVideoTracks()[0] // 这里需要定义一个全局变量记录这个值，方便在其他地方调用关闭摄像头
  //   // setMediaStreamTrack(StreamTrack) // 使用useState存储，不是使用react的同学可以用其他方法存
  //   this.setState({
  //     mediaStreamTrack:StreamTrack,
  //   }, () => {
  //     const { mediaStreamTrack } = this.state
  //     console.log(mediaStreamTrack, '----mediaStreamTrack')
  //   })
  //   try {
  //     this.videoRef.current.srcObject = stream // 这里是react写法，videoRef是获取到的video元素，其他语框架的同学获取的video==videoRef.current;下面涉及videoRef的也一样
  //   } catch (error) {
  //     const CompatibleURL = window.URL || window.webkitURL
  //     this.videoRef.current.src = CompatibleURL.createObjectURL(stream)
  //   }
  //   this.videoRef.current.play()
  // }

  // uploadImage = () => {
  //   const { mediaStreamTrack } = this.state
  //   const context = this.canvasRef.current.getContext('2d')   // canvasRef同videoRef一样也是获取到的canvas元素，其他框架同学获取到的canvas==canvasRef.current;
  //   this.canvasRef.current.width = this.videoRef.current.offsetWidth
  //   this.canvasRef.current.height = this.videoRef.current.offsetHeight
  //   context.drawImage(this.videoRef.current, 0, 0, this.canvasRef.current.width, canvasRef.current.height) // 绘制当前画面，形成图片
  //   this.videoRef.current.pause() // 暂停摄像头视频流
  //   if (mediaStreamTrack) mediaStreamTrack.stop()
  //   // mediaStreamTrack && mediaStreamTrack.stop()    // 关闭摄像头 mediaStreamTrack 是上面setMediaStreamTrack方法存储得到的
  //   const imgURL = this.canvasRef.current.toDataURL('image/jpeg', 60 / 100) // 获取到的图片，这里的图片是base64位的，只需要base64图片的同学到这里就可以停止了

  //   const $Blob = dataURLtoFile(imgURL)   // 将base64转换为blob,需要file进行上传
  //   // 这里可以执行你的上传方法（$Blob ）
  // }

  getUserMedia = (constraints, success, error) => {
    if (navigator.mediaDevices.getUserMedia) {
      // 最新的标准API
      navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error)
    } else if (navigator.webkitGetUserMedia) {
      // webkit核心浏览器
      navigator.webkitGetUserMedia(constraints).then(success).catch(error)
    } else if (navigator.mozGetUserMedia)                {
      // firfox浏览器
      navigator.mozGetUserMedia(constraints, success, error)
    } else if (navigator.getUserMedia) {
      // 旧版API
      navigator.getUserMedia(constraints, success, error)
    }
  }

  render() {
    return (
      <Layout className='app-login-layout'>
      <div className='login-content'>
        <Form
          className='app-login-form'
          name='validate_other'
          onFinish={ this.onFinish }
        >
          <FormItem name='name'>
            <InputNumber
              className='login-name-input'
              placeholder='输入账号'
              min={ 1 }
              maxLength={ 11 }
              controls={ false }
            />
          </FormItem>
          <FormItem name='password'>
            <Input.Password
              placeholder='输入密码'
              className='login-pass-input'
              visibilityToggle={ false }
            />
          </FormItem>
          { !loginPage ? (
            <FormItem name='code'>
              <Input
                placeholder='请输入邀请码'
                className='login-pass-code'
              />
            </FormItem>
          ) : '' }
          <Button type='primary' htmlType='submit' className='login-btn'>
            Submit
          </Button>
        </Form>
        { loginPage ? (
          <p onClick={ () => { this.handleChangePage(false) }  }>去注册 </p>
        ) : <p onClick={ () => { this.handleChangePage(true) }  }>去登录</p> }
        <div className='app-face-login'>
          <SmileOutlined className='app-face-icon' onClick={ this.handleGoFacePage } />
          <span>人脸登录</span>
        </div>
      </div>
    </Layout>
    )
  }
}

export default Login