const clsDB = require("./clsDB");
const clsUser = require("./clsUser");
const TableName = "Questions";
class clsQuiz extends clsUser {
  constructor(ctx) {
    super(ctx);
  }

  async GetRandomQuestion(Subject = 0) {
    let Query = `SELECT * FROM Questions
        WHERE Questions.QuestionSubject = ${Subject}
        ORDER BY RANDOM();`;
    if (Subject == 0) {
      Query = `SELECT * FROM Questions
            ORDER BY RANDOM();`;
    }

    return await new clsDB(0).GetQuery(Query);
  }
  static _PerformQuizType(QuizType) {
    switch (QuizType) {
      case "Math":
        //Code of getting Math Questions data
        break;
      case "Chemist":
        //Code of getting Chemist Questions data
        break;
      case "Physics":
        //Code of getting Pysics Questions data
        break;
      case "Biology":
        //Code of getting Biology Questions data
        break;
      case "Random":
        //Code of getting Random Questions data
        break;
      default:
        console.error("Wrong Quiz Type");
        break;
    }
  }

  async _AddQuestion(QuestionArray = []) {
    return await new clsDB(0, TableName)._InsertEntity(
      [
        "QuestionURL",
        "QuestionLevl",
        "RightAnswer",
        "ExplainURL",
        "QuestionSubject",
      ],
      QuestionArray,
    );
  }
  async _IsPhotoExist(PhotoPath) {
    const Photo = await this.SendPhoto(PhotoPath, " hi", true);
    if (!Photo) return false;
    this.ctx.deleteMessage(Photo.message_id);
    return true;
  }
  async _LastQuestion() {
    const Query = `SELECT * FROM Questions
        ORDER By ID DESc 
        LIMIT 1`;
    return await new clsDB(0).GetQuery(Query);
  }
  async _CheckAddedQuestion(QuestionTxt) {
    if (QuestionTxt.length == 1) {
      return await this.SendMessage(
        `اهلا بك سيد ادمن
لاضافة سؤال اكتب الامر التالي
/add [السؤال url]
[متسوى الصعوبة (سهل, متوسط, صعب)]
[الاجابة الصحيحة ا,ب,ج,د]
[شرح السؤال url]
[نوع السؤال (رياضيات, كيمياء, فيزياء, احياء)]

-اكتب كل معلومة في سطر
-في حالة اخطأت في احد البيانات سوف اقوم بنتبيهك لذلك لا تقلق (:

            `,
        true,
      );
    }
    if (QuestionTxt.length < 5)
      return await this.SendMessage(
        "يبدو انك قد نسيت بعض المعلومات.... \n\n /Add",
        true,
      );
    if (QuestionTxt.length > 5)
      return await this.SendMessage(
        "عدد المعلومات التي ادخلتها اكثر من الطلوب...\n\n/Add",
        true,
      );

    if (
      QuestionTxt[1] != "سهل" &&
      QuestionTxt[1] != "متوسط" &&
      QuestionTxt[1] != "صعب"
    )
      return await this.SendMessage(
        "يجب ان يكون مستوى الصعوبة كالتالي\n\n1- سهل\n2-متوسط\n3-صعب\n\n/Add",
        true,
      );
    QuestionTxt[1] = await this._GetQuestionLevelNum(QuestionTxt[1]);

    if (
      QuestionTxt[2] != "ا" &&
      QuestionTxt[2] != "ب" &&
      QuestionTxt[2] != "ج" &&
      QuestionTxt[2] != "د"
    )
      return await this.SendMessage(
        "يجب ان تكون الاجابة الصحيحة ا,ب,ج,د\n\n/Add",
        true,
      );

    if (
      QuestionTxt[4] != "رياضيات" &&
      QuestionTxt[4] != "فيزياء" &&
      QuestionTxt[4] != "كيمياء" &&
      QuestionTxt[4] != "احياء"
    )
      return await this.SendMessage(
        "يجب ان يكون رقم المادة كالتالي\n\n1- رياضيات\n2-كيمياء\n3-فيزياء\n4-احياء\n\n/Add",
        true,
      );
    QuestionTxt[4] = await this._GetQuestionSubjectNum(QuestionTxt[4]);
    if (
      !(await this._IsPhotoExist(QuestionTxt[0])) &&
      !(await this._IsPhotoExist(QuestionTxt[4]))
    )
      return await this.SendMessage("الصور التي ادخلتها غير صالحة", true);

    return true;
  }
  async SendLastQuestion(Caption) {
    return await this.SendPhoto(Question.QuestionURL, Caption, false, [
      "Show Explain",
    ]);
  }
  async ReadAddQuestionCommand() {
    const User = await new clsDB(this.UserID).GetEntity("UserID");
    if (!(await this._CheckPermissions(this.Permissions.Add, User.Permissions)))
      return;

    const QuestionTxt = this.ctx.message.text.slice(5).split("\n");
    if ((await this._CheckAddedQuestion(QuestionTxt)) != true) return;
    QuestionTxt[0] = `'${QuestionTxt[0]}'`;
    QuestionTxt[2] = `'${QuestionTxt[2]}'`;
    QuestionTxt[3] = `'${QuestionTxt[3]}'`;
    if (!(await this._AddQuestion(QuestionTxt)))
      return await this.SendMessage("السؤال موجود بالفعل!");
    await this.SendMessage("تمت اضافة السؤال✅✅✅");
    return await this.ShowLastAddedQuestion(true);
  }
  // async AddQuestion()
  // {

