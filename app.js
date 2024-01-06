"use strict";
// Importing
const log = require("console");
const { Telegraf } = require("telegraf");
const bot = new Telegraf("6499575874:AAGQKGClhIkHCnD-H0_BD5ES-5MuZR-_huk", { handleUpdates: false });
const clsDB = require("./clsDB");
const clsQuiz = require("./clsQuiz");
const clsUser = require("./clsUser");

//To make it live
cron.schedule('*/2 * * * *', async () => {
  try {
    // Make an HTTP request to the website
    const response = await axios.get('https://katma.onrender.com');

    // Log the response or handle it as needed
    console.log('Cron job executed successfully:', response.status, response.statusText);
  } catch (error) {
    // Handle any errors that occurred during the HTTP request
    console.error('Error during cron job:', error.message);
  }
});



const OnStartMessage = async (ctx) => {
  await new clsQuiz(ctx).MainScreen();
  await new clsDB(ctx.message.from.id).AddUser();
  await new clsUser(ctx).TransferringUserMessage();
}
bot.start(async (ctx) => {
  await Promise.all([
    OnStartMessage(ctx)
  ])
});

const OnUserAnswer = async (ctx) => {
  await ctx.answerCbQuery();
  await new clsQuiz(ctx).OnUserAnswer();
}
bot.action(["ا", "ب", "ج", "د"], async (ctx) => {
  await Promise.all([
    OnUserAnswer(ctx)
  ])
});

const GetQuestion = async (ctx) => {
  await ctx.answerCbQuery().catch(()=>{return});
  let Subject = ctx.callbackQuery.data;
  if (Subject.includes("عشوائي")) Subject = 0;
  await new clsQuiz(ctx).SendRandomQuestion(String(Subject), false);
}
bot.action(
  [
    "السؤال التالي فيزياء",
    "السؤال التالي كيمياء",
    "السؤال التالي رياضيات",
    "السؤال التالي احياء",
    "السؤال التالي عشوائي",
    "رياضيات",
    "فيزياء",
    "كيمياء",
    "احياء",
    "عشوائي",
  ], async (ctx) => {
    await Promise.all([
      GetQuestion(ctx)
    ])
  });



const AddQuestion = async (ctx) => {
  await new clsQuiz(ctx).ReadAddQuestionCommand();
  await new clsUser(ctx).TransferringUserMessage();
}
bot.command(["Add", "add"], async (ctx) => {
  await Promise.all([
    AddQuestion(ctx)
  ])
});

const MainScreen = async (ctx) => {
  await ctx.answerCbQuery();
  await new clsQuiz(ctx).MainScreen(false);
}
bot.action("الصفحة الرئيسية", async (ctx) => {
  await Promise.all([
    MainScreen(ctx)
  ])
});



const Delete = async (ctx) => {
  await new clsUser(ctx).TransferringUserMessage();
  await new clsQuiz(ctx).DeleteQuestion();
}
bot.command(["Delete", "delete"], async (ctx) => {
  await Promise.all([
    Delete(ctx)
  ])
});


const Send = async (ctx) => {
  await new clsUser(ctx).SendTransferedMessage();
}
bot.command(["Send", "send"], async (ctx) => {
  await Promise.all([
    Send(ctx)
  ])

});


const ShowQuestion = async (ctx) => {
  await ctx.answerCbQuery();
  let IsExplain = false;
  if (ctx.callbackQuery.data == "عرض شرح السؤال") IsExplain = true;
  await new clsQuiz(ctx).ShowLastAddedQuestion(false, IsExplain);
}
bot.action(["عرض شرح السؤال", "عرض السؤال"], async (ctx) => {
  await Promise.all([
    ShowQuestion(ctx)
  ])
});


const Find = async (ctx) => {
  await new clsUser(ctx).TransferringUserMessage();
  return await new clsQuiz(ctx).FindQuestion();
}
bot.command(["find", "Find", "Get", "get"], async (ctx) => {
  await Promise.all([
    Find(ctx)
  ])

});



const OnMeCommand = async (ctx) => {
  await new clsQuiz(ctx).GetUserData();
  await new clsUser(ctx).TransferringUserMessage();
}
bot.command(["me", "Me"], async (ctx) => {
  await Promise.all([
    OnMeCommand(ctx)
  ])

});



const GetAlldata = async (ctx) => {
  await new clsUser(ctx).GetAllData();
}
bot.hears(["احصائيات", "بيانات", "داتا", "معلومات"], async (ctx) => {
  await Promise.all([
    GetAlldata(ctx)
  ])

});

//Handling
{
  bot.on("callback_query", (ctx) => {
    ctx.answerCbQuery();
  });
  bot.on("message", async (ctx) => {
    await new clsDB(ctx.message.from.id).AddUser();
    await new clsUser(ctx).TransferringUserMessage();
  });
  bot.launch();
}
//For the deployment
{
  const http = require("http");
  const port = process.env.PORT || 5000;
  http
    .createServer(function (req, res) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("This is my telegram bot :)\n");
    })
    .listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
}
