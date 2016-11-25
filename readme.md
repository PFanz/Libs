# 说明
所有组件从用ES6写法，babel配置如下：
```json
{
  "presets": [
    ["es2015", {"loose": true}], "stage-0"],
  "plugins": [
    "transform-es3-property-literals",
    "transform-es3-member-expression-literals"
  ]
}
```
建议使用webpack打包使用，详细事例可以进入对应文件夹查看。

### 轮播图
[轮播图](./Lunbo/)
--- 依赖Event.js  

    new Lunbo({
      id: 'lunbo'
    }).init()

### 下拉刷新
--- 依赖Event.js  

    new RefreshControl({
      id: 'refresh-control'
    }).init()
