//获取应用实例
var app = getApp()

var UTIL = require('../../utils/util.js');
var GUID = require('../../utils/GUID.js');
var NLI = require('../../utils/NLI.js');

var cursor = 0;
var lastYYYTime = new Date().getTime();

var domainCorpus = '';
var lastCorpus = '';


Page({

  isShow: false,

  /**
   * 页面的初始数据
   */
  data: {
    //调试后门
    isDbg: false,
    //输入框文本
    inputTxt: '',
    //输出框文本
    outputTxt: '',
    scrolltop:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    UTIL.log('index.onLoad')
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo2) {
      UTIL.log('user unique 1: ' + UTIL.getUserUnique(userInfo2))
    })
    UTIL.log('user unique 2: ' + UTIL.getUserUnique(app.globalData.userInfo))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    UTIL.log('index.onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    UTIL.log('index.onShow')

    var that = this;
    that.isShow = true;

    //调用重力加速度传感API模拟摇一摇接口
    wx.onAccelerometerChange(function (e) {
      
      if (!that.isShow) {
        //当前界面不显示时不应该调用
        return
      }

      if (isBong(e.x) && isBong(e.y)) {
        if (new Date().getTime() - lastYYYTime <= 2000) {
          //1秒限制摇一次，避免摇一下触发多次请求
          UTIL.log('摇的太频繁啦，请等2秒再摇！' + e.x + ', '+ e.y + ', ' + e.z);
          return;
        }

        //更新最后一次成功摇的时间戳
        lastYYYTime = new Date().getTime()

        //从语料库中挑选语料运行语义理解，显示结果
        var selectedCorpus = selectCorpusRunNli(that);

        //弹Toast窗提示当前刷到哪句语料
        wx.showToast({
          title: selectedCorpus,
          icon: 'success',
          duration: 1500
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    UTIL.log('index.onHide')
    //页面隐藏后，关掉摇一摇检测
    wx.stopAccelerometer();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    UTIL.log('index.onUnload')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    UTIL.log('index.onPullDownRefresh')
    
    wx.stopPullDownRefresh();

    //页面下拉，触发轮换语料理解
    selectCorpusRunNli(this)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    UTIL.log('index.onReachBottom')
  },


  myblock:function(e){
    var method=e.target.dataset.method;
    var keyword=e.target.dataset.keyword;
    UTIL.log(keyword);
    NliProcess(method, keyword, this);
    
  },

  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },
  bindTap: function (e) {
    if (this.endTime - this.startTime < 350) {
      var method = e.target.dataset.method;
      var keyword = e.target.dataset.keyword;
      if (['dh', 'ch', 'fqdh', 'mqdh','jtdh'].indexOf(method)!=-1){
        wx.makePhoneCall({
          phoneNumber: keyword, //此号码并非真实电话号码，仅用于测试  
          success: function () {
            console.log("拨打电话成功！")
          },
          fail: function () {
            console.log("拨打电话失败！")
          }
        }) 


      }
      console.log(app.globalData.code);
      console.log("点击");
    }else{

      var method = e.target.dataset.method;
      var keyword = e.target.dataset.keyword;
      UTIL.log(keyword);
      NliProcess(method, keyword, this);
      console.log("长按");
      wx.showToast({
        title: "加载：" + keyword,
        image: "../../image/0.gif",
        duration: 2000
      })
    }
  },
  bingLongTap: function (e) {
    //console.log("长按");
  },


  previewImage: function(e){
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: [current] // 需要预览的图片http链接列表  
    })
  },

  //输入文本框聚焦触发清除输入框中的内容
  bindFocusClear: function(e) {
    UTIL.log('index.bindFocusClear')
    if (e.detail.value === '') {
      return;
    }

    UTIL.log('clear: ' + e.detail.value)
    var self = this;
    self.setData({
      inputTxt: ''
    });
  },

  //点击完成按钮时触发
  bindConfirmControl: function(e) {
    var inputTxt = e.detail.value;
    UTIL.log('index.bindConfirmControl input string: ' + inputTxt);
    //手动打字输入语料运行语义理解
    NliProcess('xm',inputTxt, this)
  },


  turnToNew: function() {
    wx.navigateBack({
    })
  }
})


//处理NLI语义结果
function NliProcess(method,keyword, self) {
  var nliResult;
  method=method||'xm';
  wx.request({
    url: 'https://wx.tzour.com/sxxy/public/index.php/admin/pub/xcxapi.html',//requestUrl,
    data: {
      method: method,
      keyword: keyword,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (result) {
      //UTIL.log(result.data.error_code);
      if (typeof(result.data.error_code) == "undefined"){
        var data = result.data.content;
        //var jsonData = JSON.stringify(data);
        //typeof cb == "function" && cb(true, jsonData)
        typeof self !== 'undefined' && self.setData({
          outputTxt: data
        })
        var query = wx.createSelectorQuery();
        typeof self !== 'undefined' && self.setData({
          scrolltop: 0
        })
        //query.select("#myscroll").scroll-top=0;//scrollOffset(0);
        wx.showToast({
          title: keyword+" OK！",
          icon: 'success',
          duration: 2000
        })
      }else{

      }
    },
    fail: function ({ errMsg }) {
      typeof cb == "function" && cb(false, jsonData)
    }
  })
}