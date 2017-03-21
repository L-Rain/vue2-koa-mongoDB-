

从设计到前端重构后端交互数据库存储一手操作，新手向全栈入门

先说点题外话：毕业后从事的设计工作，一年后内部转岗到前端两年不到。这个网站就当拿来练手，也顺便摸摸传说中的全栈门道。这个项目从设计到后台全都是从0开始，前后（包括跨年）共花了两个月左右，在这个项目之前没用过vue2也没用过vuex，什么es6、vue-recource、koa、mongodb也只是闻名未谋面，听说和使用是两码事，当然也是照虎画猫跟着别人的脚步一步步摸索不断踩坑完成的，在此谢过各位前辈

# Blink前后端

运行方式：（一定要安装mongodb） mongodb安装教程： https://segmentfault.com/a/1190000002547229
<pre>
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
</pre>

#“闪现”制作流程之（二）:再讲前端
<p>前端用的就是<strong>vue</strong>渲染，当然还有webpac，vuex，vue-router，vue-resource等冚家大礼包。都是老朋友了，之前的商城和会员中心用的都是vue+webpack，只不过这次全面升级，变成冚家<strong>2.0</strong>，很遗憾vue并不支持ie9还是8，拒绝ie从我做起：）</p>
<p><em>记录点自己遇到的坑吧:</em><br>1，vue-router2.0的动态路由</p>
<pre><code>//html
&lt;router-link :to=&quot;{
    name: &#39;article&#39;, params: { articleId: item._id }
}&quot;&gt;
&lt;/router-link&gt;

