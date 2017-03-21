<template>
	<div>
		<topbar></topbar>
		<router-view></router-view>
	   <bottomBar></bottomBar>
	   <transition name="fade">
	   	 <login v-if="popLogin"></login>
	   </transition>
		<transition name="fade">
	   	 <popTips v-if="popShow"></popTips>
	   </transition>
   </div>
</template>
<script>
import store from './store'
import topbar from "./components/reusable/topBar";
import login from "./components/reusable/login";
import bottomBar from "./components/reusable/bottomBar";
import popTips from "./components/reusable/popTips";
export default {
	data () {
	    return {
	    	// popLogin : false,
	    }
	},
	components : {
	    topbar, bottomBar, login, popTips
	},
    store,
    computed : {
    	popLogin (){
    		return this.$store.state.popLogin
    	},
    	popShow() {
    		return this.$store.state.popComment.popShow
    	}
    }

}
</script>