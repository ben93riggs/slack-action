![Notification](https://github.com/craftech-io/slack-action/workflows/Notification/badge.svg)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Maintained by Craftech.io](https://img.shields.io/badge/maintained%20by-craftech.io-%2254BEC5.svg?color=54BEC5)](https://craftech.io/?ref=terraform-aws-route53)

## Inputs variables

| With Parameter        | Required/Optional | Description |
| --------------------- | ----------------- | ------------|
| `slack_webhook_url`   | **Required**      | The Slack Incoming Webhooks URL. <br>Specify the [environment secret](https://help.github.com/es/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) for `SLACK_WEBHOOK_URL`.
| `status`              | ***Optional***    | Used to force a status to report. Defaults to `${{ job.status }}`.<br>Valid inputs are:`success`, `failure`, or `cancelled`.
| `slack_channel`       | ***Optional***    | Overrides the default webhook channel setting. 
| `slack_username`      | ***Optional***    | Overrides the default webhook username setting. 
| `tag_name`            | ***Optional***    | Adds a 'release' button to the message that links to the github release. Defaults to `${{ env.TAGNAME }}`.

## Usage

``` yaml
  - uses: craftech-io/slack-action@v1
    with:
      slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
      release_url: ${{ steps.release_step.outputs.html_url }}
    if: always()
```
