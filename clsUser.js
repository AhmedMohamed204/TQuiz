const clsBot = require("./clsBot");
const clsDB = require("./clsDB");

class clsUser extends clsBot {
    constructor(ctx) {
        super(ctx);
        this.Permissions = {
            Add: 1,
            Delete: 2,
            Update: 4,
            Find: 8,
            Send: 16
        }
    }
    async _CheckPermissions(Permission, UserPermissions) {
        if ((UserPermissions & Permission == Permission) || UserPermissions == -1) return true;
        return false;
    }
    async SendTransferedMessage()
    {
        const User = await new clsDB(this.UserID).GetEntity("UserID");
        if (!await this._CheckPermissions(this.Permissions.Send, User.Permissions)) return;

        if(!this.ctx.message.reply_to_message) return await this.SendMessage("يجب عليك الرد على الرسالة ثم الارسال",true);

        const MessageText = this.ctx.message.reply_to_message.text;
        const UserFromMessage = MessageText.match(/\d+/)? MessageText.match(/\d+/)[0] : false ;

        if(!UserFromMessage) return await this.SendMessage("عزيزي المشرف\n\nيجب ان تحتوي الرسالة على ID المستخدم",true);
        const MessageToSend  = this.ctx.message.text.slice(5);
        await this.ctx.telegram.sendMessage(UserFromMessage, MessageToSend);
        return await this.SendMessage("◄تم ارسال الرد بنجاح ",true)
    }
    async TransferringUserMessage()
    {
//         await this.ctx.forwardMessage("-1001929942763");
//         await this.ctx.telegram.sendMessage("-1001929942763", `【[${this.UserID}](tg://user?id=${this.UserID})】

// ▮▮▯▯
// ${this.ctx.message.message_id}


//         `, {parse_mode :"Markdown"})
    }
    async _TotalUsers()
    {
        const Query = `SELECT COUNT(ID) as Count from Users`;
        return await new clsDB(0).GetQuery(Query);
    }
    async _TotalQuestions()
    {
        const Query = `SELECT COUNT(ID) as Count from Questions`;
        return await new clsDB(0).GetQuery(Query);
    }
    async GetAllData()
    {
        const User = await new clsDB(this.UserID).GetEntity("UserID");
        if(User.Permissions != -1) return;

        const TotalUsers = await this._TotalUsers();
        const TotalQuestions = await this._TotalQuestions();
        return await this.SendMessage(`【بيانات المستخدمين】

◄عدد المستخدمين الكلي : ${TotalUsers.Count}

◄عدد الاسئلة الكلي : ${TotalQuestions.Count}
▮▮▯▯
        `)
    }
    async SendMessage(txtMessage, ReplyMessage = false, ArrayOfBtnText, NumberOfItemsInEachRow = 0) {
        if (ArrayOfBtnText) {

            this._SendMessageWithButtons(txtMessage, ReplyMessage, ArrayOfBtnText, NumberOfItemsInEachRow)
            return;
        }

        this._SendMessageWithoutButtons(txtMessage, ReplyMessage);
    }
    async SendPhoto(PhotoPath, Caption, ReplyMessage = false, ArrayOfBtnText, NumberOfItemsInEachRow) {
        if (ArrayOfBtnText) {
            return await this._SendPhotoWithButtons(PhotoPath, Caption, ReplyMessage, ArrayOfBtnText, NumberOfItemsInEachRow);
        }

        return await this._SendPhotoWithoutButtons(PhotoPath, Caption, ReplyMessage);
    }
}

module.exports = clsUser;
