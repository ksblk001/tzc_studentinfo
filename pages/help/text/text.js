var WxParse = require('../../../wxParse/wxParse.js');

Page({
  data: {

  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: 'https://wx.tzour.com/sxxy/public/admin/pub/index.html',
      method: 'POST',
      data: {
        'page': 'singhelp'
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var article = res.data;
        WxParse.wxParse('article', 'html', article, that, 5);
      }
    })
  }
})