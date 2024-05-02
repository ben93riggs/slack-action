# Input variables

| With Parameter        | Required           | Default                            | Description                      |
| --------------------- | ------------------ | ---------------------------------- | ---------------------------------|
| `slack_webhook_url`   | :white_check_mark: | `${{ secrets.SLACK_WEBHOOK_URL }}` | The Slack Incoming Webhooks URL.
| `tag_name`            |                    | `${{ env.TAGNAME }}`               | Adds a 'release' link to the message that leads to the github release.
| `status`              |                    | `${{ job.status }}`                | Used to force a status to report. Valid inputs are:`success`, `failure`, or `cancelled`.
| `slack_channel`       |                    | `null`                             | Overrides the default webhook channel. 
| `slack_username`      |                    | `null`                             | Overrides the default webhook username. 

## Usage

``` yaml
  - uses: craftech-io/slack-action@v1
    if: always()
```
