//このファイル内の関数群は銭湯リストを取得する時のみ使用


//1~84の銭湯名を取得する
function get84Spas() {
  var spaListSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("銭湯リスト作成用");
  
  for (var i = 1; i < 85; i++) {
    try {
      spaListSheet.getRange(i + 1, 7).setValue(scrapeOneSpa(i));
    } catch (ex) {
      spaListSheet.getRange(i + 1, 7).setValue("nonInfo");
    }
  }
}



//https://aichi1010.jp/page/detail/l/spaUrrNumber に含まれる銭湯情報をスクレイピングする関数
function scrapeOneSpa(spaUrlNumber){
  
  //Getリクエストを投げて、戻り値(Webサイト全体のHTML)を文字列に変換し、格納
  var res = UrlFetchApp.fetch("https://aichi1010.jp/page/detail/l/" + spaUrlNumber ).getContentText();
  

  var searchFromTag = "<dt>住所</dt><dd>";
  var searchToTag = "</dd>";
  
  var startIndex = res.indexOf(searchFromTag);
  var endIndex = res.indexOf(searchToTag,startIndex);
  
  var spaInfo = res.substring(startIndex + searchFromTag.length,endIndex);
  
  return spaInfo
  
}