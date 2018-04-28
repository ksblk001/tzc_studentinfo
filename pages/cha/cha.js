var util = require('../../utils/util.js');
var app = getApp();
const commits = ['姓名', '性别', '寝室']
const methods = ['xm', 'xb', 'qs']

Page({
  data: {

    isShow: false,
    commits: commits,
    methods: methods,
    method: 'xm',
    commit: '姓名',
    value: [0],

    showTopTips: false,
    errorMsg: "",
    outputTxt: '',
    scrolltop: 0,

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
  onReachBottom: function () {
    console.log('index.onReachBottom')
  },

  pickershow: function (e) {
    this.setData({ isShow: !this.data.isShow })
  },
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      method: this.data.methods[val[0]],
      commit: this.data.commits[val[0]]
    })
    console.log(this.data.method);
    console.log(this.data.commit);
  },

  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: [current] // 需要预览的图片http链接列表  
    })
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
      if (['dh', 'ch', 'fqdh', 'mqdh', 'jtdh'].indexOf(method) != -1) {
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
    } else {
      var method = e.target.dataset.method;
      var keyword = e.target.dataset.keyword;
      console.log(keyword);
      requestStuInfo(method, keyword, this);
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
    var method = this.data.method;
    var keyword = that.data.barcode
    requestStuInfo(method,keyword,this);

  },
})

function requestStuInfo(method,keyword,self){
  var skey = wx.getStorageSync('user[skey]');
  var url = "https://wx.tzour.com/sxxy/public/admin/pub/xcxapi.html";//查询数据的URL 
  wx.request({
    url: url,
    data: { keyword: keyword, skey: skey, method: method },
    method: 'GET',
    success: function (res) {
      var result = res.data;
      console.log(result);
      if (typeof (result.error_code) == "undefined") {
        var data = result.content;
        //var jsonData = JSON.stringify(data);
        //typeof cb == "function" && cb(true, jsonData)
        typeof self !== 'undefined' && self.setData({
          outputTxt: data
        })
        var query = wx.createSelectorQuery();
        typeof self !== 'undefined' && self.setData({
          scrolltop: 0
        })
        self.setData({ showTopTips: false, errorMsg: '' });
        wx.showToast({
          title: keyword + " OK！",
          icon: 'success',
          duration: 2000
        })
      } else {
        self.setData({ hiddenData: true });
        self.setData({ showTopTips: true, errorMsg: result.error_message});
        wx.showToast({
          title: result.error_message,
          image: '../../image/ava_error.png',
          duration: 2000
        })
        return;
      }
    },
    fail: function (e) {
      var toastText = '获取数据失败' + JSON.stringify(e);
      self.setData({
        hiddenLoading: !self.data.hiddenLoading,
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
}