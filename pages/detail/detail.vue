<template>
	<view class="detail">
		<view class="container">
			<view v-if="loadState">
				<u-skeleton rows="15" rowsHeight=20 title :loading="true" :animate="true"></u-skeleton>
			</view>
			<view v-else>
				<view class="title">{{detailObj.title}}</view>
				<view class="userinfo">
					<view class="avatar">
						<image :src="giveAvatar(detailObj)" mode="aspectFill"></image>
					</view>
					<view class="text">
						<view class="name">
							{{giveName(detailObj)}}
						</view>
						<view class="small"><text><uni-dateformat :date="detailObj.publish_date"
									format="yyyy年MM月ddhh:mm"></uni-dateformat> &#8226; 发布于{{detailObj.province}}</text>
						</view>
					</view>
				</view>
				<!-- 主体内容 uview的富文本解析 -->
				<view class="content">
					<u-parse :tagStyle="tagStyle" :content="detailObj.content"></u-parse>
				</view>
				<!-- 底部点赞评论区 -->
				<view class="like">
					<view class="btn" :class="detailObj.isLike ? 'active' : ''" @click="clickLike">
						<text class="iconfont icon-good-fill"></text>
						<text>{{detailObj.like_count}}</text>
					</view>
					<view class="users">
						<template v-for="item in likeUserArr">
							<image v-if="item.user_id[0].avatar_file" :src="giveAvatar(item)" mode="aspectFill"></image>
						</template>
					</view>
					<view class="text"><text class="num">{{detailObj.view_count}}</text>人看过</view>
				</view>
			</view>

		</view>

		<view class="comment">
			<view v-if="!commentList.length">
				<u-empty mode="comment" icon="https://cdn.uviewui.com/uview/empty/comment.png">
				</u-empty>
			</view>

			<view class="content" v-else>
				<view class="item" v-for="item in commentList" :key="item._id">
					<comment-item @removeEnv="P_removeEnv" :item="item"></comment-item>
				</view>
			</view>
		</view>
		<comment-frame @commentEnv="P_commentEnv" :commentObj="commentObj"></comment-frame>
	</view>
</template>

