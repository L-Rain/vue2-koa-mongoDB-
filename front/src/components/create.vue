<template>
<div class="create_page">
    <div class="cover_bg"></div>
    <div class="cover_fixed wrap clearfix"><h1 class="yellow fl">{{mainTitle}}</h1></div>
    <div class="wrap create_detail">
        <div class="create_tag">
            <span class="title_left">标题</span><input type="" name="" v-model="articleTitle">
        </div>
        <div class="create_tag">
            <span class="title_left">简介</span><input type="" name="" v-model="articleIntro">
        </div>
        <div class="create_tag">
            <span class="title_left">封面图</span>
            <div v-if="isEdit" class="pr unclickable">上传图片</div>
            <form v-else class="pr btn_hover">
                <p class="yellow_bg"></p>
                <div class="pa">上传图片</div>
                <input @click="picUpload" class="pa upload" type="file" name="fileUpload">
            </form>
            <span class="pic_upload_msg">{{ coverPicUploadMsg }}</span>
        </div>
        <div class="create_content clearfix">
            <div class="write_zone fl">
                <div class="create_btns create_title">
                    <span v-for="item in eventType" :class="item" @click="createBtn(item)"></span>
                </div>
                <textarea id="sourceArticle" rows="10" v-model="sourceArticle">

                </textarea>
            </div>
            <div class="watch_zone fr">
                <p class="create_title">预览</p>
                <div class="watch_text markdown_body"
                  v-html="markedArticle">
                </div>
            </div>
        </div>
        <div>
            <div class="create_tag main_tags">
                <span class="title_left">主题方向</span>
                <span @click="swithMainTag(index)" class="tag_btn" v-for="(item, index) in tags" :class="{ tag_active : index == mainTagDefault }">{{item.mainTag}}</span>
            </div>
        </div>
        <div class="create_tag sub_tags">
            <span class="title_left">标签分类</span>
                <span @click="swithSubTag(index)" class="tag_btn" v-for="(item, index) in subDefaultTag" :class="{ tag_active : index == 0 }">{{item}}</span>
        </div>
        <div class="submit_btn" @click="submitConfirm">发布文章</div>
    </div>
    <transition name="fade">
        <template v-if="popShow">
            <div class="pop_page">
                <div v-if="isLink" class="login_layer">
                    <div class="login_title clearfix">
                        <span class="active">插入链接</span>
                        <i class="fr" @click="popClose"></i>
                    </div>
                    <input v-model="originLink" placeholder="请输入链接" type="text" name="" class="insert_link">
                    <div class="login_btn" @click="linkInsertComfirm">插入</div>
                </div>
                <div v-else class="login_layer">
                    <div class="login_title clearfix">
                        <span class="active">插入图片</span>
                        <i class="fr" @click="popClose"></i>
                    </div>
                    <div v-if="isEdit" class="pr">
                        <input placeholder="编辑状态无法上传新图片" type="text" readonly name="">
                    </div>
                    <div v-else class="pr">
                        <input placeholder="请选择不大于1M的图片" v-model="picAddress" type="text" readonly name="">
                        <input placeholder="" type="file" name="fileUpload" class="insert_pic pa">
                    </div>

                    <div class="login_btn" @click="picInsertComfirm">插入</div>
                </div>
            </div>
        </template>
    </transition>
    <form id="fakeForm" class="pa btn_hover" name="multiUploadForm" method="post" enctype="multipart/form-data" style="top: 0;left: 0;z-index: -3;">

    </form>
</div>
</template>

