#!/usr/bin/env nodejs
const Duolingo = require('./Duolingo');
const Notion = require('./Notion');
const LineDictionary = require('./LineDictionary');

const logger = require('./logger');

require('dotenv').config();

const main = async () => {
  logger.info('Starting...');
  logger.info('Initializing Duolingo module');
  const duolingo = new Duolingo();
  logger.info('Initializing dictionary module [LINE Dictionary]');
  const dictionary = new LineDictionary();
  logger.info('Initializing Notion module');
  const notion = new Notion();

  logger.info('Fetching data from Duolingo servers...');
  await duolingo.init();

  await notion.updateDatabaseTitle(
      `${process.env.NOTION_DATABASE_TITLE} (Updating)
    `);

  for (const word in duolingo.data) {
    if (Object.prototype.hasOwnProperty.call(duolingo.data, word)) {
      try {
        const {
          hanzi,
          category,
          lastPracticed,
          strength,
          mastered,
        } = duolingo.data[word];

        logger.info(`[${hanzi}] Merging Duolingo data with dictionary data`);

        const wordDetails = {
          ...await dictionary.getWordInformations(hanzi),
          'Category': category,
          'Last Practiced': lastPracticed,
          'Strength': strength,
          'Mastered': mastered ? 'Yes' : 'No',
        };

        logger.info(`[${hanzi}] Searching Notion entry in database`);

        const hanziNotionPageEntry = await notion.getPageEntry(
            'Hanzi', wordDetails['Hanzi'],
        );

        if (hanziNotionPageEntry.results.length === 0) {
          logger.info(`[${hanzi}] Entry does not exist in database`);
          logger.info(`[${hanzi}] Creating entry`);
          await notion.addPageEntry(wordDetails);
          logger.info(`[${hanzi}] Entry added!`);
        } else {
          logger.info(`[${hanzi}] Entry does exist in database`);
          logger.info(`[${hanzi}] Updating the first matched entry`);
          await notion.updatePageEntry(
              hanziNotionPageEntry.results[0].id,
              wordDetails,
          );
          logger.info(`[${hanzi}] Entry updated!`);
        }
      } catch (e) {
        await notion.updateDatabaseTitle(
            `${process.env.NOTION_DATABASE_TITLE} (Failed update)`,
        );
        logger.error(`Error updating word !`);
        logger.error(e);
        logger.error(duolingo.data[word]);
      }
    }
  }
  await notion.updateDatabaseTitle(
      `${process.env.NOTION_DATABASE_TITLE}`,
  );
};

main();
