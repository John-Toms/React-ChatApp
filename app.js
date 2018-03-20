var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017/mdb');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.post('/login', (req, res) => {
  dbConn.then(function (db) {
    var query = { useremail: req.body.useremail };
    db.collection('userlist').find(query).toArray().then(function (response) {
      // data = JSON.parse(response);
      if (response.length != 0) {
        if (response[0].userpassword == req.body.userpassword) {
          res.send('Successful');
        } else {
          res.status(202);
          res.send('WrongPassword');
        }
      } else {
        res.status(201);
        res.send('InvalidUserEmail');
      }
    });
  });
});
app.post('/regester', (req, res) => {

  dbConn.then(function (db) {
    var query = { useremail: req.body.useremail };
    db.collection('userlist').find(query).toArray().then(function (response) {
      if (response.length == 0) {
        console.log(response)
        delete req.body._id;
        db.collection('userlist').insertOne(req.body);
        console.log(req.body);
        res.send('Successful' );
      } else {
        res.send('Exist');
      }
    });
  });
});

app.post('/usercheck', (req, res) => {
  dbConn.then(function (db) {
    var query = { useremail: req.body.useremail };
    db.collection('userlist').find(query).toArray().then(function (response) {
      if (response.length == 0) {
        console.log(response)
        res.send('New' );
      } else {
        res.send('Exist');
      }
    });
  });
});

