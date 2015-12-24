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
 * @param {int} length - パスワードの文字数
 * @param {string} charTypes - パスワードに含まれる可能性のある文字
 *
 * @return {string} 生成されたパスワード文字列
 */
PSGenerator.prototype.generate = function(keyword, passphrase, length, charTypes) {

  //プライベート変数のリセット
  this.carsor_ = 0;
  this.hash_ = '';
  this.passphrase_ = passphrase;

};

/**
 * 文字列のハッシュ化を行う関数です。
 * {@link https://caligatio.github.io/jsSHA/ jsSHA}のSHA512アルゴリズムに移譲するため、
 * そちらのライブラリが事前に読み込まれていなければここでエラーが発生します。
 * @param {string} str - ハッシュ化する文字列
 * @return {string} ハッシュ化後の文字列（16進数表記の整数を文字列化したもの）
 * @throws {Exception} jsSHAが読み込まれる前に呼び出されたとき
 * @private
 */
PSGenerator.prototype.hashing_ = function(str) {
  return (new jsSHA(str, 'TEXT')).getHash('SHA-512', 'HEX');
};

/**
 * @private
 */
PSGenerator.prototype.hashRandom = function() {
  if (this.carsor_ >= this.hash_.length - 8) {
    this.hash_ = this.hashing(this.hash_ + passphrase);
  }
}