  // }

  _RandomQuestion() {
    //
  }

  async _GetQuestion(QuestionID) {
    const Query = `
        SELECT Questions.ID, Questions.QuestionURL, Questions.RightAnswer, Questions.ExplainURL , QuestionSubjects.Name AS Subject, QuestionLvls.Level AS Level
        FROM Questions

        JOIN QuestionSubjects ON Questions.QuestionSubject = QuestionSubjects.ID
        JOIN QuestionLvls ON Questions.QuestionLevl = QuestionLvls.ID
        WHERE Questions.ID = ${QuestionID}
    LIMIT 1
        `;
    return await new clsDB(QuestionID).GetQuery(Query);
  }
  async _GetQuestionLevelNum(QuestionLevl) {
    switch (QuestionLevl) {
      case "سهل":
        return "1";
      case "متوسط":
        return "2";
      default:
        return "3";
    }
  }
  async _GetQuestionSubjectNum(QuestionSubject) {
    switch (QuestionSubject) {
      case "رياضيات":
        return "1";
      case "كيمياء":
        return "2";
      case "فيزياء":
        return "3";
      default:
        return "4";
    }
  }
  async _CheckAnswer(UserAnswer, QuestionID) {
    const QuestionAnswer =
      await this._QuestionRightAnswerAndSubject(QuestionID);
    if (QuestionAnswer.RightAnswer == UserAnswer) return true;
    return false;
  }
  async _GetUserAnswerData() {
    const UserAnswer = this.ctx.update.callback_query.data;
    const QuestionID = this.ctx.callbackQuery.message.caption
      .split("\n")[0]
      .slice(4);
    const MessageID = this.ctx.callbackQuery.message.message_id;
    const MessageCaption = this.ctx.callbackQuery.message.caption;
    const IsRandom = MessageCaption.includes("عشوائي");
    return {
      UerAnswer: UserAnswer,
      QuestionID: QuestionID,
      MessageID: MessageID,
      IsRandom: IsRandom,
    };
  }

  async AddToTotalAnswers(UserID, TotalAnswers) {
    await new clsDB(UserID).UpdateEntity("TotalAnswers", TotalAnswers + 1);
  }