app.post('/re-password', (req, res) => {
  dbConn.then(function (db) {
    var query = { useremail: req.body.useremail };
    db.collection('userlist').find(query).toArray().then(function (response) {
      if (response.length == 0) {
        res.status(202);
        res.send('Invalid UserEmail!' );
      } else {
          var mailOpts, smtpTrans;
          // Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
          smtpTrans = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                  user: "toms199363@gmail.com",
                  pass: "tomsite1" 
              }
          });
          
          //Mail options
          mailOpts = {
            from: 'toms199363@gmail.com', // sender address
            to: 'toms63@yahoo.com', // list of receivers
            subject: 'Verification Link', // Subject line
            html: '<div style="margin: 0px; padding: 0px;" ><div class="publicate_embed type_0"><div class="pub_container" style="font-weight:300; font-size:14px !important; color: #555555; font-family: helvetica neue,helvetica,arial,verdana,sans-serif;background-color:#F9F9F7;"><div class="pub_blocks_inner" style="padding:0; margin:0 auto;background-color:#FFFFFF;max-width:860px;"><div style="text-align:center;padding:0 0 20px 0;position:relative" class="bt"><a href="http://localhost:3000" target="_blank"> <img alt="Copy of Copy of Copy of Welcome to our website!" src="https://publicate.it/img/537x0x9/f/S3B/-538700-1.jpg-19892.jpg" width="35.8%" style="border:none; outline:none; text-decoration:none; box-shadow:none !important; vertical-align:bottom"></a></div><div class="pub_row" style="background-color: #ffffff; padding-top:0px; padding-bottom:15px"><div style="padding:px % px %; line-height:1.5!important;text-align:center;"><h2 style="padding: 0 !important;margin: 0!important;line-height: 1.5;display:inline-block;width:auto;text-align:center;font-weight:bold;font-style:normal;color:#2ecc71 !important;font-size:32px;background-color:transparent;border-radius:7px; -webkit-border-radius: 7px; -moz-border-radius: 7px;font-family: comic sans ms,marker felt-thin,arial,sans-serif;vertical-align: top;"><div>Welcome to our website!</div></h2></div><div style="clear:both; height:0px"></div></div><div class="pub_row" style="background-color: transparent; padding-top:15px; padding-bottom:15px"><div class="pub_block pb" style=" margin:0 1.00% 0 1.00%; width: 98%; float:left;vertical-align:top;position:relative;min-height:1px;"><div class="pub_block_inner no_drop"><div style="color:#555555; padding: 0; font-size:17px !important; line-height:1.5; font-weight:300; font-family: helvetica neue,helvetica,arial,verdana,sans-serif;word-wrap:break-word;"><div>Welcome to our website. You have to click below button to change your password. There you can change your password.<div>This is not you, please let me know for safe of your account.</div></div></div></div></div><div style="clear:both; height:0px"></div></div><div class="pub_row" style="background-color: transparent; padding-top:15px; padding-bottom:15px"><div style="text-align: center; display: block;" class=""><a href="http://localhost:3000/login" target="_blank" style="cursor: pointer; text-decoration: none !important; -moz-border-radius: 5px; -webkit-border-radius: 5px; border-radius: 5px; display: inline-block; padding: 10px 20px; font-size: 17px; background-color: #2ecc71; color: #fff; -moz-box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, 0.2); -webkit-box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, 0.2); box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, 0.2); margin: 0; data-block_id=" 769992="" dir="auto">Click once</a></div><div style="clear:both; height:0px"></div></div><div class="pub_row" style="background-color: transparent; padding-top:15px; padding-bottom:15px"><div class="pub_block pb" style=" margin:0 1% 0 1%; width: 98%; float:left;vertical-align:top;position:relative;min-height:1px;"><div class="pub_block_inner no_drop"><div style="color:#555555; padding: 0; font-size:17px !important; line-height:1.5; font-weight:300; font-family: helvetica neue,helvetica,arial,verdana,sans-serif;word-wrap:break-word;"><div>Please click this <a href="" dir="auto" style="color:#488da8 !important; color:#488da8; text-decoration:none !important; text-decoration:none;">link</a> to change your account.&nbsp;</div></div></div></div><div style="clear:both; height:0px"></div></div><div class="pub_row" style="background-color: transparent; padding-top:15px; padding-bottom:15px"><div style="padding:px % px %; line-height:1.5!important;text-align:right;"><h2 style="padding: 0 !important;margin: 0!important;line-height: 1.5;display:inline-block;width:auto;text-align:right;font-weight:normal;font-style:normal;color:#555555 !important;font-size:16px;background-color:transparent;border-radius:0px; -webkit-border-radius: 0px; -moz-border-radius: 0px;font-family: helvetica neue,helvetica,arial,verdana,sans-serif;vertical-align: top;"><div>Safe team</div></h2></div><div style="clear:both; height:0px"></div></div><div style="clear:both; height:1px"></div><div style="text-align: center; padding: 20px 0!important; margin:0!important; color:#b2b2b2!important; "><a target="_blank" href="https://publicate.it/?e=36661&amp;utm_source=web&amp;utm_medium=poweredby" style="color:#b2b2b2!important; line-height:28px!important; padding: 0!important; text-decoration:none!important; border:none!important;"><img src="https://publicate.it/resources/images/created_in_publicate_s.png" width="150" height="21" style="border:none; outline:0; text-decoration:none; max-width: 150px !important; width:100%; margin:0 auto; vertical-align:middle!important; display:block;" alt="created in Publicate"></a></div></div></div> </div><link href="https://fonts.googleapis.com/css?family=Oxygen:400,300,700" rel="stylesheet" type="text/css"><script type="text/javascript">var lc_id=11088-0;</script><script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js?1"></script><script type="text/javascript" src="/js/view_pub.js?3"></script><script id="wappalyzer" src="chrome-extension://gppongmhjkpfnbhagpmjfkannfbllamg/js/inject.js"></script><div id="SL_balloon_obj" alt="0" style="display: block;"><div id="SL_button" class="SL_ImTranslatorLogo" style="background: url(&quot;chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/img/util/imtranslator-s.png&quot;); display: none; opacity: 0; left: 1037px; top: 530px; transition: visibility 2s, opacity 2s linear;"></div><div id="SL_shadow_translation_result2" style="display: none;"></div><div id="SL_shadow_translator" style="display: none;"><div id="SL_planshet"><div id="SL_arrow_up" style="background: url(&quot;chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/img/util/up.png&quot;);"></div><div id="SL_Bproviders"><div class="SL_BL_LABLE_ON" title="Google" id="SL_P0">G</div><div class="SL_BL_LABLE_ON" title="Microsoft" id="SL_P1">M</div><div class="SL_BL_LABLE_ON" title="Translator" id="SL_P2">T</div></div><div id="SL_alert_bbl" style="display: none;"><div id="SLHKclose" style="background: url(&quot;chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/img/util/delete.png&quot;);"></div><div id="SL_alert_cont"></div></div><div id="SL_TB"><table id="SL_tables" cellspacing="1"><tr><td class="SL_td" width="10%" align="right"><input id="SL_locer" type="checkbox" title="Lock-in language"></td><td class="SL_td" width="20%" align="left"><select id="SL_lng_from" style="background: url(&quot;chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/img/util/select.png&quot;) 100% 0px no-repeat rgb(255, 255, 255);"><option value="auto">Detect language</option><option value="af">Afrikaans</option><option value="sq">Albanian</option><option value="ar">Arabic</option><option value="hy">Armenian</option><option value="az">Azerbaijani</option><option value="eu">Basque</option><option value="be">Belarusian</option><option value="bn">Bengali</option><option value="bs">Bosnian</option><option value="bg">Bulgarian</option><option value="ca">Catalan</option><option value="ceb">Cebuano</option><option value="ny">Chichewa</option><option value="zh-CN">Chinese (Simplified)</option><option value="zh-TW">Chinese (Traditional)</option><option value="hr">Croatian</option><option value="cs">Czech</option><option value="da">Danish</option><option value="nl">Dutch</option><option value="en">English</option><option value="eo">Esperanto</option><option value="et">Estonian</option><option value="tl">Filipino</option><option value="fi">Finnish</option><option value="fr">French</option><option value="gl">Galician</option><option value="ka">Georgian</option><option value="de">German</option><option value="el">Greek</option><option value="gu">Gujarati</option><option value="ht">Haitian Creole</option><option value="ha">Hausa</option><option value="iw">Hebrew</option><option value="hi">Hindi</option><option value="hmn">Hmong</option><option value="hu">Hungarian</option><option value="is">Icelandic</option><option value="ig">Igbo</option><option value="id">Indonesian</option><option value="ga">Irish</option><option value="it">Italian</option><option value="ja">Japanese</option><option value="jw">Javanese</option><option value="kn">Kannada</option><option value="kk">Kazakh</option><option value="km">Khmer</option><option value="ko">Korean</option><option value="lo">Lao</option><option value="la">Latin</option><option value="lv">Latvian</option><option value="lt">Lithuanian</option><option value="mk">Macedonian</option><option value="mg">Malagasy</option><option value="ms">Malay</option><option value="ml">Malayalam</option><option value="mt">Maltese</option><option value="mi">Maori</option><option value="mr">Marathi</option><option value="mn">Mongolian</option><option value="my">Myanmar (Burmese)</option><option value="ne">Nepali</option><option value="no">Norwegian</option><option value="fa">Persian</option><option value="pl">Polish</option><option value="pt">Portuguese</option><option value="pa">Punjabi</option><option value="ro">Romanian</option><option value="ru">Russian</option><option value="sr">Serbian</option><option value="st">Sesotho</option><option value="si">Sinhala</option><option value="sk">Slovak</option><option value="sl">Slovenian</option><option value="so">Somali</option><option value="es">Spanish</option><option value="su">Sundanese</option><option value="sw">Swahili</option><option value="sv">Swedish</option><option value="tg">Tajik</option><option value="ta">Tamil</option><option value="te">Telugu</option><option value="th">Thai</option><option value="tr">Turkish</option><option value="uk">Ukrainian</option><option value="ur">Urdu</option><option value="uz">Uzbek</option><option value="vi">Vietnamese</option><option value="cy">Welsh</option><option value="yi">Yiddish</option><option value="yo">Yoruba</option><option value="zu">Zulu</option></select></td><td class="SL_td" width="3" align="center"><div id="SL_switch_b" title="Switch languages" style="background: url(&quot;chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/img/util/switchb.png&quot;);"></div></td><td class="SL_td" width="20%" align="left"><select id="SL_lng_to" style="background: url(&quot;chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/img/util/select.png&quot;) 100% 0px no-repeat rgb(255, 255, 255);"><option value="af">Afrikaans</option><option value="sq">Albanian</option><option value="ar">Arabic</option><option value="hy">Armenian</option><option value="az">Azerbaijani</option><option value="eu">Basque</option><option value="be">Belarusian</option><option value="bn">Bengali</option><option value="bs">Bosnian</option><option value="bg">Bulgarian</option><option value="ca">Catalan</option><option value="ceb">Cebuano</option><option value="ny">Chichewa</option><option value="zh-CN">Chinese (Simplified)</option><option value="zh-TW">Chinese (Traditional)</option><option value="hr">Croatian</option><option value="cs">Czech</option><option value="da">Danish</option><option value="nl">Dutch</option><option value="en">English</option><option value="eo">Esperanto</option><option value="et">Estonian</option><option value="tl">Filipino</option><option value="fi">Finnish</option><option value="fr">French</option><option value="gl">Galician</option><option value="ka">Georgian</option><option value="de">German</option><option value="el">Greek</option><option value="gu">Gujarati</option><option value="ht">Haitian Creole</option><option value="ha">Hausa</option><option value="iw">Hebrew</option><option value="hi">Hindi</option><option value="hmn">Hmong</option><option value="hu">Hungarian</option><option value="is">Icelandic</option><option value="ig">Igbo</option><option value="id">Indonesian</option><option value="ga">Irish</option><option value="it">Italian</option><option value="ja">Japanese</option><option value="jw">Javanese</option><option value="kn">Kannada</option><option value="kk">Kazakh</option><option value="km">Khmer</option><option selected="selected" value="ko">Korean</option><option value="lo">Lao</option><option value="la">Latin</option><option value="lv">Latvian</option><option value="lt">Lithuanian</option><option value="mk">Macedonian</option><option value="mg">Malagasy</option><option value="ms">Malay</option><option value="ml">Malayalam</option><option value="mt">Maltese</option><option value="mi">Maori</option><option value="mr">Marathi</option><option value="mn">Mongolian</option><option value="my">Myanmar (Burmese)</option><option value="ne">Nepali</option><option value="no">Norwegian</option><option value="fa">Persian</option><option value="pl">Polish</option><option value="pt">Portuguese</option><option value="pa">Punjabi</option><option value="ro">Romanian</option><option value="ru">Russian</option><option value="sr">Serbian</option><option value="st">Sesotho</option><option value="si">Sinhala</option><option value="sk">Slovak</option><option value="sl">Slovenian</option><option value="so">Somali</option><option value="es">Spanish</option><option value="su">Sundanese</option><option value="sw">Swahili</option><option value="sv">Swedish</option><option value="tg">Tajik</option><option value="ta">Tamil</option><option value="te">Telugu</option><option value="th">Thai</option><option value="tr">Turkish</option><option value="uk">Ukrainian</option><option value="ur">Urdu</option><option value="uz">Uzbek</option><option value="vi">Vietnamese</option><option value="cy">Welsh</option><option value="yi">Yiddish</option><option value="yo">Yoruba</option><option value="zu">Zulu</option></select></td><td class="SL_td" width="5%" align="center"> </td><td class="SL_td" width="8%" align="center"><div id="SL_TTS_voice" title="Listen to the translation" style="background: url(&quot;chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/img/util/ttsvoice.png&quot;);"></div></td><td class="SL_td" width="8%" align="center"><div id="SL_copy" title="Copy translation" class="SL_copy" style="background: url(&quot;chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/img/util/copy.png&quot;);"></div></td><td class="SL_td" width="8%" align="center"><div id="SL_bbl_font_patch"></div><div id="SL_bbl_font" title="Font size" class="SL_bbl_font" style="background: url(&quot;chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/img/util/font.png&quot;);"></div></td><td class="SL_td" width="8%" align="center"><div id="SL_bbl_help" title="Help" style="background: url(&quot;chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/img/util/bhelp.png&quot;);"></div></td><td class="SL_td" width="15%" align="right"><div id="SL_pin" class="SL_pin_off" title="Pin pop-up bubble" style="background: url(&quot;chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/img/util/pin-on.png&quot;);"></div></td></tr></table></div></div><div id="SL_shadow_translation_result" style="visibility: visible;"></div><div id="SL_loading" class="SL_loading" style="background: url(&quot;chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/img/util/loading.gif&quot;);"></div><div id="SL_player2"></div><div id="SL_alert100">Text-to-speech function is limited to 200 characters</div><div id="SL_Balloon_options" style="background: url(&quot;chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/img/util/bg3.png&quot;) rgb(255, 255, 255);"><div id="SL_arrow_down" style="background: url(&quot;chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/img/util/down.png&quot;);"></div><table id="SL_tbl_opt" width="100%"><tr><td width="5%" align="center"><input id="SL_BBL_locer" type="checkbox" checked="1" title="Show Translators button 3 second(s)"></td><td width="5%" align="left"><div id="SL_BBL_IMG" title="Show Translators button 3 second(s)" style="background: url(&quot;chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/img/util/bbl-logo.png&quot;);"></div></td><td width="70%" align="center"><a href="chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/html/options/options.html?bbl" target="_blank" class="SL_options" title="Show options">Options</a> : <a href="chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/html/options/options.html?hist" target="_blank" class="SL_options" title="Translation History">History</a> : <a href="chrome-extension://noaijdpnepcgjemiklgfkcfbkokogabh/content/html/options/options.html?feed" target="_blank" class="SL_options" title="ImTranslator Feedback">Feedback</a> : <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&amp;hosted_button_id=GD9D8CPW8HFA2" target="_blank" class="SL_options" title="Make a small contribution">Donate</a></td><td width="15%" align="right"><span id="SL_Balloon_Close" title="Close">Close</span></td></tr></table></div></div></div></div>'// plain text body
          };
          smtpTrans.sendMail(mailOpts, function (error, response) {
              if (error) {
                  res.status(203);
                  res.send("Server Error,Please retry!")
              }
              else {
                  res.status(201);
                  res.send("Please check your mailbox!")
              }
          });
        }
    });
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
