export default class I18n {
  constructor(data, lang) {
    this.data = data;
    this.lang = lang;
  }

  get(key, lang) {
    if (lang == undefined) lang = this.lang;
    try {
      const val = this.data[key][lang];
      if (val == '' || val == undefined) throw false;
      return val;
    } catch(err) {
      //console.error(err);
      return key;
    }
  }
}
