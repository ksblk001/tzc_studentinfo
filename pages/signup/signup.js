var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    showTopTips: false,
    errorMsg: "",


    barcode: "",
    hiddenLoading: true,
    hiddenData: true,
    hiddenDropdown: true,
    hiddenClear: true,
    demoData: '张权',
    Product: {},
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
  },
  bindBarcodeInput: function (e) {
    this.setData({
      barcode: e.detail.value
    })
  },
  bindBarcodeFocus: function (e) {
    this.setData({
      hiddenDropdown: false,
      hiddenClear: false
    })
  },
  bindBarcodeBlur: function (e) {
    this.setData({
      hiddenDropdown: true,
      hiddenClear: true
    })
  },
  scan: function (e) {
    var that = this;
    wx.scanCode({
      success: function (res) {
        that.setData({
          barcode: res.result
        });
        that.query(e);
      },
      fail: function () {
        that.setData({
          barcode: "",
          hiddenData: true
        });
      },
      complete: function () {
        // complete  
      }
    })
  },
  setDemoData: function (e) {
    this.setData({
      barcode: this.data.demoData
    });
  },
  clear: function (e) {
    this.setData({
      barcode: "",
      hiddenData: true
    });
  },
  query: function (e) {
    var url = "https://wx.tzour.com/sxxy/public/admin/pub/xcxapi.html";//查询数据的URL  
    var that = this;
    if (that.data.barcode == undefined
      || that.data.barcode == null
      || that.data.barcode.length <= 0) {
      that.setData({ hiddenData: true });
      wx.showToast({
        title: '请输入条码',
        image: '../../image/ava_error.png',
        duration: 2000
      });
      return;
    }
    var skey = wx.getStorageSync('user[skey]');
    var method="xm";
    wx.request({
      url: url,
      data: { keyword: that.data.barcode, skey: skey, method: method },
      method: 'GET',
      success: function (res) {
        var result = res.data;
        console.log(result);
        if (result.error) {
          that.setData({ hiddenData: true });
          wx.showToast({
            title: result.error,
            image: '../../image/ava_error.png',
            duration: 2000
          })
          return;
        }
        that.setData({ Product: result.Data, hiddenData: false });
        wx.showToast({
          title: "获取数据成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (e) {
        var toastText = '获取数据失败' + JSON.stringify(e);
        that.setData({
          hiddenLoading: !that.data.hiddenLoading,
          hiddenData: true
        });
        wx.showToast({
          title: toastText,
          icon: '',
          duration: 2000
        })
      },
      complete: function () {
        // complete  
      }
    })
  },







//清除小程序缓存
  clearstorage:function(e){
    try {
      wx.clearStorageSync()
    } catch (e) {
      wx.showToast({
        title: "清除缓存失败",
        image: '../../image/ava_error.png',
        duration: 1500
      })
      // Do something when catch error
    }
    wx.showToast({
      title: "清除缓存成功",
      icon: 'success',
      duration: 1500
    })
  },

  formSubmit: function (e) {
    // form 表单取值，格式 e.detail.value.name(name为input中自定义name值) ；使用条件：需通过<form bindsubmit="formSubmit">与<button formType="submit">一起使用  
    var account = e.detail.value.account;
    var password = e.detail.value.password;
    var phonenumber = e.detail.value.phonenumber;
    var that = this;
    var openid = wx.getStorageSync('openid');

    util.clearError(that);
    // 判断账号是否为空和判断该账号名是否被注册  
    if ("" == util.trim(account)) {
      util.isError("账号不能为空", that);
      return;
    }

    // 判断密码是否为空  
    if ("" == util.trim(password)) {
      util.isError("密码不能为空", that);
      return;
    } else {
      util.clearError(that);
    }
    // 判断手机号码是否为空  
    if ("" == util.trim(phonenumber)) {
      util.isError("手机号码不能为空", that);
      return;
    } else {
      util.clearError(that);
    }

    wx.login({
      success: function (res) {
        // 登录成功  
        if (res.code) {
          var code = res.code;
          // 验证都通过了执行注册方法  
          util.req('/sxxy/public/admin/pub/register', {
            "code": code,
            "account": account,
            "password": password,
            "phonenumber": phonenumber
          }, function (res) {
            var datamsg = res.data.error;

            switch (datamsg) {
              case 'existname':
                util.isError(res.data.msg, that);
                break;
              case 'errorname':
                util.isError("用户名、密码、手机号码不匹配，请联系管理员！", that);
                break;
              case 'success':
                wx.showModal({
                  title: '注册状态',
                  content: '注册成功，请点击确定登录吧',
                  success: function (res) {
                    if (res.confirm) {
                      // 点击确定后跳转登录页面并关闭当前页面  
                      wx.switchTab({
                        url: '../index/index'
                      })
                    }
                  }
                })
                break;
              default:
                util.isError("注册失败：未知错误，请联系管理员！", that);
                wx.showToast({
                  title: '注册失败',
                  image: '../../image/ava_error.png',
                  duration: 2000
                })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '获取用户登录态失败！' + res.errMsg
          })
        }
      }
    })
  }
})