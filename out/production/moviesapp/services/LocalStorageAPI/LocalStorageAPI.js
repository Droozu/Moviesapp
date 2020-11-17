function loadItem(itemName) {
	try {
		return JSON.parse(localStorage.getItem(itemName));
	} catch (err) {
		if (err instanceof SyntaxError) {
			return {};
		}
		throw err;
	}
}

function checkingItemOnStorage(itemName) {
	loadItem(itemName);
}


function saveItem(itemName, item) {
	localStorage.setItem(itemName, JSON.stringify(item));
}
export default { loadItem, saveItem, checkingItemOnStorage };



