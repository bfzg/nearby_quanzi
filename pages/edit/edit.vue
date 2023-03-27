<template>
	<view class="edit">
		<view class="title">
			<input v-model.trim="artObj.title" type="text" placeholder="请输入完整的标题" placeholder-class="placeholderClass">
		</view>
		<view class="content">
			<editor class="myEdit" show-img-size show-img-toolbar show-img-resize @ready="onEditReady"
				@focus="clickEdit" @statuschange="onStatuschange" placeholder="写点什么吧~~"></editor>
		</view>
		<view class="btnGroup">
			<u-button @click="onSubmit" type="primary" text="确认发表" :disabled="!artObj.title.length"></u-button>
		</view>
		<view class="tools" v-show="toolShow">
			<view class="item" @click="addTitle"><text :class="showTitle ? 'active':''"
					class="iconfont icon-zitibiaoti"></text> </view>
			<view class="item" @click="addBold"><text :class="showBold ? 'active':''"
					class="iconfont icon-zitijiacu"></text> </view>
			<view class="item" @click="addObl"><text :class="showObl ? 'active':''"
					class="iconfont icon-zitixieti"></text> </view>
			<view class="item" @click="insertLine"><text class="iconfont icon-fengexian"></text> </view>
			<view class="item" @click="addPicture"><text class="iconfont icon-charutupian"></text> </view>
			<view class="item"><text class="iconfont icon-duigou_kuai"></text> </view>
		</view>
	</view>
</template>

<script>
	import {getImgSrc,getProvince} from '@/utils/tools.js';
	const db = uniCloud.database();
	export default {
		data() {
			return {
				toolShow: false,
				artObj: {
					title: '',
					content: '',
					description: '',
					picurls: "",
					province: ""
				},
				showTitle: false,
				showBold: false,
				showObl: false,
			};
		},
		onLoad() {
			getProvince().then(res => {
				this.artObj.province = res; //获取ip地址所属地
			});
		},
		methods: {
			//点击上传
			onSubmit() {
				this.editorCtx.getContents({
					success: res => {
						this.artObj.description = res.text.slice(0, 80);
						this.artObj.content = res.html;
						this.artObj.picurls = getImgSrc(res.html);
						uni.showLoading({
							title:"上传中..."
						})
						this.addDate();
					}
				})
			},
			//添加文章
			addDate(){
				db.collection("quanzi_article").add({
					...this.artObj
				}).then(res=>{
					uni.showToast({
						title:"上传成功!"
					});
					setTimeout(()=>{
						uni.reLaunch({
							url:"/pages/index/index"
						})
					},800);
				})
			},
			//初始化富文本
			onEditReady() {
				uni.createSelectorQuery().in(this).select('.myEdit').fields({
					size: true,
					context: true
				}, res => {
					this.editorCtx = res.context
				}).exec()
			},
			//当富文本获取焦点时触发
			clickEdit() {
				this.toolShow = true;
			},
			//当富文本编辑器的样式发生改变时触发
			checkStatus(name, detail, obj) {
				if (detail.hasOwnProperty(name)) {
					this[obj] = true;
				} else {
					this[obj] = false;
				}
			},
			onStatuschange(e) {
				let detail = e.detail;
				this.checkStatus('header', detail, 'showTitle');
				this.checkStatus('bold', detail, 'showBold');
				this.checkStatus('italic', detail, 'showObl');
			},
			//插入分隔线
			insertLine() {
				this.editorCtx.insertDivider();
			},
			//点击添加标题
			addTitle() {
				this.showTitle = !this.showTitle;
				this.editorCtx.format("header", this.showTitle ? "H2" : false);
			},
			//点击文字加粗
			addBold() {
				this.showBold = !this.showBold;
				this.editorCtx.format("bold");
			},
			//点击字体斜
			addObl() {
				this.showObl = !this.showObl;
				this.editorCtx.format("italic");
			},
			//点击添加图片
			addPicture() {
				uni.chooseImage({
					success: async res => {
						uni.showLoading({
							title: "上传中请稍后!",
							mask: true
						});
						for (let item of res.tempFiles) {
							let res = await uniCloud.uploadFile({
								filePath: item.path,
								cloudPath: item.name + '.'
							})
							this.editorCtx.insertImage({
								src:res.fileID
							})
						}
						uni.hideLoading();
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .ql-blank::before {
		font-style: normal;
		color: #e0e0e0;
	}

	.edit {
		padding: 30rpx;

		.title {
			input {
				height: 120rpx;
				font-size: 46rpx;
				border-bottom: 1px solid #e4e4e4;
				margin-bottom: 30rpx;
				color: #000;
			}

			.placeholderClass {
				color: #e0e0e0;
			}
		}

		.content {
			.myEdit {
				height: calc(100vh - 500rpx);
				margin-bottom: 30rpx;
			}
		}

		.tools {
			width: 100%;
			height: 80rpx;
			background: #fff;
			border-top: 1rpx solid #f4f4f4;
			position: fixed;
			left: 0;
			bottom: 0;
			display: flex;
			justify-content: space-around;
			align-items: center;

			.iconfont {
				font-size: 36rpx;
				color: #333;

				&.active {
					color: #0199FE
				}
			}
		}
	}
</style>