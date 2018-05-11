var app=getApp();
Page({
  data: {
    html: '<p class="MsoNormal">	<b><span style="font-size:14.0pt;font-family:宋体;">注册绑定流程</span></b><b><span style="font-size:12.0pt;"></span></b></p><p class="MsoNormal">	<span>&nbsp;</span></p><p class="MsoNormal" style="margin-left:31.5pt;text-indent:-31.5pt;">	<span><strong>Setp 1</strong></span><span style="font-family:宋体;">、输入用户名、密码、手机号码（均为管理员提供给您的信息）</span><span></span></p><p class="MsoNormal" style="margin-left:31.5pt;text-indent:-31.5pt;">	<span><strong>Setp 2</strong></span><span style="font-family:宋体;">、点击提交，等待服务器返回结果</span><span></span></p><p class="MsoNormal" style="margin-left:31.5pt;text-indent:-31.5pt;">	<span><strong>Setp 3</strong></span><span style="font-family:宋体;">、服务器提示注册成功，进入使用指南</span><span></span></p><p class="MsoNormal" style="margin-left:31.5pt;text-indent:-31.5pt;">	<span><strong>Step 4</strong></span><span style="font-family:宋体;">、完成啦。开始享受便捷的服务吧！</span><span></span></p><p class="MsoNormal">	<span>&nbsp; <br /></span></p><p class="MsoNormal">	<b><span style="font-size:14.0pt;font-family:宋体;">重新进入小程序的方法</span></b><b><span style="font-size:12.0pt;"></span></b></p><p class="MsoNormal">	<span>&nbsp;</span></p><p class="MsoNormal" style="margin-left:21.0pt;text-indent:-21.0pt;">	<span>1</span><span style="font-family:宋体;">、在微信主界面下拉，界面顶端会出现最近使用过的小程序</span><span></span></p><p class="MsoNormal" style="margin-left:21.0pt;text-indent:-21.0pt;">	<span>2</span><span style="font-family:宋体;">、通过本学院公众号的菜单链接进入（如果有的话）</span><span></span></p><p class="MsoNormal" style="margin-left:21.0pt;text-indent:-21.0pt;">	<span>3</span><span style="font-family:宋体;">、微信“发现”页里的“小程序”，找到本小程序</span><span></span></p><p class="MsoNormal" style="margin-left:21.0pt;text-indent:-21.0pt;">	<span>4</span><span style="font-family:宋体;">、再次扫描小程序二维码进入</span><span></span></p>'
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