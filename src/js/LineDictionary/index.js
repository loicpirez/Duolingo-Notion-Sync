// Please don't sue me.
// Jokes aside; this module can be used as a template to implement
// fetching from another dictionnary source; for exemple Wiktionary.

const axios = require('../axios');
const utils = require('../utils');

/**
 * LINE Dictionary module.
 */
class LineDictionary {
  /**
    * Get the Pinyin, English and usage from an Hanzi.
    * @param {string} hanzi The Hanzi to look up.
    */
  async getWordInformations(hanzi) {
    const value = encodeURIComponent(hanzi);

    const searchResult = await axios.get(`https://ac.dict.naver.com/linedictweb/ac?q=${value}&st=010&r_lt=000&q_enc=UTF-8&r_format=json&r_enc=UTF-8&_t=1599558293560`);

    const usage = await axios.get(`https://dict.naver.com/linedict/267/cnen/entryExample/exampleJson?query=${value}&dicType=cnen&platform=isPC&r_format=json&r_enc=UTF-8&q_enc=UTF-8&callback=jQuery1111036083726614442035_1634178090291&_=1634178090292`);

    const english = searchResult.items[1][0][3][0].trim();
    const pinyin = searchResult.items[1][0][4][0].trim();

    const searchAndUsages = {
      searchResult,
      usage: usage ? JSON.parse(
          usage.substring(usage.indexOf('(') + 1, usage.length - 1),
      ) : usage,
    };

    const examples = searchAndUsages.usage.searchExampleList.map(
        (example, i) => {
          const translation = utils.cleanHTMLFromString(
              utils.capitalize(example.translation),
          );

          const pinyin = utils.minimize(example.pinyin);

          const sentance = example.example;


          return `${i + 1}/ ${translation} (${pinyin}) = "${sentance}"`;
        }).join(',\n');

    await new Promise((r) => setTimeout(r, 1000));

    return {
      'Hanzi': hanzi,
      'Pinyin': pinyin,
      'English': english,
      'Examples & Usage': examples,
    };
  }
}

module.exports = LineDictionary;
