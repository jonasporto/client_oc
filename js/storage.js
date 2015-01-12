
Storage.prototype.setData = function(name,data){
	$lc = [];
	data.id = ++data.id  || 1;
	data.timestamp = Date.now();
	if(localStorage[name]) $lc = JSON.parse(localStorage[name]); 
	$lc[$lc.length] = JSON.stringify(data);
	return localStorage[name] = $lc;
}

Storage.prototype.getData = function(name){
	if(localStorage[name])return JSON.parse(localStorage[name]);
	return;
}

Storage.prototype.clear = function(){
	return localStorage.clear();
}

Storage.prototype.last = function(name){
	if(localStorage[name]) $lc = JSON.parse(localStorage[name]); 
	return $lc[$lc.length - 1];
}


Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj));
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