  async _AddCaptionQuestion(UserID, AnswerData, UserFromDataBase) {
    const QuestionAnswer = await this._QuestionRightAnswerAndSubject(
      AnswerData.QuestionID,
    );
    if (QuestionAnswer.RightAnswer == AnswerData.UerAnswer) {
      await new clsDB(UserID).UpdateEntity(
        "TotalRightAnswers",
        UserFromDataBase.TotalRightAnswers + 1,
      );
      return "--اجابة صحيحة ✅\n\n▯زاد عدد اجاباتك الصحيحة";
    } else {
      return `--اجابة خاطئة ❌\n\nالاجابة الصحيحة: ${QuestionAnswer.RightAnswer}`;
    }
  }
  async _QuestionRightAnswerAndSubject(QuestionID) {
    const Query = `
        SELECT * FROM RightAnswerAndSubjects WHERE ID = ${QuestionID};
        `;
    return await new clsDB(0).GetQuery(Query);
  }

  async _CheckFindQuestionMessage(MessageText, Command = "find") {
    if (MessageText.length == 0) {
      return await this.SendMessage(
        `
للعثور على سؤال اكتب الامر كالتالي
/${Command} [QuestionID]
__مثال___
/find 4
`,
        true,
      );
    }
    if (!Number(MessageText))
      return await this.SendMessage("الID يجب ان يكون رقما", true);
    return true;
  }
  async FindQuestion(
    IsExplain = false,
    Command = "find",
    MessageText = this.ctx.message.text.slice(5),
  ) {
    if ((await this._CheckFindQuestionMessage(MessageText, Command)) != true)
      return;
    if (!(await this.ShowQuestion(MessageText, true, false, IsExplain)))
      return await this.SendMessage("السؤال غير موجود", true);
    return MessageText;
  }
  async DeleteQuestion() {
    const User = await new clsDB(this.UserID).GetEntity("UserID");
    if (!(await this._CheckPermissions(this.Permissions.Add, User.Permissions)))
      return;
    const QuestionID = await this.FindQuestion(
      false,
      "Delete",
      this.ctx.message.text.slice(8),
    );
    if (!QuestionID) return;
    await new clsDB(QuestionID, TableName).DeleteEntityByID(QuestionID);
    return await this.SendMessage("تم حذف السؤال ", true);
  }

  async GetUserData() {
    const User = await new clsDB(this.UserID).GetEntity("UserID");
    const Caption = `*بيانات *  【[${this.UserID}](tg://user?id=${this.UserID})】

▯مجموع اجاباتك : ${User.TotalAnswers}
▮مجموع اجاباتك الصحيحة : ${User.TotalRightAnswers}

﹏﹏﹏﹏﹏﹏
        `;
    return await this.SendPhoto(
      "https://t.me/hfhdjdjsaksklsldkfkfkksoalcckxfr/25",
      Caption,
      true,
    );
  }

  async _GetQuestionSubjectInArabic(QuestionSubject) {
    switch (QuestionSubject) {
      case 1:
        return "رياضيات";
      case 2:
        return "كيمياء";
      case 3:
        return "فيزياء";
      case 4:
        return "احياء";
      default:
        return "عشوائي";
    }
  }
  async _GetQuestionLevelInArabic(QuestionLevel) {
    switch (QuestionLevel) {
      case 1:
        return "سهل";
      case 2:
        return "متوسط";
      default:
        return "صعب";
    }
  }
  async OnUserAnswer() {
    let AnswerData = await this._GetUserAnswerData();

    let UserFromDataBase = await new clsDB(this.UserID).GetEntity("UserID");
    await this.AddToTotalAnswers(this.UserID, UserFromDataBase.TotalAnswers);

    const UserAnswerAndSubject = await this._QuestionRightAnswerAndSubject(
      AnswerData.QuestionID,
    );
    let Caption = await this._AddCaptionQuestion(
      this.UserID,
      AnswerData,
      UserFromDataBase,
    );
    await this.EditPhotoAfterCallBack(
      UserAnswerAndSubject.ExplainURL,
      Caption,
      [
        `السؤال التالي ${
          AnswerData.IsRandom ? "عشوائي" : UserAnswerAndSubject.Subject
        }`,
        `الصفحة الرئيسية`,
      ],
      1,
    );
  }

