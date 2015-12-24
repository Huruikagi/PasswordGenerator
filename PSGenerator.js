/**
 * @fileoverview {@code PSGenerator}クラスとそのメソッドの定義。
 * メソッドの一部に{@link https://caligatio.github.io/jsSHA/ jsSHA}を使用しています。
 * @author Huruikagi
 */


/**
 * 一連のパスワード生成処理を担当するクラスです。
 * @constructor
 */
PSGenerator = function() {
  this.carsor_;
  this.hash_;
  this.passphrase_;
};


/**
 * @param {string} keyword - サービス名を表す文字列
 * @param {string} passphrase - ソルトとして用いる何らかの文字列
 * @param {number} length - パスワードの文字数（自然数であること）
 * @param {string[]} charTypes - パスワードに含まれる可能性のある文字。
 *     カテゴリごとに文字列化されており、それらを配列としてまとめる。
 *     （例：{@code {"012...", "abc...", "ABC..."}}）
 * @return {string} 生成されたパスワード文字列
 */
PSGenerator.prototype.generate = function(keyword, passphrase, length, charTypes) {

  //プライベートプロパティのリセット
  this.carsor_ = 0;
  this.hash_ = this.hashing_(keyword + passphrase);
  this.passphrase_ = passphrase;

  //確定した文字を格納していく配列
  var resultAry = new Array();

  //resAryの中で、まだ文字が格納されていないindexを保持する配列
  var empty = new Array();
  for (var i = 0; i < length; i++) {
    empty[i] = i;
  }

  //後で使うのでループのついでにcharTypesに格納されている文字を全部連結していく
  var allChars = '';

  //選択された各文字郡から最低1文字ずつ使うためのループ
  for (var i = 0; i < charTypes.length; i++) {
    var idx = this.hashRandom_(empty.length);
    var target = empty[idx];
    empty.splice(idx, 1);
    //パスワード文字列のtarget番目にこのカテゴリから1文字入れる
    resultAry[target] = charTypes[i].charAt(this.hashRandom_(charTypes[i].length));

    allChars += charTypes[i];
  }

  //残りを適当にランダムに埋めるためのループ
  while (empty.length > 0) {
    var idx = this.hashRandom_(empty.length);
    var target = empty[idx];
    empty.splice(idx, 1);
    resultAry[target] = allChars.charAt(allChars.length);
  }

  //結果を配列から文字列に変換する
  var resultStr = '';
  for (var i = 0; i < resultAry.length; i++) {
    resultStr += resultAry[i];
  }
  return resultStr;
};


/**
 * 文字列のハッシュ化を行うメソッドです。
 * {@link https://caligatio.github.io/jsSHA/ jsSHA}のSHA512アルゴリズムに移譲するため、
 * ライブラリが事前に読み込まれていなければここでエラーが発生します。
 * @param {string} str - ハッシュ化する文字列
 * @return {string} ハッシュ化後の文字列（16進数表記の整数を文字列化したもの）
 * @throws {Exception} jsSHAが読み込まれる前に呼び出されたとき
 * @private
 */
PSGenerator.prototype.hashing_ = function(str) {
  return (new jsSHA(str, 'TEXT')).getHash('SHA-512', 'HEX');
};


/**
 * ハッシュ値を元に文字列を取り出し、整数に変換して返却します。
 *
 * @param {number} size - 戻り値の範囲を限定する値
 * @return {number} 0以上size未満の整数
 * @private
 */
PSGenerator.prototype.hashRandom_ = function(size) {

  if (this.carsor_ >= this.hash_.length - 8) {
    //現在のhash_を末尾まで使い切ったらもう一回ハッシュ関数にかける
    this.hash_ = this.hashing(this.hash_ + passphrase);
    this.carsor_ = 0;
  }

  //ハッシュ文字列から8文字分取り出す
  var sphash = this.hash_.slice(this.carsor_, this.carsor_+ 7);
  this.carsor_ += 8;

  //取り出した文字列を整数に変換し、sizeの剰余により求める数値を得る
  return parseInt(sphash, 16) % size;
};
