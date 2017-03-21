<template>
<div class="my_articles">
    <div class="cover_bg"></div>
    <div class="cover_fixed wrap clearfix"><h1 class="yellow fl">个人主页</h1></div>
    <template v-if="dataList[0].markedArticle == ''">
        <div class="nothing_word wrap">
            <p>这个人太懒，什么都没写过~</p>
        </div>
    </template>
    <template v-else>
        <div style="padding: 20px 0 40px 0;" class="wrap clearfix">
            <template v-if="articlesBySubTag !== '' ">
                <ul class="article_list fl">
                    <li v-for="item in articlesBySubTag">
                        <h2><router-link :to="{ name: 'article', params: { articleId: item._id }}">{{item.articleTitle}}</router-link></h2>
                        <h3>{{item.articleIntro}}</h3>
                        <p>{{item.markedArticle}}</p>
                        <div v-if="theUser" class="edit_icons clearfix">
                            <div @click="editArticle(item._id)" class="fr"><i class="icon_edit"></i><span>编辑</span></div>
                            <div @click="deleteArticle(item._id, articlesBySubTag)" class="fr"><i class="icon_delete"></i><span>删除</span></div>
                        </div>
                    </li>
                </ul>
            </template>
            <template v-else>
                <ul class="article_list fl">
                    <li v-for="item in articleList">
                        <h2><router-link :to="{ name: 'article', params: { articleId: item._id }}">{{item.articleTitle}}</router-link></h2>
                        <h3>{{item.articleIntro}}</h3>
                        <p>{{item.markedArticle}}</p>
                        <div v-if="theUser" class="edit_icons clearfix">
                            <div @click="editArticle(item._id)" class="fr"><i class="icon_edit"></i><span>编辑</span></div>
                            <div @click="deleteArticle(item._id, articleList)" class="fr"><i class="icon_delete"></i><span>删除</span></div>
                        </div>
                    </li>
                </ul>
            </template>
            <div class="user fr">
                <div><img :src="dataList[0].thisUser.userImg"></div>
                <p class="user_name">{{dataList[0].thisUser.userNickName}}</p>
                <p class="tag">手记总数: {{dataList.length}}</p>
                <p class="sub_tags">
                    <span v-for="item in tagList" @click="swichArticles(item)">{{item[0].mainTag}}({{item.length}})</span>
                </p>
            </div>
        </div>
    </template>
    <transition name="fade">
        <template v-if="popShow">
            <div class="pop_page">
            <div class="login_layer">
                <div class="login_title clearfix">
                    <span class="active">删除文章</span>
                    <i class="fr" @click="popClose"></i>
                </div>
                <div class="confirm_text">确定删除此文章吗?</div>
                <div class="login_btn" @click="deleteComfirm">确认删除</div>
            </div>
            </div>
        </template>
    </transition>
</div>

</template>