  async SendQuestion(
    Question,
    IsAfterCommand = true,
    Buttons = ["ب", "ا", "د", "ج"],
    Caption = "",
  ) {
    Caption = `*ID: ${
      Question.ID
    }*\n▮مستوى الصعوبة : *${await this._GetQuestionLevelInArabic(
      Question.QuestionLevl,
    )}*\n▯المادة : *${await this._GetQuestionSubjectInArabic(
      Question.QuestionSubject,
    )}*\n${this.CurrentSubject == 0 ? "*◄عشوائي*" : ""}\n\n_-_-_-_-_-_-_-_- `;
    if (!IsAfterCommand) {
      return await this.EditPhotoAfterCallBack(
        Question.QuestionURL,
        Caption,
        Buttons,
        2,
      );
    }
    return await this.SendPhoto(
      Question.QuestionURL,
      Caption,
      false,
      Buttons,
      2,
    );
  }
  async _CheckSubject(Subject) {
    Subject = Subject.split(" ");
    return await this._GetQuestionSubjectNum(Subject[Subject.length - 1]);
  }
  async SendRandomQuestion(Subject, IsAfterCommand = true) {
    let QuestionSubject = "";

    if (Subject == "0") {
      QuestionSubject = "0";
    } else {
      QuestionSubject = await this._CheckSubject(Subject);
    }
    this.CurrentSubject = QuestionSubject;

    const Question = await this.GetRandomQuestion(QuestionSubject);
    if (!Question) {
      return await this.SendMessage("لا توجد اسئلة حتى الان ):");
    }
    return await this.SendQuestion(Question, IsAfterCommand);
  }

  async MainScreen(IsAfterCommand = true) {
    const Photo = "https://t.me/hfhdjdjsaksklsldkfkfkksoalcckxfr/21";
    const Caption = `***◄اهلا بك في بوت كويز التحصيلي***

يمكنك اختيار القسم الذي ترغب في حل اسئلته من خلال النقر على احد الازرار ادناه`;
    const ArrauOfButtons = ["رياضيات", "فيزياء", "كيمياء", "احياء", "عشوائي"];

    if (IsAfterCommand) {
      return await this.SendPhoto(Photo, Caption, true, ArrauOfButtons, 2);
    }
    return await this.EditPhotoAfterCallBack(Photo, Caption, ArrauOfButtons, 2);
  }

  async _QuestionAndCaption(QuestionID = 4, IsLastQuestion = false) {
    let Question = 0;
    if (IsLastQuestion) Question = await this._LastQuestion();
    else Question = await this._GetQuestion(QuestionID);
    if (!Question) return false;

    const Caption = `*ID: ${
      Question.ID
    }*\n▮مستوى الصعوبة : *${await this._GetQuestionLevelInArabic(
      Question.QuestionLevl,
    )}*\n▯المادة : *${await this._GetQuestionSubjectInArabic(
      Question.QuestionSubject,
    )}*\n${this.CurrentSubject == 0 ? "*◄عشوائي*" : ""}\nالاجابة الصحيحة : *${
      Question.RightAnswer
    }*\n\n_-_-_-_-_-_-_-_- `;
    return { Question: Question, Caption, Caption };
  }
  async ShowQuestion(
    QuestionID,
    IsAfterCommand = true,
    IsLastQuestion = false,
    IsExplain = false,
  ) {
    const LastQuestionData = await this._QuestionAndCaption(
      QuestionID,
      IsLastQuestion,
    );
    if (!LastQuestionData) return false;
    const QuestionURL = IsExplain
      ? LastQuestionData.Question.ExplainURL
      : LastQuestionData.Question.QuestionURL;
    let Button = ["عرض شرح السؤال"];
    if (IsExplain && !IsAfterCommand) {
      Button = ["عرض السؤال"];
    }
    const Caption = LastQuestionData.Caption;
    if (IsAfterCommand)
      return await this.SendPhoto(
        QuestionURL,
        Caption,
        true,
        ["عرض شرح السؤال"],
        1,
      );
    return await this.EditPhotoAfterCallBack(QuestionURL, Caption, Button);
  }
  async ShowLastAddedQuestion(IsAfterCommand = true, IsExplain = false) {
    return await this.ShowQuestion(0, IsAfterCommand, true, IsExplain);
  }
}
module.exports = clsQuiz;
