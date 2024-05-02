# Input variables

| With Parameter        | Required           | Default                            | Description                      |
| --------------------- | ------------------ | ---------------------------------- | ---------------------------------|
| `slack_webhook_url`   | :white_check_mark: |                                    | The Slack Incoming Webhooks URL.
| `tag_name`            |                    |                                    | Adds a 'release' link to the message that leads to the github release.
| `status`              |                    | `${{ job.status }}`                | Used to force a status to report. Valid inputs are:`success`, `failure`, or `cancelled`.
| `slack_channel`       |                    |                                    | Overrides the default webhook channel. 
| `slack_username`      |                    |                                    | Overrides the default webhook username. 

## Usage

``` yaml
  - uses: ben93riggs/slack-action@latest
      with:
        slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
        tag_name: ${{ env.TAG_NAME }} # optional
    if: always()
```
