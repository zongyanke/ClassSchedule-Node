var fs = require('fs');
var xlsx = require('node-xlsx');
var child_process=require('child_process');
var classroomused=12;
var classroomcontain=50;
var teacher_count_array=[];
var subject=["语文","数学","英语","物理","化学","生物","政治","历史","地理"];
var class_count=[0,0,0,0,0,0];
var student_count=[];
student_count[0]=[];
student_count[1]=[];
student_count[2]=[];
student_count[3]=[];
student_count[4]=[];
student_count[5]=[];
module.exports={
	writeout_0:function(limit){
		fs.writeFileSync('./public/executefile/out.txt',limit[0]+" "+limit[1]+"\r\n"+limit[2]+" "+limit[3]+"\r\n",{flag:'w',encoding:'utf-8',mode:'0666'},function(err){
         	if(err){
             	console.log("文件写入失败")
	     	}
		});
		classroomused=limit[4];
		this.writeout_1(limit);
    },
	writeout_1:function(limit){
		var teacher=xlsx.parse('./public/file/Teacher.xlsx');
		var arr="";//="1 1 1 1 1 1 1 1 1 \r\n1 1 1 1 1 1 1 1 1 \r\n1 1 1 1 1 1 1 1 1 \r\n1 1 1 1 1 1 1 1 1 \r\n1 1 1 1 1 1 1 1 1 \r\n";
		for(var i=0;i<limit[0];++i){
			for(var j=0;j<limit[1];++j){
				arr=arr+"1 ";
			}
			arr=arr+"\r\n";
		}
		fs.writeFileSync('./public/executefile/out.txt',"***\r\n",{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
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
			fs.writeFileSync('./public/executefile/out.txt',teacher[0].data[i][0]+" "+subject[flag]+" "+((flag<2||flag>7)?0:1)+" \r\n"+arr+teacher[0].data[i][1]+"\r\n",{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
				if(err){
					console.log("文件写入失败")
				}
			});
			++i; 
			while(j<teacher_count){
				fs.writeFileSync('./public/executefile/out.txt',+teacher[0].data[i][0]+" "+teacher[0].data[i][1]+" "+teacher[0].data[i][2]+" \r\n"+arr,{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
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
		fs.writeFileSync('./public/executefile/out.txt',"*****\r\n",{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
			if(err){
				console.log("文件写入失败")
			}
		});
		this.writeout_2();
	},
	writeout_2:function(){
		var student = xlsx.parse('./public/file/Student.xlsx');
    	fs.writeFileSync('./public/executefile/out.txt',classroomused+"\r\n"+50+"\r\n",{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
         	if(err){
             	console.log("文件写入失败")
         	}
		});
		var i=0;
		var j=0;
		while(i<student[0].data.length){
			var data=student[0].data[i][0]+" "+student[0].data[i][1]+" "+student[0].data[i][2]+" "+student[0].data[i][3]+" "+student[0].data[i][4]+" "+student[0].data[i][5]+" "+student[0].data[i][7]+" "+student[0].data[i][8]+" "+student[0].data[i][9]+" \r\n";
			fs.writeFileSync('./public/executefile/out.txt',data,{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
				if(err){
					console.log("文件写入失败")
				}
			});
			++j;
			++i;
			if(j==50&&i<student[0].data.length){
				fs.writeFileSync('./public/executefile/out.txt',50+"\r\n",{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
					if(err){
						console.log("文件写入失败")
					}
				});
				j=0;
			}
		}
		this.writeout_3();
	},
	writeout_3:function(){

		for(var i=0;i<6;++i){
			if(student_count[i].length!=0){
				var data=subject[i+3]+" "+class_count[i]+"\r\n";
				for(var j=0;j<student_count[i].length;++j){
					data=data+(j+1)+" "+student_count[i][j]+" "+0+"\r\n";
				}
				fs.writeFileSync('./public/executefile/out.txt',data,{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
					if(err){
						console.log("文件写入失败")
					}
				});
			}
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

		var teacher=xlsx.parse('./public/file/Teacher.xlsx');
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
		var that=this;
		fs.readFile("./public/executefile/out.txt",'utf-8',function(err,data){
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
					};
					that.transfer(json,function(json_transfer){
						return callback(json_transfer);
					});
				}
				if(data_[0]==data[i][0]&&data_[1]==data[i][1]&&data_[2]==1){
					++i;
					var json=[];
					for(var j=0;j<data[0][0];++j){
						json[j]=data[i++];
						json[j].length=data[0][1];
					}
					that.transfer(json,function(json_transfer){
						return callback(json_transfer);
					});
				}	
			}
		});
	},
	transfer:function(json,callback){
		var json_transfer="";
		//i是行，j是列
		for(var j=0;j<json[0].length;++j){
			for(var k=0;k<json.length;++k){
				json_transfer=json_transfer+json[k][j]+" ";
				//console.log(json[j][i]);
			};
			json_transfer=json_transfer+"\r\n";
		};
		json_transfer=json_transfer.split("\r\n");
		json_transfer.length=json[0].length;
		console.log("ijk"+json_transfer);
		for(var j=0;j<json_transfer.length;++j){
			json_transfer[j]=json_transfer[j].split(" ");
			json_transfer[j].length=json.length;
		};
		callback(json_transfer);
	},
	write_timetable:function(data_,old_timetable,callback){
		this.transfer(old_timetable,function(timetable){
			fs.readFile("./public/executefile/out.txt",'utf-8',function(err,data){
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
						fs.writeFileSync('./public/executefile/out_1.txt',data[k++]+"\r\n",{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
							if(err){
								console.log("文件写入失败")
							}
						});
					}
					fs.unlink('./public/executefile/out.txt', function(err) {
						if (err) 
							throw err;
						console.log('文件删除成功');
					});
					fs.rename('./public/executefile/out_1.txt', './public/executefile/out.txt', function (err) {
						if (err) throw err;
						console.log('重命名完成');
					});
					callback();
				}
			});
		});
	},
	get_schedule:function(id_type,callback){
		var schedule=[];
		var that=this;
		fs.readFile("./public/executefile/out.txt",'utf-8',function(err,count){
        	if(err){
            	console.log("error");
			}
			//一周天数，每天上课节数
			var day=count[0];
			var course=count[2];
			fs.readFile("./public/executefile/table.txt",'utf-8',function(err,data){
				if(err){
					console.log("error");
				}
				else{
					//将文件按行分割一下
					//data=data.split("\r\r\n----------\r\r\n\r\r\n\r\r\n--------------------\r\r\n\r\r\n\r\r\n");
					data=data.split("--------------------\r\r\n\r\r\n");
					data[0]=data[0].split("\r\n\r\n");
					data[1]=data[1].split("\r\n\r\n");
					data[2]=data[2].split("\r\n\r\r\n----------\r\r\n");
					if(id_type[1]==0){
						for(var i=0;i<data[0].length;++i){
							var temp=data[0][i].split(" ");
							if(id_type[0]==temp[1]){
								temp=data[0][i].split("\r\n");
								for(var j=1;j<temp.length;++j){
									//schedule=schedule+temp[j]+"\r\n";
									schedule[j-1]=temp[j].split("|");
								};
								that.transfer_schedule(schedule,function(json_transfer){
									var json={
									"code":0,
									"msg":"查询课表成功",
									"schedule":json_transfer
									};
									callback(json);
									return;
								});
							}
						}
					}
					else if(id_type[1]==1){
						for(var i=0;i<data[1].length;++i){
							var temp=data[1][i].split(" ");
							if(id_type[0]==temp[1]){
								temp=data[1][i].split("\r\n");
								for(var j=1;j<temp.length;++j){
									schedule[j-1]=temp[j].split("|");
								}
								that.transfer_schedule(schedule,function(json_transfer){
									var json={
									"code":0,
									"msg":"查询课表成功",
									"schedule":json_transfer
									};
									callback(json);
									return;
								});
							}
						}
					}
					else if(id_type[1]==2){
						for(var i=0;i<data[2].length;++i){
							var temp=data[2][i].split("\r\n");
							temp[0]=temp[0].split("  ");
							if(id_type[0]==temp[0][1]){
								temp=data[2][i].split("\r\n");
								for(var j=1;j<temp.length;++j){
									schedule[j-1]=temp[j].split("|");
								}
								that.transfer_schedule(schedule,function(json_transfer){
									var json={
									"code":0,
									"msg":"查询课表成功",
									"schedule":json_transfer
									};
									callback(json);
									return;
								});
							}
						}
					}
					var json={
						"code":403,
						"msg":"无此课表"
					};
					callback(json);
				}
			});
		});
	},
	transfer_schedule:function(json,callback){
		var json_transfer="";
		//i是行，j是列
		for(var j=0;j<json[0].length;++j){
			for(var k=0;k<json.length;++k){
				json_transfer=json_transfer+json[k][j]+"|";
				//console.log(json[j][i]);
			};    
			json_transfer=json_transfer+"\r\n";
		};
		json_transfer=json_transfer.split("\r\n");
		json_transfer.length=json[0].length;
		for(var j=0;j<json_transfer.length;++j){
			json_transfer[j]=json_transfer[j].split("|");
			json_transfer[j].length=json.length;
		};
		callback(json_transfer);
	},
	first_run:function(arg,callback){
		fs.readFile("./public/executefile/out.txt",'utf-8',function(err,data){
        	if(err){
            	console.log("error");
			}
			else{
				fs.writeFileSync('./public/executefile/out_1.txt',"3 2 2 3 2 3\r\n",{flag:'w',encoding:'utf-8',mode:'0666'},function(err){
					if(err){
						console.log("文件写入失败")
					}else{
					    console.log("文件写入成功");
					}
				});
            	fs.writeFileSync('./public/executefile/out_1.txt',data,{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
					if(err){
						console.log("文件写入失败")
					}else{
						console.log("文件写入成功");
					}
				});
				fs.unlink('./public/executefile/out.txt', function(err) {
					if (err) 
						throw err;
					console.log('文件删除成功');
				});
				fs.rename('./public/executefile/out_1.txt', './public/executefile/out.txt', function (err) {
					if (err) throw err;
					console.log('重命名完成');
				});
			}
		});
		fs.writeFileSync('./public/executefile/run.bat',"@echo off\r\n"+"@a.exe 10 1000 "+parameter,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){
			if(err){
				console.log("文件写入失败")
			}else{
			    console.log("文件写入成功");
			}
		});

		child_process.execFile("a.exe",["10","1000",arg],{cwd:'./public/executefile/'},function(error,stdout,stderr){
			if(stdout==1){
				var json={
					code:"0",
					msg:"排课成功"
				}
				callback(json);
			}
			if(stdout==0){
				var json={
					code:"500",
					msg:"本次排课未获得理想结果"
				}
				callback(json);
			}
		});
	},
	repeat_run:function(arg,callback){
		child_process.execFile("a.exe",["10","1000",arg],{cwd:'./public/executefile/'},function(error,stdout,stderr){
			if(stdout==1){
				var json={
					code:"0",
					msg:"排课成功"
				}
				callback(json);
			}
			if(stdout==0){
				var json={
					code:"500",
					msg:"本次排课未获得理想结果"
				}
				callback(json);
			}
		});
	},
	// repeat_run:function(parameter,callback){
	// 	fs.writeFile('./public/executefile/run.bat',"@echo off\r\n"+"@a.exe 10 1000 "+parameter,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){
	// 		if(err){
	// 			console.log("文件写入失败");
	// 		}else{
	// 		    console.log("文件写入成功");
	// 		}
	// 	});
	// 	fs.writeFileSync('./public/executefile/test.txt',"lkdsfgjklsdjklg",{flag:'w',encoding:'utf-8',mode:'0666'},function(err){
	// 		if(err){
	// 			console.log("文件写入失败")
	// 		}
	// 		else{
	// 			console.log("dsjkhfjk");
	// 		}
	// 	});
	// 	console.log("begin");

	// 	// child_process.execFile('run.bat',null,{cwd:'./public/executefile/'},function(error, stdout, stderr){
	// 	// 	console.log("运行已完成");
	// 	// });

	// 	// var timeinc=1;
	// 	// while(true){
	// 	// 	var temp=timeinc*timeinc;
	// 	// 	time
	// 	// }
	// 	// fs.exists('./result.txt',function(exists){
	// 	// 	if(exists){
	// 	// 		console.log("success");
	// 	// 	}
	// 	// 	console.log("sdklfjkladffsd");
	// 	// })

	// 	// console.log("begin");
	// 	// fs.exists('./result.txt',function(exists){
	// 	// 	if(exists){
	// 	// 		console.log("success");
	// 	// 	}
	// 	// 	console.log("sdklfjkladffsd");
	// 	// });

		
	// 	// var flag=true;

	// 		//下面这个就是同
	// 		// fs.accessSync('./public/executefile/table.txt', function(err) {
	// 		// 	console.log("03");
	// 		// 	console.log(err ? '文件存在' : '文件不存在');
	// 		// 	flag=false;
	// 		var a;
	// 		// });

	// 	// };
   

	// 	// fs.access('./public/executefile/table.txt', function(err) {
	// 	// 	console.log(err+"sdlkjfkl");
	// 	// 	//flag=false;
	// 	// });

	// 	// var flag=true;
	// 	// var f = function (x) {  
	// 	// 	if (x === false) {  
	// 	// 		var flag;
	// 	// 		fs.accessSync('./public/executefile/table.txt', function(err) {
	// 	// 			fs.readFile("./public/executefile/out.txt",'utf-8',function(err,data){
	// 	// 				falg=data[0];
	// 	// 			});
	// 	// 		});
	// 	// 		return flag;
	// 	// 	} 
	// 	// 	else {  
	// 	// 		return f();  
	// 	// 	}  
	// 	// };  
	// 	// console.log("end_2");
	// },
	get_analysis:function(callback){
		fs.readFile("./public/executefile/analysis.txt",'utf-8',function(err,data){
        	if(err){
            	console.log("error");
			}
			data=data.split("\r\n");
		var analysis=[""];
		var j=0;
		for(var i=2;i<data.length;++i){
			if(data[i]!=""){
				analysis[j]=data[i];
				j++;
			};
		};
		var json={
			"code":0,
			"msg":"获取分析结果成功",
			"analysis":analysis
			};
		return callback(json);
		});
	},
	sort_subject:function(){
		var student = xlsx.parse('./public/file/Student.xlsx');
		var subject_temp=["物理","化学","生物","政治","历史","地理"];
    	var i=0;
    	while(i<student[0].data.length){
			//先编号
        	for(var j=3;j<6;++j){
            	for(var k=0;k<6;++k){
                	if(student[0].data[i][j]==subject_temp[k]){
                    	student[0].data[i][j]=k;
                    	break;
                	}
            	}
			}
			//重排序一次
        	var t=0;
     		if(student[0].data[i][3]>student[0].data[i][4]){
            	t=student[0].data[i][3];
            	student[0].data[i][3]=student[0].data[i][4];
            	student[0].data[i][4]=t;
        	}
        	if(student[0].data[i][3]>student[0].data[i][5]){
            	t=student[0].data[i][3];
            	student[0].data[i][3]=student[0].data[i][5];
            	student[0].data[i][5]=t;
        	}
        	if(student[0].data[i][4]>student[0].data[i][5]){
            	t=student[0].data[i][4];
            	student[0].data[i][4]=student[0].data[i][5];
            	student[0].data[i][5]=t;
        	}
			//重新变成汉字
        	for(var j=3;j<6;++j){
            	for(var k=0;k<6;++k){
                	if(student[0].data[i][j]==k){
                    	student[0].data[i][j]=subject_temp[k];
                    	break;
                	}
            	}
        	}
        	++i;
		}
		
		var j=0;
		while(j<student[0].data.length&&student[0].data[j][0]!=undefined){
			student[0].data[j][7]=0;
			student[0].data[j][8]=0;
			student[0].data[j][9]=0;
			++j;
		}
    
    	var buffer = xlsx.build([
        	{
            	name:'sheet1',
            	data:student[0].data   
        	}
    	]);
		fs.writeFileSync('./public/file/temp.xlsx',buffer,{'flag':'w'});   //生成excel
		
		fs.unlink('./public/file/Student.xlsx', function(err) {
			if (err) 
				throw err;
			console.log('文件删除成功');
		});
		fs.rename('./public/file/temp.xlsx', './public/file/Student.xlsx', function (err) {
			if (err) throw err;
			console.log('重命名完成');
		});
	},
	get_student_list:function(subject,callback){
		var subject_temp=["物理","化学","生物","政治","历史","地理"];
		for(var i=0;i<3;++i){
			for(var k=0;k<6;++k){
                if(subject[i]==subject_temp[k]){
                    subject[i]=k;
                    break;
                }
            }
		}
		//重排序一次
        var t=0;
     	if(subject[0]>subject[1]){
            t=subject[0];
            subject[0]=subject[1];
            subject[1]=t;
        }
        if(subject[0]>subject[2]){
            t=subject[0];
            subject[0]=subject[2];
            subject[2]=t;
        }
        if(subject[1]>subject[2]){
            t=subject[1];
            subject[1]=subject[2];
            subject[2]=t;
		}

		for(var i=0;i<3;++i){
			for(var k=0;k<6;++k){
                if(subject[i]==k){
                    subject[i]=subject_temp[k];
                    break;
                }
            }
		}

		//取得未安排班级所有学生列表
		var student = xlsx.parse('./public/file/Student.xlsx');
		var list=[];
    	var i=0;
    	while(i<student[0].data.length){
			if(student[0].data[i][3]==subject[0]&&student[0].data[i][4]==subject[1]&&student[0].data[i][5]==subject[2]&&student[0].data[i][7]==0){
				list.push(student[0].data[i]);
			}
        	++i;
		}

		function descend(x,y){
			return y[6] - x[6];  //按照数组的第7个值降序排列
		}
		list.sort(descend);

		var json={
			"code":0,
			"subject_list":subject,
			"student_count":list.length,
			"student_list":list
		}
		callback(json);
	},
	send_chosen_student:function(data,callback){
		//先将班级分好
		var subject_temp=["物理","化学","生物","政治","历史","地理"];
		var class_temp=[0,0,0];
		for(var i=0;i<3;++i){
			for(var k=0;k<6;++k){
                if(data.subject_list[i]==subject_temp[k]){
					++class_count[k];
					student_count[k].push(data.student_list.length);
					class_temp[i]=class_count[k];
                    break;
                }
            }
		}
		//排班
		var student = xlsx.parse('./public/file/Student.xlsx');
		var i=0;
		while(i<data.student_list.length){
			var id=data.student_list[i][0];
			student[0].data[id-1][7]=class_temp[0];
			student[0].data[id-1][8]=class_temp[1];
			student[0].data[id-1][9]=class_temp[2];
			++i;
		}
		var buffer = xlsx.build([
        	{
            	name:'sheet1',
            	data:student[0].data   
        	}
    	]);
		fs.writeFileSync('./public/file/temp.xlsx',buffer,{'flag':'w'});   //生成excel
		
		fs.unlink('./public/file/Student.xlsx', function(err) {
			if (err) 
				throw err;
			console.log('文件删除成功');
		});
		fs.rename('./public/file/temp.xlsx', './public/file/Student.xlsx', function (err) {
			if (err) throw err;
			console.log('重命名完成');
		});
		callback();
	},
	send_specific_number_student:function(data,callback){
		var length=data.student_number;
		if(data.student_number>data.student_list.length){
			length=data.student_list.length;
		}
		//先将班级分好
		var subject_temp=["物理","化学","生物","政治","历史","地理"];
		var class_temp=[0,0,0];
		for(var i=0;i<3;++i){
			for(var k=0;k<6;++k){
                if(data.subject_list[i]==subject_temp[k]){
					++class_count[k];
					student_count[k].push(length);
					class_temp[i]=class_count[k];
                    break;
                }
            }
		}
		//排班
		var student = xlsx.parse('./public/file/Student.xlsx');
		var i=0;
		while(i<length){
			var id=data.student_list[i][0];
			student[0].data[id-1][7]=class_temp[0];
			student[0].data[id-1][8]=class_temp[1];
			student[0].data[id-1][9]=class_temp[2];
			++i;
		}
		var buffer = xlsx.build([
        	{
            	name:'sheet1',
            	data:student[0].data   
        	}
    	]);
		fs.writeFileSync('./public/file/temp.xlsx',buffer,{'flag':'w'});   //生成excel
		
		fs.unlink('./public/file/Student.xlsx', function(err) {
			if (err) 
				throw err;
			console.log('文件删除成功');
		});
		fs.rename('./public/file/temp.xlsx', './public/file/Student.xlsx', function (err) {
			if (err) throw err;
			console.log('重命名完成');
		});
		callback();
	}
}