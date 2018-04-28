//获取应用实例
var app = getApp()

var UTIL = require('../../utils/util.js');
var GUID = require('../../utils/GUID.js');
var NLI = require('../../utils/NLI.js');

var cursor = 0;
var lastYYYTime = new Date().getTime();

var domainCorpus = '';
var lastCorpus = '';
var timer;

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
    var skey = wx.getStorageSync('user[skey]')
    var openid = wx.getStorageSync('user[openid]')
    var expired_time = wx.getStorageSync('user[expired_time]')
    var timestamp = (Date.parse(new Date())) / 1000;
    if (skey != '' && timestamp < expired_time) {
      return;
    }
    var timeflag = Date.parse(new Date());
    wx.showLoading({
      title: '登录验证中',
      mask: true
    })
    // 因为我需要登录后的用户信息,但是app.getUserInfo和下面的request请求基本上是同时请求的所以获取不到  
    app.mycheck();
    // 在这里我设置了一个定时器循环多次去执行去判断上一步的函数执行完毕没有  
    // 但是也不能无限循环,所以要叫一个判断当执行超过多少秒后报一个网络错误  
    var times = setInterval(function () {
      // 因为一开始缓存当中指定的key为假当为真的时候就说明上一步成功了这时候就可以开始发送下一步的请求了  
      var skey = wx.getStorageSync('user[skey]')
      var openid = wx.getStorageSync('user[openid]')
      var expired_time = wx.getStorageSync('user[expired_time]')
      var timestamp = (Date.parse(new Date())) / 1000;
      if (skey != '' && timestamp < expired_time) {
        // 在这里停止加载的提示框  
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        // 这里必须要清除不然就等着循环死吧  
        clearTimeout(times);

        var skey = wx.getStorageSync('user[skey]')    // 用户名  
        var openid = wx.getStorageSync('user[openid]')  // 用户token  
        var expired_time = wx.getStorageSync('user[expired_time]')// 考试类型  
        wx.showToast({
          title: '验证成功',
          icon: 'success',
          duration:1500
        })
      } else {
        if (Date.parse(new Date()) > (timeflag + 8000)) {
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
          // 这里必须要清除不然就等着循环死吧  
          clearTimeout(times);
          wx.showToast({
            title: '登录验证失败',
            image: '../../image/ava_error.png',
            duration: 1500
          })
        }

      }
    });
    var that = this;
    that.isShow = true;
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
  var skey = wx.getStorageSync('user[skey]');
  console.log(skey);
  method=method||'xm';
  wx.request({
    url: 'https://wx.tzour.com/sxxy/public/index.php/admin/pub/xcxapi.html',//requestUrl,
    data: {
      method: method,
      keyword: keyword,
      skey: skey
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (result) {
      UTIL.log(result.data);
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