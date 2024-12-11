require("dotenv").config();
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  // ソケットモードではポートをリッスンしませんが、アプリを OAuth フローに対応させる場合、
  // 何らかのポートをリッスンする必要があります
  port: process.env.PORT || 3000,
});

// "hello" を含むメッセージをリッスンします
app.message("hello", async ({ message, say }) => {
  // イベントがトリガーされたチャンネルに say() でメッセージを送信します
  console.log("Say を実行します");
  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hey <@${message.user}>! We have a gift for you!`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Click Me",
          },
          action_id: "button_click",
        },
      },
    ],
    text: `Hey there <@${message.user}>!`,
  });
});

// "knock knock"を含むメッセージをリッスンし、"Who's there?" というメッセージをイタリック体で送信します。
app.message('knock knock', async({ message, say }) => {
  await say(`_Who's there?_`);
});

// 誰かが 📅 絵文字でリアクションした時に、日付ピッカー block を送信
app.event('reaction_added', async ({ event, say }) => {
  if (event.reaction === 'calendar') {
    await say({
      blocks: [{
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Pick a date for me to remind you"
        },
        "accessory": {
          "type": "datepicker",
          "action_id": "datepicker_remind",
          "initial_date": "2019-04-28",
          "placeholder": {
            "type": "plain_text",
            "text": "Select a date"
          }
        }
      }]
    });
  } else {
    console.log(`Reaction added: ${event.reaction}`);
  }
});

app.action("button_click", async ({ body, ack, say }) => {
  //  アクションのリクエストを確認
  await ack();
  await say(`<@${body.user.id}> clicked the button`);
});

(async () => {
  // アプリを起動します
  await app.start();

  console.log("⚡️ Bolt app is running!");
})();
