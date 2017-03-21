<template>
<div class="top_bar">
    <div class="head_tag yellow_bg"></div>
    <div class="head_zone black3">
        <div class="wrap clearfix">
            <div class="logo fl">
                <img src="../../images/logo.png">
                <p class="yellow_bg black1">闪现<span>·BLINK</span></p>
            </div>
            <div v-if="!!!loginJudge" class="login pr fr"  @click="popLogin">
            <span class="pa">登录</span>
                <div class="pa">
                    <i></i>
                </div>

            </div>
            <div v-else class="user_logined fr">
                <router-link :to="{ name: 'personal', params: { userId: thisUser._id }}">
                    <img :src="thisUser.userImg">
                </router-link>
            </div>
            <!-- <div class="search pr fr">
                <div class="pa"></div>
                <i class="pa"></i>
                <input class="pa" type="" name="">
            </div> -->
            <ul class="head_links clearfix fr">
                <li class="fl">
                    <span><router-link to="/index">首页</router-link></span>
                    <i class="spot_line"></i>
                </li>
                <li class="fl">
                    <span><router-link to="/query">分类索引</router-link></span>
                    <i class="spot_line"></i>
                </li>
                <li class="fl">
                    <span v-if="loginJudge"><router-link to="/create">创建手记</router-link></span>
                    <span @click="loginTip" v-else>创建手记</span>
                </li>
            </ul>

        </div>
    </div>
</div>
</template>

<script>
export default {
    computed: {
        loginJudge() {
          return this.$store.state.loginJudge
        },
        thisUser (){
            return this.$store.state.user
        }
    },
    methods : {
        popLogin : function(){
            this.$store.state.popLogin = true;
        },
        loginTip : function(){
            this.$store.state.popComment = {
              popShow : true,
              popIcon : false,
              popText : "请登录",
            };
        }
    },
    mounted (){
        this.$store.dispatch('getUserLogin').then(() => {

        }).catch((e) => {
            console.log("top_bar" ,e)
        });
    }
}
</script>
<style lang="sass">
.top_bar {
    position: absolute;
    z-index: 3;
    width: 100%;
    top: 0;
    left: 0;
}
.head_tag {
    width: 100%;
    height: 7px;
}
.head_zone {
    width: 100%;
    height: 87px;
    background: #fff;
    font-size: 0;
    .logo {
        width: 90px;
        text-align: center;
        img {
            display: inline-block;
            width: 70%;
            margin: 10px 0 6px 0;;
        }
        p {
            font-size: 14px;
            height: 23px;
            line-height: 23px;
            width: 100%;
            span {
                display: inline-block;
                vertical-align: -1px;
            }
            // padding: 5px 7px;
        }
    }
    .head_links {
        height: 87px;
        line-height: 87px;
        margin-right: 200px;
        span {
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;
            padding: 0 35px;
            font-size: 18px;
            text-align: center;
            position: relative;
        }
        a {
            color: #999;
        }
        span:after {
            content: "";
            display: block;
            position: absolute;
            left: 50%;
            right: 50%;
            bottom: -2px;
            height: 4px;
            opacity: 0;
            background: #ffe400;
            transition: all 0.3s ease-out;
        }
        span:hover:after {
            left: 0;
            right: 0;
            opacity: 1;
        }
    }
    .search, .login {
        margin-top: 28px;
        cursor: pointer;
    }
    .search {
        // transition: 0.4s all ease-out;
        width: 180px;
        height: 32px;
        div {
            transition: 0.3s all ease-out;
            right: 0;
            top: 0;
            width: 29px;
            height: 29px;
            border-radius: 29px;
            border: 1px solid #cacaca;
            margin-left: -2px;
        }
        i{
            display: inline-block;
            vertical-align: middle;
            right: 0;
            top: 0;
            width: 31px;
            height: 31px;
            background: url(../../images/icon_search.png) no-repeat center;
        }
        input {
            opacity: 0;
            transition: 0.3s all ease-out;
            top: 1px;
            right: 25px;
            // animation: searchOut 0.4s both;
            height: 25px;
            display: inline-block;
            vertical-align: middle;
            outline: none;
            border: none;
            font-size: 16px;
            width: 130px;
        }
    }
    .search:hover {
        div {
            width: 180px;
            right: 0;
        }
        input {
            opacity: 1;
            right: 35px;
            z-index: 3;
        }
    }
    .login {
        margin-left: 5px;
        width: 75px;
        height: 32px;
        div {
            transition: 0.3s all ease-out;
            right: 0;
            top: 0;
            width: 29px;
            height: 29px;
            border-radius: 29px;
            border: 1px solid #cacaca;
            margin-left: -2px;
        }
        i {
            display: inline-block;
            vertical-align: middle;
            width: 29px;
            height: 29px;
            background: url(../../images/icon_add.png) no-repeat center;
        }
        span {
            transition: 0.4s all ease-out;
            display: inline-block;
            vertical-align: middle;
            font-size: 16px;
            opacity: 0;
            top: 4px;
            left: 28px;
        }
    }
    .login:hover {
        div {
            width: 75px;
        }
        span {
            opacity: 1;
        }
    }
    .user_logined {
        height: 87px;
        line-height: 87px;
        font-size: 0;
        img {
            width: 50px;
            height: 50px;
            border-radius: 50px;
            margin: 18px 0 0 10px;
        }
    }
}

</style>