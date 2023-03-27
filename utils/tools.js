//截取上传图片的地址
export function getImgSrc(richtext, num = 3) {
	let imgList = [];
	richtext.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, (match, capture) => {
		imgList.push(capture);
	});
	imgList = imgList.slice(0, num);
	return imgList;
}
//获取发布ip地址
export function getProvince() {
	return new Promise((resolve, reject) => {
		let historyProvince = uni.getStorageSync('historyProvince');
		if (historyProvince) {
			if ((Date.now() - historyProvince.time) > 1000 * 60 * 60) {
				getIp().then(res => {
					resolve(res);
				}).catch(err => {
					reject(err)
				})
			} else {
				resolve(historyProvince.province);
			}
		} else {
			getIp().then(res => {
				resolve(res);
			}).catch(err => {
				reject(err)
			})
		}

	})
}

//获取ip
function getIp(){
	return new Promise((resolve,rejct)=>{
		uni.request({
			url:"https://restapi.amap.com/v3/ip?key=d301f5155116eea19be70d4dede3148a",
			success:res=>{
				let str=""
				if(typeof(res.data.province) == "string"){
					str=res.data.province;
				}else{
					str = "未知";
				}
				resolve(str);
				let obj={
					province:res.data.province,
					time:Date.now()
				}
				uni.setStorageSync("historyProvince",obj);
			},
			fail:err=>{
				reject(err);
			}
		})
	})
}