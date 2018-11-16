# PlutoBot-MPP
A simple bot for multiplayerpiano.com. Updated and maintained by Plutonus.

[![Codefresh build status]( https://g.codefresh.io/api/badges/pipeline/plutonuscommissions_marketplace/PlutonusCommissions%2FPlutoBot-MPP%2FPlutoBot-MPP?branch=master&key=eyJhbGciOiJIUzI1NiJ9.NWJlZTUxMmRiZjc3ZTBiOWJiMWE5NjA3._HMpo37BpurDc6Ugx-ANdlkUyDancBNRRAIfhwE3In8&type=cf-2)]( https://g.codefresh.io/pipelines/PlutoBot-MPP/builds?repoOwner=PlutonusCommissions&repoName=PlutoBot-MPP&serviceName=PlutonusCommissions%2FPlutoBot-MPP&filter=trigger:build~Build;branch:master;pipeline:5bee51916c5eee7e10a18e8e~PlutoBot-MPP)

## Requirements

- `git` command line ([Windows](https://git-scm.com/download/win)|[Linux](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)|[MacOS](https://git-scm.com/download/mac)) installed
- `node` [Version 8.0.0 or higher](https://nodejs.org)

## Downloading

In a command prompt, or powershell, navigate to you projects folder (wherever that may be), and run the following:

`git clone https://github.com/PlutonusCommissions/PlutoBot-MPP.git`

Once finished:

- In the folder from where you ran the git command, run `cd PlutoBot-MPP` and then run `npm i`
- **If you receive any errors during this process, make sure you meet the *[Requirements](#requirements)* above!**
- Edit `data/config.js` and fill in all the relevant details as indicated in the file's comments.

## Starting the bot

To start the bot, in the command prompt or powershell, run the following command:
`node app.js`