<script>
import highlight from 'highlight.js'
import marked from 'marked'
export default {
    name : "create",
    // replace: false,
    data () {
        return {
            isEdit : false,
            mainTitle: "创建手记",
            _id : "",
            submitJudge : false,

            articleTitle : "",
            articleIntro : "",
            popTipsOpts : {},
            clickAble : true,

            //封面图片上传控制
            coverPicUploadMsg : "*尺寸348x184，小于1M",
            coverPicVal : "",
            coverPicSizeOverflow : false,
            coverPicFalse : false,

            //marked语法关键词组
            sourceArticle : "",
            eventType : [ "bold", "italic", "spot_line", "link", "quote", "code", "spot_line", "image"],
            selectStart : 0,
            selLenStart : 0,
            selLenEnd : 0,
            originText : "",
            reSelStart : 0,
            reSelEnd : 0,
            selLen : 0,
            dom : "",
            beginPart : "",
            middlePart : "",
            endPart : "",

            //插入链接、图片关键词组
            isLink : true,
            popShow : false,
            originLink : "",
            picAddress : "",
            insertPicSizeOverflow : false,
            insertPicAry : [],
            locationAry : [],
            markedPicAry : [],
            pushPicAry : [],

            //标签选择关键词组
            tags : [
                {
                    mainTag : "前端开发",
                    subTags : ["JavaScript","Html5","CSS3","Node.js","AngularJS","React.JS","Vue.js","Sass/Less","WebView","前端工具"]
                },
                {
                    mainTag : "后端开发",
                    subTags : ["PHP","Java","Python","C","C++","Go","C#","Ruby","MySQL", "MongoDB", "Oracle" ,"SQL Server"]
                },
                {
                    mainTag : "移动开发",
                    subTags : ["Android", "iOS","Unity 3D","Cocos2d-x"]
                },
                {
                    mainTag : "视觉设计",
                    subTags : ["Ps" ,"Ai", "Ae", "Flash", "Maya", "Premiere","ZBrush"]
                },
                {
                    mainTag : "运维/测试",
                    subTags : ["测试","Linux"]
                },
                {
                    mainTag : "飙车圣地",
                    subTags : ["wecut通知", "高速列车", "脑洞吐槽"]
                }
            ],
            mainTagDefault : 0,
            subDefaultTag : ["JavaScript","Html5","CSS3","Node.js","AngularJS","React.JS","Vue.js","Sass/Less","WebView","前端工具"],
        }
    },
    computed: {
        markedArticle () {
            //marked默认配置
            // var marked = require('marked');
            // marked.setOptions({
            //   renderer: new marked.Renderer(),
            //   gfm: true,
            //   tables: true,
            //   breaks: false, //回车不换成br
            //   pedantic: false,
            //   sanitize: true,
            //   smartLists: true,
            //   smartypants: false
            // });
            let renderer = new marked.Renderer()
            //marked基础语法:marked(markdownString [,options] [,callback])
            return marked(this.sourceArticle, { renderer: renderer ,breaks: true})
        }
    },
    watch: {
        markedArticle () {
            window.setTimeout(() => {
                this.updateMarkedStyle()
            }, 0)
        }
    },
    mounted (){
        //二次编辑各种数值赋值
        if (this.$route.path.indexOf('edit') > -1) {
            this.mainTitle = "编辑手记";
            this.isEdit = true;
            this.coverPicUploadMsg = "*编辑状态无法上传新图片";
            this._id = this.$route.params.articleId;
            let articleId = this.$route.params.articleId;
            this.$store.dispatch('getArticleById', articleId).then(() => {
                let thisArticle = this.$store.state.article;
                this.articleTitle = thisArticle.articleTitle;
                this.articleIntro = thisArticle.articleIntro;
                this.coverPicVal = thisArticle.coverImg;
                this.sourceArticle = thisArticle.sourceArticle;

                //处理已有的图片数组
                var imgAry = thisArticle.articleImgs,
                    imgLen = imgAry.length,
                    nameStart = imgAry[0].indexOf("article/") + 8;
                for (let i = 0; i < imgLen; i++) {
                    this.insertPicAry.push( {
                        result : imgAry[i],
                        name : imgAry[i].substr(nameStart,imgAry[i].length),
                        file : imgAry[i],
                    });
                }

                $(".main_tags .tag_btn").each((index, el) => {
                    if ($(el).html() == thisArticle.mainTag) {
                        this.swithMainTag(index);
                        $(el).addClass("tag_active").siblings("span").removeClass("tag_active");
                        return;
                    }
                });
                this.$nextTick(()=>{
                    $(".sub_tags span").removeClass("tag_active").each((index, el) => {
                        $(thisArticle.subTags).each((count, that)=>{
                            if ($(el).html() == that) {
                                $(el).addClass("tag_active");
                                return;
                            }
                        })
                    })
                })

            }).catch((e) => {
                console.log("edit页" ,e)
            });
        }

        var self = this;
        this.$nextTick(function(){
            //获取人为选中范围、起点、终点
            self.dom = document.getElementById("sourceArticle");
            $(self.dom).mouseup(function(e) {
                setTimeout(function(){
                    self.selLen = window.getSelection().toString().length;
                },100)
            });
            //封面图文件上传
            $(".upload").change(function(){
                var thisFile = this.files[0];
                if (thisFile) {
                    if(thisFile.type.indexOf('image') == -1){
                        self.coverPicFalse = true;
                    }else if (thisFile.size/1024 > 1000) {
                        self.coverPicSizeOverflow = true;
                    }else {
                        self.coverPicVal = thisFile;
                        self.coverPicUploadMsg = "上传成功";
                    }
                }
            });
        })
    },
    methods : {
        //marked + highlight文本生成
        updateMarkedStyle : function(){
            var self = this;
            $('pre code').each(function (i, block) {
                highlight.highlightBlock(block)
            })
            $('.hljs').each(function (i, item) {
                let $this = $(item)
                let matchLang = $this.attr('class').match(/lang\-[a-z]+/)
                let language = matchLang ? matchLang[0].split('-')[1] : 'code'
                $this.attr('data-language', language)
            })
            $('.markdown_body a').attr('target', '_blank');

            //图片src根据对应数组赋值
            var thisLocation = "";
            var thisImg = $(".watch_text img");
            this.locationAry = [];
            this.markedPicAry = [];
            this.pushPicAry = [];
            $(this.insertPicAry).each((index, el) => {
                //获取文本修改后对应图片文本位置以获得正确排序数组
                thisLocation = this.sourceArticle.indexOf(el.name);
                if ( thisLocation > -1) {
                    //包含位置以及上传图片内容信息的数组
                    this.markedPicAry.push({
                        location : thisLocation,
                        name : el.name,
                        result : el.result,
                        file : el.file,
                    })
                }
            });
            if (this.markedPicAry.length !== 0) {
                this.markedPicAry.sort(this.keysrt("location", false));
                $(this.markedPicAry).each((index,el) => {
                    //按数组位置重排后给marked后的img赋值
                    $(thisImg[index]).attr('src', el.result);
                    this.pushPicAry.push(el.file);
                })
            }
        },
        //生成marked语法
        createBtn : function (type) {
            var self = this;
            this.dom.focus();

            this.reSelStart = this.dom.selectionStart;
            this.reSelEnd = this.dom.selectionEnd;

            //分别截取编辑内容前中后部分，后期再拼接
            this.beginPart = this.sourceArticle.substring(0,this.reSelStart),
            this.middlePart = this.sourceArticle.substring(this.reSelStart, this.reSelEnd),
            this.endPart = this.sourceArticle.substring(this.reSelEnd, this.sourceArticle.length);

            //文本人为选中
            if (this.selLen !== 0) {
                //拼接编辑字符串
                if (type == "bold") {
                    this.sourceArticle = this.beginPart + "**" + this.middlePart +"**" + this.endPart;
                    this.selLenStart = 2;
                }else if (type == "italic") {
                    this.sourceArticle = this.beginPart + "*" + this.middlePart +"*" + this.endPart;
                    this.selLenStart = 1;
                }
                this.$nextTick(() =>{
                    //获取人为选中范围
                    this.dom.setSelectionRange(this.reSelStart + this.selLenStart, this.reSelEnd + this.selLenStart);
                    this.dom.focus();
                })
            }else {
                if (this.reSelEnd !== this.reSelStart) {
                    return;
                }
                if (type == "link") {
                    this.popShow = true;
                    this.isLink = true;
                    this.$nextTick(() =>{
                        $(".insert_link").focus();
                    })
                    return;
                }
                if (type == "image") {
                    this.popShow = true;
                    this.isLink = false;
                    this.picAddress = "";
                    this.$nextTick(() =>{
                        //文本框插入图片
                        $(".insert_pic").focus().change(function(e){
                            var _that = this,
                                thisFile = this.files[0];
                            if (thisFile) {
                                if(thisFile.type.indexOf('image') == -1){
                                    self.insertPicSizeOverflow = true;
                                    self.picAddress = "请上传正确的图片格式";
                                }else if (thisFile.size/1024 > 1000) {
                                    self.insertPicSizeOverflow = true;
                                    self.picAddress = "图片尺寸超过1M，请压缩后上传";
                                }else {
                                    //生成base64图片，临时预览
                                    var reader = new FileReader();
                                    reader.readAsDataURL(thisFile);
                                    reader.onload = function(e){
                                        self.insertPicAry.push( {
                                            result : this.result,
                                            name : thisFile.name,
                                            file : thisFile,
                                        });
                                        self.picAddress = thisFile.name;
                                    }
                                }
                            }
                        })

                    })
                    return;
                }
                if (type == "bold") {
                    this.originText = "**加粗文字**";
                    this.selLenStart = 2;
                    this.selLenEnd = 6;
                }else if (type == "italic") {
                    this.originText = "*斜体文字*";
                    this.selLenStart = 1;
                    this.selLenEnd = 5;
                }else if (type == "quote") {
                    this.originText = "\n"+">引用文字";
                    this.selLenStart = 2;
                    this.selLenEnd = 6;
                }else if (type == "code") {
                    this.originText = "\n"+"```"+'\n'+"请输入代码"+ '\n' + "```";
                    this.selLenStart = 5;
                    this.selLenEnd = 10;
                }

                //文本新增可编辑内容
                this.sourceArticle = this.beginPart + this.originText + this.endPart;
                this.autoSelect();
            }
        },
        //插入链接
        linkInsertComfirm : function(){
            if (this.originLink.indexOf("http://") > -1) {
                this.sourceArticle = this.beginPart + '[链接描述](' + this.originLink + ')' + this.endPart;
            }else {
                this.sourceArticle = this.beginPart + '[链接描述](http://' + this.originLink + ')' + this.endPart;
            }
            this.selLenStart = 1;
            this.selLenEnd = 5;
            this.popShow = false;
            this.autoSelect();
        },
        //插入图片
        picInsertComfirm : function(){
            if (!!!this.insertPicSizeOverflow && this.picAddress !== "") {
                this.sourceArticle = this.beginPart + '![图片描述]('+ this.picAddress +')' + this.endPart;;
                this.picAddress = "";
                this.popShow = false;
            }
        },
        //自动选中
        autoSelect : function(){
            this.$nextTick(() =>{
                //清除选中
                 window.getSelection().removeAllRanges();
                 //光标初始化
                this.dom.focus();
                this.selectStart = this.sourceArticle.length;
                //再次选中，截取文本总长度和添加字符串差值
                this.dom.setSelectionRange(this.reSelStart + this.selLenStart,this.reSelStart + this.selLenEnd);
            })
        },
        //提交确认
        submitConfirm : function(){
            this.popTipsOpts.state = false;
            this.submitJudge = false;
            if (this.articleTitle == "") {
                this.popTipsOpts.msg = "请填写标题";
            }else if(this.articleIntro == ""){
                this.popTipsOpts.msg = "请填写简介";
            }else if(this.sourceArticle.length < 20){
                this.popTipsOpts.msg = "文章不得小于20字";
            }else if(this.coverPicVal == ""){
                this.popTipsOpts.msg = "请上传封面图";
            }else if (this.coverPicSizeOverflow) {
                this.popTipsOpts.msg = "封面图大小超过1M";
            }else if (this.coverPicFalse){
                this.popTipsOpts.msg = "封面图格式错误";
            }else {
                this.popTipsOpts = {
                    state: true,
                    msg : "all good"
                }
                this.submitJudge = true;
            }
            //成功状态请求接口
            if (this.submitJudge) {
                //使用formdata传输数据，上传图片
                var data = new FormData(document.getElementById("fakeForm"));
                var mainTagChoose = $(".main_tags .tag_active").html();

                data.append('articleTitle', this.articleTitle);
                data.append('coverImg', this.coverPicVal);
                data.append('articleIntro', this.articleIntro);
                data.append('mainTag', mainTagChoose);

                $(".sub_tags .tag_active").each(function(index, el){
                    data.append('subTags' + index, $(el).html());
                })
                if (this.pushPicAry.length !== 0) {
                    $(this.pushPicAry).each(function(index, el) {
                        data.append('textPic' + index, el);
                    });
                }

                data.append('sourceArticle', this.sourceArticle);
                data.append('markedArticle', this.markedArticle);

                //附加文章创建时间戳
                data.append('timeStamp', new Date().getTime()/1000);

                //附加当前提交用户
                console.log(this.$store.state.user);
                data.append('thisUser', JSON.stringify(this.$store.state.user));

                if (this.isEdit) {
                    //附加当前提交用户
                    data.append('thisId', this._id);
                }

                //防止重复提交
                if (this.clickAble) {
                    this.$store.dispatch('getUserLogin').then(() => {
                        if (this.isEdit) {
                            this.$store.dispatch("editArticle", data);
                        }else {
                            this.$store.dispatch("createArticle", data);
                        }
                    }).catch((e) => {
                        console.log("create" ,e)
                        this.clickAble = true;
                        this.$store.commit('SHOW_MSG', {state : false,  msg: "请重新登录"})
                    });
                    this.clickAble = false;
                }
            }else {
                this.$store.commit('SHOW_MSG', this.popTipsOpts);
            }
        },
        //弹窗关闭
        popClose : function(){
            this.popShow = false;
        },
        sortNumber : function(a,b){
            return a - b
        },
        keysrt(key,desc) {
          return function(a,b){
            return desc ? (a[key] < b[key]) : (a[key] > b[key]);
          }
        },
        //封面图提示文字初始化
        picUpload : function(){
            this.coverPicUploadMsg = "*尺寸348x184，小于1M";
        },
        //主副标签切换控件
        swithMainTag : function(index){
            this.mainTagDefault = index;
            this.subDefaultTag = this.tags[index].subTags;
        },
        swithSubTag : function(index) {
            var _this = $(".sub_tags .tag_btn")[index],
                activeLen = $(".sub_tags .tag_active").length;
            if ($(_this).hasClass('tag_active')) {
                if (activeLen !== 1) {
                    $(_this).removeClass('tag_active');
                }
            }else {
                if ($(".sub_tags .tag_active").length == 3) {
                    this.popTipsOpts = {
                        state: false,
                        msg : "分类标签最多可选三个"
                    }
                    this.$store.commit('SHOW_MSG', this.popTipsOpts);
                }else {
                    $(_this).addClass('tag_active');
                }
            }
        },
    }
}
</script>
<style lang="sass">
.create_page {
    background: #fff;
    .login_layer {
        .insert_pic {
            top: 0;
            left: 0;
            opacity: 0;
            margin-top: 0;
        }
    }
}
.create_detail {
    // width: 1010px;
    // background: #fff;
    padding: 45px 0;
    padding-bottom: 90px;
    .create_tag {
        height: 40px;
        margin-bottom: 25px;
        font-size: 0;
        span, input, div {
            display: inline-block;
            vertical-align: middle;
        }
        .title_left {
            width: 75px;
            font-size: 18px;
            color: #333;
            text-align: left;
        }
        input {
            outline: none;
            margin: 0;
            padding: 0;
            border: 1px solid #999;
            width: 256px;
            height: 38px;
            font-size: 14px;
            padding: 0 10px;
        }
        .tips {
            font-size: 14px;
            color: red;
            vertical-align: bottom;
            margin-left: 15px;
        }
        .tag_btn {
            font-size: 16px;
            padding: 5px 10px 6px 10px;
            color: #999;
            margin-right: 5px;
            cursor: pointer;
        }
        .tag_btn:hover {
            color: #333;
        }
        .tag_active {
            color: #333;
            background: #ffe400;
        }
    }
    .submit_btn {
        width: 162px;
        height: 50px;
        line-height: 50px;
        cursor: pointer;
        background: #333;
        font-size: 18px;
        color: #ffe400;
        text-align: center;
        margin: 45px 0 10px 0;
    }
    .main_tags, .sub_tags, .my_tags {
        margin-bottom: 15px;
        .title_left {
            width: 94px;
        }
    }
    .my_tags {
        input {
            width: 152px;
            height: 32px;
            padding: 0 10px;
            margin-left: 10px;
        }
    }
    .pic_upload_msg {
        font-size: 12px;
        /* vertical-align: bottom; */
        color: #999;
        margin-left: 20px;
    }
    .btn_hover, .unclickable {
        width: 140px;
        height: 40px;
        line-height: 40px;
        color: #333;
        font-size: 16px;
        text-align: center;
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
        p,div {
            width: 100%;
            height: 100%;
            transition: all 0.2s cubic-bezier(0.47, -0.2, 0.82, 0.57);
        }
        .pa {
            top: 0;
            left: 0;
        }
        .upload {
            width: 100%;
            height: 100%;
            padding: 0;
            border: none;
            opacity: 0;
            top: 0;
            left: 0;
        }
    }
    .unclickable {
        background: #e6e6e6;
        color: #999;
        cursor: default;
    }
    // .btn_hover:hover {
    //     p {
    //         transform : translateX(-5px);
    //     }
    //     div {
    //         transform : translateX(5px);
    //     }
    // }
}
.create_content {
    width: 100%;
    border-top: 1px solid #999;
    border-bottom: 1px solid #999;
    border-right: 1px solid #999;
    margin-bottom: 25px;
    .write_zone, .watch_zone {
        width: 50%;
        margin-left: -1px;
        border-left: 1px solid #999;
        height: 400px;
        textarea, .watch_text{
            padding: 20px;
            color: #666;
            font-size: 16px;
            text-align: justify;
            width: 464px;
            height: 314px;
            border: none;
            outline: none;
            resize: none;
            line-height: 24px;
        }
        .watch_text {
            font-size: 14px;
        }
    }
    .watch_zone {
        .create_title {
            text-align: center;
        }
    }
    .create_title {
        height: 45px;
        line-height: 45px;
        border-bottom: 1px solid #999;
        background: #ffe400;
        span {
            display: inline-block;
            vertical-align: middle;
            width: 30px;
            height: 30px;
            margin-left: 10px;
            cursor: pointer;
        }
        .spot_line {
            width: 1px;
            height: 16px;
            margin-left: 10px;
        }
        .bold {
            margin: 0 -5px 0 20px;
            background: url(../images/edit_bolder.png) no-repeat center;
        }
        .italic {
            background: url(../images/edit_i.png) no-repeat center;
        }
        .link {
            background: url(../images/edit_link.png) no-repeat center;
        }
        .quote {
            background: url(../images/edit_title.png) no-repeat center;
        }
        .code {
            background: url(../images/edit_code.png) no-repeat center;
        }
        .image {
            background: url(../images/edit_img.png) no-repeat center;
        }
    }
    .create_btns {
        line-height: 42px;
    }
    .watch_text {
        overflow: auto;
    }
}


</style>