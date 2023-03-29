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
						<image
							:src="detailObj.user_id[0].avatar_file ? detailObj.user_id[0].avatar_file.url : '../../static/images/user-default.jpg'"
							mode="aspectFill"></image>
					</view>
					<view class="text">
						<view class="name">
							{{detailObj.user_id[0].nickname ? detailObj.user_id[0].nickname : detailObj.user_id[0].username}}
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
				<view class="like" >
					<view class="btn" :class="detailObj.isLike ? 'active' : ''" @click="clickLike">
						<text class="iconfont icon-good-fill"></text>
						<text>{{detailObj.like_count}}</text>
					</view>
					<view class="users">
						<image src="../../static/images/user.jpg" mode="aspectFill"></image>
					</view>
					<view class="text"><text class="num">{{detailObj.view_count}}</text>人看过</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	const utilsObj = uniCloud.importObject('UtilsObj',{
		customUI:true
	});
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
				likeTime:''
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
		},
		methods: {
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
				let likeTemp = db.collection("quanzi_like").where(`article_id=="${this.artid}" && user_id==$cloudEnv_uid`).getTemp();
				db.collection(artTemp, userTemp,likeTemp).get({
					getOne: true
				}).then(res => {
					if (!res.result.data) {
						this.errFun();
						return;
					}
					let isLike = res.result.data._id.quanzi_like.length ? true : false;
					res.result.data.isLike = isLike;
					this.detailObj = res.result.data;
					this.loadState = false;
					console.log(this.detailObj);
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
				let time = Date.now();
				if(time-this.likeTime<2000){
					uni.showToast({
						title:"操作太频繁!",
						icon:'none'
					})
					return;
				}
				this.likeTime=time
				this.detailObj.isLike ? this.detailObj.like_count-- : this.detailObj.like_count++;
				this.detailObj.isLike = !this.detailObj.isLike;
				this.likeFun();
				
			},
			//点赞请求
			async likeFun(){
				//判断用户是否再这张表上点赞
				let count = await db.collection("quanzi_like").where(`article_id=="${this.artid}" && user_id==$cloudEnv_uid`).count();
				if (count.result.total) {
					db.collection("quanzi_like").where(`article_id=="${this.artid}" && user_id==$cloudEnv_uid`).remove();
					utilsObj.operation("quanzi_article", "like_count", this.artid, -1);
				} else {
					db.collection("quanzi_like").add({
						article_id: this.artid
					})
					utilsObj.operation("quanzi_article", "like_count", this.artid, 1);
				}
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
</style>