var app=getApp();
Page({
  data: {
    list: [
      {
        id: 'settings',
        name: '我的设置',
        open: false,
        pages: []
      }, 
      {
        id: 'help',
        name: '帮助说明',
        open: false,
        pages: []
      }
    ]
  },
  onLoad:function(){
    var that=this;
    that.setData({
      isback_img: app.globalData.isback_img
    })
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  }
})

