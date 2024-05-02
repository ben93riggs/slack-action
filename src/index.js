const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

const sucess_color = '#00C0C7';
const cancelled_color = '#a6a6a6';
const failure_color = '#FF614E';

function post(slackMessage) {
    const slack_webhook_url = core.getInput("slack_webhook_url");

    fetch(slack_webhook_url, {
        method: 'POST',
        body: JSON.stringify(slackMessage),
        headers: { 'Content-Type': 'application/json' },
    }).catch(console.error);
    
    if (!core.getInput("slack_webhook_url")) {
     try {   
       throw new Error(`[Error] Missing Slack Incoming Webhooks URL
           Please configure "SLACK_WEBHOOK" as environment variable or
           specify the key "slack_webhook_url" in the actions configuration.`);
       } 
       catch (error) {	
           console.error(error.message);	
       }
    }
 }

function getColor(status) {
    if (status.toLowerCase() === 'success') {
        return sucess_color;
    } else if (status.toLowerCase() === 'failure') {
        return failure_color;
    } else {
        return cancelled_color;
    }
}

function getText(status, base_url, sha, repo) {
    if (status.toLowerCase() === 'success') {
        return `<${base_url}|${repo.repo}> / *<${base_url}/commit/${sha}/checks|${github.context.workflow}>* has run *successfully*`;
    } else if (status.toLowerCase() === 'cancelled') {
        return `<${base_url}|${repo.repo}> / *<${base_url}/commit/${sha}/checks|${github.context.workflow}>* was *cancelled*`;
    } else {
        return `<${base_url}|${repo.repo}> / *<${base_url}/commit/${sha}/checks|${github.context.workflow}>* has *failed* <!here>`;
    }
}

function generateSlackMessage(text) {
    try {
        const { sha, repo, ref } = github.context;
        const status = core.getInput("status");
        const channel = core.getInput("slack_channel");
        const username = core.getInput("slack_username");
        const tag_name = core.getInput("tag_name");
        const base_url = `https://github.com/${repo.owner}/${repo.repo}`;

        let blocks = [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": getText(status, base_url, ref, repo)
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": tag_name 
                            ? `*Release:*\n<${base_url}/releases/tag/${tag_name}|${tag_name}> (<${base_url}/commit/${sha}|${ref}>)` 
                            : `*Ref:* <${base_url}/commit/${sha}|${ref}>)`
                    },
                ]
            }
        ];

        return {
            channel,
            username,
            attachments: [
                {
                    "color": getColor(status),
                    "blocks": blocks
                }
            ]
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}

try {
    post(generateSlackMessage('Sending message'));
} catch (error) {
    core.setFailed(`[Error] There was an error when sending the slack notification`);
} 