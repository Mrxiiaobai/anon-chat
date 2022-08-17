/* eslint-disable no-useless-escape */
export default {
  MOBILE: /^(13|14|15|16|17|18|19)\d{9}$/,
  EMAIL: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
  PASSWORD: /^[a-zA-Z\d_]{6,16}$/,
  NEWPASSWORD:/^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{8,16}$/,
  VCODE: /^\d{4,6}$/,
  PHOTO_TYPES: /(gif|jpe?g|png|GIF|JPG|PNG|bmp|svg)$/,
  SPECIAL_SYMBOL: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
  LETTER_AND_NUM: /^[A-Za-z0-9]+$/,
  SPECIAL_NO_NUMBER: /^[A-Za-z\u4e00-\u9fa5]+$/,
  // 店铺编号
  SHOPNUM: /^[a-zA-Z\d_]{12,100}$/,
}
