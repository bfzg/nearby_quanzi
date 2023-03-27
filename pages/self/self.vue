<template>
	<view class="user">
		<view class="top">
			<view class="group">
				<view class="userinfo">
					<view class="pic">
						<image src="../../static/images/user-default.jpg" mode="aspectFill"></image>
					</view>
					<view class="text" v-if="false">
						<view class="nickname">匿名</view>
						<!-- <view class="year">
							<uni-dateformat :date="new Date() - 360000" :threshold="[3600,99*365*24*60*60*1000]"></uni-dateformat>
							注册</view> -->
					</view>
					<view class="text" v-else>
						<view class="nickname" @click="goToLogin">点击登录</view>
					</view>
					
				</view>
				
				<view class="more">
					<text class="iconfont icon-a-10-you"></text>
				</view>
			</view>
			
			<view class="bg">				
				<image src="../../static/images/user-default.jpg" mode="aspectFill" ></image>
			</view>
		</view>
		
		
		
		<view class="main">
			<view class="info">
				<view class="item"><text>33</text>获赞</view>
				<view class="item"><text>11</text>评论</view>
				<view class="item"><text>5</text>发文</view>
			</view>
			
			<view class="list">
				<view class="group">					
					<view class="item">
						<view class="left"><text class="iconfont icon-a-24-bianji"></text><text class="text">我的长文</text></view>
						<view class="right"><text class="iconfont icon-a-10-you"></text></view>
					</view>
					<view class="item">
						<view class="left"><text class="iconfont icon-a-106-xihuan"></text><text class="text">我的点赞</text></view>
						<view class="right"><text class="iconfont icon-a-10-you"></text></view>
					</view>
					<view class="item">
						<view class="left"><text class="iconfont icon-a-21-xiugai"></text><text class="text">评论过的</text></view>
						<view class="right"><text class="iconfont icon-a-10-you"></text></view>
					</view>
				</view>
				
				<view class="group">
					<view class="item">
						<view class="left"><text class="iconfont icon-a-32-wenjian"></text><text class="text">关于</text></view>
						<view class="right"><text class="iconfont icon-a-10-you"></text></view>
					</view>		
					<view class="item">
						<view class="left"><text class="iconfont icon-a-5-xinxi"></text><text class="text">意见反馈</text></view>
						<view class="right"><text class="iconfont icon-a-10-you"></text></view>
					</view>	
				</view>
				
				<view class="group">
					<view class="item">
						<view class="left"><text class="iconfont icon-a-73-tuichu"></text><text class="text">退出登录</text></view>
						<view class="right"><text class="iconfont icon-a-10-you"></text></view>
					</view>					
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			//点击调换到登录页
			goToLogin(){
				uni.navigateTo({
					url:"/uni_modules/uni-id-pages/pages/login/login-withpwd"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.user{
	
	.top{
		height: 300rpx;
		background: #bbb;
		padding:0 30rpx;
		padding-top:var(--status-bar-height);
		position: relative;
		display: flex;
		align-items: center;
		.group{
			position: relative;
			z-index: 10;
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			color:#fff;
			.userinfo{
				display: flex;
				width: 100%;				
				align-items: center;				
				.pic{
					width: 120rpx;
					height: 120rpx;
					border-radius: 50%;
					overflow: hidden;
					border:2px solid #fff;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.text{
					padding-left:20rpx;
					.nickname{
						font-size: 44rpx;
						font-weight: 600;
					}
					.year{
						font-size: 26rpx;
						opacity: 0.6;
						padding-top:5rpx;
					}
				}
			}
			.more{
				.iconfont{
					font-size: 40rpx;
				}
			}
			
		}
		.bg{
			position: absolute;
			top: 0;
			left:0;
			width: 100%;
			height: 100%;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
				filter: blur(20px);
				transform: scale(2);
				opacity: 0.5;
			}
		}
	}
	.main{
		width: 100%;
		min-height: 200rpx;
		background: #fff;
		border-radius: 30rpx;
		transform:translateY(-30rpx);
		padding:30rpx 0;
		.info{
			padding:10rpx 30rpx;
			display: flex;
			font-size: 30rpx;
			.item{
				padding-right: 20rpx;
				color:#888;
				text{
					font-weight: 600;
					color:#333;
				}
			}
		}
		.list{
			.group{
				padding:15rpx 30rpx;
				border-bottom:15rpx solid #f4f4f4;
				.item{
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding:25rpx 0;
					font-size: 36rpx;
					color:#555;
					border-bottom:1rpx solid #f8f8f8;
					.left{
						display: flex;
						align-items: center;
						.iconfont{
							font-size: 38rpx;
							margin-right: 10rpx;
						}
					}
					.right{
						.iconfont{
							font-size: 26rpx;
						}
					}
				}
				.item:last-child{
					border: none;
				}
			}
			.group:last-child{
				border:none;
			}
		}
	}
	
}
</style>
