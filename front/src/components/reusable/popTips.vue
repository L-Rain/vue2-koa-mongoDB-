<template>
    <div class="pop_tips">
        <i :class="{
            'popSuccess' : popIcon,
            'popFail' :  !popIcon,
        }"></i>
        <span>{{ popText }}</span>
    </div>
</template>

<script>
export default {
    created() {
        setTimeout(() => {
            this.$store.state.popComment.popShow = false;
        },1000)
    },
    computed : {
        popText() {
            return this.$store.state.popComment.popText
        },
        popIcon() {
            return this.$store.state.popComment.popIcon
        }
    }

}
</script>
<style lang="sass">
.pop_tips {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 6;
    // width: 240px;
    // margin-left: -120px;
    // margin-top: -40px;
    height: 80px;
    line-height: 80px;
    padding: 0 40px;
    text-align: center;
    background: #fff;
    font-size: 0;
    transform: translate(-50%,-50%);
    box-shadow: 0 4px 40px 0 rgba(0,0,0,.1);
    -webkit-box-shadow: 0 4px 40px 0 rgba(0,0,0,.1);
    i, span {
        display: inline-block;
        vertical-align: middle;
    }
    i {
        width: 44px;
        height: 44px;
        margin-right: 15px;
    }
    .popSuccess {
        background: url(../../images/icon_success.png) no-repeat center;
    }
    .popFail {
        background: url(../../images/icon_fail.png) no-repeat center;
    }
    span {
        font-size: 20px;
        color: #333;
    }
}
</style>