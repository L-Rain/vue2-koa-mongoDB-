<template>
<div class="pop_page">
    <div class="login_layer">
        <div class="login_title clearfix">
            <span :class="{ active : isActive }" @click="loginChange">登录</span>
            <span :class="{ active : !isActive }" @click="registerChange">注册</span>
            <i class="fr" @click="popClose"></i>
        </div>
        <template v-if="isActive">
            <input class="user_name" placeholder="账号" type="text" name="" v-model="userName" >
            <input class="user_password" placeholder="密码" type="password" name="" v-model="userPassword">
        </template>
        <template v-else>
            <form v-if="!isActive" id="form" class="pr" name="fileForm"  method="post" enctype="multipart/form-data">
                <input id="input" class="pa" type="file" name="fileUpload" @click="onClick" @change="onChange">
                <input class="user_name" placeholder="账号" type="text" name="userName" v-model="userName" autocomplete="off">
                <input class="user_password" placeholder="密码" type="password" name="userPassword" autocomplete="off" v-model="userPassword">
                <input class="user_name" placeholder="昵称" type="text" name="userNickName" autocomplete="off" v-model="userNickName">
                <div class="clearfix">
                    <div class="clik_zone fl">上传头像</div>
                    <div class="upload_text fl">{{loginText}}</div>
                </div>

            </form>
        </template>

        <div class="login_btn" @click="loginRegister">{{ loginBtn }}</div>
    </div>
</div>
</template>

<script>
export default {
    data(){
        return {
            isActive : true,
            loginBtn : "登录",
            userName : "",
            userPassword : "",
            userImg : "",
            userNickName : "",
            loginText : "*请上传不大于1M的图片",
            submitJudge : false,
            popTipsOpts : {
                state: false,
                msg : "图片格式错误"
            },
            picVal : "",
            picSizeOverflow : false,
            picFalse : false,
        }
    },
    methods : {
        loginChange : function(){
            if (!this.isActive) {
                this.isActive = true;
                this.loginBtn = "登录";
            }
        },
        registerChange : function(){
            if (this.isActive) {
                this.isActive = false;
                this.loginBtn = "注册";
            }
        },
        popClose : function(){
            this.$store.state.popLogin = false;
        },
        onClick : function(){
            this.loginText = "*请上传不大于1M的图片";
        },
        onChange :function(){
            var thisFile = $("#input")[0].files[0];
            if (thisFile) {
                if(thisFile.type.indexOf('image') == -1){
                    this.picFalse = true;
                }else if (thisFile.size/1024 > 1000) {
                    this.picSizeOverflow = true;
                }else {
                    this.picVal = thisFile;
                    this.loginText = "上传成功";
                }
            }
        },
        loginRegister : function(){
            this.submitJudge = false;
            if (this.loginBtn == "注册") {
                if (this.userName == "") {
                    this.popTipsOpts.msg = "用户名为空";
                }else if(this.userPassword == "") {
                    this.popTipsOpts.msg = "密码为空";
                }else if(this.userNickName == "") {
                    this.popTipsOpts.msg = "昵称为空";
                }else if(this.picVal == ""){
                    this.popTipsOpts.msg = "请上传头像";
                }else if(this.picFalse){
                    this.popTipsOpts.msg = "图片格式有误";
                }else if(this.picSizeOverflow){
                    this.popTipsOpts.msg = "图片大小超出1M";
                }else {
                    this.submitJudge = true;
                }

                if (this.submitJudge) {
                    //formdota属于h5新内容，new空对象后可append("user", xx)添加参数也可直接添加form表单内容添加数据
                    var data = new FormData(document.getElementById("form"));
                    //一定要加emulateJSON: true参数才可正确提交formData
                     //提交给后台formdata数据，form一定要带name参数
                    this.$store.dispatch("userRegister", data)
                }else {
                    this.$store.commit('SHOW_MSG', this.popTipsOpts);
                }
            }else if(this.loginBtn == "登录") {
                if (this.userName == "") {
                    this.popTipsOpts.msg = "用户名为空";
                }else if(this.userPassword == "") {
                    this.popTipsOpts.msg = "密码为空";
                }else {
                    this.submitJudge = true;
                }
                if (this.submitJudge) {
                    this.$store.dispatch("userLogin", {
                        userName : this.userName,
                        userPassword : this.userPassword,
                    })
                }else {
                    this.$store.commit('SHOW_MSG', this.popTipsOpts);
                }
            }
        }
    }
}
</script>
<style lang="sass">
.pop_page {
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    .login_layer {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 300px;
        padding: 10px 20px;
        margin-left: -170px;
        margin-top: -140px;
        background: #fff;
        input {
            display: block;
            height: 30px;
            width: 286px;
            padding: 5px;
            margin-top: 20px;
            outline: none;
        }
    }
    .login_title {
        font-size: 16px;
        color: #999;
        border-bottom: 1px solid #333;
        span, i {
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;
        }
        span {
            padding: 10px 20px;
        }
        span:hover {
            color: #333;
        }
        span.active:hover {
            color: #ffe400;
        }
        .active {
            color: #ffe400;
            background: #333;
        }
        i {
            width: 20px;
            height: 20px;
            margin-top: 10px;
            background: url(../../images/shutdown_btn.png) no-repeat center;
        }
    }
    .login_btn, .upload_head {
        width: 100%;
        height: 50px;
        margin: 20px 0;
        line-height: 50px;
        text-align: center;
        background: #333;
        color: #ffe400;
    }
    .login_btn {
        cursor: pointer;
    }
    form {
        color: #333;
        .clearfix {
            margin-top: 20px;
        }
        .clik_zone {
            width: 150px;
            height: 50px;
            line-height: 50px;
            background: #ffe400;
            text-align: center;
        }
        .upload_text {
            font-size: 12px;
            color: #999;
            margin-top: 16px;
            margin-left: 10px;
        }
        #input {
            width: 150px;
            height: 50px;
            margin-top: 0;
            padding: 0;
            bottom: 0;
            left: 0;
            opacity: 0;
        }
    }
}

</style>