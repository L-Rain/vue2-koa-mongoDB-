<template>
    <div class="query">
        <div class="cover_bg">
            <div class="wrap">
                <div class="create_tag main_tags">
                    <span class="title_left">主题方向</span>
                    <span @click="swithMainTag(index)" class="tag_btn" v-for="(item, index) in tags" :class="{ tag_active : index == mainTagDefault }">{{item.mainTag}}</span>
                </div>
                <div class="create_tag sub_tags">
                    <span class="title_left">标签分类</span>
                        <span @click="swithSubTag(index)" class="sub_btns tag_btn" v-for="(item, index) in subDefaultTag" :class="{ tag_active : index == 0 }">{{item}}</span>
                </div>
            </div>
        </div>
        <div class="cards_zone">
            <template v-if="noData">
                <p class="wrap">筛选为空~</p>
            </template>
            <template v-else>
                <cards v-if="tempArr.length !== 0" :articleList="tempArr"></cards>
                <cards v-else :articleList="articleList"></cards>
            </template>
        </div>
    </div>
</template>

<script>
import cards from "./reusable/cards"
import timeTransform from '../dev/timeTransform'
export default {
    name : "query",
    // replace: false,
    data () {
        return {
            //标签选择关键词组
            tags : [
                {
                    mainTag : "全部",
                    subTags : ["全部"]
                },
                {
                    mainTag : "前端开发",
                    subTags : ["全部","JavaScript","Html5","CSS3","Node.js","AngularJS","React.JS","Vue.js","Sass/Less","WebView","前端工具"]
                },
                {
                    mainTag : "后端开发",
                    subTags : ["全部","PHP","Java","Python","C","C++","Go","C#","Ruby","MySQL", "MongoDB", "Oracle" ,"SQL Server"]
                },
                {
                    mainTag : "移动开发",
                    subTags : ["全部","Android", "iOS","Unity 3D","Cocos2d-x"]
                },
                {
                    mainTag : "视觉设计",
                    subTags : ["全部","Ps" ,"Ai", "Ae", "Flash", "Maya", "Premiere","ZBrush"]
                },
                {
                    mainTag : "运维/测试",
                    subTags : ["全部","测试","Linux"]
                },
                {
                    mainTag : "飙车圣地",
                    subTags : ["全部","wecut通知", "高速列车", "脑洞吐槽"]
                }
            ],
            mainTagDefault : 0,
            subDefaultTag : ["全部"],

            //数据显示
            tempArr : [],
            noData : false,
        }
    },
    methods : {
        //主副标签切换控件
        swithMainTag : function(index){
            $(".sub_btns").removeClass('tag_active');
            $($(".sub_btns")[0]).addClass('tag_active');
            this.mainTagDefault = index;
            this.subDefaultTag = this.tags[index].subTags;

            this.$nextTick(()=> {
                this.queryArr();
            })
        },
        swithSubTag : function(index) {
            var _this = $(".sub_btns")[index],
                activeLen = $(".sub_tags .tag_active").length;
            if (index !== 0) {
                $($(".sub_btns")[0]).removeClass("tag_active");
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
            }else {
                $(".sub_btns").removeClass('tag_active');
                $($(".sub_btns")[0]).addClass('tag_active');
            }
            this.$nextTick(()=> {
                this.queryArr();
            })
        },
        queryArr : function(){
            //获取主副选中标签
            let mainTag = $(".main_tags .tag_active").html();
            let subTag = [];
            $(".sub_tags .tag_active").each((index, el)=>{
                subTag.push($(el).html());
            })
            let mainTagArr = [],
                subTagArr = [];
            //获取主标签对应文章数组
            if (mainTag == "全部") {
                mainTagArr = this.articleList;
            }else {
                $(this.articleList).each((index, el)=>{
                    if (mainTag == el.mainTag)  {
                        mainTagArr.push(el);
                    }
                })
            }

            //获取副标签对应文章数组
            if (subTag[0] == "全部") {
                this.tempArr = mainTagArr;
            }else {
                $(subTag).each((count, dom) => {
                    $(mainTagArr).each((index, el)=>{
                        $(el.subTags).each((num, obj) => {
                            if (obj == dom) {
                                subTagArr.push(el);
                            }
                        })
                    })
                })
                this.tempArr = subTagArr;
            }

            if (this.tempArr.length == 0) {
                this.noData = true;
            }else {
                this.noData = false;
            }
        }
    },
    computed : {
        articleList(){
            return JSON.parse(JSON.stringify(this.$store.state.articles))
        },
    },
    mounted(){
        this.$store.dispatch('getALLArticle');
    },
    components : {
        cards
    },
}
</script>
<style lang="sass">
.query {
    .cover_bg {
        padding: 152px 0 32px 0;
        height: inherit;
        min-width: 1100px;
    }
    .cards_zone {
        min-height: 700px;
        padding: 60px 0;
    }
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
            color: #999;
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
            color: #fff;
        }
        .tag_active {
            color: #333;
            background: #ffe400;
        }
        .tag_active:hover {
            color: #333;
        }
    }
    .main_tags, .sub_tags, .my_tags {
        margin-bottom: 15px;
        .title_left {
            width: 94px;
        }
    }
}
</style>