Page({
  data: {
    list: [
      {
        id: 'signup',
        name: '我的设置',
        open: false,
        pages: []
      }, 
      {
        id: 'text',
        name: '帮助说明',
        open: false,
        pages: []
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

