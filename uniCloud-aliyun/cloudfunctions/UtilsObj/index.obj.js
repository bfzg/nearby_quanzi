const db = uniCloud.database();
const dbCmd = db.command;
module.exports = {
	_before: function() { // 通用预处理器

	},
	/**
	 * 自增减
	 * @param {Object} table 数据表
	 * @param {Object} attr	属性
	 * @param {Object} id 
	 * @param {Object} num 1 自增   -1 自减
	 */
	async operation(table, attr, id, num) {
		let obj = {};
		obj[attr] = dbCmd.inc(num); // 这里 obj[attr]=dbCmb.inc(num) 相当与 {attr:1或-1}
		return await db.collection(table).doc(id).update(obj)
	}

}