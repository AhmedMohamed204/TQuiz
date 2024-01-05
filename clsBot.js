class clsBot {
  //Private members
  constructor(ctx) {
    this.ctx = ctx;
    this.ReplyMsg = this.ctx.update.callback_query
      ? { chat_id: this.ctx.update.callback_query.from.id }
      : { reply_to_message_id: this.ctx.message.message_id };

    this._MessageOptions = new Object();
    this.UserID = 0;
    this.init();
  }
  async init() {
    this.UserID = this.ctx.from.id
      ? this.ctx.from.id
      : this.ctx.callbackQuery.from.id;
  }

  async _SendMessageWithoutButtons(txtMessage, ReplyMessage = false) {
    if (ReplyMessage) {
      return await this.ctx.reply(txtMessage, this.ReplyMsg).catch((e) => {
        return;
      });
    }
    return await this.ctx.reply(txtMessage).catch(() => {
      return;
    });
  }

  async _SendMessageWithButtons(
    txtMessage,
    ReplyMessage = false,
    ArrayOfBtnText,
    NumberOfItemsInEachRow = 0,
  ) {
    return await this.ctx
      .reply(
        txtMessage,
        await this._ButtonOptions(
          ReplyMessage,
          ArrayOfBtnText,
          NumberOfItemsInEachRow,
        ),
      )
      .catch((e) => {
        console.log(e);
      });
  }

  async _SendPhotoWithoutButtons(PhotoPath, Caption, ReplyMessage = false) {
    if (ReplyMessage) {
      return await this.ctx
        .replyWithPhoto(PhotoPath, {
          caption: Caption,
          reply_to_message_id: this.ctx.message.message_id,
          parse_mode: "Markdown",
        })
        .catch(() => {
          return;
        });
    }
    return await this.ctx
      .replyWithPhoto(PhotoPath, { caption: Caption })
      .catch(() => {
        return;
      });
  }

  async _SendPhotoWithButtons(
    PhotoPath,
    Caption,
    ReplyMessage = false,
    ArrayOfBtnText,
    NumberOfItemsInEachRow = 0,
    ParseMode = true,
  ) {
    return await this.ctx
      .replyWithPhoto(
        PhotoPath,
        await this._ButtonOptions(
          ReplyMessage,
          ArrayOfBtnText,
          NumberOfItemsInEachRow,
          Caption,
          ParseMode,
        ),
      )
      .catch(() => {
        return;
      });
  }

  async _FillBtnData(ArrayOfBtnText, NumberOfItemsInEachRow = 0) {
    let btn = [[]];
    let Counter = 0;
    let CurrentRow = 0;
    let CurrentCol = 0;

    ArrayOfBtnText.forEach((e) => {
      if (NumberOfItemsInEachRow !== 0 && Counter === NumberOfItemsInEachRow) {
        // Move to the next row
        CurrentRow++;
        btn.push([]);
        Counter = 0;
        CurrentCol = 0;
      }

      btn[CurrentRow][CurrentCol] = { text: e, callback_data: e };
      Counter++;
      CurrentCol++;
    });

    return btn;
  }

  async _ButtonOptions(
    ReplyMessage,
    ArrayOfBtnText,
    NumberOfItemsInEachRow = 0,
    Caption,
    ParseMode = false,
  ) {
    this._MessageOptions.reply_markup = {
      inline_keyboard: await this._FillBtnData(
        ArrayOfBtnText,
        NumberOfItemsInEachRow,
      ),
    };

    if (ParseMode) {
      this._MessageOptions.parse_mode = "Markdown";
    }

    if (Caption) {
      this._MessageOptions.caption = Caption;
    }

    if (ReplyMessage) {
      this._MessageOptions.reply_to_message_id = this.ctx.message.message_id;
    }

    return this._MessageOptions;
  }
  async EditPhotoAfterCallBack(
    NewPhoto,
    NewCaption = "",
    ArrayOfBtnText,
    NumberOfItemsInEachRow = 0,
  ) {
    if (ArrayOfBtnText) {
      let MessageButtons = await this._ButtonOptions(
        false,
        ArrayOfBtnText,
        NumberOfItemsInEachRow,
      );
      let MessageOptions = {};
      MessageOptions.type = "photo";
      MessageOptions.media = NewPhoto;
      MessageOptions.caption = NewCaption;
      MessageOptions.parse_mode = "Markdown";
      return await this.ctx.telegram
        .editMessageMedia(
          this.ctx.chat.id,
          this.ctx.callbackQuery.message.message_id,
          null,
          MessageOptions,
          MessageButtons,
        )
        .catch((e) => {
          return;
        });
    }
    return await this.ctx.telegram
      .editMessageMedia(
        this.ctx.chat.id,
        this.ctx.callbackQuery.message.message_id,
        null,
        {
          media: NewPhoto,
          type: "photo",
          caption: NewCaption,
        },
      )
      .catch(() => {
        return;
      });
  }
}

module.exports = clsBot;
