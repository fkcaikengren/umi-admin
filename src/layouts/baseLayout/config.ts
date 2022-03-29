const MENUS= [
  {
    "id": 2,
    "pid": 0,
    "name": "文章管理",
    "children": [
      {
          "id": 21,
          "pid": 2,
          "name": "全部文章",
          "path": '/article',
          "children": []
      },
      {
        "id": 22,
        "pid": 2,
        "name": "分类管理",
        "path": '/article/category',
        "children": []
      },
      {
        "id": 23,
        "pid": 2,
        "name": "标签管理",
        "path": '/article/tag',
        "children": []
      }
    ]
  },
  {
    "id": 3,
    "pid": 0,
    "name": "评论管理",
    "path": '/comment',
    "children": []
  }
]


export default MENUS