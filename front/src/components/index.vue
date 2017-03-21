<template>
    <div class="index">
        <!-- <div @click="deleteAll" style="position: fixed;top: 50px;left:30px;width: 200px;height: 80px;color: #fff;background:#000;text-align: center; z-index: 5;line-height:80px;font-size: 16px;">删除全部</div> -->
        <div class="banner pr" :style="{backgroundImage:'url(' + banner + ')'}">
            <!-- <img :src="banner"> -->
            <div class="middle_content pa">
                <div class="wrap pa yellow_bg clearfix">
                    <router-link :to="{ name: 'article', params: { articleId: articles[0]._id }}">
                        <div class="middle_img pa">
                            <img :src="articles[0].coverImg">
                            <div class="img_cover pa">
                                <div class="kkk"></div>
                                <div class="text_content">
                                    <h2>最新动态</h2>
                                    <div class="yellow_bg"></div>
                                    <h4>{{coverTime}}</h4>
                                </div>
                            </div>
                        </div>
                    </router-link>
                    <div class="middle_text fr">
                        <div class="kkk"></div>
                        <div class="text clearfix">
                            <p><i></i><span>{{articles[0].articleTitle}}</span></p>
                            <p class="main_text">{{coverText}}</p>
                            <div class="spot fr"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="index_list">
            <cards :articleList="articleList"></cards>
        </div>
    </div>
</template>

