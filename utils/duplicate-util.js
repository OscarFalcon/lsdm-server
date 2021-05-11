

const mapData = function(data){
	var returnData = {};
	
	
	data.forEach(
		row => {
			console.log(row);
			
			if (!returnData[row.image_id]){
				returnData[row.image_id] = {
					id: row.image_id,
					ref: "/images/" + row.image_id,
					duplicates: [{
						id: row.ref_image_id,
						ref: "/images/" + row.ref_image_id
					}]
				};
			} else{
				returnData[row.image_id].duplicates.push(
					{
						id: row.ref_image_id,
						ref: "/images/" + row.ref_image_id
					}
				);
			}
			
			console.log(returnData);
		}
	);
	return returnData;
}



module.exports = {
	mapData : mapData
};