var app = getApp();
Page({
  data: {
    html: '<p class="MsoNormal" style="margin-left:32.0pt;text-indent:-32.0pt;">	<b><span style="font-size:16.0pt;">人脸识别要点介绍</span></b><span></span></p><p class="MsoNormal" style="margin-left:15.75pt;text-indent:-15.75pt;"> <span><span>1</span>、短按界面中的图标上传照片进行人像识别查询</span></p><p class="MsoNormal" style="margin-left:15.75pt;text-indent:-15.75pt;"> <span><span>2</span>、长按界面中的图标直接拍照进行人像识别查询。</span></p><p class="MsoNormal" style="margin-left:15.75pt;text-indent:-15.75pt;"> <span><span>3</span>、查询结束后，长按信息可进行反查</span></p>  <br />  <p class="MsoNormal" style="margin-left:32.0pt;text-indent:-32.0pt;"><b><span style="font-size:16.0pt;">人脸识别图片演示：</span></b><span></span></p><img src="http://sxxy-1253202980.cossh.myqcloud.com/help/face.jpg" alt="" style="max-width:80%;height:auto;box-shadow: 4px 4px 7px #888888;border: 1px solid #DDDDDD;" />  <br />  <p class="MsoNormal" style="margin-left:32.0pt;text-indent:-32.0pt;">	<b><span style="font-size:16.0pt;">人脸识别视频演示：</span></b><span></span></p><br/>'
  },
  onShow: function () {
    var that = this;
    that.setData({
      //isback_img: app.globalData.isback_img,
      windowHeight: app.globalData.windowHeight,
      windowWidth: app.globalData.windowWidth
    });
  }
})