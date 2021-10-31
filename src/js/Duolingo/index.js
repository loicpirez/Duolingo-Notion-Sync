const utils = require('../utils');
const logger = require('../logger');

/**
 * Duolingo module.
 */
class Duolingo {
  data = [];

  /**
  * Fetch Duolingo vocabulary data.
  */
  async fetchDuolingoData() {
    const instructions = {
      'knownWords': 'python3 src/python/duolingo.known_words.py',
      'vocabulary': 'python3 src/python/duolingo.vocabulary.py',
    };

    const instructionsKeys = Object.keys(instructions);

    this.fetchedData = {
      knownWords: {},
      vocabulary: {},
    };

    for (const instruction in instructionsKeys) {
      if (Object.prototype.hasOwnProperty.call(instructionsKeys, instruction)) {
        await utils.execPromise(
            instructions[instructionsKeys[instruction]],
        ).then(
            (data) => {
              this.fetchedData[instructionsKeys[instruction]] = data;
            },
        ).catch((err) => {
          console.log({err});
          process.exit(1);
        });
      }
    }
  }


  /**
  * Promisify execution of OS commands.
  */
  async formatDuolingoData() {
    const {
      knownWords,
      vocabulary,
      // Ugly magic
      parsedKnowedWords = JSON.parse(knownWords),
      parsedVocabulary = JSON.parse(vocabulary),
    } = this.fetchedData;

    this.data = parsedVocabulary.vocab_overview.map((word) => {
      return {
        hanzi: word.word_string,
        category: word.skill,
        lastPracticed: utils.formatDate(new Date(word.last_practiced_ms)),
        mastered: parsedKnowedWords.includes(word.word_string) ||
          word.strength === 1,
        strength: word.strength,
      };
    });
  }

  /**
  * Fetch Duolingo data and format it.
  */
  async init() {
    await this.fetchDuolingoData();
    logger.info('Formating Duolingo data');
    await this.formatDuolingoData();
  }
}

module.exports = Duolingo;
