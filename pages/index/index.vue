<template>
	<view class="home">
		<view class="topnav">
			<u-tabs :list="navlist" :activeStyle="{
				color: '#333',
				fontWeight: 'bold',
				transform: 'scale(1.08)'
			}" :inactiveStyle="{
				color: '#888',
				transform: 'scale(1)'
			}" @click="clickNav"></u-tabs>
		</view>

		<view class="loadingState" v-if="loadState">
			<u-skeleton rows="4" title loading></u-skeleton>
		</view>

		<view class="content">
			<view class="item" v-for="item in dataList">
				<blog-item :like_count.sync="item.like_count" :isLike.sync="item.isLike" @delEvent="P_delEvent"
					:item="item"></blog-item>
			</view>
		</view>
		<view class="">
			<uni-load-more :status="uniload"></uni-load-more>
		</view>
		<view class="edit" @click="goEdit">
			<text class="iconfont icon-a-21-xiugai"></text>
		</view>
	</view>
</template>

<script>
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	const db = uniCloud.database();
	const dbCmd = db.command;

	export default {
		data() {
			return {
				navlist: [{
						name: "最新",
						type: "publish_date"
					},
					{
						name: "热门",
						type: "view_count"
					}
				],
				//控制骨架屏的显示与隐藏
				loadState: true,
				//点击切换最新和热门
				navAction: 0,
				dataList: [],
				uniload: 'more',
				noMore: false
			}
		},
		onLoad() {
			this.getDataList();
		},
		//触底事件
		onReachBottom() {
			this.uniload = 'loading';
			if (this.noMore) return;
			this.getDataList();
		},
		methods: {
			//获取数据
			getDataList() {
				let artTemp = db.collection("quanzi_article").where(`delState != true`).field(
					"title,user_id,description,picurls,comment_count,like_count,view_count,publish_date").getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp();
				db.collection(artTemp, userTemp).orderBy(this.navlist[this.navAction].type, "desc").skip(this.dataList
					.length).limit(5).get().then(
					async res => {
						let idArr = [];
						if (res.result.data.length == 0) {
							this.uniload = 'noMore';
							this.noMore = true;
						}
						let oldDataArr = this.dataList;
						let resDataArr = [...oldDataArr, ...res.result.data];
						//在首页显示是否点过赞的逻辑
						if (store.hasLogin) {
							resDataArr.forEach(item => {
								idArr.push(item._id);
							})
							console.log(idArr);
							let likeRes = await db.collection("quanzi_like").where({
								article_id: dbCmd.in(idArr),
								user_id: uniCloud.getCurrentUserInfo().uid
							}).get();
							likeRes.result.data.forEach(item => {
								let findIndex = resDataArr.findIndex(find => {
									return item.article_id == find._id
								})
								console.log(findIndex);
								resDataArr[findIndex].isLike = true;
							})
						}

						this.dataList = resDataArr;
						this.loadState = false;
					})
			},
			//点击切换热门 最新
			clickNav(e) {
				this.loadState = true;
				this.dataList = [];
				this.navAction = e.index;
				this.getDataList();
				this.uniload = 'more';
			},
			//跳转到发布页
			goEdit() {
				uni.navigateTo({
					url: "/pages/edit/edit"
				})
			},
			P_delEvent() {
				this.dataList = [];
				this.getDataList();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.home {
		.topnav {
			margin-bottom: 30rpx;
		}

		.loadingState {
			padding: 30rpx;
		}

		.content {
			.item {
				padding: 30rpx;
				border-bottom: #F7F7F7 15rpx solid
			}
		}

		.edit {
			width: 120rpx;
			height: 120rpx;
			background: #0199FE;
			border-radius: 50%;
			color: #fff;
			position: fixed;
			z-index: 100;
			bottom: 150rpx;
			right: 50rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			box-shadow: 0 0 20rpx rgba(1, 153, 254, 0.8);

			.iconfont {
				font-size: 50rpx;
			}
		}
	}
</style>