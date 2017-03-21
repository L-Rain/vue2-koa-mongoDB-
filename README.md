# vue2-koa-mongoDB搭建博文分享平台
从设计到前端重构后端交互数据库存储一手操作，新手向全栈入门

先说点题外话：毕业后从事的设计工作，一年后内部转岗到前端两年不到。这个网站就当拿来练手，也顺便摸摸传说中的全栈门道。这个项目从设计到后台全都是从0开始，前后（包括跨年）共花了两个月左右，在这个项目之前没用过vue2也没用过vuex，什么es6、vue-recource、koa、mongodb也只是闻名未谋面，听说和使用是两码事，当然也是照虎画猫跟着别人的脚步一步步摸索不断踩坑完成的，在此谢过各位前辈

运行方式：（先安装mongodb）
mongodb安装教程：
https://segmentfault.com/a/1190000002547229

//启动mongo服务
cd: /mongo
./mongod

//安装前端依赖，启动服务
cd: /fornt
npm install all
npm run dev

//安装后端依赖，启动服务
cd: /server
npm install all
npm run dev
