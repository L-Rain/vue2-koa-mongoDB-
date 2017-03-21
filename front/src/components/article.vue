<template>
    <div class="article_page clearfix">
        <div class="cover_bg"></div>
        <div class="cover_fixed wrap clearfix">
            <h1 class="yellow fl">{{thisArticle.articleTitle}}</h1>
        </div>
        <div style="background: #fff">
            <div class="wrap clearfix">
                <div class="user fr">
                    <div>
                    <router-link :to="{ name: 'personal', params: { userId: thisArticle.thisUser._id }}"><img :src="thisArticle.thisUser.userImg">
                    </router-link>
                    </div>
                    <p class="user_name">{{thisArticle.thisUser.userNickName}}</p>
                    <p class="time">{{timeHandle(thisArticle.timeStamp)}}</p>
                    <p class="tag">{{thisArticle.mainTag}}</p>
                    <p class="sub_tags">
                        <span v-for="item in thisArticle.subTags">{{item}}</span>
                    </p>
                </div>
                <div class="article_detail" v-html="thisArticleMarkedArticle">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import highlight from 'highlight.js'
import timeTransform from '../dev/timeTransform'
export default {
    name : "article",
    // replace: false,
    data () {
        return {

        }
    },
    watch : {
        thisArticleMarkedArticle(){
            var self = this;
            this.renderMarkedText();
        }
    },
    methods : {
        //highlight高亮代码块
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
            $('.article_detail a').attr('target', '_blank');
        },
        renderMarkedText : function(){
            var self = this;
            this.$nextTick(function(){
                self.updateMarkedStyle();
                $(".article_detail img").each(function(index, el){
                    $(el).attr('src', self.thisArticle.articleImgs[index])
                })
            })
        },
        timeHandle(timestamp){
            return timeTransform(timestamp);
        }
    },
    computed : {
        thisArticle(){
            return this.$store.state.article
        },
        thisArticleMarkedArticle(){
            return this.thisArticle.markedArticle
        }
    },
    mounted(){
        let articleId = this.$route.params.articleId;
        this.$store.dispatch('getArticleById', articleId).then(() => {

        }).catch((e) => {
            this.$store.commit('SHOW_MSG', e.body);
            setTimeout(function(){
                location.href = "/#/index";
            },800)
        });
        if (this.thisArticleMarkedArticle !== "") {
            this.renderMarkedText();
        }
    },
    beforeDestroy(){
        this.$store.state.article = {
            articleTitle: "",
            articleIntro: "",
            mainTag: "前端开发",
            subTags: ["Node.js"],
            sourceArticle: "",
            markedArticle: "",
            coverImg: "",
            articleImgs: [],
            thisUser : {
              _id : "",
              userName : "",
              userImg : "",
            }
        }
    }
}
</script>
<style lang="sass">
.article_page {
    .article_detail {
        min-height: 800px;
        width: 720px;
        padding: 40px 0;
        p {
            font-size: 16px;
            line-height: 24px;
            color: #666;
            margin-bottom: 30px;
            text-align: justify;
        }
        .img {
            font-size: 0;
            text-align: center;
        }
    }
}

</style>