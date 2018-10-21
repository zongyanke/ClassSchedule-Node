var express = require('express');
var fs=require('fs');
var multiparty=require('multiparty');
var server=require('./server.js')
var router = express.Router();

//跨域访问
router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

//注册
router.post("/register",function(req,res){ 
    if(req.body.id==""||req.body.password_1==""||req.body.password_2==""||req.body.password_1!=req.body.password_2){
        var json={
            "code":403,
            "msg":"register error"
        };
        res.send(JSON.stringify(json));
    }
    else{
        var params = {
            "id":req.body.id,
            "password":req.body.password_1
        };
        //回调函数
        server.writeUser(params,function(judge){
            if(judge==0){
                var json={
                    "code":409,
                    "msg":"存在同名用户"
                };
                res.send(JSON.stringify(json));
            }
            else{
                var json={
                    "code":0,
                    "msg":"注册成功"
                };
                res.send(JSON.stringify(json));
            }
        });
    }
});

//登陆
router.post("/login",function(req,res){
    var id = req.body.id;
    var password = req.body.password;

    var params = {
        "id":req.body.id,
        "password":req.body.password
    };
    // // server.writeJson(params);
    server.judgeUser(params,function(flag){
        if(flag){
            var json={
                "code":0,
                "msg":"login success"
            };
            res.send(JSON.stringify(json));
        }
        else{
            var json={
                "code":403,
                "msg":"login fail"
            };
            res.send(JSON.stringify(json));
        }
    });
});

router.post("/upload",function(req,res){
    var form = new multiparty.Form();
    form.uploadDir='./public/file/';
	form.parse(req, function(err, fields, files) {
        if(err) {
            var json={
                "code":404,
                "msg":"上传文件失败"
            };
            res.send(JSON.stringify(json));   
        }
        else {
            for(var i=0;i<2;++i){
                var inputFile = files.myfile[i];
                var uploadedPath = inputFile.path;
                var dstPath = './public/file/' + inputFile.originalFilename;
                //重命名为真实文件名
                fs.rename(uploadedPath, dstPath, function(err) {
                    if(err) {
                        console.log('rename error:' + err);
                    }
                })
            }
            var json={
                "code":0,
                "msg":"上传文件成功"
            };
            res.send(JSON.stringify(json));
        }
    })
});

router.post("/limit",function(req,res){
    var limit=[req.query.day,req.query.course,req.query.classroom,req.query.capacity,req.query.class];
    if(limit[0]==""||limit[1]==""||limit[2]==""||limit[3]==""||limit[4]==""){
        var json={
            "code":403,
            "msg":"empty limit"
        };
        res.send(JSON.stringify(json));
    }
    else{
        server.writeout_0(limit);
        var json={
            "code":0,
            "msg":"limit success"
        };
        res.send(JSON.stringify(json));
    }
});
        

router.post("/test",function(req,res){
    res.send("sorry");
});

router.get("/getlist",function(req,res){
    server.initCouTeaList(function(data){
        res.send(JSON.stringify(data));
    });
});

router.get("/get_timetable",function(req,res){
    var data=[req.query.id,req.query.name,req.query.type];
    if(data[0]==""||data[1]==""||data[2]==""){
        var json={
            "code":403,
            "msg":"error"
        };
        res.send(JSON.stringify(json));
    }
    else{
        //type=0是course，type=1是teacher
        server.get_timetable(data,function(json){
            res.send(JSON.stringify(json));
    });
    }
});


router.post("/write_timetable",function(req,res){
    var data=[req.body.id,req.body.name,req.body.type];
    console.log(req.body.timetable);
    //var timetable=JSON.parse(req.body.timetable);
    //console.log(timetable);,
    //type=0是course，type=1是teacher
    //console.log(JSON.parse(req.body.timetable));
    var timetable=req.body.timetable;
    server.write_timetable(data,timetable,function(){
        var json={
            "code":0,
            "msg":"修改矩阵成功"
        };
        res.send(JSON.stringify(json));
    });
});

router.get("/get_schedule",function(req,res){
    //req.query.type==0是学生，req.query.type==1是老师,req.query.type==2是教室
    var data=[req.query.id,req.query.type];
    server.get_schedule(data,function(schedule){
        res.end(JSON.stringify(schedule));
    });
});

router.get("/run",function(req,res){
    server.run(function(){
        var json={
            "code":0,
            "msg":"排课成功"
        };
        res.send(JSON.stringify(json));
    });
});

router.get("/get_analysis",function(req,res){
    server.get_analysis(function(analysis){
        res.end(JSON.stringify(analysis));
    });
});
module.exports = router;