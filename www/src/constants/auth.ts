export const INSTAGRAM_CLIENT_ID = "456846498950828";
export const INSTAGRAM_REDIRECT_URI =
  "https://guitar-practice-admin.web.app/instagramAuth";
export const INSTAGRAM_AUTH_URI = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${INSTAGRAM_REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
