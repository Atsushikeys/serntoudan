//銭湯リストをスクレイピングする

function scrapingSpaLists(){
  
  //Getリクエストを投げて、戻り値(Webサイト全体のHTML)を文字列に変換し、格納
  var res = UrlFetchApp.fetch("https://aichi1010.jp/page/detail/l/1").getContentText();

  var startIndex = res.indexOf("<h1>",res.indexOf("<h1>") + 1);
  var endIndex = res.indexOf("<span>",startIndex);

  Logger.log(startIndex);
  Logger.log(endIndex);
  
  var spaName = res.substring(startIndex + 4,endIndex);
  Logger.log(spaName);
  
}