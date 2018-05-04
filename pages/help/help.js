Page({
  data: {
    list: [
      {
        id: 'signup',
        name: '1、注册绑定帮助说明',
        open: false,
        pages: []
      }, 
      {
        id: 'text',
        name: '1、文字查询帮助说明',
        open: false,
        pages: []
      }, {
        id: 'asr',
        name: '2、语音查询帮助说明',
        open: false,
        pages: ['image', 'audio', 'video']
      }, {
        id: 'face',
        name: '3、人脸识别帮助说明',
        pages: ['map']
      }
    ]
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