//js
this.$router.push({ path: &#39; &#39;, params:&#39; &#39; })
</code></pre><p>1.1，main.js里要用特殊的姿♂势导入路由才可执行：</p>
<pre><code>const app = new Vue({
  el: &#39;app&#39;,
  router,
  store,
  render: h =&gt; h(App)
})
</code></pre><p>道理很简单，创建vue实例，根元素‘app’，还有router，sotre组件，再渲染App实例组件。当然依据官方还有几种其他写法，会报错：）</p>
<p>然后，额，好像也没然后了，vue之所以这么火就是因为比较geek，轻松上手，和vue2.0玩的开心</p>
<p>想太多，一路上都是坑<br>2，在vue组件里面只允许一个根节点，即:</p>
<pre><code>&lt;template&gt;
  //要是&gt;1的同级层就算再不乐意也得创建一个空div包裹所有层
  &lt;div&gt;
      .....
  &lt;/div&gt;
&lt;/template&gt;
</code></pre><p>3，使用formdata传输input上传图片</p>
<pre><code>&lt;form id=&quot;form&quot; name=&quot;multiUploadForm&quot; method=&quot;post&quot; enctype=&quot;multipart/form-data&quot;&gt;
   &lt;input name=&quot;thisInput&quot;&gt;
&lt;/from&gt;

var data = new FormData(document.getElementById(&quot;form&quot;));
//formdata也可以使用append方法添加数据
//data.append(&quot;other&quot;, value)
</code></pre><p>3.1，form的enctype选择“multipart/form-data”才可以上传多图<br>3.2，要想vue-resouce正确提交formdata数据就必须加<strong>“emulateJSON: true”</strong>参数</p>
<pre><code>Vue.resource(API_ROOT + &#39;users{/id}&#39;, { emulateJSON: true });
</code></pre><p>3.4，<strong>每一条formdata数据必须带上name参数</strong></p>
<p>4，marked+hightLight.js没什么好说，监听编辑框输入，预览框对应输出，对于图片处理我有自己的方法：将上传图片存入数组1，转为二进制保存在数组2，图片显示名字不显示地址（临时预览不上传服务器）,预览端输出数组2显示图片，若用户更换图片顺序，索引图片名称对应位置重新排序数组2</p>
<pre><code>//生成base64图片，临时预览，FileReader跟formdata一样为H5新增方法
var reader = new FileReader();
reader.readAsDataURL(thisFile);
//监听图片上传完毕，onload事件
reader.onload = function(e){
      self.insertPicAry.push( {
           result : this.result,
           name : thisFile.name,
           file : thisFile,
      );
      self.picAddress = thisFile.name;
 }
</code></pre><p>其他文本输出逻辑思路有：插入编辑功能的自动选中、区分、输出；用户手动选中区分、输出；二次进入编辑时赋值；各种状态判断等</p>
<p>5，token验证<br>涉及到用户修改数据都会加入token验证，还必须得是异步函数，验证完了才能执行下一步。vue-rouce提供了拦截器interceptos，在请求发出前获取用户登录后存储在sessionStorge的用户token，插入请求头，发出请求</p>
<pre><code>//vue-resource拦截器
Vue.http.interceptors.push((request, next) =&gt; {
  Vue.http.headers.common[&#39;token&#39;] = sessionStorage.token || &#39;&#39;;
  next((response) =&gt; {
    //在响应之后传给then之前对response进行修改和逻辑判断
    if (response.status == 401) {
      store.state.loginJudge = false;
      sessionStorage.removeItem(&#39;token&#39;);
    }
  })
})


//token验证使用promise对象
 getUserLogin ( {commit}, opts){
    opts = opts || &quot;&quot;;
    return new Promise((resolve, reject) =&gt; {
      api.getUserLogin(opts).then(function (res) {
        if (res.body.state) {
          resolve();
        }else {
          reject(res.body.msg)
        }
      }).catch(function(e){
         reject(e.body.msg)
      })
    })
  },
</code></pre>


#“闪现”制作流程之（三）: 三话后台
<p><strong>使用koa搭建服务器，使用MongoDB存储数据</strong></p>
<p>讲讲main.js里各类插件处理各类问题：</p>
<p>1，路由匹配：koa-router</p>
<pre><code>let koa = require(&#39;koa-router&#39;)();

//注册路由，router.routes()返回处理匹配到了请求对应的路由的router中间件
//router.use([path], middleware, [...])  Use given middleware(s) before route callback.
//router.use(),匹配到设置的接口地址后，进入回调中间件，再中间件里设置路由路径匹配对应后的回调函数
koa.use(&#39;/users&#39;, users.routes(), users.allowedMethods());
</code></pre><p>2，前后端分别配置两个域名，当然地址是本机，只是端口号不一样，既然是跨域就必须解决接口跨域的问题：kcros<br>3，想要通过地址访问本地存储的图片就必须暴露此服务器地址（文件夹位置）：koa-static</p>
<pre><code>let cors = require(&#39;kcors&#39;),
     static = require(&#39;koa-static&#39;);

//cors解决跨域问题
app.use(cors());
//static配置静态文件，可直接访问该文件夹下的文件
app.use(static(__dirname + &#39;/public/&#39;));
</code></pre><p>4，token签发认证：koa-jwt</p>
<pre><code>app.use(jwt({
  secret: &#39;Blink_1.0&#39;,
  passthrough: true
}));


app.use(function *(next){
  var ctx = this,
      thisUrl = ctx.request.url;
  console.log(thisUrl)
  // 如果不是admin，直接跳过该中间件
  if (thisUrl.indexOf(&#39;create&#39;) === -1 &amp;&amp; thisUrl.indexOf(&#39;checkOut&#39;) == -1) {
    return yield next;
  }
  var token = ctx.request.headers.token || &#39;&#39;;
  if (token) {
    var profile = jwt.verify(token, &#39;Blink_1.0&#39;);
    if (profile) {
      // 设置过期时间为1天
      if (Date.now() - profile.original_iat  &lt; 12 * 60 * 60 * 1000) {
        yield next;
      } else {
        ctx.status = 401;
        ctx.body = {
          state: false,
          msg: &#39;token已过期&#39;
        };
      }
    } else {
      ctx.status = 401;
      ctx.body = {
        state: false,
        msg: &#39;token认证失败&#39;
      }
    }
  } else {
    ctx.status = 401;
    ctx.body = {
      state: false,
      msg: &#39;token认证失败&#39;
    }
  }
});
</code></pre><p>5，想要全局使用mongodb，就得赋值一个全局承诺</p>
<pre><code>const mongoose = require(&#39;mongoose&#39;)

const mongooseDB = function () {
    //重点在这一句，赋值一个全局的承诺。
    mongoose.Promise = global.Promise
  mongoose.connect(&#39;mongodb://127.0.0.1:27017/wecut_blog&#39;)
  return mongoose.connection
}
</code></pre><p><strong>敲黑板，划重点：</strong><br>流程（二）前端里说过，图片是通过formdata形式提交数据，如何将数据流转为绝对地址保存在本地服务器：co-busboy</p>
<pre><code>//上传控件
var parse = require(&#39;co-busboy&#39;);
var fs = require(&#39;fs&#39;);
var os = require(&#39;os&#39;);
var path = require(&#39;path&#39;);

while (part = yield parts){
    //一定要对流进行处理，否则while循环会被卡住
    //input上传文件就是个对象，包含了filename键值
    if (part.filename) {
      var filename = part.filename;
      fileNames.push(filename)
      var homeDir = path.resolve(__dirname, &#39;..&#39;)
      var newpath = homeDir + &#39;/public/images/article/&#39;+ filename;
      //生成存储路径，要注意这里的newpath必须是绝对路径，否则Stream报错
      var stream = fs.createWriteStream(newpath);
      //写入文件流
      part.pipe(stream);

    //不是input上传文件则为数组[&#39;键&#39;，&#39;值&#39;]形式
    }else if(part.length) {
      if (part[0].indexOf(&quot;subTags&quot;) &gt; -1) {
        subTags.push(part[1]);
        opts[&quot;subTags&quot;] = subTags;
      }else {
        opts[part[0]] = part[1];
      }
    }
</code></pre>

