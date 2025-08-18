import { badRequest, internalServerError } from "@core/functions/http.ts";
import { verifyRequestAuthThen } from "@core/utils/handle_request.ts";
import validateId from "@core/utils/validators/uuid_validator.ts";
import { error } from "@core/utils/logger.ts";
import { Message } from "@features/chat/types/message_types.ts";
import { addMessage } from "@features/chat/services/chat_service.ts";
import { sendFcmNotificationToUser } from "@features/account/services/notification_service.ts";
import { getUserProfile } from "@features/account/services/account_services.ts";

export default verifyRequestAuthThen(async ({ req, userId, token }) => {
  try {
    var message: Message = await req.json();
  } catch {
    return badRequest("Invalid JSON body.");
  }
  try {
    if (!validateId(message.sender_id).valid) {
      return badRequest("'sender_id' is invalid");
    }
    if (!validateId(message.recipient_id).valid) {
      return badRequest("'recipient_id' is invalid");
    }
    if (message.content == undefined || message.content == null) {
      return badRequest("'content' is required");
    }
  } catch (err) {
    error(`chat validation error:`, userId, { error: err });
    return internalServerError();
  }

  try {
    const response = await addMessage(message, token);

    if (response.error) {
      error(`chat response error:`, userId, {
        error: response.error,
      });

      return Response.json(
        response.error,
        { status: response.status },
      );
    }

    const user = await getUserProfile(message.recipient_id, token);
    await sendFcmNotificationToUser(
      message.recipient_id,
      {
        notification: {
          title: user.data.metadata.full_name ?? "New message",
          body: message.content,
        },
      },
      token,
    )
      .catch((err) => {
        error(`chat fcm`, userId, { error: err });
      });

    return Response.json(
      response.data ?? { message: "Success" },
      { status: 200 },
    );
  } catch (err) {
    error(`chat error:`, userId, { error: err });
  }
  return internalServerError();
});
