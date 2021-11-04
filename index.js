const express = require('express'); // server software
const bodyParser = require('body-parser'); // parser middleware
const getResources = require('./controllers/resources');
const Res = require('./models/resource'); // 
const app = express();
var multer = require('multer');
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/crud', express.static(__dirname + '/crud'));
app.use('/layout', express.static(__dirname + '/layout'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));


// old multer code here - start
var storage = multer.diskStorage({
    destination : function(req , file , cb) {
        console.log("FILE :: ",file);
        cb(null , 'assets/media/users/')
    },
    filename : function (req , file , cb) {
        cb(null , Date.now() + file.originalname)
    }
})

var upload = multer({
    storage : storage,
    fileFilter: (req, file, cb) => {
        console.log("FILE == ",file);
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        // if (file.mimetype == "application/vnd.ms-excel" ) {
          cb(null, true);
        } else {
          cb(null, false);
        //   return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
      }
})
// old multer code here - close


app.use('/resource', getResources);

app.get('/blogs/view' , async (req , res)=>{
    res.render('resource/view')
});


app.get('/', async (req , res)=>{

    try {
        // console.log('req -> ',req);
        await Res.find().then(function (ninja){
            
            var oj=JSON.stringify(ninja);
            var hh=JSON.parse(oj)
            
            res.render('resource/table',{data:hh})
        })


        // res.send(users);

    } catch (error) {
        console.log(error.message);
    }


});


app.get('/delete/:id' , async (req , res )=>{
    Res.findByIdAndDelete(req.params.id , function(err){
        if(err){
            res.send('error in deleting ');
        } else {
            res.redirect(301 , "/");
        }
     });
})

// redirect to update
app.get('/update/:id', async (req , res)=>{

    try {
        // console.log('req -> ',req);
        await Res.findById(req.params.id).then(function (ninja){
            
            // console.log(ninja);
            var oj=JSON.stringify(ninja);
            var hh=JSON.parse(oj)
            
            res.render('resource/update',{data:hh})
        })


        // res.send(users);

    } catch (error) {
        console.log(error.message);
    }


    // res.render('resource/add')
});


// post request to update
app.post('/update/:id', upload.single('blogimage'), async (req , res)=>{

    if(req.file){
            var updateObj = {
                fileinfo : req.file.path,
                name : req.body.name,
                delivery : req.body.delivery,
                set_name : req.body.set_name,
                bid_strategy : req.body.bid_strategy,
                budget : req.body.budget,
                results : req.body.results,
                impressions : req.body.impressions,
                cost_per_result : req.body.cost_per_result,
                add_to_cart : req.body.add_to_cart,
                purchases : req.body.purchases,
                amount_spent : req.body.amount_spent,
                purchase_con_val : req.body.purchase_con_val,
                purchase_roas : req.body.purchase_roas,
                unique_link_click : req.body.unique_link_click,
                cpc : req.body.cpc,
                company_name : req.body.company_name,
                ship_date : req.body.ship_date,
                status : req.body.status,
                type : req.body.type,
            }
    }else{
        var updateObj = {
            name : req.body.name,
            delivery : req.body.delivery,
            set_name : req.body.set_name,
            bid_strategy : req.body.bid_strategy,
            budget : req.body.budget,
            results : req.body.results,
            impressions : req.body.impressions,
            cost_per_result : req.body.cost_per_result,
            add_to_cart : req.body.add_to_cart,
            purchases : req.body.purchases,
            amount_spent : req.body.amount_spent,
            purchase_con_val : req.body.purchase_con_val,
            purchase_roas : req.body.purchase_roas,
            unique_link_click : req.body.unique_link_click,
            cpc : req.body.cpc,
            company_name : req.body.company_name,
            ship_date : req.body.ship_date,
            status : req.body.status,
            type : req.body.type,
        }
    }
    
        try{
            
            // console.log(';;file -> ', req.file.path);
            
            await Res.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    $set: updateObj,
                    
                }
            ).then(function (data){
                res.redirect(301 , "/");
            }).catch(function (err){
                console.log(err.message)
            })
        }catch(err){
            // console.log(';;file -> ', req.file.path);
            console.log('err : ', err.message)
        }
        
        //  ===========================
        // res.send(req.body);
    
        // res.send('blogs section');
       
        //  =====================================
    
    });

// assign port
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`This app is listening on port ${port}`));  