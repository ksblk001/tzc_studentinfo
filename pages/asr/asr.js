/**
 * 作者：happycxz
 * 最后更新时间：2017.11.09
 * 源码分享链接：http://www.happycxz.com/m/?p=125
 *
 * https的silk语音识别API（专供微信小程序调用）：https://api.happycxz.com/wxapp/silk2asr
 * https的mp3语音识别API（专供微信小程序调用）：https://api.happycxz.com/wxapp/mp32asr
 * 该API服务搭建全过程解析及源码分享贴：http://blog.csdn.net/happycxz/article/details/78016299
 * 需要使用此API请联系作者QQ：404499164
 * 
 * 遵循开放、分享、自由、免费的精神，把开源坚持到底
 */

//获取应用实例 
var app = getApp()

var UTIL = require('../../utils/util.js');
var GUID = require('../../utils/GUID.js');
var NLI = require('../../utils/NLI.js');
//微信小程序新录音接口，录出来的是aac或者mp3，这里要录成mp3
const mp3Recorder = wx.getRecorderManager()
const mp3RecoderOptions = {
  duration: 60000,
  sampleRate: 16000,
  numberOfChannels: 1,
  encodeBitRate: 48000,
  format: 'mp3',
  //frameSize: 50
}

//弹幕定时器
var timer;

var pageSelf = undefined;


Page({
  data: {
    j: 1,//帧动画初始图片 
    isSpeaking: false,//是否正在说话
    outputTxt : "", //输出识别结果
    btnTxt:"按下录音",
    doommData: []
  },


  onLoad: function () {
    pageSelf = this;
    this.setData({
      btnText: "按下录音"
    })
    //onLoad中为录音接口注册两个回调函数，主要是onStop，拿到录音mp3文件的文件名（不用在意文件后辍是.dat还是.mp3，后辍不决定音频格式）
    mp3Recorder.onStart(() => {
      UTIL.log('mp3Recorder.onStart()...')
    })
    mp3Recorder.onStop((res) => {
      UTIL.log('mp3Recorder.onStop() ' + res)
      const { tempFilePath } = res
      var urls = "https://wx.tzour.com/sxxy/public/index.php/admin/pub/asrapi.html";
      UTIL.log('mp3Recorder.onStop() tempFilePath:' + tempFilePath)
      processFileUploadForAsr(urls, tempFilePath, this);
    })
  },

  /////////////////////////////////////////////////////////////// 以下是调用新接口实现的录音，录出来的是 mp3
  touchdown: function () {
  //touchdown_mp3: function () {
    UTIL.log("mp3Recorder.start with" + mp3RecoderOptions)
    var _this = this;
    //speaking.call(this);
    this.setData({
      btnText: "放开结束"
    })
    mp3Recorder.start(mp3RecoderOptions);
    wx.showToast({
      title: "放开结束录音",
      image: "../../image/0.gif",
      duration: 100000
    })
  },
  touchup: function () {
  //touchup_mp3: function () {
    UTIL.log("mp3Recorder.stop")
    this.setData({
      btnText: "按下录音",
    })
    mp3Recorder.stop();
    wx.hideToast()
  },

})

//上传录音文件到 api.happycxz.com 接口，处理语音识别和语义，结果输出到界面
function processFileUploadForAsr(urls, filePath, _this) {
  wx.uploadFile({
    url: urls,
    filePath: filePath,
    name: 'file',
    //formData: { "appKey": appkey, "appSecret": appsecret, "userId": UTIL.getUserUnique() },
    header: { 'content-type': 'multipart/form-data' },
    success: function (res) {
      _this.setData({
        outputTxt: res.data,
      });
      UTIL.log(res.data);
      wx.hideToast();
    },
    fail: function (res) {
      UTIL.log(res);
      wx.showModal({
        title: '提示',
        content: "网络请求失败，请确保网络是否正常",
        showCancel: false,
        success: function (res) {
        }
      });
      wx.hideToast();
    }
  });
}

function getNliFromResult(res_data) {
  var res_data_json = JSON.parse(res_data);
  var res_data_result_json = JSON.parse(res_data_json.result);
  return res_data_result_json.nli;
}

function getSttFromResult(res_data) {
  var res_data_json = JSON.parse(res_data);
  var res_data_result_json = JSON.parse(res_data_json.result);
  return res_data_result_json.asr.result;
}

//麦克风帧动画 
function speaking() {
  var _this = this;
  //话筒帧动画 
  var i = 1;
  this.timer = setInterval(function () {
    i++;
    i = i % 5;
    _this.setData({
      j: i
    })
  }, 200);
}
