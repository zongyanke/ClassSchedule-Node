var fs = require('fs');
var xlsx = require('node-xlsx');
var classroomused=12;
var classroomcontain=50;
var teacher_count_array=[];
var subject=["语文","数学","英语","物理","化学","生物","政治","历史","地理"];
module.exports={
	writeout_0:function(limit){
		fs.writeFileSync('./public/file/out.txt',limit[0]+" "+limit[1]+"\r\n"+limit[2]+" "+limit[3]+"\r\n",{flag:'w',encoding:'utf-8',mode:'0666'},function(err){
         	if(err){
             	console.log("文件写入失败")
	     	}
		});
		classroomused=limit[4];
		this.writeout_1(limit);
    },
	writeout_1:function (limit){
		var teacher=xlsx.parse('./public/file/teacher.xlsx');
		var arr="";//="1 1 1 1 1 1 1 1 1 \r\n1 1 1 1 1 1 1 1 1 \r\n1 1 1 1 1 1 1 1 1 \r\n1 1 1 1 1 1 1 1 1 \r\n1 1 1 1 1 1 1 1 1 \r\n";
		for(var i=0;i<limit[0];++i){
			for(var j=0;j<limit[1];++j){
				arr=arr+"1 ";
			}
			arr=arr+"\r\n";
		}
		fs.writeFileSync('./public/file/out.txt',teacher[0].data[0][0]+"\r\n"+arr+teacher[0].data[0][1]+"\r\n",{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
         	if(err){
             	console.log("文件写入失败")
         	}else{
             	console.log("文件写入成功");
         	}
		});
		var i=1;
		var k=0;
		var flag=0;
		var teacher_count=0;
		while(i<teacher[0].data.length){
			var j=0;
			teacher_count=teacher[0].data[i][1];
			teacher_count_array[k++]=teacher_count;
			fs.writeFileSync('./public/file/out.txt',teacher[0].data[i][0]+" "+subject[flag]+" \r\n"+arr+teacher[0].data[i][1]+"\r\n",{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
				if(err){
					console.log("文件写入失败")
				}
			});
			++i;
			while(j<teacher_count){
				fs.writeFileSync('./public/file/out.txt',+teacher[0].data[i][0]+" "+teacher[0].data[i][1]+" "+teacher[0].data[i][2]+" \r\n"+arr,{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
					if(err){
						console.log("文件写入失败")
					}
				});
				++i;
				++j;
			}
			++flag;
			if(i==teacher[0].data.length||teacher[0].data[i][0]==undefined||teacher[0].data[i][1]==undefined)
				break;
		}
		console.log("yea");
		this.writeout_2();
	},
	writeout_2:function(){
		var student = xlsx.parse('./public/file/Student.xlsx');
    	fs.writeFileSync('./public/file/out.txt',classroomused+"\r\n"+50+"\r\n",{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
         	if(err){
             	console.log("文件写入失败")
         	}
		});
		var i=0;
		var j=0;
		//暂时没有用上，以后再说
		var classcount=student[0].data.length/classroomcontain;
		var last_count=student[0].data.length%classroomcontain;
		while(i<student[0].data.length){
			var data=student[0].data[i][0]+" "+student[0].data[i][1]+" "+student[0].data[i][2]+" "+student[0].data[i][3]+" "+student[0].data[i][4]+" "+student[0].data[i][5]+" \r\n";
			fs.writeFileSync('./public/file/out.txt',data,{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
				if(err){
					console.log("文件写入失败")
				}
			});
			++j;
			++i;
			if(j==50&&i<student[0].data.length){
				fs.writeFileSync('./public/file/out.txt',50+"\r\n",{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
					if(err){
						console.log("文件写入失败")
					}
				});
				j=0;
			}
			if(student[0].data[i+1][0]==undefined||student[0].data[i+1][1]==undefined)
				break;
		}
	},
	judgeUser:function(params,callback){
		fs.readFile('./public/file/user.json',function(err,data){
			if(err){
				return console.error(err);
			}
			var user = data.toString();//将二进制的数据转换为字符串
			user = JSON.parse(user);//将字符串转换为json对象
			//判断是否存在同名用户且密码相同
			for(var i=0;i<user.data.length;++i){
				if(params.id==user.data[i].id){
					if(params.password==user.data[i].password)
						return callback(1);
				}
			}
			callback(0);
		})
	},

	writeUser:function(params,callback){
		//现将json文件读出来
		fs.readFile('./public/file/user.json',function(err,data){
			if(err){
				return console.error(err);
			}
			var user = data.toString();//将二进制的数据转换为字符串
			user = JSON.parse(user);//将字符串转换为json对象
			//判断是否存在同名用户
			for(var i=0;i<user.data.length;++i){
				if(params.id==user.data[i].id)
					return callback(0);
			}
			//开始写入
			user.data.push(params);//将传来的对象push进数组对象中
			user.total = user.data.length;//定义一下总条数，为以后的分页打基础
			var str = JSON.stringify(user);//因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
			fs.writeFile('./public/file/user.json',str,function(err){
				if(err){
					console.error(err);
				}
				console.log('------------新增用户成功-------------');
			})	
			callback(1);
		})
	},
	initCouTeaList:function(callback){
		var subject_list=[];
		var teacher_list=[];
		//初始化科目列表，这个还要看给的excel表格带不带有科目信息，否则作为默认科目
		for(var i=0;i<subject.length;++i){
			subject_list[i]={
				"id":i,
				"subject_name":subject[i]
			}
		}

		var teacher=xlsx.parse('./public/file/teacher.xlsx');
		var k=0;
		//从第一行开始读取
		for(var i=1;i<teacher[0].data.length;++i){
			var teacher_count=teacher[0].data[i++][1];
			for(var j=0;j<teacher_count;++j){
				teacher_list[k++]={
					"id":teacher[0].data[i][0],
					"name":teacher[0].data[i][1]
				}
				if(j<teacher_count-1)
					++i;		
			}
		}
		var json={
			"subject_list":subject_list,
			"teacher_list":teacher_list
		}
		callback(json);
	},
	get_timetable:function(data_,callback){
		fs.readFile("./public/file/out.txt",'utf-8',function(err,data){
        	if(err){
            	console.log("error");
			}
			else{
            	//将文件按行分割一下
            	data=data.split("\r\n");
            	for(var i=0;i<data.length-1;++i){
					data[i]=data[i].split(" ");
				}
			}
			//读取并返回数组
			for(var i=0;i<data.length-1;++i){
				if(data_[1]==data[i][1]&&data_[2]==0){
					++i;
					var json=[];
					for(var j=0;j<data[0][0];++j){
						json[j]=data[i++];
						json[j].length=data[0][1];
					}
					return callback(json);
				}
				if(data_[0]==data[i][0]&&data_[1]==data[i][1]&&data_[2]==1){
					++i;
					var json=[];
					for(var j=0;j<data[0][0];++j){
						json[j]=data[i++];
						json[j].length=data[0][1];
					}
					return callback(json);
				}	
			}
		});
	},
	write_timetable:function(data_,timetable,callback){
		fs.readFile("./public/file/out.txt",'utf-8',function(err,data){
        	if(err){
            	console.log("error");
			}
			else{
				//将文件按行分割一下
				var tempdata=[];
            	data=data.split("\r\n");
            	for(var i=0;i<data.length-1;++i){
					tempdata[i]=data[i].split(" ");
				};
				var temp=0;
				//读取并返回数组
				for(var i=0;i<tempdata.length-1;++i){
					if(data_[1]==tempdata[i][1]&&data_[2]==0){
						++i;
						temp=i;
						break;
					}
					if(data_[0]==tempdata[i][0]&&data_[1]==tempdata[i][1]&&data_[2]==1){
						++i;
						temp=i;
						break;
					}	
				};
				for(var i=0;i<tempdata[0][0];++i){
					var str="";
					for(var j=0;j<tempdata[0][1];++j){
						str=str+timetable[i][j]+" ";
					}
					data[temp]=str;
					++temp;
				};
				var k=0;
				while(k<data.length-1){
					fs.writeFileSync('./public/file/out_1.txt',data[k++]+"\r\n",{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
						if(err){
							console.log("文件写入失败")
						}
					});
				}
				fs.unlink('./public/file/out.txt', function(err) {
					if (err) 
						throw err;
					console.log('文件删除成功');
				});
				fs.rename('./public/file/out_1.txt', './public/file/out.txt', function (err) {
					if (err) throw err;
					console.log('重命名完成');
				});
				callback();
			}
		});
	},
	get_schedule:function(data,callback){
		var schedule=[];
		fs.readFile("./public/file/table.txt",'utf-8',function(err,data){
        	if(err){
            	console.log("error");
			}
			else{
            	//将文件按行分割一下
				data=data.split("\r\n\r\n\r\n\r\n-----------------\r\n\r\n\r\n");
            	for(var i=0;i<data.length-1;++i){
					//data[i]=data[i].split(" ");
					schedule[i]=data[i];
					schedule[i]=schedule[i].split("\r\n\r\n");
					console.log(schedule[i]);
				}
				
			}
		});
	}
}