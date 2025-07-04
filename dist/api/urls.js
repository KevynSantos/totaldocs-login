// admin
export const UPDATE_ATTENDANT = '/update/attendant';
export const CREATE_ATTENDANT = '/create/attendant';
export const DELETE_ATTENDANT = '/delete/attendant';
// auth
export const AUTHENTICATE = '/authenticate';
export const REFRESH_TOKEN = '/refresh';
// attendant
export const GET_ATTENDANT = '/attendant';
export const GET_ATTENDANTS = '/attendants';
export const SELF_UPDATE_ATTENDANT = '/attendant/self-update';
export const CHANGE_PASSWORD = '/attendant/change-password';
export const RECOVER_PASSWORD = '/attendant/recover-password';
// push notification
export const PUBLIC_SIGNING_KEY = '/public-signing-key';
export const IS_SUBSCRIBED = '/is-subscribed';
export const SUBSCRIBE = '/subscribe';
export const UNSUBSCRIBE = '/unsubscribe';
// chat
export const GET_SESSION = '/fetch/chat';
export const GET_SESSIONS = '/fetch/chats';
export const GET_SESSION_BY_ID = '/fetch/chat';
export const GET_SESSIONS_BY_RECIPIENT = '/fetch/chats-by-recipient';
export const COUNTER_SESSIONS = '/fetch/chats/counter';
export const GET_DETAILS = '/fetch/message/history';
export const GET_MEDIA_DETAIL = '/fetch/media';
export const SEND_MESSAGE = '/send/message-to-client';
export const EXPORT_CHAT = '/fetch/export/csv';
export const TRANSFER_CHAT = '/transfer';
export const UPDATE_MESSAGE_STATUS = '/status/update';
export const END_CHAT = '/status/end-chat';
// chabot session bind/unbind
export const BIND_CONTACT = '/bind/contact';
export const UNBIND_CONTACT = '/unbind/contact';
export const BIND_TAG = '/bind/tag';
// contact
export const GET_CONTACT = '/contact';
export const GET_CONTACTS = '/contacts';
export const CREATE_CONTACT = '/create/contact';
export const UPDATE_CONTACT = '/update/contact';
export const DELETE_CONTACT = '/delete/contact';
export const DELETE_CHANNEL_IDENTIFIER = '/delete/channel-identifier';
// tag
export const GET_TAG = '/tag';
export const GET_TAGS = '/tags';
export const CREATE_TAG = '/create/tag';
export const UPDATE_TAG = '/update/tag';
export const DELETE_TAG = '/delete/tag';
// options
export const GET_TIMEZONES = '/fetch/timezones';
// totaldocs
export const GET_ME = '/user/current';
