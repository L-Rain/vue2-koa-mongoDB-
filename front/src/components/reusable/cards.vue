<template>
<div class="wrap">
    <ul class="cards_layer clearfix">
        <li class="cards"  v-for="(item,index) in articleList">
            <router-link :to="{ name: 'article', params: { articleId: item._id }}">
                <img class="card_banner" :src="item.coverImg">
                <div class="text_content">
                    <h2>{{item.articleTitle}}</h2>
                    <p>{{item.articleIntro}}</p>
                    <div class="user_zone">
                        <template v-if="item.thisUser">
                            <router-link :to="{ name: 'personal', params: { userId: item.thisUser._id }}"><img :src="item.thisUser.userImg">
                            <h3>{{item.thisUser.userNikeName}}</h3>
                            </router-link>
                        </template>
                        <template v-else>
                            <img src="../../images/user.png">
                            <h3>LRain</h3>
                        </template>
                        <span>{{item.mainTag}}<span class="line">|</span>{{timeHandle(item.timeStamp)}}</span>
                    </div>
                    <div class="tags_zone">
                        <span  v-for="stuff in item.subTags">{{stuff}}</span>
                    </div>
                </div>
            </router-link>
        </li>
    </ul>
</div>
</template>

<script>
import timeTransform from '../../dev/timeTransform'
export default {
    props : ["articleList"],
    methods : {
        timeHandle(timestamp){
            return timeTransform(timestamp);
        }
    }
}
</script>
<style lang="sass">
.cards_layer {
    margin: 0 -28px -28px 0;
}
.cards {
    transition: 0.2s box-shadow ease-out;
    width: 348px;
    height: 348px;
    float: left;
    margin: 0 28px 28px 0;
    font-size: 0;
    position: relative;
    overflow: hidden;
    .card_banner {
        width: 100%;
        height: 184px;
    }
    .text_content {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 0 28px;
        width: 292px;
        height: 210px;
        background: #fff;
        transition: 0.2s transform ease-out;
        transform: translateY(43px);
        h2, p{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        h2 {
            font-size: 24px;
            color: #333;
            font-weight: 100;
            margin: 22px 0 5px 0;
        }
        p {
            font-size: 14px;
            color: #999;
        }
    }
    .user_zone {
        margin: 20px 0;
        img, h3, span {
            display: inline-block;
            vertical-align: middle;
        }
        img {
            width: 50px;
            height: 50px;
            border-radius: 50px;
        }
        h3 {
            font-size: 18px;
            margin: 0 10px;
            color: #333;
            font-weight: 100;
        }
        span {
            font-size: 12px;
            color: #999;
        }
        .line {
            margin: 0 5px;
            vertical-align: 0;
        }
    }
    .tags_zone {
        span {
            display: inline-block;
            vertical-align: middle;
            font-size: 12px;
            padding: 3px 10px;
            margin-right: 10px;
            background: #ffe400;
            color: #666;
        }
    }
}
.cards:hover {
    box-shadow: 0 4px 40px 0 rgba(0,0,0,.1);
    -webkit-box-shadow: 0 4px 40px 0 rgba(0,0,0,.1);
    .text_content {
        transform: translateY(0);
    }
}

</style>