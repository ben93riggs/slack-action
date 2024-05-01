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

function getText(status) {
    if (status.toLowerCase() === 'success') {
        return `*${github.context.workflow}* has run *successfully*`;
    } else if (status.toLowerCase() === 'cancelled') {
        return `*${github.context.workflow}* was *cancelled*`;
    } else {
        return `*${github.context.workflow}* has *failed* <!here>`;
    }
}

function generateSlackMessage(text) {
    const { sha, repo, ref } = github.context;
    const status = core.getInput("status");
    const channel = core.getInput("slack_channel");
    const username = core.getInput("slack_username");
    const release_url = core.getInput("release_url");
    const base_url = `https://github.com/${repo.owner}/${repo.repo}`;

    let actions = [
        {
            "type": "button",
            "text": {
                "type": "plain_text",
                "emoji": true,
                "text": "Commit"
            },
            "url": `${base_url}/commit/${sha}`,
        },
        {
            "type": "button",
            "text": {
                "type": "plain_text",
                "emoji": true,
                "text": "Action Tab"
            },
            "url": `${base_url}/commit/${sha}/checks`
        }
    ];
    
    if (release_url) {
        actions.push({
            "type": "button",
            "text": {
                "type": "plain_text",
                "emoji": true,
                "text": "Release"
            },
            "style": "primary",
            "url": release_url
        });
    }

    return {
        channel,
        username,
        attachments: [
            {
                "color": getColor(status),
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": getText(status)
                        }
                    },
                    {
                        "type": "section",
                        "fields": [
                            {
                                "type": "mrkdwn",
                                "text": `*Repository:*\n<${base_url}|${repo.repo}> (<${base_url}/commit/${sha}|${ref}>)`
                            },
                        ]
                    },
                    {
                        "type": "actions",
                        "elements": actions
                    }
                ]
            }
        ]
    };
}
try {
    post(generateSlackMessage('Sending message'));
} catch (error) {
    core.setFailed(`[Error] There was an error when sending the slack notification`);
} 