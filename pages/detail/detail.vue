<template>
	<view class="detail">
		<view class="container">
			<view class="title">这是标题</view>
			<view class="userinfo">
				<view class="avatar">
					<image src="../../static/images/panda.jpg" mode="aspectFill"></image>
				</view>
				<view class="text">
					<view class="name">王五</view>
					<view class="small">6天前 · 发布于北京市</view>
				</view>
			</view>
			<view class="content">
				这里是详情页
			</view>
			
			<view class="like">
				<view class="btn">
					<text class="iconfont icon-good-fill"></text>
					<text>88</text>
				</view>								
				<view class="users">					
					<image src="../../static/images/user.jpg" mode="aspectFill" ></image>
				</view>				
				<view class="text"><text class="num">998</text>人看过</view>
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
		onLoad(e) {
			console.log(e);
		}
	}
</script>

<style lang="scss">
.detail{
	background: #f8f8f8;
	min-height: calc(100vh - var(--window-top));	
	.container{
		padding:30rpx;	
		background: #fff;
		.title{
			font-size: 46rpx;
			color:#333;
			line-height: 1.4em;
			font-weight: 600;
		}
		.userinfo{
			padding:20rpx 0 50rpx;
			display: flex;
			align-items: center;
			.avatar{
				width: 60rpx;
				height: 60rpx;
				padding-right: 15rpx;
				image{
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
			.text{
				font-size: 28rpx;
				color:#555;
				.small{
					font-size: 20rpx;
					color:#999;
				}
			}
		}
		.content{
			
		}
		.like{
			display: flex;
			flex-direction: column;
			align-items: center;
			padding:80rpx 50rpx 50rpx;
			.btn{
				width: 260rpx;
				height: 120rpx;
				background: #e4e4e4;
				border-radius: 100rpx;
				color:#fff;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				font-size: 28rpx;
				.iconfont{
					font-size: 50rpx;
				}
				&.active{
					background: #0199FE;
				}
			}
			.text{
				font-size: 26rpx;
				color:#666;				
				.num{
					color:#0199FE
				}
				.spot{
					padding:0 10rpx;
				}
			}
			.users{
				display: flex;
				justify-content: center;
				padding:30rpx 0;
				image{
					width: 50rpx;
					height: 50rpx;
					border-radius: 50%;
					border:3px solid #fff;
					margin-left:-20rpx;
				}
			}
		}
		
	}
}
</style>