<script>
export default {
    name : "personal",
    // replace: false,
    data () {
        return {
            thisUserId : "",
            articlesBySubTag : "",
            thisArticle : "",
            popShow : false,
            thisArticleId : "",
            thisArticleArry : [],
        }
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route': 'getData'
    },
    computed: {
        dataList(){
            return JSON.parse(JSON.stringify(this.$store.state.userArticles));
        },
        articleList(){
            let thisUserArticles = this.dataList;
            let thisMarkedText,
                markedJudge = thisUserArticles[0].markedArticle;
            if (markedJudge !== "" && $(markedJudge).text()) {
                $(thisUserArticles).each(function(index, el){
                    thisMarkedText = $(el.markedArticle).text();
                    if (thisMarkedText.length > 280) {
                        el.markedArticle = thisMarkedText.substr(0,280) + "...";
                    }else {
                        el.markedArticle = thisMarkedText;
                    }
                })
            }
            return thisUserArticles
        },
        tagList(){
            let arry = [];
            //将vue观察对象转为数组（非绑定）
            arry = this.dataList;
            //根据mainTag对应键值返回相同元素紧靠排列数组
            arry.sort(this.keysrt('mainTag',true));
            //使相邻重复元素组为数组
            let newArr = [],
                tempArr = [];
            for(let i=0,j=arry.length;i<j;i++){
                if ( i + 1 == j) {
                    tempArr.push(arry[i]);
                    newArr.push(tempArr.slice(0));
                    break;
                }
                if(arry[i].mainTag == arry[i+1].mainTag){
                    tempArr.push(arry[i]);
                } else {
                    tempArr.push(arry[i]);
                    newArr.push(tempArr.slice(0));
                    tempArr.length = 0;
                }
            }
            //返回依据数组长度降序排序数组元素的数组
            return newArr.sort(this.sortArry);
        },
        theUser(){
            //登录用户与个人主页用户id一致则可操作修改
            if (this.$route.params.userId == this.$store.state.user._id) {
                return true;
            }else {
                return false;
            }
        },
    },
    mounted (){
        this.getData();
    },
    methods : {
        getData(){
            this.thisUserId = this.$route.params.userId;
            this.$store.dispatch('getArticlesByUser', this.thisUserId);
        },
        keysrt(key,desc) {
          return function(a,b){
            return desc ? (a[key] < b[key]) : (a[key] > b[key]);
          }
        },
        sortNumber(a,b){
            if (a > b)
                return -1;  //返回一个小于0 的数即可
            else
                return 1;
        },
        sortArry(a, b) { return b.length - a.length },
        swichArticles(item){
            this.articlesBySubTag = item;
        },
        editArticle(id){
            this.$store.dispatch('getUserLogin').then(() => {
                this.$router.push({ name: 'edit', params: { articleId: id }})
            }).catch((e) => {
                console.log("personal" ,e)
                this.$store.commit('SHOW_MSG', {state : false,  msg: "请重新登录"})
            });

        },
        deleteArticle(id, ary){
            this.thisArticleId = id;
            this.thisArticleArry = ary;
            this.popShow = true;
        },
        //弹窗关闭
        popClose(){
            this.popShow = false;
        },
        deleteComfirm(){
            let self = this;
            console.log("1, " + JSON.stringify(self.thisArticleArry));
            this.$store.dispatch('getUserLogin').then(() => {
                this.$store.dispatch('deleteArticle', this.thisArticleId).then(()=>{
                    // $(self.thisArticleArry).each(function(index, el){
                    //     if (el._id == self.thisArticleId) {
                    //         self.thisArticleArry.splice(index, 1);
                    //         console.log("2, " + JSON.stringify(self.thisArticleArry));
                    //     }
                    // })
                    self.popShow = false;
                    setTimeout(function(){
                        window.location.reload();
                    },500)
                });
            }).catch((e) => {
                console.log("delete" ,e)
                this.$store.commit('SHOW_MSG', {state : false,  msg: "请重新登录"})
            });
        }
    }
}
</script>
<style lang="sass">
.my_articles {
    background: #fff;
    .login_layer {
        .confirm_text {
           color: #666;
           padding: 40px 0 20px 0;
           text-align: center;
        }
    }
    h2 {
        font-size: 20px;
        color: #333;
        padding: 30px 0 20px 0;
        a {
            color: #333;
        }
    }
    h3 {
        font-size: 16px;
        color: #999;
        font-weight: normal;
        margin-bottom: 20px;
    }
    .sub_tags {
        span {
            cursor: pointer;
        }
    }
    .nothing_word {
        padding-top: 40px;
        min-height: 800px;
        p {
            font-size: 24px;
            color: #999;
        }
    }
    .article_list {
        width: 720px;
        min-height: 800px;
        overflow: hidden;
        p {
            line-height: 24px;
            color: #666;
            font-size: 16px;
            padding-bottom: 20px;
        }
        li {
            width: 100%;
            border-bottom: 1px solid #edf1f2;
        }
    }
    .edit_icons {
        padding-bottom:20px;
        font-size: 12px;
        color: #999;
        .fr {
            margin-left: 20px;
            cursor: pointer;
            &:hover {
                color: #666;
                i {
                    opacity: 0.6;
                }
            }
        }
        span, i {
            display: inline-block;
            vertical-align: middle;
        }
        .icon_edit, .icon_delete {
            width: 21px;
            height: 19px;
            margin-right: 5px;
            vertical-align: -6.5px;
            opacity: 0.3;
        }
        .icon_edit {
            background: url(../images/icon_edit.png);
        }
        .icon_delete {
            margin-right: 3px;
            background: url(../images/icon_delete.png);
        }
    }
}


</style>