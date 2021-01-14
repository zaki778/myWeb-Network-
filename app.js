var express = require('express');
var path = require('path');
var fs=require('fs');
const { stringify } = require('querystring');
const { userInfo } = require('os');
var app = express();
const session =require('express-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session
  ({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  })
);
//new
var isLoggedin=false;
var loggedUser=null;

function inArray(array,user)
{
  for(var i=0; i<array.length; i++)
  {
    if ( array[i].Name === user.Name)

     {
      //console.log('feen');
      return true;
     }
     
  }
  return false;

}


function check(array,user)
{
  for(var i=0; i<array.length; i++)
  {
    if ( array[i].Name === user.Name && array[i].Pass ===user.Pass)

     {
      //console.log('feen');
      return true;
     }
     
  }
  return false;

}

function isLogged (res, page)
{
  if (isLoggedin)
   res.render(page);
  else 
  {
    loggedUser=-1;
    res.redirect('/');
  }
}
function isLoggedP (res, page, msg)
{
  if (isLoggedin)
   res.render(page,{title:msg});
  else 
  {
    loggedUser=-1;
    res.redirect('/');
  }
}

function checkBook(arrayOfBooks, theBook)
{
  for (let i=0; i<arrayOfBooks.length;i++)
  {
    if (arrayOfBooks[i]===theBook)
     return true;
  }
  return false;

}

function addBook(bookName, res, thePlace)
{
  
  var booksData=fs.readFileSync("books.json");
  listOfBooks=JSON.parse(booksData);
  
  for(let j=0 ; j<listOfBooks.length ; j++)
  {
  
    if (listOfBooks[j][0]===loggedUser)
    {
      if (!(checkBook(listOfBooks[j], bookName) ))
      {
        listOfBooks[j].push(bookName);
        res.redirect('readlist');
      }
      
      else 
      res.render(thePlace, {title: "Error! This Book Is Already Added"});
    
    }
     
   }
    var stringOfBooks=JSON.stringify(listOfBooks);
      fs.writeFileSync("books.json", stringOfBooks);
      
      
}

app.get('/registration',function(req,res)
{
  res.render('registration', {title: "Registration"});
  
}
); 

app.post('/registration',function(req,res)
{
  var  userName = req.body.username;
  var password = req.body.password;

  var user = {Name:userName,Pass:password};

  var data=fs.readFileSync("users.json");
  var arrayOfUsers =JSON.parse(data);

  if(inArray(arrayOfUsers,user))
  {
    
    res.render('registration', {title: "Already Existing UserName"});
  }
  else
  {
        arrayOfUsers.push(user);
        
        stringOfUsers=JSON.stringify(arrayOfUsers);
        fs.writeFileSync("users.json",stringOfUsers);

        
        //new
        var booksData=fs.readFileSync("books.json");
        listOfBooks=JSON.parse(booksData);

        listOfBooks.push([user.Name]);
        var stringOfBooks=JSON.stringify(listOfBooks);
        fs.writeFileSync("books.json", stringOfBooks);


        
      
        res.redirect('/');

  }
  
});
  



app.get('/',function(req,res)
{
  if(loggedUser==-1)
    res.render('login', {title: "Not Logged in"});
  else
    res.render('login', {title: "Welcome"});

}
); 

app.post('/',function(req,res)
{
  
  var  userName =req.body.username;
  var password=req.body.password;

  var user={Name:userName,Pass:password};
  
 


  var data=fs.readFileSync("users.json");
  var arrayOfUsers =JSON.parse(data);
  
  if(inArray(arrayOfUsers,user))
  {
    if(check(arrayOfUsers,user))
  
      {
        //new
        isLoggedin=true;
        loggedUser=user.Name;
        req.session.userid;
        res.redirect('home');
      }
      else
      {
        
        res.render('login', {title: "Password is Incorrect"});
      }
  }
  
    
  else
  {
    res.render('login', {title: "UserNotRegistered"});
  }
  
}
);




app.get('/home',function(req,res)
{
  isLogged(res, 'home');
  
//  , {title: "Not Logged in"});
}
); 


app.get('/dune',function(req,res)
{
  isLoggedP(res, 'dune', '.');
}
); 

