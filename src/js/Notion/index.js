const {Client} = require('@notionhq/client');

/**
* Mock the fetch behavior of Duolingo.
*/
class Notion {
  /**
  * Initialize the Notion client.
  */
  constructor() {
    this.client = new Client({
      auth: process.env.NOTION_TOKEN,
    });
  }

  /**
 * Generate Notion page properties for a word
 * @param {string} wordDetails The word to generate properties for.
 * @return {object} The properties for the word.
 */
  generateProperties(wordDetails) {
    return {
      'Mastered': {
        'multi_select': [
          {
            // @TODO: Make this fixed variable dynamic.
            'name': wordDetails.mastered,
            'color': wordDetails.mastered === 'Yes' ? 'green' : 'red',
          },
        ],
      },
      'Exemple & Usages': {
        'rich_text': [
          {
            'text': {
              'content': wordDetails['Examples & Usage'],
              'link': null,
            },
            'plain_text': wordDetails['Examples & Usage'],
          },
        ],
      },
      'Last Practiced': {
        'date': {
          'start': wordDetails['Last Practiced'],
          'end': null,
        },
      },
      'Pinyin': {
        'rich_text': [
          {
            'text': {
              'content': wordDetails['Pinyin'],
              'link': null,
            },
            'plain_text': wordDetails['Pinyin'],
            'href': null,
          },
        ],
      },
      'Category': {
        'multi_select': [
          {
            'name': wordDetails['Category'],
          },
        ],
      },
      'Strength': {
        'number': wordDetails['Strength'],
      },
      'English': {
        'rich_text': [
          {
            'text': {
              'content': wordDetails['English'],
              'link': null,
            },
            'plain_text': wordDetails['English'],
          },
        ],
      },
      'Hanzi': {
        'title': [
          {
            'text': {
              'content': wordDetails['Hanzi'],
              'link': null,
            },
            'plain_text': wordDetails['Hanzi'],
          },
        ],
      },
    };
  }

  /**
   * Change title of a Notion database.
   * @param {string} newTitle The new title.
  */
  async updateDatabaseTitle(newTitle) {
    const options = {
      database_id: process.env.NOTION_DATABASE_ID,
    };

    await this.client.databases.update({
      ...options,
      'title': [
        {
          'text': {
            'content': newTitle,
          },
        },
      ],
    });
  }

  /**
  * Query notion for specific Hanzi to find.
  * @param {string} hanzi The hanzi to find.
  */
  async searchPageEntry(hanzi) {
    let data = {};

    const options = {
      database_id: process.env.NOTION_DATABASE_ID,
    };

    const dbData = await this.client.databases.query(options);

    dbData.results.forEach((result) => {
      const currentResult = result.properties['Hanzi'];

      if (currentResult.title[0].plain_text === hanzi) {
        data = result;
      }
    });

    return data;
  }

  /**
  * Add Notion table with specific Hanzi data.
  * @param {string} wordDetails The new word details.
  */
  async addPageEntry(wordDetails) {
    const options = {
      'parent': {
        'database_id': process.env.NOTION_DATABASE_ID,
      },
    };

    const properties = this.generateProperties(wordDetails);

    await this.client.pages.create({
      ...options,
      properties,
    });
  }


  /**
  * Update Notion table with specific Hanzi data.
  * @param {string} pageID The Notion page ID of the word to update.
  * @param {string} wordDetails The new word details.
  */
  async updatePageEntry(pageID, wordDetails) {
    const options = {
      page_id: pageID,
    };

    const properties = this.generateProperties(wordDetails);

    await this.client.pages.update({
      ...options,
      properties,
    });
  }
}

module.exports = Notion;
