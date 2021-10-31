# Synchronise Duolingo to Notion
> Send progress of Duolingo course to a Notion database.

## Introduction

I made this script to send the data from my Duolingo account to a Notion page (Chinese courses).

This script does:
- Fetch Duolingo data for your account (Chinese simplified course)
- Get dictionary pinyin,usages,exemples for each vocabulary word
- Push those data properly formatted in a Notion database

![Main page](https://raw.github.com/loicpirez/duolingo-notion-vocabulary-sync/main/screenshots/main.png)

![Grouped by category page](https://raw.github.com/loicpirez/duolingo-notion-vocabulary-sync/main/screenshots/category.png)


Please find the Notion template [here](https://loicpirez.notion.site/1f97905c491d4862a88bc8ecf1381c95?v=c0c3183875fd48f883044fdd55f845f1)

## Common setup

Clone the repo and install the dependencies.
NodeJS and Python3 (with pip) must be installed.

```bash
pip3 install duolingo-api dotenv 
```

```bash
npm install
```

## Environment

Environment must contain those variables.
You can add them in the `.env` files. (see `.env.sample`)

| Name  | Description |
| ------------- | ------------- |
| DUOLINGO_USERNAME  | Duolingo username. |
| DUOLINGO_PASSWORD  | Duolingo password. |
| NOTION_TOKEN  | API token of your Notion integration. |
| NOTION_DATABASE_TITLE  | Title of your Notion database. |
| NOTION_DATABASE_ID  | ID of your Notion database.  |
| NOTION_PAGE_ID  | ID of your Notion page.  |
