var fs = require('fs');
var path = require('path');
var conf = require("./config");

exports.GetFiles = function(dir, req, res, callback){
	var curdir = path.join(req.user.path, dir);
	fs.stat(curdir, function(err, stats){
		if(err)
			return callback(err);

		if(!stats.isFile()){
			var rFiles = [];
			var rFolders = [];

			fs.readdir(curdir, function(err, files){
				var repeat = function(i){
					if(i < files.length){
						fs.stat(path.join(curdir, files[i]), function(err, stats){
							if(err && err.code !== "EPERM"){
								return callback(err);
							} else if(err && err.code === "EPERM"){
								repeat(i + 1);
							} else {
								if(stats.isFile())
									rFiles.push({ absolutePath: path.join(dir, files[i]), fileName: files[i] });
								else
									rFolders.push(files[i]);
								repeat(i + 1);
							}
						});
					} else {
						callback(null, rFiles, rFolders, path.join(curdir, ".."), curdir);
					}
				};
				repeat(0);
			});
		} else {
			res.download(curdir);
		}
	});
};

exports.SendFile = function(tmpPath, uploadPath, callback){
	var s = fs.createReadStream(tmpPath);
	var d = fs.createWriteStream(uploadPath);

	s.pipe(d);
	s.on('end', callback);
	s.on('error', callback);
};

exports.remove = function(req, loc_, callback){
	var loc = path.join(req.user.path, loc_);
	fs.stat(loc, function(err, stats){
		if(err)
			return callback(err);
		if(!stats.isFile())
			return callback({ stack: 'Cant\'t delete a whole folder' });
		fs.unlink(loc, function(err){
			var red = path.join(loc_.replace("/_sys/delete/", "/"), "..") + "/";
			callback(err, red);
		});
	});
};