<script>
import cards from "./reusable/cards";
import banner from "../images/banner.jpg";
export default {
    name : "index",
    // replace: false,
    data () {
        return {
            banner : banner,
            coverTime : "",
        }
    },
    watch : {
        articles(){
            var thisTime = new Date(parseInt(this.articles[0].timeStamp) * 1000);
            var thiMonth = thisTime.getMonth(),
                thisDay = thisTime.getDay();
            switch (thiMonth) {
                case '1':
                this.coverTime = "Jan." + thisDay
                break
                case '2':
                this.coverTime = "Feb." + thisDay
                break
                case '3':
                this.coverTime = "Mar." + thisDay
                break
                case '4':
                this.coverTime = "Apr." + thisDay
                break
                case '5':
                this.coverTime = "May." + thisDay
                break
                case '6':
                this.coverTime = "Jun." + thisDay
                break
                case '7':
                this.coverTime = "Jul." + thisDay
                break
                case '8':
                this.coverTime = "Aug." + thisDay
                break
                case '9':
                this.coverTime = "Sept." + thisDay
                break
                case '10':
                this.coverTime = "Oct." + thisDay
                break
                case '11':
                this.coverTime = "Nov." + thisDay
                break
                case '12':
                this.coverTime = "Dec." + thisDay
                break
            }
        }
    },
    components : {
        cards
    },
    computed : {
        articles(){
            return this.$store.state.articles
        },
        articleList(){
            return this.$store.state.articles.slice(1)
        },
        coverText(){
            return $(this.$store.state.articles[0].markedArticle).text()
        }
    },
    mounted(){
        this.$store.dispatch('getALLArticle');
    },
    methods : {
        deleteAll(){
            this.$store.dispatch('deleteAll');
        }
    }
}
</script>
<style lang="sass">
.banner {
    height: 784px;
    background: no-repeat center;
    background-size: cover;
    font-size: 0;
    .middle_content {
        bottom: 0;
        left: 0;
        height: 200px;
        width: 100%;
        background: rgba(27,26,21,0.96);
        .wrap {
            height: 316px;
            bottom: 0;
            left: 50%;
            margin-left: -550px;
        }
        .middle_img {
            width: 550px;
            height: 320px;
            font-size: 0;
            // margin: -53px 0 0 28px;
            bottom: 28px;
            left: 28px;
            background: #333;
        }
        img {
            width: 100%;
            height: 100%;
        }
    }
    .img_cover {
        width: 100%;
        height: 100%;
        bottom: 0;
        left: 0;
        text-align: center;
        background: rgba(0,0,0,0.7);
        .text_content {
            display: inline-block;
            vertical-align: middle;
            text-align: center;
            h2 {
                font-size: 24px;
                color: #fff;
                font-weight: normal;
            }
            div {
                height: 5px;
                width: 126px;
                margin: 20px 0;
            }
            h4 {
                font-size: 18px;
                color: #727272;
                font-weight: normal;
            }
        }
    }
    .middle_text {
        padding: 0 55px;
        width: 412px;
        height: 100%;
        .text {
            display: inline-block;
            vertical-align: middle;
        }
        i,span {
            display: inline-block;
            vertical-align: middle;
        }
        span {
            max-width: 360px;
            font-size: 36px;
            color: #333;
            vertical-align: -15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        p {
            font-size: 16px;
            color: #666;
        }
        .main_text {
            margin: 20px 0 10px 0;
        }
        .fr {
            width: 46px;
            height: 40px;
            background: url(../images/icon_attract.png) no-repeat center;
            transform: rotateZ(180deg);
        }
        i {
            width: 46px;
            height: 40px;
            margin-right: 5px;
            background: url(../images/icon_attract.png) no-repeat center;
        }
        .main_text{
            display: -webkit-box!important;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 6;
            text-align: justify;
        }
    }
}
.index_list {
    padding: 60px 0;
}
//common sass
.kkk {
    width: 0;
    height: 100%;
    display: inline-block;
    vertical-align: middle;
}
.wrap {
    width: 1100px;
    margin: 0 auto;
}
.yellow {
    color : #ffe400;
}
.yellow_bg {
    background: #ffe400;
}
.black_bg {
    color: #333;
}
.black1 {
    color : #333;
}
.black2 {
    color : #666;
}
.black3 {
    color : #999;
}
.cover_bg {
    width: 100%;
    height: 294px;
    background: #333;
}
.cover_fixed {
    margin-top: -100px;
    h1 {
            font-size: 40px;
    font-weight: normal;
    margin-top: 27px;
    padding-bottom: 15px;
    border-bottom: 6px solid #ffe400;
    max-width: 720px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    }
}
.spot_line {
    display: inline-block;
    vertical-align: middle;
    width: 1px;
    height: 16px;
    background: #cacaca;
}
.article_page, .my_articles {
    .user {
        font-size: 0;
        width: 280px;
        text-align: center;
        background: #f6f6f5;
        margin-top: 40px;
        padding: 30px 0 20px 0;
        img, span {
            display: inline-block;
            vertical-align: middle;
        }
        img {
            width: 80px;
            height: 80px;
            border-radius: 80px;
            background : #ffe400;
        }
        span {
            margin-left: 15px;
        }
        .user_name {
            font-size: 24px;
            color: #333;
            margin: 10px auto 20px auto;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .line {
            vertical-align: 1px;
            margin: 0 10px;
        }
        .time, .tag {
            font-size: 12px;
            color: #999;
        }
        .tag {
            font-size: 14px;
            margin: 10px 0 20px 0;
        }
        .sub_tags {
            padding: 0 5px;
            span {
                font-size:12px;
                padding: 3px 10px;
                margin:0 5px;
                background: #ffe400;
                color: #666;
                margin-bottom: 10px;
            }
        }
    }
}







.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease-out;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}

.markdown_body, .article_detail {
  h1, h2, h3, h4, strong {
    font-weight: 600;
    color: #333;
  }
  p {
    margin: 0 0 20px 0;
  }
  img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
    border-radius: 2px;
  }
  a {
    color: #08c;
    // font-weight: 600;
  }
  code, pre {
    font-family: 'Roboto Mono', Monaco, courier, monospace;
    font-size: 14px;
    background-color: #f8f8f8;
    -webkit-font-smoothing: initial;
  }
  pre {
    box-shadow: 0 0 2px #ccc;
    margin-bottom: 20px;
  }
  code {
    position: relative;
    box-sizing: border-box;
    padding: 17.5px;
    max-height: 500px;
    &:after {
      content: attr(data-language);
      position: absolute;
      top: 0;
      right: 0;
      color: #ccc;
      text-align: right;
      font-size: 14px;
      padding: 5px 10px 0;
      line-height: 15px;
      height: 15px;
      font-weight: 600;
    }
  }
  blockquote {
    text-indent: 0;
    padding: 10.5px 21px;
    background-color: #f5f5f5;
    border-left: 4px solid #ccc;
    color: #333;
    font-size: 17.5px;
    margin: 35px 0;
  }
  ul,ol {
    display: block;
    list-style-type: disc;
    padding-left: 25px;
  }
}
.hljs-comment,
.hljs-quote {
    color: #8e908c;
}

.hljs-variable,
.hljs-template-variable,
.hljs-tag,
.hljs-name,
.hljs-selector-id,
.hljs-selector-class,
.hljs-regexp,
.hljs-deletion {
    color: #c82829;
}

.hljs-number,
.hljs-built_in,
.hljs-builtin-name,
.hljs-literal,
.hljs-type,
.hljs-params,
.hljs-meta,
.hljs-link {
    color: #f5871f;
}

.hljs-attribute {
    color: #eab700;
}

.hljs-string,
.hljs-symbol,
.hljs-bullet,
.hljs-addition {
    color: #718c00;
}

.hljs-title,
.hljs-section {
    color: #4271ae;
}

.hljs-keyword,
.hljs-selector-tag {
    color: #8959a8;
}

.hljs {
    display: block;
    overflow-x: auto;
    background: white;
    color: #4d4d4c;
    padding: 8.75px;
}

.hljs-emphasis {
    font-style: italic;
}

.hljs-strong {
    font-weight: bold;
}
</style>