//app.js

const corpusList = require('./config').corpus
var UTIL = require('./utils/util.js');

App({
  onShow: function () {
    UTIL.log('App Show')
  },
  onHide: function () {
    UTIL.log('App Hide')
  },
  onLaunch: function () {
    UTIL.log('App Launch')
    this.updateUserLocation()
  },

  updateUserLocation: function() {
    var that = this
    wx.getLocation({
      //type: 'wgs84',  // gps原始坐标
      type: 'gcj02', //国家标准加密坐标
      success: function (res) {
        that.globalData.latitude = res.latitude
        that.globalData.longitude = res.longitude
        that.globalData.speed = res.speed
        //var accuracy = res.accuracy
        UTIL.log('REFRESH LOCATION: ' + that.globalData.latitude + ' | ' + that.globalData.longitude + ' , speed: ' + that.globalData.speed)
      },
      fail: function(res) {
        UTIL.log('REFRESH LOCATION FAILED...')
      }
    })
  },

  getUserInfo:function(cb){
    var that = this
    let skey = wx.getStorageSync('skey');
    let expired_time = wx.getStorageSync('expired_time')
    var timestamp = (Date.parse(new Date()))/1000;
    if(skey!=''&& timestamp<expired_time){
      console.log('登录状态有效');
      //typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (user) {
          that.globalData.code=user.code;
          that.globalData.openid=getSessionKey(user.code);
          console.log(that.globalData.openid);
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              that.globalData.custId = UTIL.getUserUnique(that.globalData.userInfo);
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        },
        fail: function () {
          UTIL.log('登录WX失败了！')
        }
      })
    }
  },



  clearUserInfo: function() {
    var that = this
    that.globalData.userInfo = null;
    that.globalData.hasLogin = false;
  },

  globalData:{
    userInfo:null,
    corpus: corpusList,
    custId: '',
    latitude: 0.0,
    longitude: 0.0,
    speed: 0,
    openid:'',
  }
})

function getSessionKey(code) {
  wx.request({
    url: 'https://wx.tzour.com/sxxy/public/index.php/admin/pub/getsession_key.html',//requestUrl,
    data: {
      code: code,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    success: function (result) {
      if(result.data.errcode==null){
        wx.setStorageSync('skey', result.data.skey);
        wx.setStorageSync('expired_time', result.data.expired_time);
        console.log(result.data);
      }else{
        console.log('错误');
      }
    },
    fail: function ({ errMsg }) {
      console.log('错误'+code);
    }
  })
}