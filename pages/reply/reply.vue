<template>
	<view class="reply">
		<view class="top">
			<comment-item :item="replyItem"></comment-item>
		</view>
		<view class="list" v-for="item in childReply" :key="item._id">
			<comment-item  @removeEnv="commentEnv" :childState="true" :closeBtn="true" :item="item"></comment-item>
		</view>
		<comment-frame @commentEnv="commentEnv" :commentObj="commentObj" :placeholder="`回复: ${giveName(replyItem)}`"></comment-frame>
	</view>
</template>

<script>
	import {giveName} from "@/utils/tools.js"
	const db = uniCloud.database();
	export default {
		data() {
			return {
				replyItem:null,
				commentObj:{
					article_id:'',
					comment_type:1,
					reply_user_id:"",
					reply_comment_id:""
				},
				childReply:[]
			};
		},
		onLoad(e) {
			let replyItem = uni.getStorageSync("replyItem");
			if(!replyItem){
				return uni.navigateBack();
			}
			this.replyItem= replyItem || {};
			this.commentObj.article_id = this.replyItem.article_id;
			this.commentObj.reply_user_id = this.replyItem.user_id[0]._id;
			this.commentObj.reply_comment_id = this.replyItem._id;
			this.getCommentList();
		},
		//页面销毁
		onUnload(){
			uni.removeStorageSync("replyItem");
		},
		methods:{
			giveName,
			getCommentList(){
				let commentTemp = db.collection("quanzi_comment").where(`article_id=='${this.replyItem.article_id}' && delState != true && comment_type==1 && reply_comment_id=="${this.replyItem._id}"`).orderBy("comment_date desc").limit(10).getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,avatar_file,nickname,username").getTemp();
				db.collection(commentTemp,userTemp).get().then(res=>{
					this.childReply=res.result.data;
				})
				
			},
			//评论或删除成功
			commentEnv(){
				this.childReply=[];
				this.getCommentList();
			},

		}
	}
</script>

<style lang="scss">
.reply{
	.top{
		padding: 30rpx;
		border-bottom: 15rpx solid #eee;
	}
}
.list{
	padding: 30rpx;
	padding-bottom: 120rpx;
	.row{
		padding-bottom: 15rpx;
	}
}
</style>
