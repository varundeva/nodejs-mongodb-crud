var ExpSvr = require('express')
var ExpSvrFunc = ExpSvr()
var BdyParser = require('body-parser')
ExpSvrFunc.use(BdyParser.json())
var MdbCncVap = require('mongodb').MongoClient
var MdbUrlVar = "mongodb://localhost:27017"
var NamClnVar
MdbCncVap.connect(MdbUrlVar, (ErrMdbVar, SvrMdbVar) => {
    if (ErrMdbVar) throw ErrMdbVar
    var NamMdbVar = SvrMdbVar.db("ShoppingCart")
    NamClnVar = NamMdbVar.collection("Products")
    console.log("Connected Successfully")

})

ExpSvrFunc.listen(8080, function () {
    console.log("Server Started and Running")
})


// Read Operation
ExpSvrFunc.get("/cart", function (Req, Res) {
    NamClnVar.find({}).toArray((ErrMdbVar, ResMdbVar) => {
        if (ErrMdbVar) throw ErrMdbVar
        Res.json(ResMdbVar)
    })

})

//Create Operation
ExpSvrFunc.post("/cart", function (Req, Res) {
    const BdyReqVar = Req.body
    var AddItmVar = {
        "Uid": BdyReqVar.Uid,
        "Name": BdyReqVar.Name,
        "Cost": BdyReqVar.Cost
    }
    NamClnVar.insertOne(AddItmVar, (ErrMdbVar, ResMdbVar) => {
        if (ErrMdbVar) throw ErrMdbVar
        Res.status(201)
        Res.send("Record Added Successfully")

    })
})

//Update Operation
ExpSvrFunc.put("/cart/:Uid", function (Req, Res) {
    var ReqUidVar = Number(Req.params.Uid)
    const BdyReqVar = Req.body
    var UpdItmVar = {
        "Uid": ReqUidVar,
        "Name": BdyReqVar.Name,
        "Cost": BdyReqVar.Cost
    }
    NamClnVar.updateOne({ "Uid": ReqUidVar }, { $set: UpdItmVar }, function (ErrMdbVar, ResMdbVar) {
        if (ErrMdbVar) throw ErrMdbVar
        Res.status(201)
        Res.send("Data Updated Successfully")
    })

})

// Delete Operation
ExpSvrFunc.delete("/cart/:Uid", function (Req, Res) {
    var ReqUidVar = Number(Req.params.Uid)
    NamClnVar.deleteOne({"Uid":ReqUidVar},function(ErrMdbVar,ResMdbVar){
        if(ErrMdbVar) throw ErrMdbVar
        Res.status(201)
        Res.send("One Data Successfully Deleted")
    })
})

