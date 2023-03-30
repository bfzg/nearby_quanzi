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

		<view class="loadingState" v-show="loadState">
			<u-skeleton rows="4" title loading></u-skeleton>
		</view>

		<view class="content">
			<view class="item" v-for="item in dataList" :key="item._id">
				<blog-item :item="item"></blog-item>
			</view>
		</view>

		<view class="edit" @click="goEdit">
			<text class="iconfont icon-a-21-xiugai"></text>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database();
	export default {
		data() {
			return {
				navlist: [{
						name: "最新",
						type:"publish_date"
					},
					{
						name: "热门",
						type:"view_count"
					}
				],
				//控制骨架屏的显示与隐藏
				loadState: false,
				//点击切换最新和热门
				navAction: 0,
				dataList: [],
			}
		},
		onLoad() {
			this.getDataList();
		},
		methods: {
			//获取数据
			getDataList(){
				let artTemp=db.collection("quanzi_article").field("title,user_id,description,picurls,comment_count,like_count,view_count,publish_date").getTemp();
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp();
				db.collection(artTemp,userTemp).orderBy(this.navlist[this.navAction].type ,"desc").get().then(res=>{
					this.dataList = res.result.data;
				})
			},
			//点击切换热门 最新
			clickNav(e) {
				this.loadState = true;
				this.dataList = [];
				this.navAction = e.index;
				this.getDataList();
			},
			//跳转到发布页
			goEdit() {
				uni.navigateTo({
					url: "/pages/edit/edit"
				})
			},
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