<script>
	import pageJson from "@/pages.json"
	import {
		store
	} from '@/uni_modules/uni-id-pages/common/store.js'
	import {
		giveName,
		giveAvatar
	} from "@/utils/tools.js"
	const db = uniCloud.database();
	const utilsObj = uniCloud.importObject('UtilsObj', {
		customUI: true
	});
	import {
		likeFun
	} from '@/utils/clilkeLike.js';
	export default {
		data() {
			return {
				artid: "",
				loadState: true,
				tagStyle: { //富文本内容样式
					p: "line-height:1.7em;font-size:18px;padding-bottom=10rpx;",
					img: "margin: 10px 0;"
				},
				detailObj: null, //文章详情数据
				likeTime: '',
				likeUserArr: [], //用户头像
				commentObj:{
					article_id:"",
					comment_type:0,
				},
				commentList:[]
			};
		},
		onLoad(e) {
			if (!e.id) {
				this.errFun();
				return;
			}
			this.artid = e.id;
			this.getDataList();
			this.readUpdate();
			this.getLikeUser();
			this.commentObj.article_id =e.id;
			this.getCommentList();
		},
		methods: {
			giveName,
			giveAvatar,
			//删除成功后的回调
			P_removeEnv(e){
				console.log(e);
				let index = this.commentList.findIndex(item=>{
					return item._id == e._id
				});
				this.commentList.splice(index,1);
			},
			//评论成功后的回调
			P_commentEnv(e){
				this.commentList.unshift({
					...e,
					...this.commentObj,
					user_id:[store.userInfo]
				})
			},
			//获取评论
			async getCommentList(){
				let commentTemp = db.collection("quanzi_comment").where(`article_id=='${this.artid}' && delState != true && comment_type==0`).orderBy("comment_date desc").getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,avatar_file,nickname,username").getTemp();
				let res = await db.collection(commentTemp,userTemp).get();
				let idArr = res.result.data.map(item=>{
					return item._id;
				})
				let replyArr = await db.collection("quanzi_comment").where({
					reply_comment_id:db.command.in(idArr)
				}).groupBy('reply_comment_id').groupField('count(*) as totalReply').get();
				
				res.result.data.forEach(item=>{
					let index = replyArr.result.data.findIndex(find=>{
						return find.reply_comment_id==item._id;
					})
					if(index > -1) item.totalReply = replyArr.result.data[index].totalReply;
				})
				
				this.commentList = res.result.data;
				
			},
			
			//错误处理
			errFun() {
				uni.showToast({
					title: "参数有误",
					icon: "none"
				})
				setTimeout(() => {
					uni.reLaunch({
						url: "/pages/index/index"
					})
				}, 800)
			},
			//获取数据
			getDataList() {
				let artTemp = db.collection("quanzi_article").where(`_id=="${this.artid}"`).getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp();
				let likeTemp = db.collection("quanzi_like").where(`article_id=="${this.artid}" && user_id==$cloudEnv_uid`)
					.getTemp();
				let tempArr = [artTemp, userTemp];
				if (store.hasLogin) tempArr.push(likeTemp);

				db.collection(...tempArr).get({
					getOne: true
				}).then(res => {
					if (!res.result.data) {
						this.errFun();
						return;
					}
					let isLike = false;
					if (store.hasLogin) isLike = res.result.data._id?.quanzi_like.length ? true : false;
					res.result.data.isLike = isLike;
					this.detailObj = res.result.data;
					this.loadState = false;
				}).catch(err => {
					this.errFun();
				})
			},
			//每次查看详情都会修改阅读量
			readUpdate() {
				utilsObj.operation("quanzi_article", "view_count", this.artid, 1);
			},
			//点赞操作
			clickLike() {
				//判断是否点赞
				if (!store.hasLogin) {
					uni.showModal({
						title: "是否登录!",
						success: res => {
							if (res.confirm) {
								uni.navigateTo({
									url: '/' + pageJson.uniIdRouter.loginPage
								})
							}
						}
					})

				}

				let time = Date.now();
				if (time - this.likeTime < 2000) {
					uni.showToast({
						title: "操作太频繁!",
						icon: 'none'
					})
					return;
				}
				this.likeTime = time
				this.detailObj.isLike ? this.detailObj.like_count-- : this.detailObj.like_count++;
				this.detailObj.isLike = !this.detailObj.isLike;
				likeFun(this.artid);

			},
			//截取用户头像
			getLikeUser() {
				let likeTemp = db.collection("quanzi_like").where(`article_id == '${this.artid}'`).getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,avatar_file").getTemp();
				db.collection(likeTemp, userTemp).orderBy('publish_date desc').limit(5).get().then(res => {
					this.likeUserArr = res.result.data;
					this.commentList = res.result.data;
				})
			}
		},
	}
</script>

<style lang="scss">
	.detail {
		background: #f8f8f8;
		min-height: calc(100vh - var(--window-top));

		.container {
			padding: 30rpx;
			background: #fff;

			.title {
				font-size: 46rpx;
				color: #333;
				line-height: 1.4em;
				font-weight: 600;
			}

			.userinfo {
				padding: 20rpx 0 50rpx;
				display: flex;
				align-items: center;

				.avatar {
					width: 60rpx;
					height: 60rpx;
					padding-right: 15rpx;

					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}

				.text {
					font-size: 28rpx;
					color: #555;

					.small {
						font-size: 20rpx;
						color: #999;
					}
				}
			}

			.content {}

			.like {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 80rpx 50rpx 50rpx;

				.btn {
					width: 260rpx;
					height: 120rpx;
					background: #e4e4e4;
					border-radius: 100rpx;
					color: #fff;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					font-size: 28rpx;

					.iconfont {
						font-size: 50rpx;
					}


				}

				.text {
					font-size: 26rpx;
					color: #666;

					.num {
						color: #0199FE
					}

					.spot {
						padding: 0 10rpx;
					}
				}

				.users {
					display: flex;
					justify-content: center;
					padding: 30rpx 0;

					image {
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
						border: 3px solid #fff;
						margin-left: -20rpx;
					}
				}
			}

		}
	}

	.active {
		background: #0199FE !important;
	}

	.comment {
		padding: 30rpx;
		padding-bottom: 120rpx;

		.item {
			padding: 10rpx 0;
		}
	}
</style>