app.post('/dune',function(req,res)
{
  addBook("Dune", res, 'dune');
  
  
});



app.get('/flies',function(req,res)
{
  isLoggedP(res, 'flies', '.');
}
); 

app.post('/flies',function(req,res)
{
  addBook("Lord Of the Flies", res, 'flies'); 
  
        
 });


app.get('/grapes',function(req,res)
{
  isLoggedP(res, 'grapes', '.');
}
); 
app.post('/grapes',function(req,res)
{
  addBook("The Grapes Of Wrath", res, 'grapes');
  
 });
 

app.get('/leaves',function(req,res)
{
  isLoggedP(res, 'leaves', '.');
}
); 
app.post('/leaves',function(req,res)
{
  addBook("Leaves Of Grass", res, 'leaves');
        
});



app.get('/mockingbird',function(req,res)
{
  isLoggedP(res, 'mockingbird', '.');
}
); 
app.post('/mockingbird',function(req,res)
{
  addBook("To Kill a Mockingbird", res, 'mockingbird');
  
});

app.get('/sun',function(req,res)
{
  isLoggedP(res, 'sun', '.');
}
); 
app.post('/sun',function(req,res)
{
  addBook("The Sun And Her Flowers", res, 'sun');
        
 });

 app.get('/fiction',function(req,res)
{
  isLogged(res, 'fiction');
}
); 

app.get('/novel',function(req,res)
{
  isLogged(res, 'novel');
}
); 

app.get('/poetry',function(req,res)
{
  isLogged(res, 'poetry');
}
); 

app.get('/readlist',function(req,res)

  {
   if(isLoggedin)
   {
    
  var booksData=fs.readFileSync("books.json");
  listOfBooks=JSON.parse(booksData);
  
  for(let j=0 ; j<listOfBooks.length ; j++)
  {
  
    if (listOfBooks[j][0]===loggedUser)
    {
      if (checkBook(listOfBooks[j], "Lord Of the Flies") )
        book1="Lord Of the Flies";
        else
        book1='none';
      
      if (checkBook(listOfBooks[j], "Dune") )
        book2="Dune";
        else 
        book2='none';

        if (checkBook(listOfBooks[j], "Leaves Of Grass") )
        book3="Leaves Of Grass";
        else 
        book3='none';

        if (checkBook(listOfBooks[j], "The Sun And Her Flowers") )
        book4="The Sun And Her Flowers";
        else 
        book4='none';

        if (checkBook(listOfBooks[j], "To Kill a Mockingbird") )
        book5="To Kill a Mockingbird";
        else 
        book5='none';

        if (checkBook(listOfBooks[j], "The Grapes Of Wrath") )
        book6="The Grapes Of Wrath";
        else 
        book6='none';
      
    
    }
     
   }
  res.render('readlist',
   {
   book1, 
   book2,
   book3, 
   book4, 
   book5, 
   book6 
   });}
   else
   {
    loggedUser=-1;
    res.redirect('/');

   }
}
); 



app.get('/searchresults',function(req,res)
{
  if (isLoggedin)
  res.render('searchresults',{ title:'Search Results'});
  else
  {
    loggedUser=-1;
    res.redirect('/');
  }
  

}
);

let searchedBook="";
app.post('/searchresults' ,function(req,res)
{
  searchedBook=req.body.Search ;
  switch(searchedBook.toUpperCase())
  {
     case "THE GRAPES OF WRATH": res.redirect('grapes')
    break;
    
    case "LEAVES OF GRASS": res.redirect('leaves')
    break;
    

    case "THE SUN AND HER FLOWERS": res.redirect('sun')
    break;


    case "DUNE": res.redirect('dune')
    break;
    

    case "TO KILL A MOCKING BIRD": res.redirect('mockingbird')
    break;

    case "LORD OF THE FLIES": res.redirect('flies')
    break;

    default: res.render('searchresults',{ title:'No Such a book'});
  }
  
}
);











if(process.env.PORT)
{
  app.listen(process.env.PORT,function(){console.log("Server Started")});
}
else
{
  app.listen(3000,function(){console.log("Server started on port 3000")});
}


