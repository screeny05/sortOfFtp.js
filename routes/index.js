var ftp = require('../ftp');
var conf = require("../config");
var path = require('path');

exports.index = function(req, res){
	if(!req.user){
		res.render('index', { title: 'Please Auth.', loggedIn: false });
	}
	else{
		ftp.GetFiles(decodeURIComponent(req.url), req, res, function(err, files, folder, parent, curdir){
			var parent = path.join(req.url, "..");
			parent = parent === "\\" ? "/" : parent + "/";
			console.log(path.join(req.url, ".."));
			res.render('index', { title: 'Hello there!', loggedIn: true, err: err || false, files: files, folder: folder, parent: parent, curdir: curdir, isRoot: req.url.length == 1, isSecond: path.join(req.url, "..").length == 1 });
		});
	}
};

exports.upload = function(req, res){
	if(req.user){
		if(req.files.file){
			ftp.SendFile(req.files.file.path, path.join(req.body.path, req.files.file.name), function(err){
				if(err)
					res.render('index', { title: "Error!", loggedIn: true, err: err });
				else
					res.redirect("back");
			});
		} else {
			res.render('index', { title: "Error - Please Send File", loggedIn: true });
		}
	} else {
		res.render('index', { title: "Error - Please login", loggedIn: false });
	}

};

exports.edit = function(req, res){

};

exports.remove = function(req, res){
	res.render('index', { title: "Delete " + req.params[0] + "?", loggedIn: true, delete: true, redirect: path.join(req.url.replace("/_sys/delete/", "/"), "..") });
};

exports.remove_yes = function(req, res){
	if(req.user){
		ftp.remove(req, req.params[0], function(err, redirect){
			if(err)
				res.render('index', { title: "Error!", err: err, loggedIn: true });
			else
				res.redirect(redirect);
		});
	} else {
		res.render('index', { title: "Error - Please login", loggedIn: false });
	}
};
